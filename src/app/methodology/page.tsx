import { getSiteMeta } from '@/lib/data';
import { SiteFooter, SiteHeader } from '../site-chrome';

export const revalidate = 3600;

export default async function MethodologyPage() {
  const siteMeta = await getSiteMeta();
  return (
    <div className="site-shell">
      <SiteHeader active={null} />
      <main className="program-page-width program-page methodology-page">
        <h1>How this index is built</h1>
        <p>GrantsRadar lists funding open to people building with AI: grants, credits, compute, hackathons, startup programs and research funding.</p>
        <p>Every listing is verified against the funder&apos;s own page. Aggregators, newsletters and press coverage are where I find programs, not where I take the details from.</p>

        <h2>Each row is a summary, not the full terms</h2>
        <p>A row captures the core funding or resources a program offers. Many programs offer more: technical support, introductions, office hours, architecture reviews, co-marketing and other benefits. Those aren&apos;t all listed here.</p>
        <p>Conditions aren&apos;t all here either. A program listed at Up to $200,000 might only offer that tier to a startup with VC or accelerator backing.</p>
        <p>The row should tell you whether a program is worth a closer look. The funder&apos;s page tells you what you would actually get and what conditions apply. Read it before you apply.</p>

        <h2>What the money columns mean</h2>
        <p>Award size is the highest publicly stated amount available to one recipient, team or company.</p>
        <p>Pool is the total amount available across the whole program.</p>
        <p>They are two different numbers and are never added together.</p>
        <p>Award not published means the funder hasn&apos;t said. It does not mean there is no money.</p>

        <h2>What you get is not the same as how much</h2>
        <p>A program offering $200,000 in cloud credits and one offering $200,000 in cash are not the same offer.</p>
        <p>Credits are restricted to a company&apos;s product and may expire or come with tier conditions.</p>
        <p>That&apos;s why every row carries a What you get tag. The figure tells you the size. The tag tells you the kind.</p>

        <h2>Live and History</h2>
        <p>Status is maintained by hand. A deadline passing does not automatically move a program to History.</p>
        <p>This matters especially for rolling programs, which do not always announce a clear closing date.</p>
        <p>Closed programs move to History rather than disappearing.</p>

        <h2>How often it&apos;s checked</h2>
        <p>I review the index every week. I look for new programs, check whether any have closed, and update anything that&apos;s changed.</p>
        <p>The footer shows when the index was last updated.</p>

        <h2>Corrections and submissions</h2>
        <p>Spotted something wrong, or know a program that should be here? <a href="https://forms.gle/o1QjvMdhW1qK2iXB8" target="_blank" rel="noreferrer">Send it here</a>.</p>
        <p>Built and maintained by <a href="https://www.linkedin.com/in/hellen-musyoka-b5007a1b9/" target="_blank" rel="noreferrer">Hellen Musyoka</a>.</p>
      </main>
      <SiteFooter lastUpdated={siteMeta.last_updated} />
    </div>
  );
}
