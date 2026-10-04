import 'server-only';
import Papa from 'papaparse';
import { PROGRAM_COLUMNS, type ProgramsData, type ProgramRow, type RawProgramRow, type SiteMetaData } from './types';

type Logger = (message: string) => void;
export function parsePrograms(csv: string, log: Logger = console.error): ProgramsData {
  const parsed = Papa.parse<Record<string, string>>(csv, {
    header: true, skipEmptyLines: true, dynamicTyping: false,
  });
  const fields = parsed.meta.fields ?? [];
  const missing = PROGRAM_COLUMNS.filter(column => !fields.includes(column));
  if (missing.length) throw new Error(`Programs CSV missing columns: ${missing.join(', ')}`);
  const globalErrors = parsed.errors.filter(error => error.row === undefined);
  if (globalErrors.length) throw new Error(globalErrors.map(error => error.message).join('; '));
  const allRows = parsed.data.map(raw => Object.fromEntries(
    PROGRAM_COLUMNS.map(column => [column, raw[column] ?? '']),
  ) as RawProgramRow);
  const malformedRows: ProgramsData['malformedRows'] = [];
  const slugRows = new Map<string, number[]>();
  allRows.forEach((row, index) => {
    if (row.slug.trim()) slugRows.set(row.slug, [...(slugRows.get(row.slug) ?? []), index + 2]);
    const reasons = parsed.errors.filter(error => error.row === index).map(error => error.message);
    if (!row.Program.trim()) reasons.push('Missing Program');
    if (!row.slug.trim()) reasons.push('Missing slug');
    if (row.status !== 'live' && row.status !== 'history') reasons.push(`Invalid status: ${JSON.stringify(row.status)}`);
    if (reasons.length) {
      malformedRows.push({ row: index + 2, reasons });
      log(`Programs CSV row ${index + 2}: ${reasons.join('; ')}`);
    }
  });
  const duplicateSlugs = [...slugRows].filter(([, rows]) => rows.length > 1)
    .map(([slug, rows]) => ({ slug, rows }));
  duplicateSlugs.forEach(({ slug, rows }) => log(`Duplicate slug ${JSON.stringify(slug)}: rows ${rows.join(', ')}; all excluded`));
  const invalidRows = new Set(malformedRows.map(issue => issue.row));
  const duplicates = new Set(duplicateSlugs.map(issue => issue.slug));
  const programs = allRows.filter((row, index) => !invalidRows.has(index + 2) && !duplicates.has(row.slug)) as ProgramRow[];
  return { totalRowsParsed: allRows.length, allRows, programs, malformedRows, duplicateSlugs };
}

export function parseSiteMeta(csv: string): SiteMetaData {
  const parsed = Papa.parse<{ key: string; value: string }>(csv, { header: true, skipEmptyLines: true, dynamicTyping: false });
  if (!['key', 'value'].every(column => parsed.meta.fields?.includes(column))) throw new Error('Site Meta CSV requires key and value columns');
  if (parsed.errors.length) throw new Error(`Malformed Site Meta CSV: ${parsed.errors.map(error => error.message).join('; ')}`);
  const matches = parsed.data.filter(row => row.key === 'last_updated');
  if (matches.length !== 1) throw new Error('Site Meta CSV requires exactly one last_updated row');
  return { rows: parsed.data, last_updated: matches[0].value };
}

/** Only this derived tag list is split/trimmed, as required by SPEC section 3. */
export function getBenefitTags(program: ProgramRow): string[] {
  return program['What you get'].split(',').map(tag => tag.trim());
}
