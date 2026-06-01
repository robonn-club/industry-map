# Contributing

The map is only as good as its data. The easiest way to help is to **add a
company or research institute** — no coding required, just one JSON-style entry.

## Add a company

Open [`data/companies.js`](data/companies.js) and copy an existing entry into the
right sector block:

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

## Submitting

1. Fork the repo and create a branch.
2. Add your entry (open `index.html` locally to check it appears).
3. Open a pull request describing what you added.
