# Scripts

Seven small Node scripts, no build step and no dependencies beyond `mapshaper`
(used only by `build:geo`). All of them assume **Node 18+** for global `fetch`;
CI pins Node 22.

The shared idea: **the machine does the lookup grind, a human keeps the quality
gate.** Nothing here writes to the live dataset without either a `--write` flag
or a review pass through a `_candidates` file.

| Script | npm | What it does |
|---|---|---|
| `validate.mjs` | `npm run validate` | Checks the dataset. Run before every PR. |
| `check-links.mjs` | — | Checks every `website` URL still resolves. |
| `geocode.mjs` | — | Snaps coordinates to the real OSM building footprint. |
| `fetch-candidates.mjs` | — | Drafts new entries from Wikidata for review. |
| `find-startups.mjs` | — | Proposes new leads for the Startups page from the startup press. |
| `new-startups.mjs` | — | Coverage and maintenance report for the Startups page. |
| `build-geo.mjs` | `npm run build:geo` | Regenerates `data/geo/*.js` from `data/geo/src/`. |

## `validate.mjs`

```bash
node scripts/validate.mjs            # the live data
node scripts/validate.mjs --staged   # also check data/_candidates.* files
```

No duplicate names, all required fields present, valid state / sector / size
codes, numeric coordinates inside Germany, plausible `founded` year. Exits
non-zero on any problem, so it can gate CI — and it does: `.github/workflows/validate.yml`
runs it on every PR touching `data/**` or `scripts/**`.

Entries in `data/companies/new-startups.js` get a stricter pass: a register entry
in the form `Amtsgericht <court> HRB <number>`, real `registered` and `verified`
dates, sources of all three kinds (`register`, `company`, `press` or `institution`),
a register number and website host used by no other entry, and nothing that is
already on the rejected list in `new-startups.review.js`. Conditions that depend on
today's date — an entry ageing out of the window, a check over a year old — are
printed as warnings and never fail the run, so CI cannot turn red because a day passed.

Its `sources` array is the canonical list of where entity data lives. **When that
list changes, update `check-links.mjs`, `fetch-candidates.mjs` and `geocode.mjs`
to match** — each keeps its own copy, and each fails quietly if the paths drift.
`find-startups.mjs` keeps one too, and stops with an error if a file is missing.

## `check-links.mjs`

```bash
node scripts/check-links.mjs             # every entry
node scripts/check-links.mjs --changed   # only URLs this branch touched
node scripts/check-links.mjs --json      # machine-readable, for the workflow
```

Every dot on the map is a link, so a dead URL silently breaks the thing the map
exists to do. Verdicts are deliberately conservative:

| verdict | meaning | fails the run |
|---|---|---|
| `ok` | 2xx/3xx | no |
| `moved` | resolved onto a different host — worth updating the entry | no |
| `unverifiable` | 401/403/429/5xx — blocked us or server-side | no |
| `unreachable` | timeout, reset, refused, TLS error | no |
| `dead` | 404/410/451, or DNS says the host does not exist | **yes** |

That split is the whole point. An early draft of this script treated a timeout as
a dead link and reported **119 of 245** as broken — BMW, Siemens, SAP and Deutsche
Telekom among them — when every one was a slow response, not a bad URL. A checker
that cries wolf gets muted, so only a server saying *definitively* "nothing here"
counts as dead.

Two implementation notes worth keeping:

- **Cancel every response body** (`await res.body?.cancel()`). Without it Node
  holds the sockets open and the process never exits.
- **`HEAD` is not enough.** Plenty of hosts answer `HEAD` with `403`/`405` while
  serving `GET` fine, so it falls back to `GET`, then to `GET` with a browser
  User-Agent, before believing a failure.

`.github/workflows/links.yml` runs the full sweep weekly and files the dead ones
into a single self-updating issue rather than failing a build nobody watches.

## `geocode.mjs`

```bash
node scripts/geocode.mjs           # dry run → data/_geocode.review.json
node scripts/geocode.mjs --write   # apply HIGH-confidence hits in place
```

Queries Nominatim by name + city and keeps only confident building-level matches,
writing 6-decimal coordinates plus an `address` label. `HIGH` hits are safe to
apply; `MED`/`LOW` are listed with an OSM search link so you can place them by
hand. One request per second against the public endpoint — be polite. The cache
in `scripts/.geocode-cache.json` is gitignored and regenerable.

## `fetch-candidates.mjs`

```bash
node scripts/fetch-candidates.mjs   # → data/_candidates.generated.js
```

Pulls German-HQ'd companies per sector from Wikidata, fills the boring fields
(founding year, website, coordinates, employee count → size), and dedupes against
everything already on the map. It never touches the live dataset — output goes to
`data/_candidates.generated.js` for review.

**You still write the description.** Wikidata's is a rough hint at best, and the
one-factual-sentence rule in [CONTRIBUTING.md](../CONTRIBUTING.md) is what keeps
the popups readable.

It refuses to run if it cannot load a dedupe set, rather than silently proposing
every existing company as new. The dedupe set includes the new startups' legal
names and every candidate on the review file's rejected list.

```bash
node scripts/fetch-candidates.mjs --since 2023-10-05
```

`--since` keeps only companies Wikidata says were founded on or after that day:
leads for the Startups page. Expect few, and expect wrong dates. Wikidata's
recent German entries are mostly agencies and self-created items, so every lead
still goes through the register check in [NEW-STARTUPS.md](../NEW-STARTUPS.md).

### Extending the sector mapping

`INDUSTRY_SECTOR` maps a Wikidata **industry** QID (property `P452`) to one of our
eight sectors, and `SECTOR_PRIORITY` breaks ties when a company is tagged with
several — robotics and AI lead, because they are what the map is for.

To add a sector mapping:

1. Find the industry item on Wikidata (e.g. *machine vision* → `Q11660`) and
   confirm real German companies actually carry it via `P452`.
2. Add `Qxxxxxx: "sector"` to `INDUSTRY_SECTOR`.
3. If the new industry overlaps ones already mapped, place the sector in
   `SECTOR_PRIORITY` where you want it to win.
4. Re-run the script and read the generated file — a mapping that pulls in
   hundreds of loosely-related companies is worse than no mapping.

## `find-startups.mjs`

```bash
node scripts/find-startups.mjs                 # show what would be proposed
node scripts/find-startups.mjs --write         # add the proposals to the review file
node scripts/find-startups.mjs --report FILE   # also write the summary to FILE
node scripts/find-startups.mjs --since 2026-09-01   # look further back than 35 days
npm test                                       # its rules, offline, on made-up pages
```

Reads the startup press, keeps the names inside the map's domains, reads each company's
imprint for its legal name and register entry, and adds the best 20 to `leads` in
`new-startups.review.js`. Everything it proposes goes into `new-startups.seen.json`, so a lead
deleted in review does not come back. [NEW-STARTUPS.md](../NEW-STARTUPS.md#new-names-every-two-weeks)
explains what it reads and why, and how to review what it finds.

`.github/workflows/find-startups.yml` runs it on the 1st and 15th of each month and opens
one pull request. To follow another source, add it to `SOURCES`. Any public WordPress API
works, and `readTitleLinks` handles ordinary articles as it is.

Implementation notes worth keeping:

- **It reads robots.txt before every site**, and under Claude Code it obeys the rules for AI
  agents (`CLAUDECODE` is set there). One source allows ordinary clients but not AI agents, so
  a session testing this script skips that source by itself. Leave that check in place, and
  do not change the User-Agent to get past a block.
- **It keeps no article text.** Those paragraphs name founders, so the pull request carries
  names, links and register facts only, and the tests use invented companies.
- **It re-loads the review file before writing it.** If the file's layout changes, the run
  stops instead of corrupting the dataset.
- **A wrong register number is worse than none.** The reader leaves a field empty when in
  doubt, and the lead then goes under *Needs a look*.

## `new-startups.mjs`

```bash
node scripts/new-startups.mjs          # Markdown report
node scripts/new-startups.mjs --json   # machine-readable, for the workflow
```

Answers the questions that keep the Startups page honest: how many are
listed against the national count for the same three-year window, where the gaps
are by state and sector, and what needs doing — entries that aged out (move them
to the size file that fits), entries last verified over 180 days ago, national
counts more than 270 days past their latest half-year, a finder that has added
nothing for 45 days, and who ages out next.

It computes the window the same way `js/common.js` does, so the report and the page
always agree. It never edits data and never contacts the commercial register:
register checks stay manual, because the register's terms cap retrievals at 60 an
hour and warn against automated access. `.github/workflows/new-startups.yml`
runs it every two weeks and keeps one issue, *New startups: maintenance due*, up to date.

## `build-geo.mjs`

```bash
npm install && npm run build:geo
```

Simplifies the Bundesländer with mapshaper and derives the national outline as
their exact dissolve, from **one shared topology**, so the state borders and the
country border can never disagree. Edit `data/geo/src/`, never the generated
`data/geo/*.js`.
