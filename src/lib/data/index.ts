import 'server-only';
import { parsePrograms, parseSiteMeta } from './parse';
export type * from './types';
export { getBenefitTags } from './parse';

const lastSuccessful = new Map<string, unknown>();
async function readFeed<T>(name: 'PROGRAMS_CSV_URL' | 'SITE_META_CSV_URL', parse: (csv: string) => T, allowStale: boolean): Promise<T> {
  const url = process.env[name];
  if (!url) throw new Error(`Missing required environment variable: ${name}`);
  try {
    const response = await fetch(url, { redirect: 'follow', next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`${name} returned HTTP ${response.status}`);
    const data = parse(await response.text());
    lastSuccessful.set(url, data);
    return data;
  } catch (error) {
    // Next's Data Cache retains successful responses across revalidation failures.
    // This also retains the last parsed result during this server process's lifetime.
    if (allowStale && lastSuccessful.has(url)) {
      console.error(`${name} failed; serving last successful data`);
      return lastSuccessful.get(url) as T;
    }
    throw error;
  }
}
export function getPrograms(options: { allowStale?: boolean } = {}) {
  return readFeed('PROGRAMS_CSV_URL', parsePrograms, options.allowStale ?? true);
}
export function getSiteMeta(options: { allowStale?: boolean } = {}) {
  return readFeed('SITE_META_CSV_URL', parseSiteMeta, options.allowStale ?? true);
}
