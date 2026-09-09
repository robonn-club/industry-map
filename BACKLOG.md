# Industry Map — backlog

A live, interactive map of Germany's robotics & tech industry that helps everyone discover
companies to connect with.

## Done

### Batch 1
- [x] Add multiple filter selection
- [x] Sector grid button moved to the top-left of the filter bar; the "near" filter is no
      longer Bonn-only — any of 25 university cities can be the origin, so "near me" works
      wherever you study

### Batch 2
- [x] Add a reset button for filters — clears sectors, region *and* distance in one click
- [x] Move the question from center to top-right, next to the company count
- [x] Move the map `+` / `-` controls under the sector-grid button
- [x] Review the filtering process — `isVisible()` is now the single gate; chips carry live
      counts and dim in place instead of disappearing, so the bar never reflows

### Batch 3
- [x] Separate companies and research institutes into different data files
- [ ] Deepen company data
- [ ] Deepen research-institute data

## Next round — decisions locked

1. **Split type from domain.** `research` is currently both a sector and 34% of the dataset
   (83/245), so filtering "Robotics" shows 28 dots and *hides* DLR RMC, Fraunhofer IPA, DFKI,
   KIT humanoids and both Bonn labs. Re-sector the 83 institutes to their real domain and make
   company-vs-institute its own filter, driven by the existing `isInstitute` flag. Drop
   `research` from `SECTOR_CONFIG`; extend `scripts/validate.mjs` for the new shape.
2. **Fix institute `size`.** Marker radius encodes headcount, but institutes carry their parent
   org's size — Uni Bonn AIS (~25 people) and TU Berlin RBO are both `mid` (100–1000), and no
   institute is `startup`. Re-bucket on group headcount alongside (1).
3. **Global search box** in the header — name / city / tag, flying to the hit via the existing
   `locateEntity()`. Today the only text search is inside the list overlay.
4. **Cluster or spiderfy dense cities.** Munich 38, Berlin 23, Stuttgart 9 overlap at the
   default zoom; only *exactly identical* coordinates are fanned out today.
5. **`tags`, `updated`, `source` fields** + a generated `data/map.json`, so engineers can find
   by technology (SLAM, manipulation, perception, ROS) and the bot/website can reuse the data.
6. ~~**GitHub Action** running `scripts/validate.mjs` on every PR~~ — **done**, along with
   `scripts/check-links.mjs` and a weekly link sweep. See [scripts/README.md](scripts/README.md).

## Link health

Every dot on the map is a link, so a dead URL silently breaks the thing the map exists for.
`scripts/check-links.mjs` checks them; CI runs it on changed URLs per PR and sweeps all of them
weekly into one self-updating issue.

Its verdicts are deliberately conservative — only a definitive `404`/`410`/`451` or a
non-resolving domain counts as **dead**. Timeouts and bot-blocks are reported separately and
never fail a run: an early draft that treated timeouts as failures flagged 119 of 245 links as
broken, including BMW, Siemens and SAP, every one of which was simply slow.

First full sweep: **220 ok · 8 moved · 14 unverifiable · 2 unreachable · 1 dead.** The dead one
(Heckler & Koch) and five legacy-branded domains were fixed. Three redirects were left alone on
purpose — Diehl lands on a migration host, Webasto on a locale page, and the Uni Freiburg lab's
own site is http-only, so in each case the redirect target would be a worse entry than what is
there now.

## Scope

**Germany-first**: worldwide audience, German dataset. The validator's German bounding box
stays. `data/geo/world.js` is still produced by the build but never rendered — safe to drop.

## Known coverage gaps

Bavaria 65, BW 53, NRW 39, Berlin 23 … but MV 1, Saarland 2, Brandenburg 2, Saxony-Anhalt 2.
Roughly true to the real industry, though the region panel is near-empty for six states. The
map is a curated sample, not a census, and should say so.
