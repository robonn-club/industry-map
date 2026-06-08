# Germany Industry Map

An interactive map of Germany's robotics, tech, and industrial landscape — built
by [Robonn](https://github.com/robonn-club), the robotics club at the
University of Bonn, to help students see the industry at a glance and find
companies and labs to connect with.

**[▶ Open the live map](https://robonn-club.github.io/industry-map/)**

## What it shows

- **100 companies and research institutes** across 8 sectors, plotted on a precise
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
index.html          # page structure
css/style.css       # styling (Robonn brand)
js/app.js           # all logic
data/
  companies.js      # companies (7 sectors)
  institutes.js     # research institutes & university labs
  regions.js        # regional profiles
  germany.js        # national outline
  bundeslaender.js  # the 16 states
  world.js          # world backdrop
```

## Contributing

Adding a company or institute takes one entry and no code — see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Data & attribution

- Country borders: [Natural Earth](https://www.naturalearthdata.com/) (public domain)
- Germany & state boundaries: [deutschlandGeoJSON](https://github.com/isellsoap/deutschlandGeoJSON)
  (data © GeoBasis-DE / BKG, [dl-de/by-2-0](https://www.govdata.de/dl-de/by-2-0))
- Map rendering: [Leaflet](https://leafletjs.com/)

## License

[MIT](LICENSE) © 2026 Robonn — Robotics Club at the University of Bonn
