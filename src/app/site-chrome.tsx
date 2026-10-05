'use client';

import Link from 'next/link';

const SUBMIT_URL = 'https://forms.gle/o1QjvMdhW1qK2iXB8';

type ActivePage = 'live' | 'history' | null;

function formatSiteDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

export function SiteHeader({ active }: { active: ActivePage }) {
  return (
    <header className="site-header">
      <div className="page-width header-inner">
        <Link className="wordmark" href="/">GrantsRadar</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link className={`nav-link${active === 'live' ? ' nav-link--active' : ''}`} href="/" aria-current={active === 'live' ? 'page' : undefined}>Live</Link>
          <Link className={`nav-link${active === 'history' ? ' nav-link--active' : ''}`} href="/history" aria-current={active === 'history' ? 'page' : undefined}>History</Link>
          <a className="nav-link" href={SUBMIT_URL} target="_blank" rel="noreferrer">Submit<span className="submit-label-suffix"> a program</span></a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ lastUpdated }: { lastUpdated: string }) {
  return (
    <footer className="site-footer">
      <div className="page-width footer-inner">
        <div className="footer-left">
          <a href={SUBMIT_URL} target="_blank" rel="noreferrer">Submit a program</a><span aria-hidden="true">·</span>
          <span className="last-updated">Last updated {formatSiteDate(lastUpdated)}</span>
        </div>
        <span>Built by <a href="https://www.linkedin.com/in/hellen-musyoka-b5007a1b9/" target="_blank" rel="noreferrer">Hellen Musyoka</a></span>
      </div>
    </footer>
  );
}
