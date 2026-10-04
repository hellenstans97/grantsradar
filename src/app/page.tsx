import { getPrograms, getSiteMeta, type ProgramRow } from '@/lib/data';
import { LiveIndex } from './live-index';

export const revalidate = 3600;

function sortLivePrograms(programs: ProgramRow[]) {
  return programs
    .filter((program) => program.status === 'live')
    .sort((a, b) => {
      if (a.end_date && b.end_date) return a.end_date.localeCompare(b.end_date);
      if (a.end_date) return -1;
      if (b.end_date) return 1;
      return a.Program.localeCompare(b.Program);
    });
}

export default async function Home() {
  const [{ programs }, siteMeta] = await Promise.all([getPrograms(), getSiteMeta()]);
  const livePrograms = sortLivePrograms(programs);

  return (
    <LiveIndex
      programs={livePrograms}
      lastUpdated={siteMeta.last_updated}
      todayIso={new Date().toISOString().slice(0, 10)}
    />
  );
}
