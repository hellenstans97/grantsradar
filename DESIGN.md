# GrantsRadar — V1 Design Spec

This document records design decisions already made and agreed. It is the visual
companion to `SPEC.md`, which covers data, architecture and behaviour.

The reference is the GrantsRadar V1 draft canvas, which has four approved screens:
Live (desktop), History (desktop), Program page, and Live (phone).

Where this document and the canvas disagree, this document wins.

---

## 1. What the site should feel like

A quiet data index, not a marketing site. Closer to a reference table someone
returns to weekly than to a landing page they read once.

- Off-white ground, white surfaces, thin borders
- One brand accent colour, used sparingly (amber exists separately as a
  semantic urgency colour)
- Monospace for numbers, dates, tags, micro-labels and metadata; sans for prose
  and field labels
- No logos, no illustrations, no gradients, no emoji
- Dense rows that can be scanned, not cards that must be read

The visual promise is accuracy. Anything that reads as persuasion works against it.

---

## 2. Colour

### Ground and surface

| Token | Hex | Use |
|---|---|---|
| Paper | `#F6F6F3` | Page background |
| Surface | `#FFFFFF` | Header, row container, footer |
| Surface hover | `#FCFCFA` | Row hover tint |
| Line | `#E4E4DF` | Container borders |
| Line, inner | `#EFEFEA` | Dividers between rows |

### Neutral text — three values, nothing else

These are the greys. White text on an active filter chip, and the green and amber
semantic text defined below, sit outside this scale.

| Token | Hex | Contrast on white | Use |
|---|---|---|---|
| Ink | `#15161A` | 16.5:1 | Program names, award figures, headlines |
| Body | `#5F6166` | 6.1:1 | Organisation, `FOR`, eligibility, type tags, dates, `Not Published`, sublines |
| Quiet | `#6E7075` | 4.9:1 | `+N` tag overflow, footer metadata, closed award figures |

**The contrast rule:**

> All meaningful text uses `#6E7075` or darker on the light background. Important
> secondary information uses `#5F6166`. Hierarchy must not depend on low contrast.

Hierarchy comes from **size, weight and typeface**. Never from fading. This rule
exists because an earlier draft used five greys down to `#A8AAAE` (2.3:1) and the
eligibility line became unreadable in daylight.

### Accent — green

| Token | Hex | Use |
|---|---|---|
| Green | `#0B6B4F` | `Apply →` links, solid Apply button, live status dot, link colour |
| Green hover | `#084F3A` | Link hover |
| Green ink | `#0A5540` | Text inside money tags |
| Green tint | `#E7F1EC` | Money tag background |
| Green border | `#C5DECF` | Money tag border |

### Amber — urgency only

| Token | Hex | Use |
|---|---|---|
| Amber ink | `#7A4F00` | Deadline text inside 14 days |
| Amber tint | `#FBF0DA` | Urgent deadline background |
| Amber border | `#EBD7AE` | Urgent deadline border |

Amber appears **only** on deadlines inside 14 days. Nowhere else.

### Neutral tag

| Token | Hex | Use |
|---|---|---|
| Tag tint | `#F2F2EE` | Non-money tag background |
| Tag border | `#E4E4DF` | Non-money tag border |
| Tag outline | `#E0E0DA` | Type tag border (no fill) |

### History greys

| Token | Hex | Use |
|---|---|---|
| Closed tint | `#ECECE7` | `CLOSED` chip background |
| Closed border | `#DEDED8` | `CLOSED` chip border |

`CLOSED` chip text and `Official page →` use **Body `#5F6166`**. There is no
separate closed-ink token.

`Quiet #6E7075` is used for the closed award figure only, which sits on white.
It must not be used on the `#ECECE7` chip — that combination is 4.2:1 and fails
the contrast rule.

---

## 3. Type

Two families, loaded from Google Fonts.

**Space Grotesk** — 400, 500, 600, 700. All prose, names, headings, buttons, inputs.

**JetBrains Mono** — 400, 500. Every number, date, tag, micro-label and metadata line.

The monospace is what makes the page read as an instrument rather than an article.
It applies to award sizes, pool figures, dates, countdowns, tags, the `FOR` label,
the `WHAT YOU GET` label, the stats line and the footer date.

### Scale — desktop

| Element | Size | Weight | Family | Colour |
|---|---|---|---|---|
| Wordmark | 19px | 700 | Sans | Ink |
| Nav links | 15px | 400 / 500 active | Sans | Body / Ink |
| H1 | 38px | 600 | Sans | Ink |
| Subline | 16px | 400 | Sans | Body |
| Stats line | 12px | 400 | Mono | Body |
| Search and select | 15px | 400 | Sans | Ink |
| Filter chips | 12px | 400 / 500 active | Sans | Ink |
| `WHAT YOU GET` label | 11px | 400 | Mono, uppercase, 0.07em | Body |
| Program name | 16px | 600 | Sans | Ink |
| Organisation | 13px | 400 | Sans | Body |
| `FOR` label | 11px | 400 | Mono, uppercase, 0.07em | Body |
| Facts-table label (program page) | 14px | 400 | Sans | Body |
| Facts-table value (program page) | 16px | 400 | Mono or Sans | Ink |
| Award on program page | 20px | 500 | Mono | Ink |
| Eligibility text | 13px | 400 | Sans | Body |
| Tags | 10px | 400 / 500 money | Mono, uppercase, 0.05em | Body / Green ink |
| Award figure | 17px | 500 | Mono | Ink |
| `Not Published` | 13px | 400 | Mono | Body |
| Deadline | 11–12px | 400 | Mono | Body / Amber ink |
| `Apply →` | 13px | 500 | Sans | Green |
| Footer links | 14px | 400 | Sans | Ink |
| Footer date | 13px | 400 | Mono | Quiet |

Letter-spacing: `-0.03em` on the H1, `-0.02em` on the wordmark, `-0.01em` on
program names and award figures. Everything else default.

**On the `FOR` label weight:** 400, not 500. At 11px and full contrast, 500 makes
the label heavier than the data it labels, and it would stop matching the
`WHAT YOU GET` label above it. Mono, uppercase and the tracking already separate
it from the eligibility text beside it — weight is not needed and works against
the hierarchy.

### Scale — phone

H1 drops to 26px and the subline to 14px. Program-row text does not shrink below
its desktop values — names, eligibility, tags, award figures and dates all keep
their desktop sizes, because a phone is where readability matters most.

---

## 4. Layout

### Page

Content is centred at `max-width: 1120px` with `40px` side padding. The program
page narrows to `860px`, because it is read rather than scanned.

**At phone widths, side padding is `18px`, not 40px.**

### Header

Wordmark left, nav right. Three links: **Live · History · Submit a program**.
The active page is 500 weight with a 2px green underline; the others are Body grey.

**On individual Program pages, no nav item is shown as active** — a program page
is not itself a nav destination. All three links render in Body grey.

No tagline next to the wordmark. The headline below says what the site is.

### Hero

Three stacked elements, nothing else:

```
Who's backing people building with AI?
Cash, credits and compute. What's open, and on what terms.
● 29 open programs · 7 closing this month · Since October 2026
```

The stats line carries a 6px green dot. The open-program count and the
closing-this-month count are calculated from live rows, never typed.
`Since October 2026` is fixed site-launch metadata.

No further explanatory prose. The next thing on the page is search.

### Search and filters

One row: search input (flexible) plus program-type `<select>` (190px minimum).

**Exact copy:**

| Element | Text |
|---|---|
| Search placeholder, Live | `Search programs or funders` |
| Search placeholder, History | `Search closed programs or funders` |
| Select default option | `All program types` |

Below it: the `WHAT YOU GET` label followed by five chips.

**Chip states:**

| State | Fill | Border | Text |
|---|---|---|---|
| Inactive | `#FFFFFF` | `#D7D7D1` | Ink |
| Active | `#15161A` | `#15161A` | `#FFFFFF`, 500 weight |

The active chip is a dark pill, not green. Green already carries two meanings on
this site — the Apply action and the live dot — and green tint with green ink is
the money-tag treatment, so a green chip would read as a `GRANT` tag sitting in
the filter row. Dark is a neutral "selected" state with no semantic load.

When any filter is active, a **Clear** link appears after the chips and a
`4 of 29 shown` count appears right-aligned on the same row. Neither is visible
in the default state — the stats line above already gives the total.

### The row

A four-column grid inside a single bordered container:

```
minmax(0, 1fr)   270px        170px          70px
name block       tag column   award column   action
                              (right)        (right)
```

22px gap, `16px 24px` padding, `1px solid #EFEFEA` divider between rows, none
after the last.

**Name block:** program name, organisation beneath, then `FOR` plus eligibility.

**Tag column:** the type tag first (outlined, no fill), then up to two What-you-get
tags, then `+N` if more exist.

**Award column:** award figure, deadline beneath, both right-aligned.

**Action:** `Apply →` as a green text link, right-aligned.

The fixed tag and award columns are what make the rows read as a ledger. Without
them the tags trail variable-length eligibility text and the vertical rhythm breaks.

### Footer

Left: **How this index is built · Submit a program · Last updated 28 September 2026**
Right: **Built by Hellen Musyoka**

`Last updated` is rendered from the Site Meta feed. The date shown above is
illustrative, not hard-coded.

**Hellen Musyoka** links to `https://www.linkedin.com/in/hellen-musyoka-b5007a1b9/`,
rendered in Ink so it reads as a name rather than a link. No social handle is
displayed anywhere on the site.

The methodology page lives here and nowhere else. It is a trust page, not a
first-screen need.

### The History page

Identical structure to Live. Only the header copy, the row treatments and the
action label change.

```
History
Programs that have closed.
```

Two lines. No explanation of why closed programs are kept, no note about
programs running again — the earlier longer version was cut deliberately.

Then: search → program-type select → the same five quick filters → closed count
→ rows, in the same bordered container.

The count line reads `3 closed programs` and carries a grey dot (`#C9C9C2`),
not the green live dot.

### The Program page

Narrower at `max-width: 860px`. Fixed order:

```
← All live programs

Program name                              Apply →
Organisation

[TYPE]  [WHAT YOU GET…]  [OPEN · ROLLING]

┌──────────────────────────────────────────────────┐
│ Applications period   Rolling                    │
│ Award size            Up to $200,000             │
│ What you get          Cloud credits              │
│ Who can apply         Startups, pre-Series B…    │
│ Total pool            Not Published              │
│ Official source       aws.amazon.com/startups…   │
└──────────────────────────────────────────────────┘

GrantsRadar records what the funder publishes. Full tier conditions
and application steps are on the official page.
```

- The facts table is a two-column grid, `200px` label column on `#FCFCFA`,
  value column on white, `1px solid #EFEFEA` between rows
- **Field labels are sans**, 14px, Body grey
- **Values by field:** Applications period, Award size and Total pool use Mono —
  including `Rolling` and `Not Published`. What you get, Who can apply and
  Official source use Sans
- Award size is the largest value in the table at 20px
- Apply is a **solid green button** here, not a text link — it is the single
  action on the page
- The closing sentence stays. It explains the product philosophy without
  sending anyone to the methodology page

**For a closed program**, three things change:

- The breadcrumb reads **`← History`**, not `← All live programs`
- `Apply →` becomes **`Official page →`**, in Body grey, not a green button
- The status chip becomes **`Closed`** in the grey treatment

Everything else is unchanged, including the original `Applications period`
value and the facts-table order.

---

## 5. Rules that carry meaning

These are the decisions where the visual choice encodes a fact. They are not
decoration and should not be simplified away.

### Money looks different from credits

| Tag | Treatment |
|---|---|
| `Grant`, `Cash prizes` | Green ink on green tint, 500 weight |
| `API credits`, `Cloud credits`, `Compute`, `Subscription`, `Hardware` | Body grey on neutral tint, 400 weight |
| Type tag (`Hackathon`, `Startup Program`, …) | Body grey, outlined, no fill |

Three treatments for three different kinds of fact.

**This distinction should be visible before a reader inspects any details.**
Several funders use the word "grant" for programs that pay only in credits. The
design must not repeat that blurring — which is why the money tags are the one
place colour carries meaning rather than decoration.

### Urgency is visible

A deadline inside **14 days** renders as an amber pill reading
`Closes 4 Oct 2026 · 3 days left`. Outside 14 days it is the plain date in Body
grey. Rolling programs read `Rolling`.

**The exact funder date never disappears.** The countdown is added to it, never
substituted for it. The date carries trust; the countdown carries urgency.

Countdown days are computed from `end_date`. If `end_date` has passed and `status`
is still `live`, show the exact date and a quiet **Deadline passed** marker — never
a negative countdown, and never move the row automatically.

### Not Published is a finding

`Not Published` renders at 13px in Body grey — smaller than a real figure so it
does not compete, but at full contrast because it is information, not an empty
field. It must never look disabled.

### Closed means closed

On History: a grey chip sits exactly where the amber deadline sits on Live. Same
position, opposite temperature.

- If the row has an `end_date`, the chip reads `CLOSED 4 OCT 2026`
- If it has no `end_date` — a rolling program that later ended — the chip reads
  simply `CLOSED`

The award figure drops to Quiet grey because the money is no longer available.
Program names stay full contrast — History is a record people read, not a
graveyard.

The action link reads **`Official page →`** in Body grey, never `Apply →`. A closed
program must not invite an application.

On an individual program page, a closed program shows a clear **Closed** indicator
at the top. The original `Applications period` value stays unchanged — a closed
rolling program still reads `Rolling`, because that is what it was. People arrive
on old URLs from search with no idea they are looking at History.

A live program page shows **OPEN · ROLLING** when `status = live` and
`Applications period = Rolling`; otherwise it shows **OPEN**. `OPEN` comes from
`status`, `ROLLING` from `Applications period`. No new data is required.

**Status chip colours:**

| State | Text | Fill | Border |
|---|---|---|---|
| Live | Green ink `#0A5540` | Green tint `#E7F1EC` | `#C5DECF` |
| Closed | Body `#5F6166` | Closed tint `#ECECE7` | Closed border `#DEDED8` |

Status chips are the one place besides money tags where colour carries meaning
rather than decoration.

### The filtered tag stays visible

Tags are capped at two plus `+N`. **When a What-you-get filter is active, any
selected tag sorts to the front of the visible two.** Without this, filtering by
`Hardware` could return a row whose `Hardware` tag is hidden behind `+2`, and the
filter looks broken.

### Which tags become filters

Five quick filters: **Grant · Cash prizes · API credits · Cloud credits · Compute**.
These are the five that are either money or resources to build with.

`Subscription` and `Hardware` remain visible as row tags and on program pages but
are not quick filters in V1.

Quick-filter membership is a product decision, not determined by row count, and
does not change automatically as the dataset grows.

---

## 6. Interaction

**The whole row is clickable** to the program page, using a stretched link on the
program name. The `Apply →` link sits above it and goes to the funder in a new tab.
Row hover tints to `#FCFCFA`.

**Filter logic:** OR within a filter, AND across filters. Chips toggle; the type
select is single-choice.

**Empty results:** a bordered panel reading *"Nothing matches those filters"* with
*"Try removing one, or clear them."* beneath. Never a blank page.

**Empty History:** before anything closes, History shows exactly
**`Programs will appear here when they close.`** Not "when their deadline
passes" — rolling programs have no deadline. An empty page under a nav tab reads
as broken.

---

## 7. Phone

Not a redesign. The same product at 390px.

- Wordmark left, menu button right (44px touch target)
- H1 at 26px, same words
- Search full width, type select full width beneath it
- The five chips scroll horizontally. **The scrollbar is hidden** (`scrollbar-width: none`
  plus `::-webkit-scrollbar { display: none }`) — swipe still works, but a visible
  bar reads as a design element
- Stats line drops "Since October 2026" to fit
- Rows become stacked cards in the same bordered container

**The one layout change from desktop:** award figure and `Apply →` share a line,
with tags and the deadline beneath. Desktop reads left-to-right across columns;
a phone reads top-to-bottom, so the two things a builder decides with sit together.

Whole card is tappable. All touch targets at least 44px.

### The menu

The header button opens a plain dropdown panel below the header containing
**Live · History · Submit a program**. No full-screen takeover, no slide-in
drawer, no animation beyond showing and hiding.

### History on a phone

Exactly the same stacked-card structure as Live, with the closed-state
treatments from section 5: grey `CLOSED` date chip, Quiet-grey award figure,
`Official page →` in Body grey.

### The program page on a phone

- Program name and organisation stack first, then the status chips
- The action button sits below them, full width
- **The facts table becomes stacked label-over-value rows**, not two squeezed
  columns. Label in Body grey above, value beneath
- Official source URLs wrap rather than overflow (`word-break: break-all`)

### The footer on a phone

Stacks vertically. The links and date on the left may wrap across lines;
**Built by Hellen Musyoka** moves beneath them rather than sitting opposite.

---

## 8. Accessibility

- Every interactive element uses the appropriate semantic element: `<button>`,
  `<a href>`, `<input>` or `<select>`. Form controls have associated `<label>`
  elements. Never a div with a click handler
- Icon-only buttons carry `aria-label`
- Filter chips carry `aria-pressed`
- All text meets 4.5:1 minimum; see the contrast rule in section 2
- Status is never communicated by colour alone — amber deadlines also read
  "3 days left", closed rows also read "CLOSED"

---

## 9. What not to add

- Logos or favicons for funders
- Illustrations, gradients, decorative imagery, emoji
- A fourth neutral text grey
- A second brand accent colour
- Colour on Type or What-you-get tags beyond the money/not-money distinction
- Marketing copy below the hero
- Pagination or a "show more" control — all live rows run down the page
- Animation beyond the row hover
