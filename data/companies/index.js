// Company dataset, split by size across data/companies/{global,big,mid,startup}.js.
// Those four files must be loaded before this one (see index.html); this stitches
// them back into the single COMPANIES array the rest of the app consumes.
//
// Sizes:   "startup" (<100 employees) | "mid" (100–1000) | "big" (1000–5000) | "global" (5000+)
// Sectors: robotics | automotive | ai_ml | industrial | software | research | defense | agriculture

const COMPANIES = [
  ...COMPANIES_GLOBAL,
  ...COMPANIES_BIG,
  ...COMPANIES_MID,
  ...COMPANIES_STARTUP,
];
