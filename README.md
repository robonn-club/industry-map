# Germany Industry Map

An interactive map of Germany's robotics, tech, and industrial landscape — built
by [Robonn](https://github.com/robonn-club), the robotics club at the
University of Bonn, to help students see the industry at a glance and find
companies and labs to connect with.

**[▶ Open the live map](https://robonn-club.github.io/industry-map/)**

## What it shows

- **200 companies and 100 university labs / research institutes** across 7 sectors,
  plotted on a precise vector map of Germany and its 16 states — every state has entries.
- **A Startups page** ([`startups.html`](startups.html)) — tech startups founded in
  Germany in the last three years, each checked against the commercial register, its own
  imprint and an independent source. A timeline shows when each one was registered;
  sector, state and text filters narrow the cards; every card opens its sources and
  links to the map. The page also shows how complete the list is against the national
  startup counts, and every candidate that was checked and left out. On the map these
  startups wear a gold ring and link to their card. Every two weeks a script collects new
  names from the startup press into a pull request for review. Method and sources:
  [NEW-STARTUPS.md](NEW-STARTUPS.md).
- **A Pixel view** ([`pixel.html`](pixel.html)) — the same entries as buildings on a
  pixel-art model of Germany: height is headcount, roof and colour are the sector, stone
  columns mean a lab, a gold lot and flag mean a new startup. Every entry gets its own lot,
  so dense cities become districts instead of a pile of dots. The price is position: a lot
  sits near the real address, not on it. Selecting a building pins its true location, and
  a Dots switch shows the map's own markers on the same ground.
- **Search** (press `/`) over names, cities, sectors and descriptions — typing
  `slam` finds the labs that do SLAM. Results ignore the active filters and fly
  straight to the hit.
- **Type filter** — companies, labs, or both. **Multi-select sector filters** with
  live counts, a **distance filter** from any of 25 university cities, and a
  **Sector Grid** comparing all sectors at once.
- Click a state for a regional sector breakdown; click a point for details, the
  organisation's site, and a roles link (thesis / HiWi search for labs).
- **Every filter is in the URL**, so a link restores exactly what you were looking at —
  sectors, type, Bundesland, origin city, radius and the open view
  (e.g. `?s=robotics&t=institute&r=bavaria&o=Munich&v=list`). `?c=<name>` opens the map
  on one entry; the Startups page keeps its own filters the same way
  (`startups.html?s=robotics&r=bavaria`).

### Sectors are domains, not categories of organisation

An institute carries the domain it works in — robotics, AI & ML, … — exactly like a
company, and *being* an institute is the separate **Type** axis. Institutes used to
all sit in a `research` sector, which meant filtering for **Robotics** returned 28
companies and hid DLR, Fraunhofer IPA, DFKI and both Bonn labs. Robotics now returns
**70**, of which 41 are labs.

## Run locally

No build step. Either open `index.html` directly, or serve it:

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

## Project structure

```
index.html              # the map page
startups.html           # the Startups page
pixel.html              # the Pixel view
css/style.css           # styling (Robonn brand)
css/startups.css        # styling only the Startups page uses
css/pixel.css           # styling only the Pixel view uses
js/common.js            # shared by all pages: sector palette, escaping, the 3-year rule
js/app.js               # the map
js/startups.js          # the Startups page
js/pixel.js             # the Pixel view: projection, lot layout, ground, camera, UI
js/pixel-sprites.js     # the Pixel view's buildings, generated from sector, size and type
data/
  companies/            # companies (7 sectors), split by size
    global.js  big.js  mid.js  startup.js
    new-startups.js     # founded in the last 3 years, any size, with register entry + sources
    new-startups.review.js  # national baseline, rejected candidates, open leads
    new-startups.seen.json  # everything the finder has proposed, so it does not repeat itself
    index.js            # merges the company files into COMPANIES
  institutes.js         # research institutes & university labs
  regions.js            # regional profiles
  geo/                  # Germany state overlay (generated — run `npm run build:geo`)
    germany.js          # national outline (exact dissolve of the 16 states)
    bundeslaender.js    # the 16 states (interactive highlight layer)
    world.js            # legacy vector backdrop (no longer rendered)
    src/                # pristine sources the build reads from
scripts/
  validate.mjs          # checks company/institute data (CI gate on every PR)
  check-links.mjs       # checks every `website` URL still resolves
  geocode.mjs           # snaps coordinates to the real OSM building footprint
  fetch-candidates.mjs  # drafts new entries from Wikidata for review (--since for new startups)
  find-startups.mjs     # proposes new leads from the startup press (+ .test.mjs, npm test)
  new-startups.mjs      # coverage + maintenance report for the Startups page
  build-geo.mjs         # regenerates the geo/*.js layers from src/
  README.md             # what each script does and how they fit together
.github/workflows/
  validate.yml          # dataset + changed-link checks on every pull request
  links.yml             # weekly sweep of all links -> one self-updating issue
  find-startups.yml     # every two weeks: new names from the press -> one pull request
  new-startups.yml      # every two weeks: aged-out / due-for-recheck startups -> one issue
NEW-STARTUPS.md         # what counts as a new startup, sources, checks, coverage
```

## Map & boundaries

The basemap is **Esri Dark Gray Canvas** raster tiles in Web Mercator — a world-wide dark canvas
designed to sit *under* data, so the coloured sector markers and the interactive **Bundesländer**
overlay carry the eye. It is keyless: no signup, no token in the repo.

Esri serves geometry and labels as two layers, and has no imagery past **z16**, so the tile layers
set `maxNativeZoom: 16` — Leaflet upscales that tile for the street-level zooms rather than
requesting the "Map data not yet available" placeholder. The ground softens as you close in; the
markers stay crisp vectors on the real HQ coordinate.

> We were on CARTO Dark Matter until CARTO moved their basemap CDN behind an API key. Tiles from
> `basemaps.cartocdn.com` are now stamped "API KEY REQUIRED" across the middle, so that host is
> unusable unless the club registers a key.

The `germany.js` / `bundeslaender.js` overlay layers are **generated**, not hand-edited. They come
from the pristine GeoJSON in `data/geo/src/` via [mapshaper](https://github.com/mbloch/mapshaper):

```bash
npm install
npm run build:geo
```

The states and the national outline are built from **one shared topology** (the outline is the
exact dissolve of the Bundesländer), so their borders always match. (`world.js` is still produced by
the build but is no longer rendered — the tile basemap replaced it.)

## Contributing

Adding a company or institute takes one entry and no code — see
[CONTRIBUTING.md](CONTRIBUTING.md). A startup founded in the last three years needs its
register entry and sources too — see [NEW-STARTUPS.md](NEW-STARTUPS.md).

## Data & attribution

- Basemap tiles: [Esri](https://www.esri.com/) Dark Gray Canvas — Esri, HERE, Garmin, ©
  [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, and the GIS user community
- Germany & state boundaries: [deutschlandGeoJSON](https://github.com/isellsoap/deutschlandGeoJSON)
  (data © GeoBasis-DE / BKG, [dl-de/by-2-0](https://www.govdata.de/dl-de/by-2-0))
- National startup counts (New startups coverage): Startup-Verband and startupdetector,
  [*Next Generation – Startup-Neugründungen in Deutschland*](https://startupverband.de/media/file/rs-nextgenerationstartupneugruendungenh12026)
- Register entries: Handelsregister publications, linked per entry via
  [North Data](https://www.northdata.de)
- Map rendering: [Leaflet](https://leafletjs.com/)
- Boundary processing: [mapshaper](https://github.com/mbloch/mapshaper)

## Contributors

This map is a community effort — every company on it was added by someone like
you. We'd love to see your face below: just [open a Pull Request](CONTRIBUTING.md).

[![Contributors](https://contrib.rocks/image?repo=robonn-club/industry-map)](https://github.com/robonn-club/industry-map/graphs/contributors)

## License

[MIT](LICENSE) © 2026 Robonn — Robotics Club at the University of Bonn
