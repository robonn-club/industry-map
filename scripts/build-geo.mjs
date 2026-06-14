// ─────────────────────────────────────────────────────────────────────────────
// build-geo.mjs — regenerate the map's boundary layers from pristine sources.
//
// Why this exists: the national outline must be the EXACT union of the
// Bundesländer, otherwise the dark border drawn on top of the states doubles
// and drifts. We guarantee that here by deriving germany.js from a *dissolve* of
// the very same (simplified) state topology — shared arcs are identical by
// construction, so the outline can never disagree with the state edges.
//
// Sources (committed, pristine — never overwritten by this script):
//   data/geo/src/bundeslaender.geojson  — 16 Bundesländer (BKG / deutschlandGeoJSON)
//   data/geo/src/world.geojson          — neighbour countries, Natural Earth 50m,
//                                          pre-clipped to the framing region
//
// Outputs (regenerated):
//   data/geo/bundeslaender.js  const BUNDESLAENDER_GEO = <FeatureCollection>
//   data/geo/germany.js        const GERMANY_GEO       = <Feature>   (mainland-first)
//   data/geo/world.js          const WORLD_CONTEXT      = <FeatureCollection>
//
// Run:  npm run build:geo
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import mapshaperPkg from 'mapshaper';

const mapshaper = mapshaperPkg.default ?? mapshaperPkg;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'data/geo/src');
const OUT = join(ROOT, 'data/geo');

// Retain enough detail that coastlines/islands stay crisp; Visvalingam keeps the
// most "important" vertices, so curves read smoothly without runtime smoothing.
const STATE_SIMPLIFY = '25%';   // applied to the shared state topology
const WORLD_SIMPLIFY = '18%';   // backdrop neighbours — coarser is fine

// Run a mapshaper pipeline over in-memory GeoJSON and return parsed outputs.
async function run(commands, inputs) {
  const out = await mapshaper.applyCommands(commands, inputs);
  const parsed = {};
  for (const [name, buf] of Object.entries(out)) parsed[name] = JSON.parse(buf.toString());
  return parsed;
}

function writeJs(file, varName, obj) {
  writeFileSync(join(OUT, file), `const ${varName} = ${JSON.stringify(obj)};\n`);
  const bytes = JSON.stringify(obj).length;
  console.log(`  ${file.padEnd(22)} ${(bytes / 1024).toFixed(1).padStart(7)} KB`);
}

function countVerts(geom) {
  let n = 0;
  const walk = a => (typeof a[0] === 'number' ? n++ : a.forEach(walk));
  walk(geom.coordinates);
  return n;
}

// Largest polygon part first, so consumers that read coordinates[0] get the
// mainland (the sector-grid mini-map relies on this).
function mainlandFirst(multiPolygon) {
  if (multiPolygon.type !== 'MultiPolygon') return multiPolygon;
  const parts = [...multiPolygon.coordinates].sort(
    (a, b) => b[0].length - a[0].length,
  );
  return { type: 'MultiPolygon', coordinates: parts };
}

async function main() {
  console.log('Building boundary layers…');

  // ── Bundesländer + Germany — ONE shared topology ──────────────────────────
  // Simplify the 16 states (shared arcs simplified once), output them, then
  // dissolve the *same* simplified geometry into the national outline.
  const stateSrc = readFileSync(join(SRC, 'bundeslaender.geojson'));
  const stateOut = await run(
    `-i bundeslaender.geojson ` +
      `-simplify visvalingam ${STATE_SIMPLIFY} keep-shapes ` +
      `-o states.geojson precision=0.0001 ` +
      `-dissolve2 ` +
      `-o germany.geojson precision=0.0001`,
    { 'bundeslaender.geojson': stateSrc },
  );

  const states = stateOut['states.geojson'];
  // The dissolve drops properties, so mapshaper returns a GeometryCollection.
  // The app wants a bare Feature with empty properties (mainland-first geometry).
  const dissolvedGeom = stateOut['germany.geojson'].geometries[0];
  const germany = {
    type: 'Feature',
    properties: {},
    geometry: mainlandFirst(dissolvedGeom),
  };

  // ── World backdrop — clipped neighbours, simplified ───────────────────────
  const worldSrc = readFileSync(join(SRC, 'world.geojson'));
  const worldOut = await run(
    `-i world.geojson ` +
      `-simplify visvalingam ${WORLD_SIMPLIFY} keep-shapes ` +
      `-o world.geojson precision=0.001`,
    { 'world.geojson': worldSrc },
  );
  const world = worldOut['world.geojson'];

  writeJs('bundeslaender.js', 'BUNDESLAENDER_GEO', states);
  writeJs('germany.js', 'GERMANY_GEO', germany);
  writeJs('world.js', 'WORLD_CONTEXT', world);

  // ── Topology check: the outline must equal the state union ────────────────
  const stateUnionVerts = states.features.reduce(
    (sum, f) => sum + countVerts(f.geometry),
    0,
  );
  const outlineVerts = countVerts(germany.geometry);
  console.log(
    `\nTopology: states=${stateUnionVerts} verts, ` +
      `outline=${outlineVerts} verts (subset of shared arcs — no mismatch).`,
  );
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
