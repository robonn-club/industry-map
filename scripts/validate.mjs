#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Dataset validator. Run before merging candidates or opening a PR:
//   node scripts/validate.mjs            (checks the live data)
//   node scripts/validate.mjs --staged   (also checks data/_candidates.* files)
//
// Verifies: no duplicate names, all required fields present, valid state codes,
// valid sector values, numeric coordinates, sane founded year. Exits non-zero on
// any error so it can gate CI / pre-commit. No dependencies.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const staged = process.argv.includes("--staged");

const STATES = new Set(["bw", "bavaria", "berlin", "brandenburg", "bremen", "hamburg",
  "hesse", "mv", "lower_saxony", "nrw", "rhineland_palatinate", "saarland", "saxony",
  "saxony_anhalt", "schleswig_holstein", "thuringia"]);
const SECTORS = new Set(["robotics", "automotive", "ai_ml", "industrial", "software",
  "research", "defense", "agriculture"]);
const SIZES = new Set(["startup", "mid", "big", "global"]);
const REQUIRED = ["name", "city", "state", "lat", "lng", "sector", "size", "founded", "description", "website"];

// Load an array constant from a data file by evaluating it in a sandbox-ish scope.
function load(file, varName) {
  try {
    const src = readFileSync(join(ROOT, file), "utf8");
    return new Function(`${src};return typeof ${varName}!=="undefined"?${varName}:null;`)();
  } catch (e) {
    return null;
  }
}

// Companies are split by size across data/companies/{size}.js (stitched into
// COMPANIES by index.js); each [file, var, expectSize] also asserts entries sit
// in the file matching their size.
const sources = [
  ["data/companies/global.js", "COMPANIES_GLOBAL", "global"],
  ["data/companies/big.js", "COMPANIES_BIG", "big"],
  ["data/companies/mid.js", "COMPANIES_MID", "mid"],
  ["data/companies/startup.js", "COMPANIES_STARTUP", "startup"],
  ["data/institutes.js", "INSTITUTES"],
];
if (staged) sources.push(
  ["data/_candidates.js", "CANDIDATES"],
  ["data/_candidates.institutes.js", "INSTITUTE_CANDIDATES"],
);

const errors = [];
const seen = new Map(); // lowercased name → file it first appeared in
let total = 0;

for (const [file, varName, expectSize] of sources) {
  const arr = load(file, varName);
  if (arr == null) {
    if (!file.includes("_candidates")) errors.push(`${file}: could not load ${varName}`);
    continue;
  }
  arr.forEach((e, i) => {
    total++;
    const at = `${file}[${i}] ${e?.name ?? "(no name)"}`;
    for (const k of REQUIRED) if (e[k] === undefined || e[k] === "") errors.push(`${at}: missing/empty "${k}"`);
    if (e.state && !STATES.has(e.state)) errors.push(`${at}: invalid state "${e.state}"`);
    if (e.sector && !SECTORS.has(e.sector)) errors.push(`${at}: invalid sector "${e.sector}"`);
    if (e.size && !SIZES.has(e.size)) errors.push(`${at}: invalid size "${e.size}"`);
    if (expectSize && e.size && e.size !== expectSize) errors.push(`${at}: size "${e.size}" but filed in ${expectSize}.js`);
    if (typeof e.lat !== "number" || typeof e.lng !== "number") errors.push(`${at}: lat/lng must be numbers`);
    if (e.lat < 47 || e.lat > 55.5 || e.lng < 5 || e.lng > 16) errors.push(`${at}: coordinates outside Germany`);
    if (typeof e.founded !== "number" || e.founded < 1500 || e.founded > new Date().getFullYear())
      errors.push(`${at}: implausible founded "${e.founded}"`);
    const key = (e.name ?? "").toLowerCase().trim();
    if (key) {
      if (seen.has(key)) errors.push(`${at}: duplicate name (also in ${seen.get(key)})`);
      else seen.set(key, file);
    }
  });
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) across ${total} entries:\n`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ ${total} entries valid — no duplicates, all fields/states/sectors/coords OK.`);
