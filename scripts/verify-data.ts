import { loadEnvConfig } from '@next/env';
import { getPrograms, getSiteMeta } from '../src/lib/data';

loadEnvConfig(process.cwd());
async function main() {
  // Never hide an unsuccessful current verification behind a stale result.
  const [data, meta] = await Promise.all([getPrograms({ allowStale: false }), getSiteMeta({ allowStale: false })]);
  console.log(`Total rows parsed: ${data.totalRowsParsed}`);
  console.log(`Count with status = live (all parsed rows): ${data.allRows.filter(row => row.status === 'live').length}`);
  console.log(`Count with status = history (all parsed rows): ${data.allRows.filter(row => row.status === 'history').length}`);
  console.log(`Included valid rows: ${data.programs.length}`);
  console.log(`Malformed rows: ${data.malformedRows.length}`);
  data.malformedRows.forEach(issue => console.log(`  Row ${issue.row}: ${issue.reasons.join('; ')}`));
  console.log(`Duplicate slugs: ${data.duplicateSlugs.length}`);
  data.duplicateSlugs.forEach(issue => console.log(`  ${issue.slug}: rows ${issue.rows.join(', ')} (all excluded)`));
  const columns = ['Program', 'Applications period', 'end_date', 'Award size', 'What you get', 'slug', 'status'] as const;
  // Full-width table; no console.table truncation. Cell contents remain unchanged.
  const widths = columns.map(column => Math.max(column.length, ...data.allRows.map(row => row[column].length)));
  const line = (cells: readonly string[]) => cells.map((cell, i) => cell.padEnd(widths[i])).join(' | ');
  console.log('\nAll parsed rows (including excluded rows):');
  console.log(line(columns));
  console.log(widths.map(width => '-'.repeat(width)).join('-+-'));
  data.allRows.forEach(row => console.log(line(columns.map(column => row[column]))));
  console.log(`\nlast_updated: ${meta.last_updated}`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
