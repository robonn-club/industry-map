# Contributing

The map is only as good as its data. The easiest way to help is to **add a
company or research institute** — no coding required, just one JSON-style entry.

## Add a company

Companies are split by size into [`data/companies/`](data/companies/) — open the
file matching the company's size (`global.js`, `big.js`, `mid.js`, or
`startup.js`) and copy an existing entry into the right sector block:

```js
{
  name: "Example Robotics", city: "Munich", state: "bavaria",
  lat: 48.1374, lng: 11.5755,
  sector: "robotics", size: "mid", founded: 2015,
  description: "One concise sentence on what they build.",
  website: "https://example.com"
},
```

## Add a research institute

Same fields, in [`data/institutes.js`](data/institutes.js). Always use
`sector: "research"`.

## Field reference

| Field | Values |
|-------|--------|
| `sector` | `robotics` · `automotive` · `ai_ml` · `industrial` · `software` · `defense` · `agriculture` · `research` |
| `size` | `startup` (<100) · `mid` (100–1000) · `big` (1000–5000) · `global` (5000+) |
| `state` | `bw` `bavaria` `berlin` `brandenburg` `bremen` `hamburg` `hesse` `mv` `lower_saxony` `nrw` `rhineland_palatinate` `saarland` `saxony` `saxony_anhalt` `schleswig_holstein` `thuringia` |
| `lat` / `lng` | Decimal coordinates (look them up on a map; ~4 decimals is plenty) |
| `description` | One sentence, factual, no marketing fluff |

## Guidelines

- **Real, verifiable companies only** — include the official `website`.
- **No duplicates** — search the file first.
- Keep descriptions to **one sentence**.
- Place the entry under the matching sector comment to keep the file tidy.

## Editing the map boundaries

The files in [`data/geo/`](data/geo/) (`germany.js`, `bundeslaender.js`, `world.js`) are
**generated — don't hand-edit them.** They're built from the pristine sources in `data/geo/src/`:

```bash
npm install
npm run build:geo
```

`scripts/build-geo.mjs` simplifies the Bundesländer and derives the national outline as their exact
dissolve (one shared topology), so the borders always match. Edit `data/geo/src/` and rebuild.

## Submitting

1. Fork the repo and create a branch.
2. Add your entry (open `index.html` locally to check it appears).
3. If you touched data, run `node scripts/validate.mjs` (and `npm run build:geo` for boundaries).
4. Open a pull request describing what you added.

## Recognition

Everyone who contributes shows up in the **[Contributors](README.md#contributors)**
image in the README — your avatar, linked to your GitHub profile. It updates
automatically from the commit history, so once your pull request is merged you'll
appear there. Adding a single company is enough; you don't have to write code.
