# Scripts

Four small Node scripts, no build step and no dependencies beyond `mapshaper`
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

Its `sources` array is the canonical list of where entity data lives. **When that
list changes, update `check-links.mjs` and `fetch-candidates.mjs` to match** —
both keep their own copy, and both fail quietly if the paths drift.

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
every existing company as new.

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

## `build-geo.mjs`

```bash
npm install && npm run build:geo
```

Simplifies the Bundesländer with mapshaper and derives the national outline as
their exact dissolve, from **one shared topology**, so the state borders and the
country border can never disagree. Edit `data/geo/src/`, never the generated
`data/geo/*.js`.
