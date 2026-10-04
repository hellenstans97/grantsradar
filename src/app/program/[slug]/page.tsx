import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPrograms, getSiteMeta, type ProgramRow } from '@/lib/data';
import { SiteFooter, SiteHeader } from '../../site-chrome';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

function benefitTags(program: ProgramRow) {
  return program['What you get'].split(',').map((tag) => tag.trim());
}

async function findProgram(slug: string) {
  const { programs } = await getPrograms();
  return programs.find((program) => program.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await findProgram(slug);
  if (!program) return {};
  return { title: `${program.Program} — GrantsRadar`, description: program.Organisation };
}

export default async function ProgramPage({ params }: PageProps) {
  const { slug } = await params;
  const [program, siteMeta] = await Promise.all([findProgram(slug), getSiteMeta()]);
  if (!program) notFound();

  const isClosed = program.status === 'history';
  const statusLabel = isClosed
    ? 'Closed'
    : program['Applications period'] === 'Rolling' ? 'OPEN · ROLLING' : 'OPEN';
  const facts = [
    { label: 'Applications period', value: program['Applications period'], kind: 'mono' },
    { label: 'Award size', value: program['Award size'], kind: 'mono award' },
    { label: 'What you get', value: program['What you get'], kind: 'sans' },
    { label: 'Who can apply', value: program['Who can apply'], kind: 'sans' },
    { label: 'Total pool', value: program.Pool, kind: 'mono' },
  ];

  return (
    <div className="site-shell">
      <SiteHeader active={null} />
      <main className="program-page-width program-page">
        <Link className="breadcrumb" href={isClosed ? '/history' : '/'}>
          {isClosed ? '← History' : '← All live programs'}
        </Link>

        <div className="program-heading">
          <div>
            <h1>{program.Program}</h1>
            <p>{program.Organisation}</p>
          </div>
          <a
            className={isClosed ? 'program-action program-action--closed program-action--desktop' : 'program-action program-action--desktop'}
            href={program.Apply}
            target="_blank"
            rel="noreferrer"
          >
            {isClosed ? 'Official page →' : 'Apply →'}
          </a>
        </div>

        <div className="program-tags">
          <span className="tag tag--type">{program.Type}</span>
          {benefitTags(program).map((tag) => (
            <span className={`tag ${tag === 'Grant' || tag === 'Cash prizes' ? 'tag--money' : 'tag--benefit'}`} key={tag}>{tag}</span>
          ))}
          <span className={`status-chip ${isClosed ? 'status-chip--closed' : 'status-chip--live'}`}>{statusLabel}</span>
        </div>

        <a
          className={isClosed ? 'program-action program-action--closed program-action--mobile' : 'program-action program-action--mobile'}
          href={program.Apply}
          target="_blank"
          rel="noreferrer"
        >
          {isClosed ? 'Official page →' : 'Apply →'}
        </a>

        <dl className="facts-table">
          {facts.map((fact) => (
            <div className="fact-row" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd className={`fact-value fact-value--${fact.kind.replace(' ', ' fact-value--')}`}>{fact.value}</dd>
            </div>
          ))}
          <div className="fact-row">
            <dt>Official source</dt>
            <dd className="fact-value fact-value--sans fact-source">
              <a href={program.Apply} target="_blank" rel="noreferrer">{program.Apply}</a>
            </dd>
          </div>
        </dl>

        <p className="program-note">GrantsRadar records what the funder publishes. Full tier conditions and application steps are on the official page.</p>
      </main>
      <SiteFooter lastUpdated={siteMeta.last_updated} />
    </div>
  );
}
