# GrantsRadar

Next.js App Router / TypeScript implementation of GrantsRadar. Product and visual
contracts are in SPEC.md and DESIGN.md. The current UI scope is the desktop Live
index at `/`; History, program detail pages, methodology, and mobile layouts are
reserved for later work.

## Setup and verification

Use Node.js 24 or newer (the verification script uses `--use-env-proxy`).

```sh
npm ci --cache /workspace/.npm-cache
npm run typecheck
npm test
npm run verify:data
```

Set `PROGRAMS_CSV_URL` and `SITE_META_CSV_URL` in the process environment or
`.env.local`. `.env.example` lists their names without feed values.
In restricted cloud networking, allow `docs.google.com` and
`*.googleusercontent.com` for Google's signed CSV redirect destinations.

`verify:data` loads Next environment files, follows redirects, and uses the same
server-only readers as the application. It prints all parsed rows, including
excluded rows, without truncation or cell normalization. Status counts cover all
parsed rows; the included-valid-row count is reported separately. Row numbers
refer to CSV records with the header as record 1 (quoted newlines do not increment
the record number). Verification fails on a current fetch failure rather than
silently using stale data.

Both readers request `next: { revalidate: 3600 }`. Next manages persistent fetch
caching when called in its server runtime; the standalone verification script's
native fetch does not implement Next caching. Readers also retain the last parsed
successful result in process memory on later errors. Without a successful cache,
errors propagate so a future page can render the contract's unavailable message.

All 13 original column values remain strings, including dates, amounts, URLs,
Type, and the raw What you get cell. `status` is narrowed only after validation.
Missing Program/slug, invalid status, and CSV parser errors exclude the affected
row and are logged. Every row sharing a duplicate slug is excluded, including
conflicts with malformed rows. Only the separately derived benefit-tag list is
split and trimmed, as SPEC requires. `last_checked` is retained for the typed raw
record and is not used for application behavior.

Tests use clearly labeled synthetic fixtures only; they are never application
fallback data. Feed values are not stored in source code.
