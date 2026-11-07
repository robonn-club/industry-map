// The pixel view (pixel.html): the same entries as the map, drawn as buildings on a
// model of Germany. Buildings come from js/pixel-sprites.js; the palette, escaping and
// the new-startup rule from js/common.js.
//
// Everything in the world is drawn into one low-resolution buffer, then scaled up by a
// whole number, so all pixels share a grid at every zoom. Labels are the exception: they
// are drawn at screen scale, so they stay readable when the world is small.

// ── Entries ───────────────────────────────────────────────────────────────────

const ENTITIES = [
  ...COMPANIES,
  ...INSTITUTES.map(e => Object.assign(e, { isInstitute: true })),
];
ENTITIES.forEach(c => { c.isNew = isNewStartup(c); });

// The map's four size bands (SIZE_CONFIG in js/app.js).
const SIZES = [
  { key: 'startup', label: 'Startup', range: '<100' },
  { key: 'mid',     label: 'Mid',     range: '100–1000' },
  { key: 'big',     label: 'Large',   range: '1000–5000' },
  { key: 'global',  label: 'Global',  range: '5000+' },
];
const SIZE_RANK = Object.fromEntries(SIZES.map((s, i) => [s.key, i]));
const SIZE_RANGE = Object.fromEntries(SIZES.map(s => [s.key, s.range]));

// ── Projection ────────────────────────────────────────────────────────────────

// About 1.1 km per world pixel. A lot is a fixed number of pixels, so this sets how far
// a dense city has to spread: fewer pixels per degree would push Munich into the Alps.
const PX_PER_DEG_LAT = 100;
const PX_PER_DEG_LNG = PX_PER_DEG_LAT * Math.cos(51.2 * Math.PI / 180);
const KM_PER_PX = 111.2 / PX_PER_DEG_LAT;
const MARGIN = { left: 26, right: 26, top: 40, bottom: 30 };   // room for tall sprites and the board's edge

function outerRings(geo) {
  const g = geo.geometry;
  return g.type === 'Polygon' ? g.coordinates : g.coordinates.flat();
}

const GERMANY_RINGS = outerRings(GERMANY_GEO);
const LNG_MIN = Math.min(...GERMANY_RINGS.flat().map(p => p[0]));
const LNG_MAX = Math.max(...GERMANY_RINGS.flat().map(p => p[0]));
const LAT_MIN = Math.min(...GERMANY_RINGS.flat().map(p => p[1]));
const LAT_MAX = Math.max(...GERMANY_RINGS.flat().map(p => p[1]));

const projectX = lng => (lng - LNG_MIN) * PX_PER_DEG_LNG + MARGIN.left;
const projectY = lat => (LAT_MAX - lat) * PX_PER_DEG_LAT + MARGIN.top;
const WORLD_W = Math.ceil(projectX(LNG_MAX)) + MARGIN.right;
const WORLD_H = Math.ceil(projectY(LAT_MIN)) + MARGIN.bottom;
const LAND = { x0: projectX(LNG_MIN), x1: projectX(LNG_MAX), y0: projectY(LAT_MAX), y1: projectY(LAT_MIN) };

const worldKey = (x, y) => y * WORLD_W + x;
const inWorld = (x, y) => x >= 0 && y >= 0 && x < WORLD_W && y < WORLD_H;

// ── Land mask ─────────────────────────────────────────────────────────────────

const landMask = (() => {
  const cv = document.createElement('canvas');
  cv.width = WORLD_W; cv.height = WORLD_H;
  const g = cv.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#fff';
  g.beginPath();
  for (const ring of GERMANY_RINGS) {
    ring.forEach(([lng, lat], i) => {
      if (i) g.lineTo(projectX(lng), projectY(lat)); else g.moveTo(projectX(lng), projectY(lat));
    });
    g.closePath();
  }
  g.fill();
  const alpha = g.getImageData(0, 0, WORLD_W, WORLD_H).data;
  const mask = new Uint8Array(WORLD_W * WORLD_H);
  for (let i = 0; i < mask.length; i++) mask[i] = alpha[i * 4 + 3] > 127 ? 1 : 0;
  return mask;
})();
const isLand = (x, y) => inWorld(x, y) && landMask[worldKey(x, y)] === 1;

// ── The lot grid ──────────────────────────────────────────────────────────────

// One global isometric grid, one lot per entry. A cell is 8 voxels along each edge, so
// on screen it is a 16×8 diamond. The grid is what removes the pile-up: Munich's entries
// cannot share a pixel, so they spread out into a district.
const CELL = 8;
const cellOf = (wx, wy) => [Math.floor((wy + wx / 2) / CELL), Math.floor((wy - wx / 2) / CELL)];
const cellKey = (i, j) => (i + 500) * 2000 + (j + 500);
const cellBack = (i, j) => [(i - j) * CELL, (i + j) * CELL / 2];

const lotOwner = new Map();   // cellKey → building

function cellOnLand(i, j) {
  const [x, y] = cellBack(i, j);
  return isLand(x, y + 1) && isLand(x, y + CELL - 1) && isLand(x - CELL + 1, y + CELL / 2) && isLand(x + CELL - 1, y + CELL / 2) && isLand(x, y + CELL / 2);
}

// Nothing is built in the Alps: no entry is there, and a dense Munich would otherwise
// spill over the one landscape everyone recognises.
const ALPS = { lat: 47.76, lngA: 10.05, lngB: 13.1 };
function cellInAlps(i, j) {
  const [x, y] = cellBack(i, j);
  return y + CELL / 2 > projectY(ALPS.lat) && x > projectX(ALPS.lngA) && x < projectX(ALPS.lngB);
}

function lotFits(i, j, n) {
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    if (lotOwner.has(cellKey(i + a, j + b)) || !cellOnLand(i + a, j + b) || cellInAlps(i + a, j + b)) return false;
  }
  return true;
}

const BUILDINGS = ENTITIES.map(c => ({
  c,
  look: { sector: c.sector, size: c.size, isLab: !!c.isInstitute, variant: hashStr(c.name) % 3, isNew: !!c.isNew },
  wx: projectX(c.lng), wy: projectY(c.lat),      // true position, in world pixels
  phase: hashStr(c.name) % 97,
  i: 0, j: 0, ax: 0, ay: 0, cells: 1, depth: 0, movedKm: 0,
}));

// Tallest first, each taking the free lot nearest its address, on two conditions: a
// building may not end up more than half hidden, and it may not push one already placed
// past that point. A building nobody can see cannot be hovered or clicked, so this is a
// rule, not a preference. It pushes low buildings to the front of a district.
const MIN_VISIBLE = 0.5;
const HIDDEN_PENALTY = 14;   // world pixels of distance worth accepting to stay fully visible

// Filling towards the viewer makes a dense city's district grow south of its true centre,
// so each building aims north by a share of the radius its district is expected to reach.
const NORTH_AIM = 0.2;
function northAim(b) {
  const cells = BUILDINGS.reduce((n, o) => {
    if (Math.hypot(o.wx - b.wx, o.wy - b.wy) > 40) return n;
    return n + sprite(o.look).cells ** 2;
  }, 0);
  return NORTH_AIM * Math.sqrt(cells * CELL * CELL / Math.PI);
}

function placeBuildings() {
  const offsets = [];
  for (let di = -28; di <= 28; di++) for (let dj = -28; dj <= 28; dj++) {
    offsets.push({ di, dj, d: Math.hypot((di - dj) * CELL, (di + dj) * CELL / 2) });
  }
  offsets.sort((a, b) => a.d - b.d);

  const owner = new Int16Array(WORLD_W * WORLD_H).fill(-1);   // front-most building per pixel
  const visible = new Int32Array(BUILDINGS.length);
  const order = BUILDINGS.map((_, n) => n)
    .sort((a, b) => SIZE_RANK[BUILDINGS[b].c.size] - SIZE_RANK[BUILDINGS[a].c.size] || BUILDINGS[a].c.name.localeCompare(BUILDINGS[b].c.name));

  const eachPixel = (s, ax, ay, fn) => {
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
      if (s.px[y * s.w + x] === -1) continue;
      const wx = ax - s.ox + x, wy = ay - s.oy + y;
      if (inWorld(wx, wy)) fn(worldKey(wx, wy));
    }
  };

  for (const index of order) {
    const b = BUILDINGS[index], s = sprite(b.look), n = s.cells;
    const aimX = b.wx, aimY = b.wy - northAim(b);
    const i0 = Math.round((aimY + aimX / 2) / CELL - n / 2);
    const j0 = Math.round((aimY - aimX / 2) / CELL - n / 2);
    let best = null, bestCost = Infinity;

    for (const { di, dj, d } of offsets) {
      if (d - CELL * 2 >= bestCost) break;
      const i = i0 + di, j = j0 + dj;
      if (!lotFits(i, j, n)) continue;
      const dist = Math.hypot((i - j) * CELL - aimX, (i + j + n) * CELL / 2 - aimY);
      if (dist >= bestCost) continue;

      const depth = i + j + n;
      const [ax, ay] = cellBack(i, j);
      let hidden = 0;
      const covered = new Map();
      eachPixel(s, ax, ay, k => {
        const o = owner[k];
        if (o < 0) return;
        if (BUILDINGS[o].depth > depth) hidden++;
        else covered.set(o, (covered.get(o) ?? 0) + 1);
      });
      if (hidden / s.pixels > 1 - MIN_VISIBLE) continue;
      const harmsAnother = [...covered].some(([o, px]) => (visible[o] - px) / sprite(BUILDINGS[o].look).pixels < MIN_VISIBLE);
      if (harmsAnother) continue;

      const cost = dist + HIDDEN_PENALTY * hidden / s.pixels;
      if (cost < bestCost) { bestCost = cost; best = { i, j }; }
    }

    const { i, j } = best ?? { i: i0, j: j0 };
    const [ax, ay] = cellBack(i, j);
    const depth = i + j + n;
    Object.assign(b, { i, j, ax, ay, cells: n, depth });
    b.movedKm = Math.hypot((i - j) * CELL - b.wx, depth * CELL / 2 - b.wy) * KM_PER_PX;
    for (let a = 0; a < n; a++) for (let c = 0; c < n; c++) lotOwner.set(cellKey(i + a, j + c), b);
    eachPixel(s, ax, ay, k => {
      const o = owner[k];
      if (o >= 0 && BUILDINGS[o].depth > depth) return;
      if (o >= 0) visible[o]--;
      owner[k] = index;
      visible[index]++;
    });
  }
}
placeBuildings();

const DRAW_ORDER = [...BUILDINGS].sort((a, b) => a.depth - b.depth || a.ax - b.ax);

const MOVED = BUILDINGS.map(b => b.movedKm).sort((a, b) => a - b);
const MOVED_MEDIAN = MOVED[MOVED.length >> 1];
const MOVED_MAX = MOVED[MOVED.length - 1];

// ── Ground ────────────────────────────────────────────────────────────────────

const GRASS = [0x4C7656, 0x56805A, 0x618B5F, 0x6F9664];
const WATER = 0x67B2CF, WATER_DEEP = 0x4F98B8;
const SAND = 0xD9C998;
const STATE_LINE = 0x3B5F48;
const SOIL = [0x31503C, 0x6E5A42, 0x6E5A42, 0x5C4B37, 0x5C4B37, 0x4B3D2C, 0x4B3D2C, 0x3D3225];
const BOARD_SHADOW = 0x131D23;
const TREE_TONES = { l: 0x4F8A5A, m: 0x3C6F4B, d: 0x2C563E };
const ROCK = { lit: 0x96A09C, shade: 0x6D7774, snow: 0xF5F8F6, base: 0x55615C };

const ROAD = 0x47545B, PAVING = 0xCDD0C2, LAWN = 0x86AE6C, PATH = 0xE4DFCB;
const CROP_A = 0xBFAE54, CROP_B = 0x8F9340, GOLD_EDGE = 0xF0BC4A;
const SHADOW_TINT = 0x12202A;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function latticeNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const at = (a, b) => hash(a, b, 7) / 4294967296;
  const top = at(xi, yi) * (1 - sx) + at(xi + 1, yi) * sx;
  const bot = at(xi, yi + 1) * (1 - sx) + at(xi + 1, yi + 1) * sx;
  return top * (1 - sy) + bot * sy;
}
const terrainNoise = (x, y) => latticeNoise(x / 46, y / 46) * 0.62 + latticeNoise(x / 15, y / 15) * 0.28 + latticeNoise(x / 6, y / 6) * 0.1;

// Rivers and forests are hand-placed landmarks for orientation, not data. Points are
// rough [lat, lng] and pass through the towns a German reader would expect.
const RIVERS = [
  { w: 2, pts: [[47.58, 7.59], [48.1, 7.57], [48.58, 7.8], [49.01, 8.31], [49.49, 8.45], [49.63, 8.38], [50.0, 8.28], [49.97, 7.9], [50.36, 7.6], [50.73, 7.11], [50.94, 6.97], [51.23, 6.77], [51.43, 6.73], [51.66, 6.61], [51.84, 6.1]] },   // Rhine
  { w: 2, pts: [[50.87, 14.24], [51.05, 13.74], [51.16, 13.47], [51.56, 13.01], [51.86, 12.65], [51.87, 12.25], [52.13, 11.65], [52.54, 11.97], [52.99, 11.75], [53.37, 10.56], [53.54, 9.99], [53.79, 9.42], [53.89, 9.14], [53.87, 8.75]] },   // Elbe
  { w: 2, pts: [[47.95, 8.5], [48.09, 9.22], [48.4, 9.99], [48.72, 10.78], [48.76, 11.42], [48.92, 11.87], [49.02, 12.1], [48.88, 12.57], [48.83, 12.96], [48.57, 13.46], [48.56, 13.83]] },   // Danube
  { w: 1, pts: [[49.89, 10.89], [50.04, 10.23], [49.79, 9.93], [49.76, 9.52], [49.97, 9.15], [50.11, 8.68], [50.0, 8.28]] },   // Main
  { w: 1, pts: [[51.42, 9.65], [51.77, 9.38], [52.1, 9.36], [52.29, 8.92], [52.64, 9.22], [53.08, 8.8], [53.54, 8.57], [53.63, 8.52]] },   // Weser
  { w: 1, pts: [[48.78, 9.18], [49.03, 9.2], [49.41, 8.7], [49.49, 8.45]] },   // Neckar
  { w: 1, pts: [[48.14, 11.58], [48.54, 12.15], [48.72, 12.75], [48.8, 12.92]] },   // Isar
  { w: 1, pts: [[52.52, 13.4], [52.4, 13.05], [52.42, 12.55], [52.75, 12.2], [52.87, 11.95]] },   // Spree and Havel
];
const LAKES = [[47.62, 9.35, 0.13, 0.38], [53.43, 12.68, 0.1, 0.1], [47.88, 12.45, 0.06, 0.08], [47.92, 11.3, 0.08, 0.05]];
const FORESTS = [
  [48.2, 8.2, 0.55, 0.24], [48.4, 9.45, 0.2, 0.55], [49.0, 13.0, 0.36, 0.5], [50.0, 11.8, 0.28, 0.35],
  [50.7, 10.7, 0.2, 0.42], [50.6, 12.9, 0.16, 0.65], [51.75, 10.6, 0.14, 0.3], [51.15, 8.2, 0.3, 0.5],
  [50.35, 6.75, 0.3, 0.32], [49.85, 7.2, 0.18, 0.5], [49.35, 7.8, 0.24, 0.22], [49.65, 9.2, 0.26, 0.28],
  [50.55, 9.75, 0.22, 0.28], [52.85, 10.3, 0.26, 0.45], [52.15, 14.0, 0.26, 0.55], [53.25, 13.1, 0.24, 0.6],
];

const put = (buf, x, y, c) => { if (inWorld(x, y)) buf[worldKey(x, y)] = c; };
const putLand = (buf, x, y, c) => { if (isLand(x, y)) buf[worldKey(x, y)] = c; };

function stampTree(buf, x, y) {
  const rows = ['.l.', 'lmd', 'lmd', '.d.'];
  rows.forEach((row, ry) => [...row].forEach((ch, rx) => {
    if (ch !== '.') putLand(buf, x + rx - 1, y + ry - 3, TREE_TONES[ch]);
  }));
}

function stampPeak(buf, x, base, h) {
  for (let r = 0; r <= h; r++) {
    const half = Math.round(r * 0.9);
    for (let dx = -half; dx <= half; dx++) {
      const snowLine = h * 0.32 + (hash(x + dx, h) % 3) - 1;
      let c = dx <= 0 ? ROCK.lit : ROCK.shade;
      if (r < snowLine) c = dx <= 0 ? ROCK.snow : 0xCFD9D8;
      else if (r === h) c = ROCK.base;
      putLand(buf, x + dx, base - h + r, c);
    }
  }
}

function paintRivers(buf) {
  for (const { w, pts } of RIVERS) {
    const xy = pts.map(([lat, lng]) => [projectX(lng), projectY(lat)]);
    for (let s = 0; s < xy.length - 1; s++) {
      const p0 = xy[Math.max(0, s - 1)], p1 = xy[s], p2 = xy[s + 1], p3 = xy[Math.min(xy.length - 1, s + 2)];
      const steps = Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * 1.5);
      for (let t = 0; t <= steps; t++) {
        const f = t / steps, f2 = f * f, f3 = f2 * f;
        const cr = k => 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * f + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * f2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * f3);
        const x = Math.round(cr(0)), y = Math.round(cr(1));
        putLand(buf, x, y, WATER);
        if (w > 1) putLand(buf, x + 1, y, WATER_DEEP);
      }
    }
  }
  for (const [lat, lng, rLat, rLng] of LAKES) {
    const cx = projectX(lng), cy = projectY(lat), rx = rLng * PX_PER_DEG_LNG, ry = rLat * PX_PER_DEG_LAT;
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) putLand(buf, x, y, WATER);
    }
  }
}

// Dotted, because a state line is not a road, and only inland: the coast and national
// border already have the board's edge.
function paintStateLines(buf) {
  for (const feature of BUNDESLAENDER_GEO.features) {
    for (const ring of outerRings(feature)) {
      let step = 0;
      for (let s = 0; s < ring.length - 1; s++) {
        const x0 = projectX(ring[s][0]), y0 = projectY(ring[s][1]);
        const x1 = projectX(ring[s + 1][0]), y1 = projectY(ring[s + 1][1]);
        const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)));
        for (let t = 0; t < n; t++) {
          const x = Math.round(x0 + (x1 - x0) * t / n), y = Math.round(y0 + (y1 - y0) * t / n);
          step++;
          if (step % 3 === 2) continue;
          if (isLand(x - 2, y) && isLand(x + 2, y) && isLand(x, y - 2) && isLand(x, y + 2)) buf[worldKey(x, y)] = STATE_LINE;
        }
      }
    }
  }
}

function bakeTerrain() {
  const buf = new Int32Array(WORLD_W * WORLD_H).fill(-1);
  const depth = SOIL.length;

  // The board: an offset shadow, then its soil edge, then the grass on top.
  for (let y = 0; y < WORLD_H; y++) for (let x = 0; x < WORLD_W; x++) {
    if (isLand(x, y)) continue;
    let edge = -1;
    for (let k = 1; k <= depth; k++) if (isLand(x, y - k)) { edge = k - 1; break; }
    if (edge >= 0) {
      const c = SOIL[edge];
      buf[worldKey(x, y)] = hash(x, y) % 7 === 0 ? sink(c, 0.16) : c;
    } else if (isLand(x - 6, y - depth - 3)) {
      buf[worldKey(x, y)] = BOARD_SHADOW;
    }
  }
  for (let y = 0; y < WORLD_H; y++) for (let x = 0; x < WORLD_W; x++) {
    if (!isLand(x, y)) continue;
    const dither = BAYER[(y & 3) * 4 + (x & 3)] / 16 - 0.5;
    const v = (terrainNoise(x, y) - 0.5) * 3.2 + 1.5 + dither * 0.7;
    buf[worldKey(x, y)] = GRASS[Math.max(0, Math.min(GRASS.length - 1, Math.round(v)))];
  }

  // Sand along the two seas. The land borders in the north are left out.
  const seaLat = projectY(53.42);
  for (let y = 0; y < seaLat; y++) for (let x = 0; x < WORLD_W; x++) {
    if (!isLand(x, y)) continue;
    const lng = LNG_MIN + (x - MARGIN.left) / PX_PER_DEG_LNG;
    const lat = LAT_MAX - (y - MARGIN.top) / PX_PER_DEG_LAT;
    if ((lat > 54.72 && lng > 8.5 && lng < 9.75) || lng > 14.1) continue;
    if (!isLand(x - 2, y) || !isLand(x + 2, y) || !isLand(x, y - 2) || !isLand(x, y + 2)) buf[worldKey(x, y)] = SAND;
  }

  paintRivers(buf);
  paintStateLines(buf);

  // Forests and the Alps go on last and back to front, so nearer trees overlap farther ones.
  const props = [];
  for (const [lat, lng, rLat, rLng] of FORESTS) {
    const cx = projectX(lng), cy = projectY(lat), rx = rLng * PX_PER_DEG_LNG, ry = rLat * PX_PER_DEG_LAT;
    for (let y = Math.floor(cy - ry); y <= cy + ry; y += 3) for (let x = Math.floor(cx - rx); x <= cx + rx; x += 3) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (d > 1) continue;
      const roll = hash(x, y, 3) % 100;
      if (roll > (1 - d) * 86 + 6) continue;
      const jx = x + (hash(x, y, 5) % 3) - 1, jy = y + (hash(x, y, 6) % 3) - 1;
      if (isLand(jx, jy)) props.push({ y: jy, draw: () => stampTree(buf, jx, jy) });
    }
  }
  const alpsLat = projectY(ALPS.lat), lngA = projectX(ALPS.lngA), lngB = projectX(ALPS.lngB);
  for (let y = Math.floor(alpsLat); y < WORLD_H; y += 3) for (let x = Math.floor(lngA); x <= lngB; x += 5) {
    const jx = x + (hash(x, y, 8) % 4);
    if (!isLand(jx, y)) continue;
    const h = 6 + (hash(x, y, 9) % 8);
    props.push({ y, draw: () => stampPeak(buf, jx, y, h) });
  }
  props.sort((a, b) => a.y - b.y).forEach(p => p.draw());
  return buf;
}

function lotColor(b, u, v, d, edge, x, y) {
  if (d < 1) return ROAD;
  if (b.look.isNew && d < 2) return GOLD_EDGE;
  if (b.look.isLab) return Math.abs(u - v) < 1 && u > edge / 2 ? PATH : LAWN;
  if (b.look.sector === 'agriculture') return Math.floor(v / 2) % 2 ? CROP_A : CROP_B;
  const paved = mix(PAVING, sectorRamp(b.look.sector).l, 0.16);
  return hash(x, y, 2) % 9 === 0 ? sink(paved, 0.07) : paved;
}

function bakeCity(terrain) {
  const buf = terrain.slice();

  for (const b of BUILDINGS) {
    const edge = b.cells * CELL;
    for (let y = b.ay; y < b.ay + edge; y++) for (let x = b.ax - edge; x < b.ax + edge; x++) {
      const X = x + 0.5 - b.ax, Y = y + 0.5 - b.ay;
      const u = Y + X / 2, v = Y - X / 2;
      if (u < 0 || v < 0 || u >= edge || v >= edge) continue;
      put(buf, x, y, lotColor(b, u, v, Math.min(u, v, edge - u, edge - v), edge, x, y));
    }
  }

  // Shadows fall to the right, across the road and onto the next lot, which gives a
  // district depth before any building is drawn on top.
  for (const b of BUILDINGS) {
    const fp = sprite(b.look).footprint;
    const reach = Math.min(Math.round(fp.h * 0.7), 16);
    for (let y = b.ay + Math.floor((fp.u0 + fp.v0) / 2); y < b.ay + Math.ceil((fp.u1 + fp.v1) / 2); y++) {
      const Y = y + 0.5 - b.ay;
      const xb = Math.min(2 * (fp.u1 - Y), 2 * (Y - fp.v0));
      const xa = Math.max(2 * (fp.u0 - Y), 2 * (Y - fp.v1));
      if (xb < xa) continue;
      for (let x = Math.ceil(b.ax + xa); x <= b.ax + xb + reach; x++) {
        if (isLand(x, y)) buf[worldKey(x, y)] = mix(buf[worldKey(x, y)], SHADOW_TINT, 0.3);
      }
    }
  }

  // Street trees on the free cells around a district soften its edge.
  for (const b of BUILDINGS) for (let a = -1; a <= b.cells; a++) for (let c = -1; c <= b.cells; c++) {
    const i = b.i + a, j = b.j + c;
    if (lotOwner.has(cellKey(i, j)) || hash(i, j, 11) % 3) continue;
    const [x, y] = cellBack(i, j);
    const jx = x + (hash(i, j, 12) % 7) - 3, jy = y + 3 + (hash(i, j, 13) % 3);
    stampTree(buf, jx, jy);
  }
  return buf;
}

const terrainBuffer = bakeTerrain();
const terrainCanvas = toCanvas(terrainBuffer, WORLD_W, WORLD_H);
const cityCanvas = toCanvas(bakeCity(terrainBuffer), WORLD_W, WORLD_H);

// ── Street traffic ────────────────────────────────────────────────────────────

// Small delivery robots on the streets of the larger districts. Purely decorative: a
// city with nobody in it reads as a model, and these are robots.
const ROUTES = (() => {
  const routes = [];
  const scan = (coords, mapAlong) => {
    const lines = new Map();
    for (const [a, b] of coords) (lines.get(a) ?? lines.set(a, []).get(a)).push(b);
    for (const [line, stops] of lines) {
      stops.sort((x, y) => x - y);
      let start = stops[0], prev = stops[0];
      for (const s of [...stops.slice(1), Infinity]) {
        if (s !== prev + 1) {
          if (prev - start >= 3) routes.push(mapAlong(line, start, prev + 1));
          start = s;
        }
        prev = s;
      }
    }
  };
  const cells = [...lotOwner.keys()].map(k => [Math.floor(k / 2000) - 500, (k % 2000) - 500]);
  scan(cells.map(([i, j]) => [j, i]), (j, i0, i1) => ({ from: [i0, j], to: [i1, j] }));
  scan(cells.map(([i, j]) => [i, j]), (i, j0, j1) => ({ from: [i, j0], to: [i, j1] }));
  return routes.sort((a, b) => hash(...a.from) - hash(...b.from)).slice(0, 70);
})();
const ROBOT_COLORS = ['#FFD978', '#FFFFFF', '#FF9B6B'];

// ── Filters ───────────────────────────────────────────────────────────────────

// Same model as the map's chips: nothing selected on an axis means everything on it.
const filters = { sectors: new Set(), types: new Set(), newOnly: false };

const matches = b => (!filters.sectors.size || filters.sectors.has(b.c.sector))
  && (!filters.types.size || filters.types.has(b.c.isInstitute ? 'institute' : 'company'))
  && (!filters.newOnly || b.c.isNew);

// ── Stage and camera ──────────────────────────────────────────────────────────

const stage = document.getElementById('px-stage');
const canvas = document.getElementById('px-canvas');
const ctx = canvas.getContext('2d');
const world = document.createElement('canvas');
world.width = WORLD_W; world.height = WORLD_H;
const w = world.getContext('2d');
w.imageSmoothingEnabled = false;

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = () => window.devicePixelRatio || 1;

const cam = { x: (LAND.x0 + LAND.x1) / 2, y: (LAND.y0 + LAND.y1) / 2, z: 1 };
let flight = null;
let atFit = true;
let mode = 'buildings';
let hovered = null, selected = null;
let worldDirty = true, screenDirty = true;

const redraw = () => { worldDirty = true; screenDirty = true; };

// Space the key panel covers on a wide screen, so "fit" centres Germany in what is left.
function leftInset() {
  const key = document.getElementById('px-key');
  if (key.hidden || innerWidth < 860) return 0;
  return Math.round((key.getBoundingClientRect().right - stage.getBoundingClientRect().left) * DPR());
}

function fitCamera() {
  const pad = 20 * DPR(), inset = leftInset();
  const landW = LAND.x1 - LAND.x0, landH = LAND.y1 - LAND.y0 + 24;
  const raw = Math.min((canvas.width - inset - pad * 2) / landW, (canvas.height - pad * 2) / landH);
  // Whole numbers keep every pixel square, so take one if it is near enough: up to 20% of
  // the screen wasted, or 6% eaten from the padding. Otherwise the overview is slightly
  // soft, which is much less visible on a high-density screen. Zooming in always lands on
  // whole numbers.
  const whole = Math.max(1, Math.floor(raw + 0.06));
  const z = whole / raw >= 0.8 && whole / raw <= 1.06 ? whole : raw;
  return { x: (LAND.x0 + LAND.x1) / 2 - inset / 2 / z, y: (LAND.y0 + LAND.y1) / 2 + 4, z };
}

function zoomLevels() {
  const fit = fitCamera().z;
  const levels = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16].filter(z => z <= 8 * DPR() && z >= Math.min(fit, 1));
  return Number.isInteger(fit) ? levels : [...levels, fit].sort((a, b) => a - b);
}

function clampCamera(c) {
  c.x = Math.max(LAND.x0 - 40, Math.min(LAND.x1 + 40, c.x));
  c.y = Math.max(LAND.y0 - 40, Math.min(LAND.y1 + 40, c.y));
  return c;
}

function flyTo(target, ms = 650) {
  clampCamera(target);
  if (reducedMotion || ms === 0) { Object.assign(cam, target); flight = null; screenDirty = true; return; }
  flight = { from: { ...cam }, to: target, t0: performance.now(), ms };
}

const originX = () => Math.round(canvas.width / 2 - cam.x * cam.z);
const originY = () => Math.round(canvas.height / 2 - cam.y * cam.z);
const screenToWorld = (px, py) => [(px - originX()) / cam.z, (py - originY()) / cam.z];

function zoomStep(dir, px = canvas.width / 2, py = canvas.height / 2) {
  const levels = zoomLevels();
  const base = flight ? flight.to.z : cam.z;
  let idx = levels.findIndex(z => z >= base - 1e-6);
  if (idx < 0) idx = levels.length - 1;
  if (levels[idx] > base + 1e-6 && dir > 0) idx--;
  const nz = levels[Math.max(0, Math.min(levels.length - 1, idx + dir))];
  if (nz === base) return;
  const [wx, wy] = screenToWorld(px, py);
  atFit = false;
  flyTo({ x: wx - (px - canvas.width / 2) / nz, y: wy - (py - canvas.height / 2) / nz, z: nz }, 150);
}

function resize() {
  const r = stage.getBoundingClientRect();
  const cw = Math.round(r.width * DPR()), ch = Math.round(r.height * DPR());
  if (cw === canvas.width && ch === canvas.height) return;
  canvas.width = cw; canvas.height = ch;
  if (atFit) Object.assign(cam, fitCamera());
  screenDirty = true;
}

// ── Drawing the world ─────────────────────────────────────────────────────────

let anim = 0;

function drawRobots() {
  ROUTES.forEach((route, n) => {
    const [i0, j0] = route.from, [i1, j1] = route.to;
    const len = Math.hypot((i1 - i0) * CELL * 1.2, (j1 - j0) * CELL * 1.2);
    const pos = (anim * 0.5 + n * 17) % (len * 2);
    const f = (pos > len ? len * 2 - pos : pos) / len;
    const [x, y] = cellBack(i0 + (i1 - i0) * f, j0 + (j1 - j0) * f);
    w.fillStyle = ROBOT_COLORS[n % ROBOT_COLORS.length];
    w.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  });
}

function drawSmoke(b, s) {
  for (const e of s.emit) for (let k = 0; k < 3; k++) {
    const age = (anim + b.phase + k * 5) % 15;
    const x = b.ax - s.ox + e.x + Math.round(age / 5);
    const y = b.ay - s.oy + e.y - Math.round(age * 0.5) - 1;
    w.fillStyle = age < 5 ? '#EDEFEA' : age < 10 ? '#CBD0CC' : '#A7AEAB';
    const size = age < 5 ? 1 : 2;
    w.fillRect(x, y, size, size);
  }
}

// A dotted line from the lot to the real address, so the shift is visible, not just stated.
function drawTruePin(b) {
  const x0 = b.ax, y0 = b.ay + b.cells * CELL / 2;
  const n = Math.ceil(Math.max(Math.abs(b.wx - x0), Math.abs(b.wy - y0)));
  w.fillStyle = '#FFFFFF';
  for (let t = 0; t <= n; t += 2) w.fillRect(Math.round(x0 + (b.wx - x0) * t / n), Math.round(y0 + (b.wy - y0) * t / n), 1, 1);
  const px = Math.round(b.wx), py = Math.round(b.wy);
  w.fillRect(px - 2, py - 2, 5, 5);  // a white ring, so the pin still shows on a red building
  w.fillStyle = '#E8503A';
  w.fillRect(px - 1, py - 1, 3, 3);
}

function spriteFrame(b) {
  if (reducedMotion) return sprite(b.look, 0);
  return sprite(b.look, Math.floor((anim + b.phase) / (b.look.sector === 'robotics' ? 4 : 3)));
}

function drawWorld() {
  w.clearRect(0, 0, WORLD_W, WORLD_H);
  if (mode === 'dots') {
    w.drawImage(terrainCanvas, 0, 0);
  } else {
    w.drawImage(cityCanvas, 0, 0);
    if (!reducedMotion) drawRobots();
    for (const b of DRAW_ORDER) {
      const s = spriteFrame(b);
      const canvasFor = matches(b) ? s.canvas : ghostOf(s);
      w.drawImage(canvasFor, b.ax - s.ox, b.ay - s.oy);
    }
    if (!reducedMotion) for (const b of DRAW_ORDER) {
      if (matches(b)) { const s = spriteFrame(b); if (s.emit.length) drawSmoke(b, s); }
    }
  }
  if (mode === 'buildings') {
    const picked = [selected, hovered].filter(Boolean);
    for (const b of picked) {
      const s = spriteFrame(b);
      w.drawImage(haloOf(s), b.ax - s.ox - 1, b.ay - s.oy - 1);
      w.drawImage(s.canvas, b.ax - s.ox, b.ay - s.oy);
    }
    // Pins go last: a real address close to its lot is usually behind the building itself.
    for (const b of picked) drawTruePin(b);
  }
}

// The Dots view is today's map: same radii and colours as js/app.js, a constant size on
// screen, at true coordinates. Drawn over the scaled world so the comparison is fair.
const DOT_RADIUS = { startup: 3.5, mid: 5, big: 7, global: 9.5 };
const LAB_MIN_RADIUS = 5;
const dotRadius = b => (b.c.isInstitute ? Math.max(DOT_RADIUS[b.c.size], LAB_MIN_RADIUS) : DOT_RADIUS[b.c.size]);

function drawDots(ox, oy, z) {
  const dpr = DPR();
  const circle = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r * dpr, 0, Math.PI * 2); };
  const shown = BUILDINGS.filter(matches).sort((a, b) => SIZE_RANK[b.c.size] - SIZE_RANK[a.c.size]);
  for (const b of shown) {
    const x = ox + b.wx * z, y = oy + b.wy * z, r = dotRadius(b);
    const color = SECTOR_CONFIG[b.c.sector].color;
    circle(x, y, r);
    ctx.globalAlpha = b.c.isInstitute ? 0.38 : 0.95;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = (b.c.isInstitute ? 2.2 : 1.5) * dpr;
    ctx.strokeStyle = b.c.isInstitute ? color : 'rgba(255,255,255,0.92)';
    ctx.stroke();
    if (b.c.isNew) {
      circle(x, y, r + 3.4);
      ctx.lineWidth = 1.6 * dpr;
      ctx.strokeStyle = NEW_COLOR;
      ctx.stroke();
    }
    if (b === hovered || b === selected) {
      circle(x, y, r + 1.5);
      ctx.lineWidth = 2.5 * dpr;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
  }
}

// ── Bitmap labels ─────────────────────────────────────────────────────────────

// Map labels are drawn from this table rather than a web font: they stay on the pixel
// grid, and they cannot flash or shift while a font loads. Capitals only, as map labels are.
const GLYPHS = {
  A: '.##./#..#/####/#..#/#..#', B: '###./#..#/###./#..#/###.', C: '.###/#.../#.../#.../.###', D: '###./#..#/#..#/#..#/###.',
  E: '####/#.../###./#.../####', F: '####/#.../###./#.../#...', G: '.###/#.../#.##/#..#/.###', H: '#..#/#..#/####/#..#/#..#',
  I: '###/.#./.#./.#./###', J: '..##/...#/...#/#..#/.##.', K: '#..#/#.#./##../#.#./#..#', L: '#.../#.../#.../#.../####',
  M: '#...#/##.##/#.#.#/#...#/#...#', N: '#..#/##.#/#.##/#..#/#..#', O: '.##./#..#/#..#/#..#/.##.', P: '###./#..#/###./#.../#...',
  Q: '.##./#..#/#..#/#.#./.#.#', R: '###./#..#/###./#.#./#..#', S: '.###/#.../.##./...#/###.', T: '#####/..#../..#../..#../..#..',
  U: '#..#/#..#/#..#/#..#/.##.', V: '#...#/#...#/.#.#./.#.#./..#..', W: '#...#/#...#/#.#.#/##.##/#...#', X: '#..#/#..#/.##./#..#/#..#',
  Y: '#...#/.#.#./..#../..#../..#..', Z: '####/...#/.##./#.../####',
  0: '.##./#.##/##.#/#..#/.##.', 1: '.#./##./.#./.#./###', 2: '###./...#/.##./#.../####', 3: '###./...#/.##./...#/###.',
  4: '#..#/#..#/####/...#/...#', 5: '####/#.../###./...#/###.', 6: '.##./#.../###./#..#/.##.', 7: '####/...#/..#./.#../.#..',
  8: '.##./#..#/.##./#..#/.##.', 9: '.##./#..#/.###/...#/.##.',
  '&': '.#../#.#./.#.#/#.#./.#.#', '-': '.../.../###/.../...', '—': '..../..../####/..../....', '+': '.../.#./###/.#./...',
  '.': '././././#', ',': '../../.#/.#/#.', '/': '...#/..#./..#./.#../#...', '(': '.#/#./#./#./.#', ')': '#./.#/.#/.#/#.',
  ' ': '../../../../..',
};
const UMLAUT = { 'Ä': 'A', 'Ö': 'O', 'Ü': 'U' };
const labelCache = new Map();

function labelSprite(text, fg, bg) {
  const key = `${text}|${fg}|${bg}`;
  if (labelCache.has(key)) return labelCache.get(key);
  const chars = [...text.toUpperCase().replace(/ß/g, 'SS')];
  const hasDots = chars.some(ch => UMLAUT[ch]);
  const top = hasDots ? 3 : 1;
  const glyph = ch => (GLYPHS[UMLAUT[ch] ?? ch] ?? GLYPHS[' ']).split('/');
  const width = chars.reduce((n, ch) => n + glyph(ch)[0].length + 1, 0) + 1;
  const height = top + 5 + 1;
  const cv = document.createElement('canvas');
  cv.width = width; cv.height = height;
  const g = cv.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, width, height);
  g.fillStyle = fg;
  let x = 1;
  for (const ch of chars) {
    const rows = glyph(ch);
    rows.forEach((row, ry) => [...row].forEach((bit, rx) => { if (bit === '#') g.fillRect(x + rx, top + ry, 1, 1); }));
    if (UMLAUT[ch]) { g.fillRect(x, top - 2, 1, 1); g.fillRect(x + rows[0].length - 1, top - 2, 1, 1); }
    x += rows[0].length + 1;
  }
  labelCache.set(key, cv);
  return cv;
}

const CITIES = (() => {
  const byCity = new Map();
  for (const b of BUILDINGS) (byCity.get(b.c.city) ?? byCity.set(b.c.city, []).get(b.c.city)).push(b);
  return [...byCity].map(([name, members]) => {
    const tops = members.map(b => { const s = sprite(b.look); return b.ay - s.oy; });
    return {
      name, members,
      x: members.reduce((n, b) => n + b.ax, 0) / members.length,
      top: Math.min(...tops),
      y: members.reduce((n, b) => n + b.ay, 0) / members.length,
    };
  }).sort((a, b) => (b.name === 'Bonn') - (a.name === 'Bonn') || b.members.length - a.members.length);
})();

const shortName = name => (name.length > 20 ? name.slice(0, 18).trimEnd() + '..' : name);

function drawLabels(ox, oy, z) {
  const dpr = DPR(), s = z / dpr;
  const k = Math.max(1, Math.ceil(1.6 * dpr));
  const taken = [];
  const place = (cv, sx, sy, center = true) => {
    const dw = cv.width * k, dh = cv.height * k;
    const x = Math.round(center ? sx - dw / 2 : sx), y = Math.round(sy - dh);
    if (x + dw < 0 || y + dh < 0 || x > canvas.width || y > canvas.height) return false;
    const gap = 2 * k;
    if (taken.some(r => x < r.x + r.w + gap && x + dw + gap > r.x && y < r.y + r.h + gap && y + dh + gap > r.y)) return false;
    taken.push({ x, y, w: dw, h: dh });
    ctx.drawImage(cv, x, y, dw, dh);
    return true;
  };
  ctx.imageSmoothingEnabled = false;

  // A one-building town needs no label of its own until the building's name can't say it.
  const minCount = s < 1.5 ? 4 : s < 3 ? 3 : s < 5 ? 2 : 1;
  for (const city of CITIES) {
    const shown = city.members.filter(matches).length;
    if (!shown || (shown < minCount && city.name !== 'Bonn')) continue;
    const home = city.name === 'Bonn';
    place(labelSprite(city.name, home ? '#FFD978' : '#FFFFFF', 'rgba(16,28,35,0.88)'), ox + city.x * z, oy + city.top * z - 1);
  }

  if (mode !== 'buildings' || s < 3) return;
  const named = DRAW_ORDER.filter(matches).sort((a, b) => SIZE_RANK[b.c.size] - SIZE_RANK[a.c.size]);
  for (const b of named) {
    if (SIZE_RANK[b.c.size] < (s < 4 ? 2 : s < 5 ? 1 : 0)) continue;
    const sp = sprite(b.look);
    place(labelSprite(shortName(b.c.name), '#16232A', 'rgba(238,241,232,0.94)'), ox + b.ax * z, oy + (b.ay - sp.oy) * z - k);
  }
}

// ── Present ───────────────────────────────────────────────────────────────────

function present() {
  const z = cam.z, ox = originX(), oy = originY();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#1B272E';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = !flight && !Number.isInteger(z);
  ctx.drawImage(world, ox, oy, WORLD_W * z, WORLD_H * z);
  if (mode === 'dots') drawDots(ox, oy, z);
  drawLabels(ox, oy, z);
}

function frame(now) {
  requestAnimationFrame(frame);
  if (flight) {
    const f = Math.min(1, (now - flight.t0) / flight.ms);
    const e = f * f * (3 - 2 * f);
    cam.x = flight.from.x + (flight.to.x - flight.from.x) * e;
    cam.y = flight.from.y + (flight.to.y - flight.from.y) * e;
    cam.z = Math.exp(Math.log(flight.from.z) + (Math.log(flight.to.z) - Math.log(flight.from.z)) * e);
    screenDirty = true;
    if (f === 1) { Object.assign(cam, flight.to); flight = null; }
  }
  const t = Math.floor(now / 125);
  if (!reducedMotion && t !== anim) { anim = t; worldDirty = true; }
  if (worldDirty) { drawWorld(); worldDirty = false; screenDirty = true; }
  if (screenDirty) { present(); screenDirty = false; }
}

// ── Picking ───────────────────────────────────────────────────────────────────

function pick(wx, wy) {
  const ix = Math.floor(wx), iy = Math.floor(wy);
  if (mode === 'dots') {
    let best = null, bestD = Infinity;
    const perCssPx = DPR() / cam.z;   // dots keep their size on screen, so reach does too
    for (const b of BUILDINGS) {
      if (!matches(b)) continue;
      const d = Math.hypot(b.wx - wx, b.wy - wy);
      if (d < (dotRadius(b) + 2) * perCssPx && d < bestD) { best = b; bestD = d; }
    }
    return best;
  }
  for (let k = DRAW_ORDER.length - 1; k >= 0; k--) {
    const b = DRAW_ORDER[k];
    if (!matches(b)) continue;
    const s = sprite(b.look);
    const sx = ix - (b.ax - s.ox), sy = iy - (b.ay - s.oy);
    if (sx >= 0 && sy >= 0 && sx < s.w && sy < s.h && s.px[sy * s.w + sx] !== -1) return b;
  }
  // The lot counts too, which makes the smallest buildings easier to hit.
  const [i, j] = cellOf(wx, wy);
  const owner = lotOwner.get(cellKey(i, j));
  return owner && matches(owner) ? owner : null;
}

// ── Pointer ───────────────────────────────────────────────────────────────────

const tip = document.getElementById('px-tip');
const pointers = new Map();
let drag = null, pinch = null;

function showTip(b, cx, cy) {
  if (!b) { tip.hidden = true; return; }
  const cfg = SECTOR_CONFIG[b.c.sector];
  tip.innerHTML = `<strong>${esc(b.c.name)}</strong><span>${esc(b.c.city)} &middot; ${esc(cfg.label)} &middot; ${esc(SIZE_RANGE[b.c.size] ?? b.c.size)} staff</span>`;
  tip.hidden = false;
  const r = stage.getBoundingClientRect();
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  const x = cx - r.left + 14 + tw > r.width ? cx - r.left - tw - 14 : cx - r.left + 14;
  const y = Math.max(4, cy - r.top - th - 12);
  tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

canvas.addEventListener('pointerdown', e => {
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, [e.clientX, e.clientY]);
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) };
    drag = null;
  } else if (pointers.size === 1) {
    drag = { x: e.clientX, y: e.clientY, camX: cam.x, camY: cam.y, moved: 0 };
    flight = null;
  }
});

canvas.addEventListener('pointermove', e => {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, [e.clientX, e.clientY]);
  const r = canvas.getBoundingClientRect();
  const px = (e.clientX - r.left) * DPR(), py = (e.clientY - r.top) * DPR();

  if (pinch && pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (d / pinch.d > 1.3 || d / pinch.d < 0.77) {
      zoomStep(d > pinch.d ? 1 : -1, ((a[0] + b[0]) / 2 - r.left) * DPR(), ((a[1] + b[1]) / 2 - r.top) * DPR());
      pinch.d = d;
    }
    return;
  }
  if (drag) {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
    if (drag.moved > 4) {
      Object.assign(cam, clampCamera({ x: drag.camX - dx * DPR() / cam.z, y: drag.camY - dy * DPR() / cam.z, z: cam.z }));
      atFit = false;
      screenDirty = true;
      canvas.classList.add('is-dragging');
      showTip(null);
    }
    return;
  }
  if (e.pointerType === 'mouse') {
    const hit = pick(...screenToWorld(px, py));
    if (hit !== hovered) { hovered = hit; canvas.classList.toggle('is-over', !!hit); worldDirty = true; }
    showTip(hit, e.clientX, e.clientY);
  }
});

function endPointer(e) {
  pointers.delete(e.pointerId);
  canvas.classList.remove('is-dragging');
  if (pointers.size < 2) pinch = null;
  if (!drag || pointers.size) { drag = null; return; }
  if (drag.moved <= 4 && e.type === 'pointerup') {
    const r = canvas.getBoundingClientRect();
    selectBuilding(pick(...screenToWorld((e.clientX - r.left) * DPR(), (e.clientY - r.top) * DPR())));
  }
  drag = null;
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('pointerleave', () => {
  if (hovered) { hovered = null; worldDirty = true; }
  showTip(null);
});

let wheelSum = 0, wheelTimer = 0;
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  wheelSum += e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => { wheelSum = 0; }, 220);
  if (Math.abs(wheelSum) < 40) return;
  const r = canvas.getBoundingClientRect();
  zoomStep(wheelSum < 0 ? 1 : -1, (e.clientX - r.left) * DPR(), (e.clientY - r.top) * DPR());
  wheelSum = 0;
}, { passive: false });

canvas.addEventListener('dblclick', e => {
  const r = canvas.getBoundingClientRect();
  zoomStep(1, (e.clientX - r.left) * DPR(), (e.clientY - r.top) * DPR());
});

canvas.addEventListener('keydown', e => {
  const step = 40 * DPR() / cam.z;
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (moves[e.key]) {
    e.preventDefault();
    Object.assign(cam, clampCamera({ x: cam.x + moves[e.key][0], y: cam.y + moves[e.key][1], z: cam.z }));
    atFit = false;
    screenDirty = true;
  } else if (e.key === '+' || e.key === '=') zoomStep(1);
  else if (e.key === '-') zoomStep(-1);
});

// ── Building card ─────────────────────────────────────────────────────────────

const card = document.getElementById('px-card');

function spriteElement(look, scale = 2, frameIndex = 0) {
  const s = sprite(look, frameIndex);
  const cv = document.createElement('canvas');
  cv.width = s.w; cv.height = s.h;
  cv.getContext('2d').drawImage(s.canvas, 0, 0);
  cv.className = 'px-sprite';
  cv.style.width = `${s.w * scale}px`;
  cv.style.height = `${s.h * scale}px`;
  cv.setAttribute('aria-hidden', 'true');
  return cv;
}

function selectBuilding(b) {
  selected = b;
  worldDirty = true;
  card.hidden = !b;
  if (!b) return;
  const c = b.c, cfg = SECTOR_CONFIG[c.sector];
  const moved = b.movedKm < 1 ? 'Drawn at its real address.' : `Drawn ${Math.round(b.movedKm)} km from its real address, which the red pin marks.`;
  const links = [
    `<a href="${escapeAttr(jobsUrl(c))}" target="_blank" rel="noopener noreferrer">${jobsLabel(c)} &#8599;</a>`,
    c.website ? `<a href="${escapeAttr(c.website)}" target="_blank" rel="noopener noreferrer">Visit website &#8599;</a>` : '',
    c.isNew ? `<a class="px-sources" href="${STARTUPS_PAGE}#${escapeAttr(startupAnchor(c.name))}">Sources &rarr;</a>` : '',
  ].join('');
  card.innerHTML = `
    <button id="px-card-close" type="button" aria-label="Close">&times;</button>
    <div class="px-card-scene"></div>
    <h2>${esc(c.name)}</h2>
    <span class="px-badge" style="background:${cfg.color}">${sectorIconSvg(c.sector, 'sector-icon')}${esc(cfg.label)}</span>
    <p class="px-card-meta">${esc(c.city)} &middot; ${c.isInstitute ? 'Research lab' : 'Company'} &middot; ${esc(SIZE_RANGE[c.size] ?? c.size)} staff</p>
    ${c.isNew ? `<p class="px-card-new"><span>New startup</span> Registered ${esc(fmtDay(c.registered))}${c.founded ? ` &middot; founded ${esc(c.founded)}` : ''}</p>` : ''}
    <p class="px-card-desc">${esc(c.description)}</p>
    <p class="px-card-moved">${moved}</p>
    <div class="px-card-links">${links}</div>`;
  card.querySelector('.px-card-scene').appendChild(spriteElement(b.look, b.cells > 1 ? 2 : 3));
  document.getElementById('px-card-close').addEventListener('click', () => selectBuilding(null));
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && selected) selectBuilding(null);
});

function locate(b) {
  selectBuilding(b);
  atFit = false;
  const z = zoomLevels().filter(l => l <= 4 * DPR()).pop();
  const s = sprite(b.look);
  const target = Math.max(z, cam.z);
  // On a phone the card covers the lower part of the screen, so aim above it.
  const lift = innerWidth < 860 ? canvas.height * 0.2 / target : 0;
  flyTo({ x: b.ax, y: b.ay - s.oy / 2 + lift, z: target });
}

// ── Key and filters ───────────────────────────────────────────────────────────

const countVisible = document.getElementById('count-visible');
document.getElementById('count-total').textContent = BUILDINGS.length;

function syncFilters() {
  document.querySelectorAll('[data-sector]').forEach(el => el.setAttribute('aria-pressed', filters.sectors.has(el.dataset.sector)));
  document.querySelectorAll('[data-type]').forEach(el => el.setAttribute('aria-pressed', filters.types.has(el.dataset.type)));
  document.getElementById('px-new').setAttribute('aria-pressed', filters.newOnly);
  document.getElementById('px-reset').hidden = !(filters.sectors.size || filters.types.size || filters.newOnly);
  countVisible.textContent = BUILDINGS.filter(matches).length;
  if (selected && !matches(selected)) selectBuilding(null);
  if (hovered && !matches(hovered)) hovered = null;
  redraw();
}

function toggleIn(set, value) { if (!set.delete(value)) set.add(value); syncFilters(); }

// Sprites differ in width, so each sits in a fixed slot to keep the chip labels aligned.
function chipArt(look) {
  const slot = document.createElement('span');
  slot.className = 'px-chip-art';
  slot.appendChild(spriteElement(look, 2));
  return slot;
}

function buildKey() {
  const sizes = document.getElementById('px-sizes');
  for (const s of SIZES) {
    const col = document.createElement('div');
    col.className = 'px-size';
    col.appendChild(spriteElement({ sector: 'robotics', size: s.key, isLab: false, variant: 1, isNew: false }, 2));
    const lbl = document.createElement('span');
    lbl.textContent = s.range;
    col.appendChild(lbl);
    sizes.appendChild(col);
  }

  const sectors = document.getElementById('px-sectors');
  for (const [key, cfg] of Object.entries(SECTOR_CONFIG)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-chip';
    btn.dataset.sector = key;
    btn.appendChild(chipArt({ sector: key, size: 'mid', isLab: false, variant: 0, isNew: false }));
    const text = document.createElement('span');
    text.className = 'px-chip-text';
    text.innerHTML = `${esc(cfg.label)}<small>${BUILDINGS.filter(b => b.c.sector === key).length}</small>`;
    btn.appendChild(text);
    btn.addEventListener('click', () => toggleIn(filters.sectors, key));
    sectors.appendChild(btn);
  }

  const types = document.getElementById('px-types');
  const typeRows = [
    ['company', 'Companies', { sector: 'industrial', size: 'mid', isLab: false, variant: 0, isNew: false }, b => !b.c.isInstitute],
    ['institute', 'Labs', { sector: 'robotics', size: 'mid', isLab: true, variant: 0, isNew: false }, b => b.c.isInstitute],
  ];
  for (const [key, label, look, test] of typeRows) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-chip';
    btn.dataset.type = key;
    btn.appendChild(chipArt(look));
    const text = document.createElement('span');
    text.className = 'px-chip-text';
    text.innerHTML = `${label}<small>${BUILDINGS.filter(test).length}</small>`;
    btn.appendChild(text);
    btn.addEventListener('click', () => toggleIn(filters.types, key));
    types.appendChild(btn);
  }

  const newBtn = document.getElementById('px-new');
  newBtn.prepend(chipArt({ sector: 'software', size: 'startup', isLab: false, variant: 1, isNew: true }));
  newBtn.querySelector('small').textContent = BUILDINGS.filter(b => b.c.isNew).length;
  newBtn.addEventListener('click', () => { filters.newOnly = !filters.newOnly; syncFilters(); });

  document.getElementById('px-reset').addEventListener('click', () => {
    filters.sectors.clear(); filters.types.clear(); filters.newOnly = false; syncFilters();
  });
  document.getElementById('px-note').textContent =
    `Each lot is as near to the real address as the grid allows: half are within ${Math.round(MOVED_MEDIAN)} km, the farthest is ${Math.round(MOVED_MAX)} km away. Select a building to see its real address as a red pin, or switch to Dots for true positions.`;
}

const keyPanel = document.getElementById('px-key');
const keyToggle = document.getElementById('px-key-toggle');
function setKeyOpen(open) {
  keyPanel.hidden = !open;
  keyToggle.setAttribute('aria-expanded', open);
}
function toggleKey(open) {
  setKeyOpen(open);
  if (atFit) flyTo(fitCamera(), 200);
}
keyToggle.addEventListener('click', () => toggleKey(keyPanel.hidden));
document.getElementById('px-key-close').addEventListener('click', () => toggleKey(false));

// ── Views and controls ────────────────────────────────────────────────────────

const VIEWS = {
  germany:      { label: 'Germany' },
  munich:       { label: 'Munich', city: 'Munich', scale: 3 },
  berlin:       { label: 'Berlin', city: 'Berlin', scale: 3 },
  'rhine-ruhr': { label: 'Rhine-Ruhr', lat: 51.15, lng: 7.05, scale: 2 },
  bonn:         { label: 'Bonn', city: 'Bonn', scale: 5 },
};

function goToView(name) {
  const view = VIEWS[name] ?? VIEWS.germany;
  document.querySelectorAll('[data-view]').forEach(el => el.setAttribute('aria-current', el.dataset.view === name ? 'true' : 'false'));
  if (!view.scale) { atFit = true; flyTo(fitCamera()); return; }
  atFit = false;
  const levels = zoomLevels();
  const wanted = view.scale * DPR() * (innerWidth < 860 ? 0.6 : 1);   // a phone shows less, so it zooms less
  const z = levels.reduce((best, l) => (Math.abs(l - wanted) < Math.abs(best - wanted) ? l : best), levels[0]);
  const inset = leftInset();
  if (view.city) {
    const city = CITIES.find(c => c.name === view.city);
    flyTo({ x: city.x - inset / 2 / z, y: city.y - 6, z });
  } else {
    flyTo({ x: projectX(view.lng) - inset / 2 / z, y: projectY(view.lat), z });
  }
}

function buildControls() {
  const nav = document.getElementById('px-views');
  for (const [key, view] of Object.entries(VIEWS)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-btn';
    btn.dataset.view = key;
    btn.textContent = view.label;
    btn.addEventListener('click', () => {
      try { history.replaceState(null, '', `#${key}`); } catch { /* the frame may not allow it */ }
      goToView(key);
    });
    nav.appendChild(btn);
  }
  document.getElementById('px-zoom-in').addEventListener('click', () => zoomStep(1));
  document.getElementById('px-zoom-out').addEventListener('click', () => zoomStep(-1));
  document.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(el => el.setAttribute('aria-pressed', el === btn));
    hovered = null;
    redraw();
  }));
}

// ── Search ────────────────────────────────────────────────────────────────────

// The same ranking and keys as the map's search box (js/app.js).
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
let searchHits = [], searchCursor = -1;

function scoreEntity(c, q) {
  const name = c.name.toLowerCase(), city = c.city.toLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (new RegExp(`(^|[\\s—–-])${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(name)) return 2;
  if (name.includes(q)) return 3;
  if (city.startsWith(q)) return 4;
  if (city.includes(q)) return 5;
  if ((SECTOR_CONFIG[c.sector]?.label || '').toLowerCase().includes(q)) return 6;
  if (c.description.toLowerCase().includes(q)) return 7;
  return -1;
}

function renderSearch() {
  if (!searchHits.length) {
    searchResults.innerHTML = '<li class="sr-empty">No match on the map yet.</li>';
    return;
  }
  searchResults.innerHTML = searchHits.map((b, i) => {
    const cfg = SECTOR_CONFIG[b.c.sector];
    return `<li class="sr-item" role="option" id="sr-${i}" data-i="${i}" aria-selected="${i === searchCursor}">
      <span class="${b.c.isInstitute ? 'sr-ring' : 'sr-disc'}" style="color:${cfg.color}"></span>
      <span class="sr-name">${esc(b.c.name)}</span>${b.c.isNew ? '<span class="sr-new">New</span>' : ''}
      <span class="sr-meta">${esc(b.c.city)} &middot; ${esc(cfg.label)}</span>
    </li>`;
  }).join('');
}

function closeSearch() {
  searchResults.hidden = true;
  searchInput.setAttribute('aria-expanded', 'false');
  searchCursor = -1;
}

function chooseSearch(i) {
  const b = searchHits[i];
  if (!b) return;
  closeSearch();
  searchInput.blur();
  locate(b);
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  searchCursor = -1;
  if (q.length < 2) { searchHits = []; closeSearch(); return; }
  searchHits = BUILDINGS.map(b => ({ b, score: scoreEntity(b.c, q) }))
    .filter(r => r.score >= 0)
    .sort((a, b) => a.score - b.score || a.b.c.name.localeCompare(b.b.c.name))
    .slice(0, 8).map(r => r.b);
  renderSearch();
  searchResults.hidden = false;
  searchInput.setAttribute('aria-expanded', 'true');
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!searchHits.length) return;
    searchCursor = (searchCursor + (e.key === 'ArrowDown' ? 1 : -1) + searchHits.length) % searchHits.length;
    renderSearch();
    searchInput.setAttribute('aria-activedescendant', `sr-${searchCursor}`);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    chooseSearch(searchCursor === -1 ? 0 : searchCursor);
  } else if (e.key === 'Escape') {
    searchInput.value = ''; searchHits = []; closeSearch();
  }
});

searchResults.addEventListener('mousedown', e => {
  const li = e.target.closest('.sr-item');
  if (li) { e.preventDefault(); chooseSearch(+li.dataset.i); }
});
document.addEventListener('click', e => {
  if (!document.getElementById('search-box').contains(e.target)) closeSearch();
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

buildKey();
buildControls();
if (innerWidth < 860) setKeyOpen(false);
syncFilters();
resize();
new ResizeObserver(resize).observe(stage);
addEventListener('hashchange', () => goToView(location.hash.slice(1)));

const startView = location.hash.slice(1);
if (VIEWS[startView] && VIEWS[startView].scale) {
  // Open on the linked view without a flight from the country.
  goToView(startView);
  if (flight) { Object.assign(cam, flight.to); flight = null; }
}
requestAnimationFrame(frame);
