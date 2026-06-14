# Germany Industry Map

An interactive map of Germany's robotics, tech, and industrial landscape — built
by [Robonn](https://github.com/robonn-club), the robotics club at the
University of Bonn, to help students see the industry at a glance and find
companies and labs to connect with.

**[▶ Open the live map](https://robonn-club.github.io/industry-map/)**

## What it shows

- **245 companies and research institutes** across 8 sectors, plotted on a precise
  vector map of Germany and its 16 states.
- **Multi-select sector filters**, a **Near Bonn** filter, and a **Sector Grid**
  that compares all sectors at once.
- Click a state for a regional sector breakdown; click a point for details and a
  link to the organisation.
- Filtered views are shareable by URL (e.g. `?s=robotics,ai_ml`).

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
  build-geo.mjs         # regenerates the geo/*.js layers from src/
  validate.mjs          # checks company/institute data
```

## Map & boundaries

The basemap is **CARTO Dark Matter** (OpenStreetMap data) raster tiles in Web Mercator — a precise,
world-wide dark slippy map you can zoom from the globe down to a street. The coloured sector markers
and an interactive **Bundesländer** overlay sit on top.

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

- Basemap tiles: [CARTO](https://carto.com/attributions) Dark Matter, data ©
  [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
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
