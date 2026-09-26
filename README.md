# Germany Industry Map

An interactive map of Germany's robotics, tech, and industrial landscape — built
by [Robonn](https://github.com/robonn-club), the robotics club at the
University of Bonn, to help students see the industry at a glance and find
companies and labs to connect with.

**[▶ Open the live map](https://robonn-club.github.io/industry-map/)**

## What it shows

- **169 companies and 100 university labs / research institutes** across 7 sectors,
  plotted on a precise vector map of Germany and its 16 states — every state has entries.
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
  (e.g. `?s=robotics&t=institute&r=bavaria&o=Munich&v=list`).

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
index.html              # page structure
css/style.css           # styling (Robonn brand)
js/app.js               # all logic
data/
  companies/            # companies (7 sectors), split by size
    global.js  big.js  mid.js  startup.js
    index.js            # merges the size files into COMPANIES
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
  fetch-candidates.mjs  # drafts new entries from Wikidata for review
  build-geo.mjs         # regenerates the geo/*.js layers from src/
  README.md             # what each script does and how they fit together
.github/workflows/
  validate.yml          # dataset + changed-link checks on every pull request
  links.yml             # weekly sweep of all links -> one self-updating issue
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
[CONTRIBUTING.md](CONTRIBUTING.md).

## Data & attribution

- Basemap tiles: [Esri](https://www.esri.com/) Dark Gray Canvas — Esri, HERE, Garmin, ©
  [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, and the GIS user community
- Germany & state boundaries: [deutschlandGeoJSON](https://github.com/isellsoap/deutschlandGeoJSON)
  (data © GeoBasis-DE / BKG, [dl-de/by-2-0](https://www.govdata.de/dl-de/by-2-0))
- Map rendering: [Leaflet](https://leafletjs.com/)
- Boundary processing: [mapshaper](https://github.com/mbloch/mapshaper)

## Contributors

This map is a community effort — every company on it was added by someone like
you. We'd love to see your face below: just [open a Pull Request](CONTRIBUTING.md).

[![Contributors](https://contrib.rocks/image?repo=robonn-club/industry-map)](https://github.com/robonn-club/industry-map/graphs/contributors)

## License

[MIT](LICENSE) © 2026 Robonn — Robotics Club at the University of Bonn
