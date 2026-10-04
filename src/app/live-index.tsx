'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ProgramRow } from '@/lib/data';
import { SiteFooter, SiteHeader } from './site-chrome';

const QUICK_FILTERS = ['Grant', 'Cash prizes', 'API credits', 'Cloud credits', 'Compute'] as const;
const MONEY_TAGS = new Set(['Grant', 'Cash prizes']);

type Props = { programs: ProgramRow[]; lastUpdated: string; todayIso: string };
type IndexMode = 'live' | 'history';

function tagsFor(program: ProgramRow) {
  return program['What you get'].split(',').map((tag) => tag.trim());
}

function daysBetween(fromIso: string, toIso: string) {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

function formatClosedDate(isoDate: string) {
  if (!isoDate) return 'CLOSED';
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return 'CLOSED';
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
  return `CLOSED ${formatted.toUpperCase()}`;
}

function LiveDeadline({ program, todayIso }: { program: ProgramRow; todayIso: string }) {
  if (!program.end_date) return <span className="deadline">{program['Applications period']}</span>;
  const daysLeft = daysBetween(todayIso, program.end_date);
  if (daysLeft < 0) {
    return <span className="deadline deadline--urgent">{program['Applications period']} · closed</span>;
  }
  if (daysLeft <= 14) {
    const countdown = daysLeft === 0 ? 'closes today' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`;
    return <span className="deadline deadline--urgent">{program['Applications period']} · {countdown}</span>;
  }
  return <span className="deadline">{program['Applications period']}</span>;
}

function ProgramRowView({ program, selectedTags, todayIso, mode }: {
  program: ProgramRow;
  selectedTags: readonly string[];
  todayIso: string;
  mode: IndexMode;
}) {
  const tags = tagsFor(program);
  const orderedTags = [...tags].sort((a, b) => Number(selectedTags.includes(b)) - Number(selectedTags.includes(a)));
  const visibleTags = orderedTags.slice(0, 2);
  const isHistory = mode === 'history';

  return (
    <article className="program-row">
      <div className="program-name-block">
        <Link className="program-name stretched-link" href={`/program/${program.slug}`}>{program.Program}</Link>
        <p className="organisation">{program.Organisation}</p>
        <p className="eligibility"><span>FOR</span> {program['Who can apply']}</p>
      </div>
      <div className="tag-column">
        <span className="tag tag--type">{program.Type}</span>
        {visibleTags.map((tag) => (
          <span className={`tag ${MONEY_TAGS.has(tag) ? 'tag--money' : 'tag--benefit'}`} key={tag}>{tag}</span>
        ))}
        {orderedTags.length > 2 && <span className="tag-overflow">+{orderedTags.length - 2}</span>}
      </div>
      <div className="award-column">
        <strong className={`${program['Award size'] === 'Not Published' ? 'award award--unknown' : 'award'}${isHistory ? ' award--closed' : ''}`}>
          {program['Award size']}
        </strong>
        {isHistory
          ? <span className="deadline deadline--closed">{formatClosedDate(program.end_date)}</span>
          : <LiveDeadline program={program} todayIso={todayIso} />}
      </div>
      <a className={`apply-link${isHistory ? ' apply-link--closed' : ''}`} href={program.Apply} target="_blank" rel="noreferrer">
        {isHistory ? 'Official page →' : 'Apply →'}
      </a>
    </article>
  );
}

function ProgramsIndex({ programs, lastUpdated, todayIso, mode }: Props & { mode: IndexMode }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isHistory = mode === 'history';
  const types = useMemo(() => [...new Set(programs.map((program) => program.Type))].sort((a, b) => a.localeCompare(b)), [programs]);
  const closingThisMonth = useMemo(() => {
    const month = todayIso.slice(0, 7);
    return programs.filter((program) => program.end_date.startsWith(month)).length;
  }, [programs, todayIso]);
  const filteredPrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return programs.filter((program) => {
      const matchesQuery = !normalizedQuery || program.Program.toLocaleLowerCase().includes(normalizedQuery) || program.Organisation.toLocaleLowerCase().includes(normalizedQuery);
      const matchesType = !type || program.Type === type;
      const programTags = tagsFor(program);
      const matchesTags = !selectedTags.length || selectedTags.some((tag) => programTags.includes(tag));
      return matchesQuery && matchesType && matchesTags;
    });
  }, [programs, query, selectedTags, type]);
  const filtersActive = Boolean(query || type || selectedTags.length);

  function toggleTag(tag: string) {
    setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  }

  function clearFilters() {
    setQuery(''); setType(''); setSelectedTags([]);
  }

  return (
    <div className="site-shell">
      <SiteHeader active={mode} />
      <main className="page-width main-content">
        <section className="hero">
          <h1>{isHistory ? 'History' : "Who's backing people building with AI?"}</h1>
          <p className="subline">{isHistory ? 'Programs that have closed.' : "Cash, credits and compute. What's open, and on what terms."}</p>
          <p className="stats-line">
            <span className={isHistory ? 'history-dot' : 'live-dot'} aria-hidden="true" />
            {isHistory ? `${programs.length} closed programs` : `${programs.length} open programs · ${closingThisMonth} closing this month · Since October 2026`}
          </p>
        </section>
        <section className="discovery" aria-label="Find programs">
          <div className="search-row">
            <label className="visually-hidden" htmlFor={`${mode}-program-search`}>{isHistory ? 'Search closed programs or funders' : 'Search programs or funders'}</label>
            <input id={`${mode}-program-search`} type="search" placeholder={isHistory ? 'Search closed programs or funders' : 'Search programs or funders'} value={query} onChange={(event) => setQuery(event.target.value)} />
            <label className="visually-hidden" htmlFor={`${mode}-program-type`}>Program type</label>
            <select id={`${mode}-program-type`} value={type} onChange={(event) => setType(event.target.value)}>
              <option value="">All program types</option>
              {types.map((programType) => <option key={programType}>{programType}</option>)}
            </select>
          </div>
          <div className="filter-row">
            <span className="filter-label">WHAT YOU GET</span>
            {QUICK_FILTERS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return <button className={`filter-chip${selected ? ' filter-chip--active' : ''}`} key={tag} type="button" aria-pressed={selected} onClick={() => toggleTag(tag)}>{tag}</button>;
            })}
            {filtersActive && <button className="clear-button" type="button" onClick={clearFilters}>Clear</button>}
            {filtersActive && <span className="result-count">{filteredPrograms.length} of {programs.length} shown</span>}
          </div>
        </section>
        {filteredPrograms.length ? (
          <section className="program-list" aria-label={isHistory ? 'Closed programs' : 'Live programs'}>
            {filteredPrograms.map((program) => <ProgramRowView key={program.slug} program={program} selectedTags={selectedTags} todayIso={todayIso} mode={mode} />)}
          </section>
        ) : programs.length === 0 && isHistory ? (
          <section className="empty-results empty-results--history"><p>Closed programs will be listed here.</p></section>
        ) : (
          <section className="empty-results"><p>Nothing matches those filters</p><span>Try removing one, or clear them.</span></section>
        )}
      </main>
      <SiteFooter lastUpdated={lastUpdated} />
    </div>
  );
}

export function LiveIndex(props: Props) { return <ProgramsIndex {...props} mode="live" />; }
export function HistoryIndex(props: Props) { return <ProgramsIndex {...props} mode="history" />; }
