
# GrantsRadar — V1 Product Spec

## 1. Purpose

GrantsRadar helps AI builders quickly discover live funding and builder programs they may qualify for.

The index covers opportunities such as:

- Grants Programs
- Research Grants
- Credits Programs
- Startup Programs
- Hackathons
- Buildathons
- Fellowships
- Other relevant AI builder programs

GrantsRadar is a discovery layer.

Its job is to give a builder enough information to quickly understand whether an opportunity may be relevant, then direct them to the official source to learn more or apply.

---

## 2. Site Identity

### Name

GrantsRadar

### Tagline

**Live funding for AI builders.**

### Supporting copy

**Grants, credits, hackathons, research funding and startup programs in one place.**

---

## 3. Data Source and Architecture

### Single source of truth

The **Programs tab** of the owner's Google Sheet is the single source of truth. There is no second *manually maintained* copy of the program data — not in another tab, and not in the website code. Cached copies created automatically by the website for speed and reliability are expected and correct.

Programs is published to the web as CSV. That CSV is what the website reads.

**The website has read-only access to the published feed and never writes to the Google Sheet.**

### Columns

**Public — displayed to users:**

1. Program
2. Organisation
3. Type
4. Applications period
5. What you get
6. Pool
7. Award size
8. Who can apply
9. Apply

**Technical — read by the site, not displayed:**

10. slug — powers the program page URL
11. status — `live` or `history`
12. end_date — machine-readable deadline, for sorting

**Maintenance — not read or displayed by the website:**

13. last_checked — the date the owner last verified this row against its official source

`last_checked` sits in the published CSV like everything else, so it is technically accessible even though the site ignores it. It contains nothing sensitive.

There is no `start_date`. Nothing in V1 uses one.

### Site Meta tab

A second, tiny tab holds one setting:

| key | value |
|---|---|
| last_updated | 2026-09-24 |

It is published separately as CSV and read by the footer. The owner changes one cell when GrantsRadar is meaningfully updated. Nothing else lives here.

### How the site gets the data

**Programs tab → published CSV → Next.js on Vercel, fetched server-side → GrantsRadar**

The site fetches the CSV **on the server**, builds the finished page, and caches it. **Both the Programs feed and the Site Meta feed revalidate every 60 minutes**, so a footer date change appears automatically like any other edit.

This matters for two reasons:

1. **Pages arrive complete.** Search engines and social previews can read them. Individual program pages have real titles and descriptions when shared.
2. **The owner never deploys.** Editing the sheet is the only action needed. There is no rebuild, no GitHub change, no manual step.

### If the feed fails

If the CSV cannot be fetched, the server continues serving the last successful copy. The site must never show an empty page because a fetch failed.

If there is no cached copy at all, show a short message saying data is temporarily unavailable, with a link to the owner's profile.

### Reading the CSV

Use a proper CSV parser. Do not split lines or commas manually. Several fields legitimately contain commas — `Grant, API credits, Compute` and `Startups, pre-Series B. Top tier needs VC or accelerator backing.` — and naive splitting will corrupt them.

`What you get` is comma-separated within its own cell. After the CSV is parsed, split that field's value on commas and trim whitespace to produce individual tags.

### Bad rows must not break the site

A malformed row must never crash GrantsRadar or blank the page.

- A row missing `Program`, `slug`, or a valid `status` is excluded from display and logged as an error.
- **Duplicate slugs are invalid.** If two or more rows share a slug, exclude all conflicting rows from display and log the error. Never choose one silently.
- Every other valid row continues to render.

This matters because the dataset is edited by hand in a spreadsheet, indefinitely. A blank cell six months from now must cost one missing row, not the whole site.

---

## 4. Main Pages

### Live

The default homepage. Contains programs where `status` is `live`:

- programs with an active application period
- programs accepting applications on a rolling basis

Prioritize fast discovery and scanning.

**Sort order:**

1. Programs with a deadline — soonest `end_date` first
2. Rolling programs — alphabetical by Program name

---

### History

Contains programs where `status` is `history` — programs that previously appeared on GrantsRadar and are no longer accepting applications.

Closed programs remain in the dataset rather than being deleted, so GrantsRadar gradually becomes a historical index of AI builder programs.

**Sort order:** programs with an `end_date` first, most recently ended at the top. Programs without an `end_date` — closed rolling programs — follow, alphabetical by Program name.

**Every history entry displays a clear Closed indicator.**

---

### Program Page

Each program has its own permanent URL, built from its `slug`:

`grantsradar.dev/program/google-cloud-ai-startup-program`

**The slug is a stored value in the dataset, not generated from the program name.**

This matters. Program names get corrected — several have already been renamed to match their funders' official wording. If URLs were generated from names, every correction would silently break a link that may already be shared, bookmarked or indexed.

Rules:

- Written once, when the program is added
- Lowercase, words joined by hyphens
- **Never changed, even if the program is renamed**
- **Every slug is unique across the entire dataset.** Two rows sharing a slug would compete for the same URL.
- The site reads it and does not modify it

**Routes are resolved from the current CSV data at request or revalidation time, not fixed to the slugs that existed when the site was last deployed.** Adding a new valid slug to the Programs tab must make its `/program/[slug]` URL work without a code change or a deployment. A program added on a Tuesday must be reachable at its URL within the revalidation window, not after the next deploy.

The URL keeps working after a program moves from Live to History.

Each program page must have its own page title and social preview description, generated server-side from that program's data.

The page provides useful context without reproducing the entire official program website. The official source remains where users get full details and apply.

---

### Methodology

GrantsRadar has a Methodology page explaining how information is collected and standardized.

Core rules:

- Every figure comes from the funder's own page. Aggregator and "best credits" blog posts republish dead figures for years, and several state the opposite of what the providers' own pages say.
- Nothing is guessed. Where a funder does not publish something, the entry reads `Not Published`. That is a finding, not a gap.
- Program names use the funder's official wording. Where that name alone is generic — "Grants Program", "Genesis Program" — the organisation is prefixed.
- What a program is FOR and what it PROVIDES are recorded separately. A research grant paid in credits is still Research Grants.
- Where a program has tiers, the headline figure is the highest published recipient amount. Any condition attached to that tier appears in Who can apply.
- Cash and credits are never presented as the same thing.
- Every program links to its official source.
- Rolling programs stay listed only while there is evidence the program is still active.

---

## 5. Dataset Fields

1. **Program** — the funder's official name, verbatim. Where that name alone is generic, the organisation is prefixed.
2. **Organisation** — who funds it.
3. **Type** — one of eight values. See section 8.
4. **Applications period** — one of three formats. See section 12.
5. **What you get** — one or more of seven tags. See section 9.
6. **Pool** — see section 11.
7. **Award size** — see section 10.
8. **Who can apply** — see section 6a.
9. **Apply** — the funder's official application route. Use the direct application link where one exists; otherwise the official program page that contains the application route.
10. **slug** — see section 4.
11. **status** — `live` or `history`. Set by hand. See section 13.
12. **end_date** — `YYYY-MM-DD`. See section 12.
13. **last_checked** — `YYYY-MM-DD`. Maintenance only.

The website preserves the public column names exactly. Do not rename them in the interface.

---

## 6. Browsing View

When browsing Live or History, users should understand an opportunity quickly.

Show:

- Program
- Organisation
- Type
- Applications period
- What you get
- Award size
- Who can apply
- The link action

Do not overcrowd the browsing view. `Pool` does not need to be prominent here.

### Click behaviour

- **Program name or card** → the GrantsRadar program page, same tab
- **Link button** → the funder's URL from the `Apply` column, new tab

### The link label depends on status

- `status = live` → **Apply →**
- `status = history` → **Official page →**

Same URL, different label. A closed program must never invite an application.

There is no link-type field. Some funders' links lead to an application form, others to a program page containing the application route. Both are acceptable — the job is to send the builder to the funder's official route.

---

## 6a. Who can apply — the format

Under 15 words. Two parts: who the program is for, then the single condition that would disqualify most readers. No explanation.

Example:

`Startups, pre-Series B. Top tier needs VC or accelerator backing.`

The Apply link carries the detail. This field exists to stop someone spending an afternoon on a program they were never eligible for.

---

## 7. Individual Program Page

The program page shows the same fields as the browsing view, plus:

- Pool
- The official source link

Nothing is written for the program page that does not exist in the dataset. There is no commentary field in V1.

**Programs with `status = history` display a clear Closed indicator at the top of the page.** The original `Applications period` value stays unchanged as historical information — a closed rolling program still reads `Rolling`, because that is what it was. The Closed indicator is what tells the visitor they cannot apply.

This matters because people arrive on old program URLs from search results and shared links, with no idea they are looking at History.

The page stays concise. GrantsRadar does not reproduce every eligibility rule, tier or condition from the original program page.

The desired behaviour is:

**Understand the opportunity → decide whether it may be relevant → visit the official source**

---

## 8. Type Vocabulary

**Type says what a program is FOR.** What it provides is the `What you get` column, and the two are independent.

| Value | Meaning |
|---|---|
| Hackathon | A time-boxed build competition with prizes. |
| Buildathon | The same, where the funder uses that word. |
| Fellowship | Funds a person for a period of time. |
| Grants Program | Funds a builder's own product or public good. |
| Research Grants | Funds research — a study, a paper, an investigation. |
| Credits Program | Support for people and organisations that are not startups — open-source maintainers, academics, researchers and public-interest organisations. |
| Startup Program | Gated on being a startup. Usually "X for Startups". |
| Other | Nothing above fits. |

The dataset may not contain every value. Filters display only the Types actually present in the data.

Do not rename values:

- `Grants Program`, not `Grant`
- `Research Grants`, not `Research`
- `Credits Program`, not `Credits`

---

## 9. What You Get Vocabulary

**What you get says what the program provides to recipients.** It can contain more than one value, comma-separated.

| Tag | Meaning |
|---|---|
| Grant | Money awarded to fund your own work. |
| Cash prizes | Money won in a competition. |
| API credits | Metered usage of a model or AI product — inference, tokens, agent runs. |
| Cloud credits | General cloud platform spend. |
| Compute | Training and inference compute, GPU or CPU time. |
| Subscription | A paid plan given free. |
| Hardware Support | Physical hardware, or access to machines such as GPUs or quantum processors. |

Example: `Grant, API credits, Compute`

Split on commas and trim whitespace to produce individual tags. Each tag is filterable.

Nothing outside these seven. Do not substitute broader or different wording:

- keep `Grant`, not `Cash grant`
- keep `Compute`, not `Compute credits`
- keep `Cash prizes`, not `Prize money`

---

## 10. Award Size

`Award size` is the amount or value available to an individual recipient.

| Situation | Written as |
|---|---|
| Fixed amount | `$10,000` |
| Maximum | `Up to $100,000` |
| Minimum only | `From $500` |
| Not published | `Not Published` |

For programs with multiple tiers, show the highest published recipient amount as the headline figure, and put any condition attached to that tier in `Who can apply`.

Do not list every tier in the browsing view. Users check the official source for tier conditions.

---

## 11. Pool

`Pool` is the total amount allocated to the whole program.

- Full digits: `$5,000,000`, never `$5 million`
- If the funder only publishes a maximum: `Up to $20,000`
- If not stated: `Not Published`

Pool is secondary information and does not need to appear prominently while browsing.

---

## 12. Applications Period and Dates

### What users see

The `Applications period` column, in the human-readable wording from the dataset. Three formats, and no others:

| Situation | Written as |
|---|---|
| Apply any time, or open with no published deadline | `Rolling` |
| A single deadline | `Closes 21 Oct 2026` |
| A window | `14 Sep – 4 Oct 2026` |

Dates use day, short month, year. No times, no time zones. Ranges use an en dash (–), not a hyphen.

### What the site sorts by

`end_date`, in ISO format `YYYY-MM-DD`.

- `Rolling` → blank
- `Closes 21 Oct 2026` → `2026-10-21`
- `14 Sep – 4 Oct 2026` → `2026-10-04`

`end_date` never replaces the human-readable `Applications period` shown to users. It exists only for sorting and to make overdue rows obvious to the owner.

---

## 13. Live and History Logic

`status` decides which page a program appears on. It is set by hand. **The site does not calculate it.**

### Programs with a closing date or window

`live` while applications are open. Once the closing date or end of the window passes, the owner changes it to `history`.

### Rolling programs

`live` while the official program source indicates applications are still open.

The owner changes it to `history` if a rolling program:

- stops accepting applications
- clearly ends
- disappears
- or its official program page is no longer active

**This is why status is manual.** Rolling programs do not announce their own death; the page simply goes quiet or vanishes. No date comparison can detect that. It requires someone opening the page and deciding.

### Programs that have not opened yet

A program that has been announced but is not yet accepting applications is not added to the dataset until applications open. There is no upcoming state.

Programs are never deleted simply because they close.

---

## 14. Search and Filters

V1 includes simple search across program and organisation names.

### Filters

**Type** — the Type values present in the dataset.

**What you get** — the individual tags present in `What you get`:

- Grant
- Cash prizes
- API credits
- Cloud credits
- Compute
- Subscription
- Hardware Support

### Filter logic

- **Multiple selections within one filter use OR**
- **Different filters use AND**

Example: `Grant` and `Compute` selected under What you get, plus `Research Grants` under Type, returns Research Grants programs that offer either Grant or Compute.

Do not add other filters in V1. Additional filters only after actual usage shows they are useful.

---

## 15. Submit a Program

Include a **Submit a program** link. It opens a Google Form.

Submissions go into a separate review tab, never into Programs.

Submitted programs are never published automatically. The owner verifies every field against the official program source before adding it to the dataset.

---

## 16. Site-wide Last Updated

The footer displays one site-wide date, read from the `last_updated` cell in the Site Meta tab.

**Last updated: 24 September 2026**

This is the most recent meaningful update to GrantsRadar — adding a program, moving one to History, correcting data, or a meaningful site change.

There is no public per-program "last checked" date.

---

## 17. Maintenance Rhythm

Not a site feature, but the design assumes it. Recorded here so the site is built to support it.

**Fixed deadlines are easy to maintain, not automatic.** Sort by `end_date`, find the rows whose date has passed, change those to `history`. The site never does this by itself.

**Rolling programs are re-verified on rotation, not all at once.** Sort by `last_checked`, open the oldest handful, confirm they are still live, update the date. Roughly monthly per program.

**A normal session:** add any newly found programs → move expired ones to History → check the five or six oldest rolling rows → update `last_updated` in Site Meta.

**The design requirement:** a normal maintenance session is short and requires only spreadsheet edits — never code, never a deployment. One tab, no sync, no deploys.

---

## 18. Attribution

The footer credits the creator:

**Built by Hellen Musyoka**

The name and handle link to the relevant personal profile.

GrantsRadar exists as its own useful product while clearly accumulating attribution to its creator.

---

## 19. V1 Principles

Prioritize:

- Accuracy
- Simplicity
- Fast scanning
- Current information
- Official sources
- Low maintenance
- Useful information over exhaustive information

GrantsRadar is a discovery layer, not a replacement for the official program website.

**Responsive.** GrantsRadar must work cleanly on phone and desktop. Browsing, filtering, opening a program page and clicking through must all work comfortably on a phone.

The user journey:

**Discover → quickly judge relevance → learn more → apply through the official source**

---

## 20. Not Included in V1

Do not build:

- User accounts
- Login
- Saved programs
- Favourites
- Personalized recommendations
- AI matching
- Automated scraping
- Automated link or dead-page checking
- Telegram automation
- Payments
- Complex admin dashboard
- Automatic publishing of submitted programs
- Automatic calculation of Live vs History status
- An upcoming or "not yet open" state
- A commentary or notes field on program pages
- A second manually maintained copy of the program data

These can be considered later only if actual usage shows they are useful.

---

## 21. Technical V1 Principle

Keep the architecture simple.

**Programs tab → published CSV → Next.js on Vercel, fetched server-side and revalidated every 60 minutes → GrantsRadar**

Website code: **GitHub**
Deployment: **Vercel**

Program data stays entirely out of the website code. Adding a program means typing in a spreadsheet, never editing code and never triggering a deployment — including the new program's own URL.

---

## 22. Success for V1

V1 succeeds if a builder can:

1. Open GrantsRadar.
2. Immediately understand what the site is for.
3. See currently available programs.
4. Quickly understand what each program offers.
5. Quickly understand who can apply.
6. Search or filter without confusion.
7. Open an individual program if they want more context.
8. Click through to the official source to learn more or apply.
9. Tell immediately when a program is closed.
10. Do all of the above comfortably on a phone.

And if the owner can add a program — page, URL and all — by typing one row in a spreadsheet.

The site should feel useful before it feels sophisticated.
