import assert from 'node:assert/strict';
import { test } from 'node:test';
import Papa from 'papaparse';
import { parsePrograms, parseSiteMeta } from '../src/lib/data/parse';
import { PROGRAM_COLUMNS } from '../src/lib/data/types';
import { getPrograms, getSiteMeta } from '../src/lib/data';

// Synthetic parser fixtures only; never used as application data.
const record = (name: string, slug: string, status = 'live') => PROGRAM_COLUMNS.map(column => ({
  Program: name, slug, status, 'What you get': 'Grant, API credits',
  'Award size': '$1,234', 'Who can apply': 'Research teams, worldwide.',
} as Record<string, string>)[column] ?? '');
const csv = (rows: string[][]) => Papa.unparse({ fields: [...PROGRAM_COLUMNS], data: rows });

test('quoted commas and line breaks survive unchanged; malformed and every duplicate are excluded', () => {
  const input = csv([
    record('Fixture, with\na newline', 'unique'), record('Duplicate one', 'duplicate'),
    record('', 'duplicate', 'bad-status'), record('Missing slug', ''), record('History fixture', 'history', 'history'),
  ]);
  const logs: string[] = [];
  const result = parsePrograms(input, message => logs.push(message));
  assert.equal(result.totalRowsParsed, 5);
  assert.deepEqual(result.programs.map(row => row.slug), ['unique', 'history']);
  assert.equal(result.programs[0].Program, 'Fixture, with\na newline');
  assert.equal(result.programs[0]['Award size'], '$1,234');
  assert.equal(result.programs[0]['What you get'], 'Grant, API credits');
  assert.equal(result.malformedRows.length, 2);
  assert.deepEqual(result.duplicateSlugs, [{ slug: 'duplicate', rows: [3, 4] }]);
  assert.equal(logs.length, 3);
});

test('a field-count error excludes only the affected row', () => {
  const result = parsePrograms(`${csv([record('Good fixture', 'good')])}\r\nshort,row`, () => {});
  assert.equal(result.programs.length, 1);
  assert.equal(result.malformedRows.length, 1);
  assert.match(result.malformedRows[0].reasons.join('; '), /Too few fields/);
});

test('Site Meta preserves the value and rejects ambiguous last_updated', () => {
  assert.equal(parseSiteMeta('key,value\nlast_updated, 2026-09-24 ').last_updated, ' 2026-09-24 ');
  assert.throws(() => parseSiteMeta('key,value\nlast_updated,a\nlast_updated,b'), /exactly one/);
});

test('both feed readers request redirects and hourly Next cache; fallback retains successful results', async () => {
  const originalFetch = globalThis.fetch;
  const originals = [process.env.PROGRAMS_CSV_URL, process.env.SITE_META_CSV_URL];
  process.env.PROGRAMS_CSV_URL = 'https://example.test/programs';
  process.env.SITE_META_CSV_URL = 'https://example.test/meta';
  const requests: RequestInit[] = [];
  globalThis.fetch = async (url, options) => {
    requests.push(options!);
    return new Response(String(url).endsWith('/meta') ? 'key,value\nlast_updated,unchanged' : csv([record('Fixture', 'fixture')]));
  };
  try {
    const programs = await getPrograms();
    const meta = await getSiteMeta();
    assert.equal(meta.last_updated, 'unchanged');
    for (const options of requests) {
      assert.equal(options.redirect, 'follow');
      assert.deepEqual((options as RequestInit & { next: unknown }).next, { revalidate: 3600 });
    }
    globalThis.fetch = async () => { throw new Error('fixture network failure'); };
    assert.equal(await getPrograms(), programs);
    await assert.rejects(getPrograms({ allowStale: false }), /fixture network failure/);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [index, name] of ['PROGRAMS_CSV_URL', 'SITE_META_CSV_URL'].entries()) {
      if (originals[index] === undefined) delete process.env[name]; else process.env[name] = originals[index];
    }
  }
});
