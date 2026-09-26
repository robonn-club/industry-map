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

## Next round

1. ~~**Split type from domain.**~~ **Done.** All 83 institutes carry a real sector;
   `research` is gone from `SECTOR_CONFIG` and from the validator, and
   company-vs-institute is its own **Type** filter (`?t=company|institute`).
   Robotics went **28 → 65**, AI & ML **24 → 51**.
2. ~~**Fix institute `size`.**~~ **Done.** Sizes are now the group's headcount, not
   the parent university's: 43 labs are `startup` (<100), where none were before.
   Institute markers gained a radius floor and heavier stroke, because a correct
   `startup` ring at 3.5 px was invisible.
3. ~~**Global search box.**~~ **Done.** Header search over name, city, sector and
   description; `/` focuses it, arrows + Enter pick, and it ignores active filters.
4. **Cluster or spiderfy dense cities.** Munich 38, Berlin 23, Stuttgart 9 overlap at
   the default zoom; only *exactly identical* coordinates are fanned out today. Search
   takes some pressure off this, but the visual pile-up remains.
5. **`tags`, `updated`, `source` fields** + a generated `data/map.json`. Search reads
   descriptions today, which covers technology terms only where a description happens
   to mention them — `slam` finds 3 labs, and there are certainly more.
6. ~~**GitHub Action** running `scripts/validate.mjs` on every PR~~ — **done**, along
   with `scripts/check-links.mjs` and a weekly link sweep. See
   [scripts/README.md](scripts/README.md).

## Needs human review

The 83 institute sector/size assignments were made by reading each entry's name and
description. Most are unambiguous; these are judgement calls worth a second opinion:

| Entry | Called it | Why it is arguable |
|---|---|---|
| Max Planck Institute for Intelligent Systems | `robotics` | Genuinely split — Tübingen is ML-heavy, Stuttgart is robotics |
| DFKI (main) | `ai_ml` | "Europe's leading AI lab" but with major robotics groups; its Robotics Innovation Center is separately listed as `robotics` |
| Fraunhofer IML | `industrial` | Logistics/material flow; a robotics student would also expect it under robotics |
| Fraunhofer IOSB | `defense` | Optronics and image exploitation; also does civil autonomous systems |
| Fraunhofer HHI | `software` | Telecoms, photonics and video coding fit none of the seven sectors well |
| Uni Würzburg — Robotics and Telematics | `robotics` | Small-satellite formations arguably belong under Aerospace & Defense |
| TUM — Computer Vision & AI | `ai_ml` | Visual SLAM is robotics-adjacent; filed under the chair's own name |
| Science of Intelligence | `robotics` | A cluster spanning robotics, AI and cognitive science |
| RWTH Aachen Robotics | `mid` | An umbrella entry over several chairs rather than one group |

Sizes for the large Fraunhofer institutes (IPA, IML, IOSB, IIS `big`) are estimates from
institute scale, not headcounts pulled from a source.

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

## Coverage

**269 entries — 169 companies, 100 labs — and every one of the 16 Bundesländer is now
represented.** A September 2026 pass added 25 entries aimed squarely at the states the map
barely reached:

| State | was | now | added |
|---|---|---|---|
| Mecklenburg-Vorpommern | 1 | 3 | Fraunhofer IGP, Uni Rostock Chair of Mechatronics |
| Saxony-Anhalt | 2 | 4 | ifak, Fraunhofer IMWS |
| Brandenburg | 2 | 3 | Rolls-Royce Deutschland (Dahlewitz) |
| Saarland | 2 | 3 | ZeMA |
| Thuringia | 3 | 6 | Fraunhofer IOF, Fraunhofer IDMT, Carl Zeiss Meditec |
| Schleswig-Holstein | 4 | 8 | GEOMAR, Drägerwerk, Fraunhofer ISIT, Raytheon Anschütz |
| Hamburg | 5 | 7 | Fraunhofer CML, TU Hamburg IMEK |
| Bremen | 6 | 7 | OHB System |
| Rhineland-Palatinate | 7 | 8 | Schott |
| Saxony | 7 | 11 | Fraunhofer IPMS / IVI / IKTS, Fabmatics |
| Hesse | 8 | 11 | ESA ESOC, Fraunhofer LBF, Fraunhofer SIT |

Density still favours the south — Bavaria 4.9 and Berlin 5.9 entries per million residents
against Brandenburg 1.2 and Rhineland-Palatinate 1.9 — which is broadly true to where the
industry sits, but the thinnest states are no longer near-empty. The map remains a curated
sample, not a census.

### Still thin
- **Lower Saxony (18), NRW (39)** are large states whose entries skew to a few cities.
- **Rhineland-Palatinate and Saarland** have the key robotics players (DFKI, RPTU, ZeMA,
  CISPA) but little industry beyond them.
- No entry anywhere is a *branch site* of a foreign company: the map tracks headquarters and
  independent research institutes, so e.g. John Deere's Kaiserslautern R&D centre is absent.

