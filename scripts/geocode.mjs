#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// HQ geocoder — snaps company/institute coordinates to their real OSM footprint.
//
//   node scripts/geocode.mjs            dry run: writes data/_geocode.review.json,
//                                       prints a summary, mutates nothing
//   node scripts/geocode.mjs --write    apply HIGH-confidence hits in place
//                                       (6-decimal lat/lng + an `address` field)
//
// We query Nominatim (the same OSM data the map's tiles render) by name + city,
// then keep only confident building-level matches: the machine does the lookup
// grind, you keep the quality gate (see scripts/README.md, data-curation flow).
//
// Confidence:
//   HIGH  name-token match AND a real footprint (osm_type way/relation, or an
//         office/industrial/commercial/building type) AND moved < MAX_JUMP_KM
//   MED   name matched but the hit is a point of dubious type (bus stop, a lone
//         "consulting" node) — eyeball it
//   LOW   no name match / city-level result only — look it up by hand
//
// HIGH hits are safe to apply; MED/LOW are listed with an OSM search link so you
// can paste the right coordinate yourself. No dependencies (Node 18+ fetch).
// Be polite: one request per second against the public endpoint.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WRITE = process.argv.includes("--write");
const ENDPOINT = "https://nominatim.openstreetmap.org/search";
const UA = "robonn-industry-map-geocoder/0.1 (https://github.com/robonn-club/industry-map; research)";
const CACHE_FILE = join(ROOT, "scripts/.geocode-cache.json");
const REVIEW_FILE = join(ROOT, "data/_geocode.review.json");
const MAX_JUMP_KM = 40;          // a "match" further than this is almost certainly the wrong place
const COORD_DECIMALS = 6;        // ~0.1 m — building resolution

// Footprint types worth trusting even on a node; everything else needs a way/relation.
const GOOD_TYPES = new Set(["office", "industrial", "commercial", "building", "works",
  "company", "factory", "manufacture", "yes"]);

const sources = [
  ["data/companies/global.js", "COMPANIES_GLOBAL"],
  ["data/companies/big.js", "COMPANIES_BIG"],
  ["data/companies/mid.js", "COMPANIES_MID"],
  ["data/companies/startup.js", "COMPANIES_STARTUP"],
  ["data/institutes.js", "INSTITUTES"],
];

function load(file, varName) {
  const src = readFileSync(join(ROOT, file), "utf8");
  return new Function(`${src};return typeof ${varName}!=="undefined"?${varName}:null;`)();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function haversine(aLat, aLng, bLat, bLng) {
  const rad = Math.PI / 180, R = 6371;
  const dLat = (bLat - aLat) * rad, dLng = (bLng - aLng) * rad;
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Trim Nominatim's verbose display_name to a usable street address (drop the
// trailing state / postcode / country tail, keep house number + street + city).
// Only return a label when OSM actually has a street — a bare city duplicates the
// entry's `city` field, so we leave `address` off and let the marker speak.
function shortAddress(r) {
  const a = r.address ?? {};
  if (!a.road) return null;
  const street = [a.road, a.house_number].filter(Boolean).join(" ");
  const place = a.city || a.town || a.village || a.suburb || a.municipality || "";
  return [street, a.postcode, place].filter(Boolean).join(", ");
}

// A hand-entered `address` (from the company's Impressum) is the most precise
// input we have, so geocode that verbatim. Otherwise fall back to name search:
// institute names read "Parent — Lab" and the lab tail isn't mapped, so search
// the parent institution; companies keep their full name (hyphens intact).
function queryFor(e) {
  if (e.address) return `${e.address}, Germany`;
  const parent = e.name.split(/\s+[—–]\s+/)[0];   // spaced em/en dash only
  return `${parent}, ${e.city}, Germany`;
}

// When we queried by a curated address, trust the top hit if it resolved to a
// precise point (a house number or a building footprint) rather than a town.
function chooseByAddress(cands, oldLat, oldLng) {
  if (!cands?.length) return { r: null, conf: "LOW", reason: "address not found" };
  const r = cands[0];
  const jump = haversine(oldLat, oldLng, +r.lat, +r.lon);
  const precise = r.address?.house_number || r.osm_type === "way"
    || r.osm_type === "relation" || GOOD_TYPES.has(r.type) || r.type === "house";
  if (!precise) return { r, conf: "MED", reason: `address coarse (${r.type})`, jump };
  if (jump > MAX_JUMP_KM) return { r, conf: "MED", reason: `address ${jump.toFixed(0)} km from old`, jump };
  return { r, conf: "HIGH", reason: `address ${r.osm_type}/${r.type}`, jump };
}

// Among the top candidates, keep the ones whose name actually matches, then pick
// the best footprint: an office/industrial/works way or relation beats a museum,
// a dealership or a bus stop that merely shares the brand name.
function chooseBest(cands, name, oldLat, oldLng) {
  if (!cands?.length) return { r: null, conf: "LOW", reason: "no result" };
  const token = name.toLowerCase().replace(/\b(group|ag|gmbh|se|kg|co|the)\b/g, "").trim().split(/\s+/)[0];
  const matches = cands.filter(r => token && (r.display_name ?? "").toLowerCase().includes(token));
  if (!matches.length) return { r: cands[0], conf: "LOW", reason: `name not in matches (${cands[0].type})` };
  const scored = matches.map(r => {
    const jump = haversine(oldLat, oldLng, +r.lat, +r.lon);
    const footprint = r.osm_type === "way" || r.osm_type === "relation";
    const goodType = GOOD_TYPES.has(r.type);
    const score = (goodType ? 4 : 0) + (footprint ? 2 : 0) - (jump > MAX_JUMP_KM ? 10 : 0) - jump / 50;
    return { r, jump, footprint, goodType, score };
  }).sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (best.jump > MAX_JUMP_KM) return { r: best.r, conf: "MED", reason: `best match ${best.jump.toFixed(0)} km away`, jump: best.jump };
  if (!best.footprint && !best.goodType) return { r: best.r, conf: "MED", reason: `dubious type "${best.r.type}"`, jump: best.jump };
  return { r: best.r, conf: "HIGH", reason: `${best.r.osm_type}/${best.r.type}`, jump: best.jump };
}

async function geocode(q, cache) {
  if (cache[q] !== undefined) return cache[q];
  const url = `${ENDPOINT}?` + new URLSearchParams({
    q, format: "jsonv2", limit: "5", addressdetails: "1", countrycodes: "de",
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Nominatim ${res.status} for "${q}"`);
  cache[q] = await res.json();
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 0));   // persist as we go
  await sleep(1100);                                            // 1 req/s, politely
  return cache[q];
}

const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};
const review = [];
const counts = { HIGH: 0, MED: 0, LOW: 0 };

for (const [file, varName] of sources) {
  const arr = load(file, varName);
  if (!arr) { console.error(`! could not load ${varName} from ${file}`); continue; }
  for (const e of arr) {
    const q = queryFor(e);
    let cands;
    try { cands = await geocode(q, cache); }
    catch (err) { console.error(`  ${e.name}: ${err.message}`); continue; }
    const { r, conf, reason, jump } = e.address
      ? chooseByAddress(cands, e.lat, e.lng)
      : chooseBest(cands, e.name, e.lat, e.lng);
    counts[conf]++;
    const osmUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`;
    review.push({
      name: e.name, file, city: e.city, conf, reason, website: e.website,
      oldLat: e.lat, oldLng: e.lng,
      newLat: r ? +(+r.lat).toFixed(COORD_DECIMALS) : null,
      newLng: r ? +(+r.lon).toFixed(COORD_DECIMALS) : null,
      movedKm: jump != null ? +jump.toFixed(2) : null,
      address: r ? shortAddress(r) : null,
      osm: r ? `${r.osm_type}/${r.type}` : null, osmUrl,
    });
    process.stdout.write(conf === "HIGH" ? "." : conf === "MED" ? "?" : "x");
  }
}
process.stdout.write("\n");

writeFileSync(REVIEW_FILE, JSON.stringify(review, null, 2));
console.log(`\n${review.length} entries — HIGH ${counts.HIGH}  MED ${counts.MED}  LOW ${counts.LOW}`);
console.log(`Review proposals: ${REVIEW_FILE}\n`);

const needsEyes = review.filter(r => r.conf !== "HIGH");
if (needsEyes.length) {
  console.log("Needs an address (add `address:` from the company's Impressum, then re-run):");
  for (const r of needsEyes) console.log(`  [${r.conf}] ${r.name} (${r.city}) — ${r.reason}\n        ${r.website}`);
  console.log("");
}

if (!WRITE) {
  console.log("Dry run. Re-run with --write to apply the HIGH-confidence hits in place.");
  process.exit(0);
}

// ── Apply HIGH-confidence hits in place ──────────────────────────────────────
// Edit each source file as text: find the entry by its `name: "..."`, replace the
// `lat:/lng:` pair inside that object, and insert (or update) an `address:` line.
let applied = 0;
const byFile = new Map();
for (const r of review) if (r.conf === "HIGH") {
  if (!byFile.has(r.file)) byFile.set(r.file, []);
  byFile.get(r.file).push(r);
}
for (const [file, hits] of byFile) {
  const path = join(ROOT, file);
  let src = readFileSync(path, "utf8");
  for (const h of hits) {
    const esc = h.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // The object spans from its `name:` line to the first lone `}` (entries are flat).
    const objRe = new RegExp(`(name:\\s*"${esc}"[\\s\\S]*?)(\\n\\s*\\})`, "m");
    const m = src.match(objRe);
    if (!m) { console.error(`  ! could not locate ${h.name} in ${file}`); continue; }
    let obj = m[1];
    obj = obj.replace(/lat:\s*-?[\d.]+\s*,\s*lng:\s*-?[\d.]+\s*,/,
      `lat: ${h.newLat}, lng: ${h.newLng},`);
    if (h.address) {
      if (/address:\s*"[^"]*"/.test(obj)) {
        obj = obj.replace(/address:\s*"[^"]*"/, `address: ${JSON.stringify(h.address)}`);
      } else {
        // Insert an address line right after the lat/lng line, matching its indent.
        obj = obj.replace(/(lat:\s*-?[\d.]+,\s*lng:\s*-?[\d.]+,)(\n([ \t]*))/,
          (_, latlng, nl, indent) => `${latlng}${nl}address: ${JSON.stringify(h.address)},${nl}`);
      }
    }
    src = src.slice(0, m.index) + obj + m[2] + src.slice(m.index + m[0].length);
    applied++;
  }
  writeFileSync(path, src);
}
console.log(`✓ Applied ${applied} HIGH-confidence coordinate updates. Run: node scripts/validate.mjs`);
