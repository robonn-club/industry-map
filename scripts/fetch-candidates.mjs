#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Wikidata candidate generator (hybrid sourcing, see scripts/README.md)
//
// Pulls German-HQ'd companies per sector from Wikidata, fills the boring fields
// (founding year, website, coordinates, employee count → size), dedupes against
// data/companies/*.js + data/institutes.js + data/_candidates.js, and writes
// data/_candidates.generated.js
// for human review. The machine does the lookup grind; you keep the quality gate:
// verify HQ is really in Germany, fix the sector if mis-bucketed, and WRITE THE
// ONE-SENTENCE DESCRIPTION (Wikidata's is only a rough hint).
//
// No dependencies — uses Node 18+ global fetch. Run: node scripts/fetch-candidates.mjs
// Data: Wikidata (CC0). Be polite: it queries the public endpoint a few times.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENDPOINT = "https://query.wikidata.org/sparql";
const UA = "robonn-industry-map-databot/0.1 (https://github.com/robonn-club/industry-map; research)";
const PER_SECTOR_LIMIT = 250;

// Wikidata industry (P452) QID → our sector. Derived from the real industry
// distribution of German companies (scripts/README.md explains how to extend).
const INDUSTRY_SECTOR = {
  Q170978: "robotics",                                   // robotics
  Q11660: "ai_ml", Q2539: "ai_ml",                       // AI, machine learning
  Q392933: "defense", Q3477363: "defense",               // weapons industry, aerospace industry
  Q11451: "agriculture", Q1402889: "agriculture",        // agriculture
  Q16000047: "agriculture", Q12159342: "agriculture",    // agricultural machinery / engineering
  Q190117: "automotive", Q107597958: "automotive", Q3477381: "automotive",
  Q107597925: "industrial", Q101333: "industrial", Q187939: "industrial",
  Q1326885: "industrial", Q1957908: "industrial", Q1803786: "industrial", Q184199: "industrial",
  Q880371: "software", Q11661: "software", Q941594: "software",
};

// When a company is tagged with several industries, the first sector here wins.
// Robotics/AI lead because they are the map's focus (Robonn = robotics club).
const SECTOR_PRIORITY = ["robotics", "ai_ml", "defense", "agriculture", "automotive", "industrial", "software"];

// Wikidata's English Bundesland label → our state code.
const STATE_MAP = {
  "baden-württemberg": "bw", "bavaria": "bavaria", "free state of bavaria": "bavaria",
  "berlin": "berlin", "brandenburg": "brandenburg", "bremen": "bremen",
  "free hanseatic city of bremen": "bremen", "hamburg": "hamburg", "hesse": "hesse",
  "mecklenburg-vorpommern": "mv", "mecklenburg-western pomerania": "mv",
  "lower saxony": "lower_saxony", "north rhine-westphalia": "nrw",
  "rhineland-palatinate": "rhineland_palatinate", "saarland": "saarland",
  "saxony": "saxony", "free state of saxony": "saxony", "saxony-anhalt": "saxony_anhalt",
  "schleswig-holstein": "schleswig_holstein", "thuringia": "thuringia", "free state of thuringia": "thuringia",
};

const sizeFromEmployees = (n) =>
  n == null ? "" : n < 100 ? "startup" : n < 1000 ? "mid" : n < 5000 ? "big" : "global";

// Names already on the map or already staged — never re-emit these.
//
// The company dataset was split by size (data/companies/{global,big,mid,startup}.js)
// and data/companies.js no longer exists. This list must stay in step with the
// `sources` array in scripts/validate.mjs: read the wrong paths and the catch
// below swallows it silently, leaving every company already on the map looking
// brand new and re-emitted as a candidate.
const EXISTING_SOURCES = [
  ["data/companies/global.js", "COMPANIES_GLOBAL"],
  ["data/companies/big.js", "COMPANIES_BIG"],
  ["data/companies/mid.js", "COMPANIES_MID"],
  ["data/companies/startup.js", "COMPANIES_STARTUP"],
  ["data/institutes.js", "INSTITUTES"],
  ["data/_candidates.js", "CANDIDATES"],
  ["data/_candidates.generated.js", "CANDIDATES_GENERATED"],
];

function loadExistingNames() {
  const names = new Set();
  let loaded = 0;
  for (const [file, varName] of EXISTING_SOURCES) {
    try {
      const src = readFileSync(join(ROOT, file), "utf8");
      const arr = new Function(`${src};return typeof ${varName}!=="undefined"?${varName}:[];`)();
      for (const e of arr) if (e?.name) names.add(e.name.toLowerCase());
      if (arr.length) loaded++;
    } catch { /* _candidates files may legitimately not exist yet */ }
  }
  // The data files are not optional. If none of them loaded, the dedupe set is
  // empty and every existing entry would come back as a candidate — fail loudly
  // instead of generating hundreds of duplicates.
  if (!loaded) {
    console.error("✗ could not load any existing dataset file — refusing to run without a dedupe set.");
    console.error("  Check the paths in EXISTING_SOURCES against scripts/validate.mjs.");
    process.exit(2);
  }
  return names;
}

function buildQuery(sectorQids) {
  const values = sectorQids.map((q) => `wd:${q}`).join(" ");
  // Kept deliberately light: no recursive P131* here (it 502s the public
  // endpoint). The HQ entity is captured so state can be resolved in a cheap,
  // ID-anchored second pass — see resolveStates().
  return `
SELECT ?company ?companyLabel ?hq ?coord ?inception ?employees ?website ?cityLabel WHERE {
  VALUES ?industry { ${values} }
  ?company wdt:P452 ?industry .
  ?company wdt:P17 wd:Q183 .
  OPTIONAL { ?company wdt:P159 ?hq. }
  OPTIONAL { ?company wdt:P625 ?coordC. }
  OPTIONAL { ?hq wdt:P625 ?coordH. }
  BIND(COALESCE(?coordC, ?coordH) AS ?coord)
  OPTIONAL { ?company wdt:P571 ?inception. }
  OPTIONAL { ?company wdt:P1128 ?employees. }
  OPTIONAL { ?company wdt:P856 ?website. }
  OPTIONAL { ?hq rdfs:label ?cityLabel. FILTER(LANG(?cityLabel)="en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,de". }
}
LIMIT ${PER_SECTOR_LIMIT}`;
}

async function runQuery(query, attempts = 3) {
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/sparql-results+json" },
        signal: AbortSignal.timeout(45000), // a stalled socket must fail, not hang
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text()).slice(0, 80)}`);
      return (await res.json()).results.bindings;
    } catch (e) {
      if (i >= attempts) throw e;
      await new Promise((r) => setTimeout(r, 1500 * i)); // linear backoff
    }
  }
}

// Cheap, ID-anchored state lookup: resolve each entity's Bundesland by walking
// P131* up to a "state of Germany" (Q1221156). Anchored VALUES keeps it fast.
async function resolveStates(entityQids) {
  const out = new Map(); // qid → english state label
  const ids = [...entityQids];
  for (let i = 0; i < ids.length; i += 60) {
    const values = ids.slice(i, i + 60).map((q) => `wd:${q}`).join(" ");
    const query = `
SELECT ?x ?stateLabel WHERE {
  VALUES ?x { ${values} }
  ?x wdt:P131* ?st. ?st wdt:P31 wd:Q1221156.
  ?st rdfs:label ?stateLabel. FILTER(LANG(?stateLabel)="en")
}`;
    try {
      for (const row of await runQuery(query)) {
        out.set(v(row, "x").split("/").pop(), v(row, "stateLabel"));
      }
    } catch (e) {
      process.stderr.write(`  state batch failed (${e.message}) — those stay blank\n`);
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  return out;
}

const v = (row, k) => (row[k] ? row[k].value : undefined);

function parsePoint(wkt) {
  const m = wkt && wkt.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/);
  return m ? { lng: +(+m[1]).toFixed(4), lat: +(+m[2]).toFixed(4) } : null;
}

async function main() {
  const existing = loadExistingNames();
  const bySector = {};
  for (const s of SECTOR_PRIORITY) bySector[s] = [];

  // Group industry QIDs by sector and query one sector at a time (keeps each
  // request small and avoids the public endpoint's timeout/502 on big joins).
  const sectorToQids = {};
  for (const [qid, sector] of Object.entries(INDUSTRY_SECTOR)) (sectorToQids[sector] ??= []).push(qid);

  const merged = new Map(); // company QID → accumulated record
  for (const [sector, qids] of Object.entries(sectorToQids)) {
    process.stderr.write(`Querying ${sector} (${qids.length} industries)… `);
    let rows;
    try {
      rows = await runQuery(buildQuery(qids));
    } catch (e) {
      process.stderr.write(`FAILED: ${e.message}\n`);
      continue;
    }
    process.stderr.write(`${rows.length} rows\n`);
    for (const row of rows) {
      const qid = v(row, "company").split("/").pop();
      const rec = merged.get(qid) ?? { qid, hqQid: "", sectors: new Set(), coord: null, city: "", state: "", year: "", employees: null, website: "", desc: "", name: "" };
      rec.name ||= v(row, "companyLabel") || "";
      rec.hqQid ||= (v(row, "hq") || "").split("/").pop();
      rec.sectors.add(sector);
      rec.coord ||= parsePoint(v(row, "coord"));
      rec.city ||= v(row, "cityLabel") || "";
      rec.year ||= (v(row, "inception") || "").slice(0, 4);
      rec.website ||= v(row, "website") || "";
      rec.desc ||= v(row, "desc") || "";
      const emp = v(row, "employees");
      if (emp != null && rec.employees == null) rec.employees = Math.round(+emp);
      merged.set(qid, rec);
    }
    await new Promise((r) => setTimeout(r, 1200)); // be polite
  }

  // Second pass: resolve Bundesland for every entity (HQ entity if known, else
  // the company itself), then map Wikidata's label → our state code.
  const stateAnchors = new Set();
  for (const rec of merged.values()) stateAnchors.add(rec.hqQid || rec.qid);
  process.stderr.write(`Resolving states for ${stateAnchors.size} entities…\n`);
  const stateLabels = await resolveStates(stateAnchors);
  for (const rec of merged.values()) {
    const label = (stateLabels.get(rec.hqQid) || stateLabels.get(rec.qid) || "").toLowerCase();
    if (STATE_MAP[label]) rec.state = STATE_MAP[label];
  }

  // Resolve each company to a single sector and shape into a candidate entry.
  let kept = 0, skipped = 0;
  for (const rec of merged.values()) {
    if (!rec.name || rec.name.startsWith("Q") || existing.has(rec.name.toLowerCase())) { skipped++; continue; }
    existing.add(rec.name.toLowerCase()); // dedupe within this run too
    const sector = SECTOR_PRIORITY.find((s) => rec.sectors.has(s));
    const flags = [];
    if (!rec.coord) flags.push("no-coord");
    if (!rec.state) flags.push("no-state");
    if (!rec.employees) flags.push("no-size");
    if (!rec.desc) flags.push("no-description");
    bySector[sector].push({
      name: rec.name,
      city: rec.city.replace(/\s*\(.*?\)\s*/g, "").trim(),
      state: rec.state,
      lat: rec.coord?.lat ?? "",
      lng: rec.coord?.lng ?? "",
      sector,
      size: sizeFromEmployees(rec.employees),
      founded: rec.year ? +rec.year : "",
      description: rec.desc, // DRAFT — rewrite to one factual sentence
      website: rec.website,
      _qid: rec.qid,
      _flags: flags,
    });
    kept++;
  }

  writeOutput(bySector);
  process.stderr.write(`\nDone: ${kept} candidates written, ${skipped} skipped (dupes/unnamed).\n`);
}

function esc(s) { return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

function writeOutput(bySector) {
  const lines = [
    "// ─────────────────────────────────────────────────────────────────────────────",
    "// MACHINE-GENERATED candidate entries from Wikidata — NOT loaded by index.html.",
    "// Regenerate with: node scripts/fetch-candidates.mjs",
    "//",
    "// REVIEW EACH before merging into the right data/companies/<size>.js:",
    "//  • confirm the company is really headquartered in Germany,",
    "//  • fix the sector if mis-bucketed (the trailing comment shows Wikidata's QID),",
    "//  • REWRITE the description into one factual sentence (drafts are rough),",
    "//  • fill any blank field flagged in the trailing comment.",
    "//",
    `// Generated ${new Date().toISOString().slice(0, 10)}. Source: Wikidata (CC0).`,
    "// ─────────────────────────────────────────────────────────────────────────────",
    "",
    "const GENERATED_CANDIDATES = [",
  ];
  for (const sector of SECTOR_PRIORITY) {
    const items = bySector[sector];
    if (!items.length) continue;
    lines.push("", `  // ── ${sector.toUpperCase()} (${items.length}) ──`);
    for (const e of items) {
      const flagNote = e._flags.length ? ` flags: ${e._flags.join(", ")}` : "";
      lines.push(
        "  {",
        `    name: "${esc(e.name)}", city: "${esc(e.city)}", state: "${esc(e.state)}",`,
        `    lat: ${e.lat}, lng: ${e.lng},`,
        `    sector: "${e.sector}", size: "${e.size}", founded: ${e.founded || '""'},`,
        `    description: "${esc(e.description)}",`,
        `    website: "${esc(e.website)}"`,
        `  }, // ⚑ ${e._qid}${flagNote}`,
      );
    }
  }
  lines.push("", "];", "");
  writeFileSync(join(ROOT, "data", "_candidates.generated.js"), lines.join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); });
