#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Dataset validator. Run before merging candidates or opening a PR:
//   node scripts/validate.mjs            (checks the live data)
//   node scripts/validate.mjs --staged   (also checks data/_candidates.* files)
//
// Verifies: no duplicate names, all required fields present, valid state codes,
// valid sector values, numeric coordinates, sane founded year where given. Exits non-zero on
// any error so it can gate CI / pre-commit. No dependencies.
//
// New startups (data/companies/new-startups.js) get a stricter pass on top: each
// must carry its register entry, its legal entity and sources of every required
// kind, must not share a register number or website with anything else, and must
// not be on the review file's list of candidates already ruled out. Conditions
// that depend on today's date (an entry ageing out of the window, a check grown
// old) are warnings, never errors: CI must not start failing because a day passed.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const staged = process.argv.includes("--staged");

const STATES = new Set(["bw", "bavaria", "berlin", "brandenburg", "bremen", "hamburg",
  "hesse", "mv", "lower_saxony", "nrw", "rhineland_palatinate", "saarland", "saxony",
  "saxony_anhalt", "schleswig_holstein", "thuringia"]);
// "research" is deliberately absent: it described what an entry *is*, not what it
// works on, so it collapsed a third of the dataset into one bucket and hid every
// major robotics lab behind a filter no robotics student would click. Institutes
// now carry a real domain; company-vs-institute is the separate Type axis.
const SECTORS = new Set(["robotics", "automotive", "ai_ml", "industrial", "software",
  "defense", "agriculture"]);
const SIZES = new Set(["startup", "mid", "big", "global"]);
const REQUIRED = ["name", "city", "state", "lat", "lng", "sector", "size", "description", "website"];

// `founded` is optional, and deliberately so. Plenty of real entries have no
// defensible founding year: a university chair that grew out of another, an
// institute formed by merging two others, a company with no public founding
// date. Requiring the field pushed contributors toward inventing one, which is
// worse than an absent value — nothing in the UI reads it. Supply it when a
// source states it; leave it out when it does not.

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
// in the file matching their size. new-startups.js holds any size.
const NEW_FILE = "data/companies/new-startups.js";
const REVIEW_FILE = "data/companies/new-startups.review.js";
const sources = [
  ["data/companies/global.js", "COMPANIES_GLOBAL", "global"],
  ["data/companies/big.js", "COMPANIES_BIG", "big"],
  ["data/companies/mid.js", "COMPANIES_MID", "mid"],
  ["data/companies/startup.js", "COMPANIES_STARTUP", "startup"],
  [NEW_FILE, "NEW_STARTUPS"],
  ["data/institutes.js", "INSTITUTES"],
];
if (staged) sources.push(
  ["data/_candidates.js", "CANDIDATES"],
  ["data/_candidates.institutes.js", "INSTITUTE_CANDIDATES"],
);

const errors = [];
const warnings = [];
const seen = new Map(); // lowercased name → file it first appeared in
const hosts = new Map(); // website host → [name, file] of every entry using it
let total = 0;

const hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch { return null; }
};

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
    if (e.address !== undefined && typeof e.address !== "string") errors.push(`${at}: address must be a string`);
    if (e.state && !STATES.has(e.state)) errors.push(`${at}: invalid state "${e.state}"`);
    if (e.sector && !SECTORS.has(e.sector)) errors.push(`${at}: invalid sector "${e.sector}"`);
    if (e.size && !SIZES.has(e.size)) errors.push(`${at}: invalid size "${e.size}"`);
    if (expectSize && e.size && e.size !== expectSize) errors.push(`${at}: size "${e.size}" but filed in ${expectSize}.js`);
    if (typeof e.lat !== "number" || typeof e.lng !== "number") errors.push(`${at}: lat/lng must be numbers`);
    if (e.lat < 47 || e.lat > 55.5 || e.lng < 5 || e.lng > 16) errors.push(`${at}: coordinates outside Germany`);
    if (e.founded !== undefined &&
        (typeof e.founded !== "number" || e.founded < 1500 || e.founded > new Date().getFullYear()))
      errors.push(`${at}: implausible founded "${e.founded}"`);
    const key = (e.name ?? "").toLowerCase().trim();
    if (key) {
      if (seen.has(key)) errors.push(`${at}: duplicate name (also in ${seen.get(key)})`);
      else seen.set(key, file);
    }
    const host = hostOf(e.website);
    if (host) (hosts.get(host) ?? hosts.set(host, []).get(host)).push([e.name, file]);
  });
}

// ── New startups: provenance, uniqueness, and the review file ────────────────

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (s) => typeof s === "string" && ISO_DAY.test(s) && !Number.isNaN(Date.parse(s))
  && new Date(s).toISOString().slice(0, 10) === s;
const today = new Date().toISOString().slice(0, 10);
const windowStart = (() => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear() - 3, d.getUTCMonth(), d.getUTCDate())).toISOString().slice(0, 10);
})();
// Court, register type and number, e.g. "Amtsgericht Charlottenburg (Berlin) HRB 260878 B".
const REGISTER = /^Amtsgericht \S.*? (HRB|HRA|GnR|PR|VR) \d+( [A-Z]{1,2})?$/;
const SOURCE_TYPES = new Set(["register", "company", "press", "institution"]);
const STATUSES = new Set(["active", "inactive"]);
const STALE_DAYS = 365;

const review = load(REVIEW_FILE, "NEW_STARTUP_REVIEW");
if (review == null) errors.push(`${REVIEW_FILE}: could not load NEW_STARTUP_REVIEW`);
const reasons = new Set(Object.keys(review?.reasons ?? {}));
const rejected = review?.rejected ?? [];
const rejectedRegisters = new Map(rejected.filter(r => r.register).map(r => [r.register, r.name]));
const rejectedNames = new Map(rejected.map(r => [r.name.toLowerCase(), r.reason]));

rejected.forEach((r, i) => {
  const at = `${REVIEW_FILE} rejected[${i}] ${r?.name ?? "(no name)"}`;
  if (!r.name) errors.push(`${at}: missing name`);
  if (!reasons.has(r.reason)) errors.push(`${at}: unknown reason "${r.reason}"`);
  if (!isDay(r.checked)) errors.push(`${at}: "checked" must be YYYY-MM-DD`);
  if (r.registered !== undefined && !isDay(r.registered)) errors.push(`${at}: "registered" must be YYYY-MM-DD`);
  if (r.register !== undefined && !REGISTER.test(r.register)) errors.push(`${at}: register "${r.register}" is not "Amtsgericht <court> HRB <number>"`);
  if (!r.register && !r.source) errors.push(`${at}: needs a register or a source, so the decision can be re-checked`);
});

const fresh = load(NEW_FILE, "NEW_STARTUPS") ?? [];
const registers = new Map();
fresh.forEach((e, i) => {
  const at = `${NEW_FILE}[${i}] ${e?.name ?? "(no name)"}`;
  for (const k of ["legalName", "register", "registered", "status", "verified"])
    if (e[k] === undefined || e[k] === "") errors.push(`${at}: missing/empty "${k}"`);

  if (e.register !== undefined) {
    if (!REGISTER.test(e.register)) errors.push(`${at}: register "${e.register}" is not "Amtsgericht <court> HRB <number>"`);
    if (registers.has(e.register)) errors.push(`${at}: register ${e.register} is already used by ${registers.get(e.register)}`);
    else registers.set(e.register, e.name);
    if (rejectedRegisters.has(e.register))
      errors.push(`${at}: register ${e.register} is on the review file's rejected list (as "${rejectedRegisters.get(e.register)}")`);
  }
  if (rejectedNames.has((e.name ?? "").toLowerCase()))
    errors.push(`${at}: also on the rejected list (${rejectedNames.get(e.name.toLowerCase())}) — keep it in one place`);

  if (e.registered !== undefined) {
    if (!isDay(e.registered)) errors.push(`${at}: "registered" must be a real date, YYYY-MM-DD`);
    else if (e.registered > today) errors.push(`${at}: "registered" ${e.registered} is in the future`);
    else if (e.registered < windowStart && e.status !== "inactive")
      warnings.push(`${at}: registered ${e.registered}, before the window (${windowStart}) — move it to the size file that fits`);
  }
  if (e.verified !== undefined) {
    if (!isDay(e.verified)) errors.push(`${at}: "verified" must be a real date, YYYY-MM-DD`);
    else if (e.verified > today) errors.push(`${at}: "verified" ${e.verified} is in the future`);
    else if (isDay(e.registered) && e.verified < e.registered) errors.push(`${at}: verified before it was registered`);
    else if ((Date.parse(today) - Date.parse(e.verified)) / 864e5 > STALE_DAYS)
      warnings.push(`${at}: last verified ${e.verified}, over ${STALE_DAYS} days ago`);
  }
  // A stated founding year far from the register date usually means a renamed
  // or re-registered older business — worth a second look, not a hard stop.
  if (typeof e.founded === "number" && isDay(e.registered) && Math.abs(e.founded - +e.registered.slice(0, 4)) > 1)
    warnings.push(`${at}: founded ${e.founded} but registered ${e.registered} — check it is not an older business`);

  if (e.status !== undefined && !STATUSES.has(e.status)) errors.push(`${at}: invalid status "${e.status}"`);
  if (e.status === "inactive" && !e.statusNote) errors.push(`${at}: inactive entries need a statusNote saying why and since when`);

  if (!Array.isArray(e.sources)) {
    errors.push(`${at}: missing "sources"`);
  } else {
    const types = new Set();
    e.sources.forEach((s, j) => {
      if (!SOURCE_TYPES.has(s?.type)) errors.push(`${at}: sources[${j}] has invalid type "${s?.type}"`);
      if (typeof s?.url !== "string" || !/^https?:\/\//.test(s.url)) errors.push(`${at}: sources[${j}] needs an http(s) url`);
      if (!s?.note) errors.push(`${at}: sources[${j}] needs a note saying what it confirms`);
      types.add(s?.type);
    });
    if (!types.has("register")) errors.push(`${at}: needs a "register" source`);
    if (!types.has("company")) errors.push(`${at}: needs a "company" source (its own imprint)`);
    if (!types.has("press") && !types.has("institution")) errors.push(`${at}: needs an independent "press" or "institution" source`);
  }

  // One website, one entry: a host shared with anything else on the map is
  // almost always the same company under another name.
  const host = hostOf(e.website);
  const others = (hosts.get(host) ?? []).filter(([n]) => n !== e.name);
  if (host && others.length) errors.push(`${at}: website host ${host} is also used by ${others.map(([n, f]) => `${n} (${f})`).join(", ")}`);
});

// A lead is a name waiting for its check. The finder (scripts/find-startups.mjs) adds
// the links it found, and a lead that has been dealt with must not linger as one.
(review?.leads ?? []).forEach((l, i) => {
  const at = `${REVIEW_FILE} leads[${i}] ${l?.name ?? "(no name)"}`;
  if (!l.name) errors.push(`${at}: missing name`);
  if (!l.city && !l.source) errors.push(`${at}: needs a city or a source`);
  for (const k of ["website", "source", "imprint"])
    if (l[k] !== undefined && !/^https?:\/\//.test(l[k])) errors.push(`${at}: "${k}" must be an http(s) url`);
  if (l.register !== undefined && !REGISTER.test(l.register)) errors.push(`${at}: register "${l.register}" is not "Amtsgericht <court> HRB <number>"`);
  if (l.found !== undefined && !isDay(l.found)) errors.push(`${at}: "found" must be YYYY-MM-DD`);
  const key = (l.name ?? "").toLowerCase().trim();
  if (seen.has(key)) errors.push(`${at}: already on the map (${seen.get(key)}) — remove the lead`);
  if (rejectedNames.has(key)) errors.push(`${at}: also on the rejected list — keep it in one place`);
});

for (const w of warnings) console.warn("  ! " + w);
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) across ${total} entries:\n`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ ${total} entries valid — no duplicates, all fields/states/sectors/coords OK;`
  + ` ${fresh.length} new startups with register entries and sources, ${rejected.length} rejected candidates on record.`);
