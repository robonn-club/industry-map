// Company dataset, split by size across data/companies/{global,big,mid,startup}.js.
// Those four files must be loaded before this one (see index.html); this stitches
// them back into the single COMPANIES array the rest of the app consumes.
//
// Sizes:   "startup" (<100 employees) | "mid" (100–1000) | "big" (1000–5000) | "global" (5000+)
// Sectors: robotics | automotive | ai_ml | industrial | software | research | defense | agriculture
//
// lat/lng position the marker and are canonical — prefer the company's real HQ
// building (scripts/geocode.mjs snaps them to the OSM footprint). `address` is an
// optional, derived label (street + house number where OSM has it) shown in the
// popup; it is never the source of truth for position, so leaving it off is fine.

const COMPANIES = [
  ...COMPANIES_GLOBAL,
  ...COMPANIES_BIG,
  ...COMPANIES_MID,
  ...COMPANIES_STARTUP,
];
