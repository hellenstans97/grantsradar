import { getPrograms, getSiteMeta, type ProgramRow } from '@/lib/data';
import { HistoryIndex } from '../live-index';

export const revalidate = 3600;

function sortHistoryPrograms(programs: ProgramRow[]) {
  return programs
    .filter((program) => program.status === 'history')
    .sort((a, b) => {
      if (a.end_date && b.end_date) return b.end_date.localeCompare(a.end_date);
      if (a.end_date) return -1;
      if (b.end_date) return 1;
      return a.Program.localeCompare(b.Program);
    });
}

export default async function HistoryPage() {
  const [{ programs }, siteMeta] = await Promise.all([getPrograms(), getSiteMeta()]);
  return (
    <HistoryIndex
      programs={sortHistoryPrograms(programs)}
      lastUpdated={siteMeta.last_updated}
      todayIso={new Date().toISOString().slice(0, 10)}
    />
  );
}
