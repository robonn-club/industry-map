// Buildings for the pixel view (pixel.html). Load after js/common.js, before js/pixel.js.
//
// Every building is generated, so a new entry in the data files needs no new art.
// A model is a small block of voxels; each pixel of the sprite is one ray cast through
// that block along the isometric view direction. That keeps every shape on the same
// 2:1 pixel grid, and shading follows from which face the ray hits.
//
// What a building says, in the order a reader notices it:
//   height and footprint   headcount (the same four size bands as the map's dots)
//   colour and silhouette  sector (never colour alone, as with the map's glyphs)
//   stone and columns      research lab rather than company
//   gold flag              new startup (the map's gold ring; the lot gets a gold edge too)

// ── Colour ────────────────────────────────────────────────────────────────────

const rgb = hex => parseInt(hex.slice(1), 16);

function mix(a, b, t) {
  const ch = s => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
}
const lift = (c, t) => mix(c, 0xFFFFFF, t);
const sink = (c, t) => mix(c, 0x10202A, t);

// The sector palette is deliberately muted for text and chips. At sprite size that
// reads as grey, so buildings push each colour away from its own grey by a fixed factor.
function vivid(c, f) {
  const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
  const grey = 0.3 * r + 0.59 * g + 0.11 * b;
  const push = v => Math.max(0, Math.min(255, Math.round(grey + (v - grey) * f)));
  return (push(r) << 16) | (push(g) << 8) | push(b);
}

// Sun from the left: roof brightest, left wall mid, right wall in shade.
const ramp = c => ({ t: lift(c, 0.24), l: c, r: sink(c, 0.34) });
const sectorRamp = sector => ramp(vivid(rgb(SECTOR_CONFIG[sector].color), 1.3));

const OUTLINE = 0x16232A;
const GLASS = 0xA6DCE8, GLASS_SHADE = 0x6FA6BA;
const LIT = 0xFFE591, LIT_SHADE = 0xE3BE66;
const STEEL = { t: 0xB7C2C4, l: 0x8E9A9E, r: 0x69767B };
const DARK = { t: 0x56636A, l: 0x3F4B52, r: 0x2E383E };
const ORANGE = { t: 0xFFC25A, l: 0xF29A2E, r: 0xC4701C };
const WHITE = { t: 0xFFFFFF, l: 0xD3DCDB, r: 0x97A6A9 };
const STONE = { t: 0xF4F0E4, l: 0xE2DCCC, r: 0xB4AE9E };
const GOLD = { t: 0xFFD978, l: 0xE3A72F, r: 0xB57F18 };

// ── Hashing ───────────────────────────────────────────────────────────────────

// Layout and sprites must come out the same on every load, so nothing uses Math.random.
function hash(...xs) {
  let h = 2166136261;
  for (const x of xs) { h ^= x | 0; h = Math.imul(h, 16777619); h ^= h >>> 13; }
  return h >>> 0;
}
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// ── Voxels ────────────────────────────────────────────────────────────────────

const FACE_T = 0, FACE_L = 1, FACE_R = 2;
const paint = (m, a, b) => (typeof m === 'function' ? m(a, b) : m);

class Voxels {
  constructor(w, d, h) {
    this.w = w; this.d = d; this.h = h;
    this.faces = new Int32Array(w * d * h * 3).fill(-1);
  }
  at(u, v, z, face) { return this.faces[(u + this.w * (v + this.d * z)) * 3 + face]; }
  put(u, v, z, t, l, r) {
    if (u < 0 || v < 0 || z < 0 || u >= this.w || v >= this.d || z >= this.h) return;
    const k = (u + this.w * (v + this.d * z)) * 3;
    this.faces[k] = t; this.faces[k + 1] = l; this.faces[k + 2] = r;
  }
  // Half-open box. In a material, t(u, v) gets the position on the roof, and
  // l(i, z) / r(i, z) get columns counted from the front corner and height above the
  // box's base, so a wall pattern comes out symmetric on both sides of a building.
  box(u0, v0, z0, u1, v1, z1, m) {
    for (let z = z0; z < z1; z++) for (let v = v0; v < v1; v++) for (let u = u0; u < u1; u++) {
      this.put(u, v, z, paint(m.t, u - u0, v - v0), paint(m.l, u1 - 1 - u, z - z0), paint(m.r, v1 - 1 - v, z - z0));
    }
  }
  cylinder(cu, cv, r, z0, z1, m) {
    for (let z = z0; z < z1; z++) for (let v = Math.floor(cv - r); v <= cv + r; v++) for (let u = Math.floor(cu - r); u <= cu + r; u++) {
      if ((u + 0.5 - cu) ** 2 + (v + 0.5 - cv) ** 2 <= r * r) {
        this.put(u, v, z, paint(m.t, u, v), paint(m.l, u, z - z0), paint(m.r, v, z - z0));
      }
    }
  }
  sphere(cu, cv, cz, r, m) {
    for (let z = Math.floor(cz - r); z <= cz + r; z++) for (let v = Math.floor(cv - r); v <= cv + r; v++) for (let u = Math.floor(cu - r); u <= cu + r; u++) {
      if ((u + 0.5 - cu) ** 2 + (v + 0.5 - cv) ** 2 + (z + 0.5 - cz) ** 2 <= r * r) {
        this.put(u, v, z, paint(m.t, u, v), paint(m.l, u, z), paint(m.r, v, z));
      }
    }
  }
}

// One ray per pixel, walked from the viewer's side of the block towards the ground.
// Screen x = u - v and y = (u + v) / 2 - z, so all three axes advance at the same rate
// along a ray, and the axis whose boundary was crossed last tells which face was hit.
function raycast(vox) {
  const W = vox.w, D = vox.d, H = vox.h;
  const sw = W + D + 2, sh = H + Math.ceil((W + D) / 2) + 2;
  const ox = D + 1, oy = H + 1;
  const px = new Int32Array(sw * sh).fill(-1);
  const faces = new Int8Array(sw * sh).fill(-1);

  for (let sy = 0; sy < sh; sy++) for (let sx = 0; sx < sw; sx++) {
    const X = sx - ox + 0.5, Y = sy - oy + 0.5;
    const U = Y + H + X / 2, V = Y + H - X / 2;
    let iu = Math.floor(U), iv = Math.floor(V), iz = H - 1;
    let du = U - iu, dv = V - iv, dz = 1, face = FACE_T;
    while (iz >= 0 && iu >= 0 && iv >= 0) {
      if (iu < W && iv < D) {
        const c = vox.at(iu, iv, iz, face);
        if (c !== -1) { px[sy * sw + sx] = c; faces[sy * sw + sx] = face; break; }
      }
      const step = Math.min(du, dv, dz);
      du -= step; dv -= step; dz -= step;
      if (du < 1e-9) { iu--; du = 1; face = FACE_R; }
      else if (dv < 1e-9) { iv--; dv = 1; face = FACE_L; }
      else { iz--; dz = 1; face = FACE_T; }
    }
  }
  return { sw, sh, ox, oy, px, faces };
}

// Pixel-art finish: a lit line under each roof edge and down the front corner, then a
// dark outline around the silhouette so a building separates from whatever is behind it.
function finish({ sw, sh, px, faces }) {
  const out = px.slice();
  for (let y = 1; y < sh; y++) for (let x = 0; x < sw - 1; x++) {
    const k = y * sw + x, f = faces[k];
    if (f !== FACE_L && f !== FACE_R) continue;
    if (faces[k - sw] === FACE_T) out[k] = lift(px[k], 0.26);
    else if (f === FACE_L && faces[k + 1] === FACE_R) out[k] = lift(px[k], 0.16);
  }
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    const k = y * sw + x;
    if (px[k] !== -1) continue;
    const near = (x > 0 && px[k - 1] !== -1) || (x < sw - 1 && px[k + 1] !== -1)
      || (y > 0 && px[k - sw] !== -1) || (y < sh - 1 && px[k + sw] !== -1);
    if (near) out[k] = OUTLINE;
  }
  return out;
}

// ── Wall patterns ─────────────────────────────────────────────────────────────

// 2:1 iso steps pair up columns (1,2), (3,4), (5,6) on the same row, so a window two
// columns wide on one of those pairs stays level. Hence the four-column rhythm.
const onWindowColumn = i => (i + 3) % 4 < 2;

function windows(base, seed, top, shaded, { floor = 3, tall = 2, from = 1 } = {}) {
  return (i, z) => {
    if (z < from || z >= top - 1 || !onWindowColumn(i) || (z - from) % floor >= tall) return base;
    const lit = hash(seed, (i + 3) >> 2, ((z - from) / floor) | 0) % 5 === 0;
    if (lit) return shaded ? LIT_SHADE : LIT;
    return shaded ? GLASS_SHADE : GLASS;
  };
}

const withDoor = (wall, i0, i1, top, color) =>
  (i, z) => (i >= i0 && i <= i1 && z < top ? color : wall(i, z));

// ── Rooftop props ─────────────────────────────────────────────────────────────

// The one moving part of a robotics building: it swings across the roof.
const ARM_SWING = [[1, 0], [1, 1], [0, 1], [1, 1]];

function robotArm(V, u, v, z, k, frame) {
  V.box(u - 1, v - 1, z, u + 1, v + 1, z + 1, DARK);
  const shoulder = 2 + k, reach = 1 + k;
  V.box(u - 1, v - 1, z + 1, u, v, z + 1 + shoulder, ORANGE);
  const [du, dv] = ARM_SWING[frame % ARM_SWING.length];
  for (let s = 1; s <= reach; s++) {
    const a = u - 1 + du * s, b = v - 1 + dv * s;
    V.box(a, b, z + shoulder, a + 1, b + 1, z + shoulder + 1, ORANGE);
  }
  const a = u - 1 + du * reach, b = v - 1 + dv * reach;
  V.box(a, b, z + shoulder - 1, a + 1, b + 1, z + shoulder, DARK);
}

const CAR_BODIES = [ramp(0xF2EDE0), ramp(0xD84B3C), ramp(0x3D7FBF)];
function car(V, u, v, z, tone = 0) {
  const body = CAR_BODIES[tone % CAR_BODIES.length];
  V.box(u, v, z, u + 5, v + 3, z + 1, body);
  V.box(u + 1, v, z + 1, u + 4, v + 3, z + 2, { t: body.t, l: 0x35505E, r: 0x263A45 });
}

function coolingFan(V, u, v, z, frame) {
  const vane = (a, b) => (frame % 2 ? (a === 1 || b === 1) : (a === b || a + b === 2));
  V.box(u, v, z, u + 3, v + 3, z + 1, { t: (a, b) => (vane(a, b) ? 0x2B2344 : 0xC3B7E8), l: DARK.l, r: DARK.r });
}

function chimney(V, u, v, z0, z1, emit) {
  const band = c => (i, z) => (z1 - z0 - z <= 3 && (z1 - z0 - z) % 2 === 1 ? 0xD8493A : c);
  V.box(u, v, z0, u + 2, v + 2, z1, { t: 0x2E383E, l: band(0xD9D4C8), r: band(0xA8A296) });
  emit.push({ u: u + 1, v: v + 1, z: z1 });
}

function tree(V, u, v, z, r = 1.6) {
  V.box(u, v, z, u + 1, v + 1, z + 1, { t: 0x6B4A2E, l: 0x7D5835, r: 0x5A3D25 });
  V.sphere(u + 0.5, v + 0.5, z + 1.2 + r, r, { t: 0x7CC36A, l: 0x57A24F, r: 0x3C7E40 });
}

function antenna(V, u, v, z, tall) {
  V.box(u, v, z, u + 1, v + 1, z + tall, STEEL);
  V.box(u, v, z + tall, u + 1, v + 1, z + tall + 1, { t: 0xFF6A4D, l: 0xE24A34, r: 0xB83524 });
}

function radome(V, cu, cv, z, r) {
  V.box(Math.floor(cu), Math.floor(cv), z, Math.floor(cu) + 1, Math.floor(cv) + 1, z + 1, STEEL);
  V.sphere(cu, cv, z + r + 0.6, r, WHITE);
}

function silo(V, cu, cv, r, top) {
  const bands = c => (i, z) => (z % 4 === 3 ? sink(c, 0.14) : c);
  V.cylinder(cu, cv, r, 0, top, { t: 0xD5DBD8, l: bands(0xC2CAC6), r: bands(0x8D9794) });
  V.sphere(cu, cv, top, r, { t: 0xEEF2EE, l: 0xD5DBD8, r: 0x9EA8A4 });
}

// The pole starts at the ground because not every roof reaches h, and the back corner
// it stands in is hidden by the building anyway.
function pennant(V, u, v, z, m = GOLD) {
  V.box(u, v, 0, u + 1, v + 1, z + 6, WHITE);
  V.box(u + 1, v, z + 4, u + 4, v + 1, z + 6, m);
}

// ── Models: one per sector ────────────────────────────────────────────────────

// Each returns how tall its main mass is. A one-cell lot is 8×8 voxels; the footprint
// (T.m, T.a) leaves a road around it. Global companies get a two-cell campus.

function modelRobotics(V, T, h, seed, frame) {
  const c = sectorRamp('robotics'), { m, a } = T;
  const opts = { from: h > 5 ? 2 : 1 };
  if (T.cells > 1) {
    const hall = 8;
    V.box(m, m, 0, m + a, m + a, hall, {
      t: c.t, l: withDoor(windows(c.l, seed, hall, false, opts), 5, 8, 4, DARK.l), r: windows(c.r, seed + 1, hall, true, opts),
    });
    V.box(m, m, hall, m + 8, m + 8, h, { t: c.t, l: windows(c.l, seed + 2, h - hall, false), r: windows(c.r, seed + 3, h - hall, true) });
    robotArm(V, m + 10, m + 5, hall, 2, frame);
    robotArm(V, m + 5, m + 10, hall, 2, frame + 2);
    return;
  }
  V.box(m, m, 0, m + a, m + a, h, { t: c.t, l: windows(c.l, seed, h, false, opts), r: windows(c.r, seed + 1, h, true, opts) });
  robotArm(V, m + (a >> 1) + 1, m + (a >> 1) + 1, h, h > 12 ? 2 : h > 6 ? 1 : 0, frame);
}

function modelAutomotive(V, T, h, seed) {
  const c = sectorRamp('automotive'), { m, a } = T;
  const roller = (i, z, top, wall) => (i >= 1 && i <= a - 2 && z < top ? (z % 2 ? 0xE2E3DC : 0xB8BDB7) : wall);
  if (T.cells > 1) {
    const hall = 9;
    V.box(m, m, 0, m + a, m + a, hall, {
      t: (u, v) => ((u + v) % 7 === 0 ? sink(c.t, 0.12) : c.t),
      l: windows(c.l, seed, hall, false, { from: 5, floor: 9, tall: 2 }),
      r: (i, z) => (i % 5 === 4 ? c.r : roller(i, z, 6, c.r)),
    });
    V.box(m, m, hall, m + 6, m + 6, h, { t: c.t, l: windows(c.l, seed + 2, h - hall, false), r: windows(c.r, seed + 3, h - hall, true) });
    car(V, m + 7, m + 1, hall, seed);
    car(V, m + 7, m + 5, hall, seed + 1);
    car(V, m + 7, m + 9, hall, seed + 2);
    return;
  }
  const doorTop = Math.min(h - 1, h > 10 ? 6 : 3);
  V.box(m, m, 0, m + a, m + a, h, {
    t: c.t,
    l: windows(c.l, seed, h, false, { from: doorTop }),
    r: (i, z) => (z >= doorTop ? windows(c.r, seed + 1, h, true, { from: doorTop })(i, z) : roller(i, z, doorTop, c.r)),
  });
  if (a >= 5) car(V, m, m + 1, h, seed);
}

function modelAI(V, T, h, seed, frame) {
  const base = sectorRamp('ai_ml'), { m, a } = T;
  const wall = sink(base.l, 0.5), shade = sink(base.r, 0.45);
  // Server racks: a dark monolith with no windows and rows of blinking lights.
  const rack = (c, salt) => (i, z) => {
    if (z === 0) return lift(c, 0.12);
    if (i % 2 === 0 || z % 2 === 0) return c;
    const w = hash(seed, salt, i, z);
    if (w % 3) return c;
    const on = (w >>> 8) % 4 !== frame % 4;
    if (!on) return lift(c, 0.1);
    return w % 2 ? 0x7DF5E4 : 0xD0B3FF;
  };
  const roof = (u, v) => (u % 4 === 0 || v % 4 === 0 ? base.l : base.t);
  V.box(m, m, 0, m + a, m + a, h, { t: roof, l: rack(wall, 1), r: rack(shade, 2) });
  if (T.cells > 1) {
    coolingFan(V, m + 2, m + 2, h, frame);
    coolingFan(V, m + 8, m + 2, h, frame + 1);
    coolingFan(V, m + 2, m + 8, h, frame + 1);
    coolingFan(V, m + 8, m + 8, h, frame);
  } else {
    coolingFan(V, m + (a >> 1) - 1, m + (a >> 1) - 1, h, frame);
  }
}

function modelIndustrial(V, T, h, seed, frame, emit) {
  const c = sectorRamp('industrial'), { m, a } = T;
  // A factory is wide and low; the chimney is what reaches the band's height.
  const walls = T.cells > 1 ? Math.round(h * 0.45) : Math.max(3, Math.round(h * 0.6));
  const from = Math.min(2, walls - 2);
  V.box(m, m, 0, m + a, m + a, walls, {
    t: c.t, l: windows(c.l, seed, walls, false, { from, floor: 4 }), r: windows(c.r, seed + 1, walls, true, { from, floor: 4 }),
  });
  // Sawtooth roof: north-light glass on the steep side of each tooth.
  const pitch = T.cells > 1 ? 4 : 3;
  for (let u = 0; u < a; u++) {
    const rise = 1 + (u % pitch);
    V.box(m + u, m, walls, m + u + 1, m + a, walls + rise, { t: lift(c.t, 0.14), l: c.l, r: GLASS_SHADE });
  }
  if (T.cells > 1) {
    chimney(V, m + 1, m + 1, walls, h + 8, emit);
    chimney(V, m + 6, m + 1, walls, h + 3, emit);
    V.cylinder(m + 3, m + 10, 2.4, walls, walls + 7, { t: STEEL.t, l: STEEL.l, r: STEEL.r });
  } else {
    chimney(V, m, m + a - 2, walls, h + (h > 5 ? 4 : 3), emit);
  }
}

function modelSoftware(V, T, h) {
  const base = sectorRamp('software'), { m, a } = T;
  // Curtain wall: glass tinted with the sector, broken by a light slab every third row.
  const curtain = (slab, glass) => (i, z) => (z % 3 === 2 ? slab : i % 4 === 3 ? sink(glass, 0.22) : glass);
  const glassL = mix(GLASS, base.l, 0.3), glassR = mix(GLASS_SHADE, base.r, 0.3);
  const roof = (u, v) => ((u + v) % 3 === 0 ? 0x6EB663 : 0x86C873);
  if (T.cells > 1) {
    const podium = 6;
    V.box(m, m, 0, m + a, m + a, podium, { t: roof, l: curtain(base.t, glassL), r: curtain(base.l, glassR) });
    V.box(m + 1, m + 1, podium, m + 9, m + 9, h + 2, { t: roof, l: curtain(base.t, glassL), r: curtain(base.l, glassR) });
    tree(V, m + 10, m + 3, podium, 1.5);
    tree(V, m + 3, m + 10, podium, 1.5);
    tree(V, m + 10, m + 10, podium, 1.9);
    antenna(V, m + 4, m + 4, h + 2, 3);
    return;
  }
  V.box(m, m, 0, m + a, m + a, h, { t: roof, l: curtain(base.t, glassL), r: curtain(base.l, glassR) });
  tree(V, m + (a >> 1), m + (a >> 1), h, a > 5 ? 1.7 : 1.4);
  if (h > 12) antenna(V, m + 1, m + 1, h, 3);
}

function modelDefense(V, T, h, seed) {
  const c = sectorRamp('defense'), { m, a } = T;
  // Hangar: a barrel vault with its door on the right. The radome or tower adds the height.
  const walls = T.cells > 1 ? Math.round(h * 0.42) : Math.max(2, Math.round(h * 0.5));
  const half = a / 2, arc = Math.round(a * 0.4);
  let crown = 0;
  for (let v = 0; v < a; v++) {
    const off = (v + 0.5 - half) / half;
    const top = walls + Math.round(arc * Math.sqrt(1 - off * off));
    crown = Math.max(crown, top);
    const door = (_, z) => (Math.abs(off) < 0.72 && z < top - 2 ? (v % 2 ? 0xD8DCD5 : 0xB2B7B0) : c.r);
    V.box(m, m + v, 0, m + a, m + v + 1, top, {
      t: u => (u % 3 === 0 ? sink(c.t, 0.16) : c.t),
      l: windows(c.l, seed, walls, false, { from: 1, floor: 3, tall: 1 }),
      r: door,
    });
  }
  if (T.cells > 1) {
    V.cylinder(m + 2.5, m + 2.5, 2.2, 0, h + 3, STEEL);
    V.cylinder(m + 2.5, m + 2.5, 3.2, h + 3, h + 6, { t: STEEL.t, l: GLASS, r: GLASS_SHADE });
    antenna(V, m + 2, m + 2, h + 6, 2);
    radome(V, m + 8, m + half, crown, 3);
  } else if (h > 12) {
    radome(V, m + half - 0.5, m + half, crown, 2.6);
  } else if (h > 5) {
    radome(V, m + half - 0.5, m + half, crown, 2);
  } else {
    antenna(V, m + (a >> 1), m + (a >> 1), crown, 3);
  }
}

function modelAgriculture(V, T, h) {
  const base = sectorRamp('agriculture'), { m, a } = T;
  // Farm: a timber barn under a roof in the sector colour, its wide gable facing right,
  // and a silo in the yard behind it, which is what reaches the band's height.
  const wood = { l: 0xCFA76B, r: 0x94754A };
  const roofT = lift(base.t, 0.08), roofL = base.l;
  const plank = (c, i) => (i % 2 ? c : sink(c, 0.12));
  const walls = T.cells > 1 ? Math.round(h * 0.34) : Math.max(2, Math.round(h * 0.4));
  const yard = T.cells > 1 ? 5 : 2;
  for (let v = 0; v < a; v++) {
    const top = walls + Math.round(Math.min(v + 1, a - v) * 0.75);
    const doorway = Math.abs(v + 0.5 - a / 2) < a / 4 + 0.5;
    V.box(m + yard, m + v, 0, m + a, m + v + 1, top, {
      t: roofT,
      l: (i, z) => (z >= walls ? roofL : plank(wood.l, i)),
      r: (_, z) => (doorway && z < Math.min(walls + 1, 6) ? 0x5A3C26 : plank(wood.r, v)),
    });
  }
  if (T.cells > 1) {
    silo(V, m + 2.2, m + 3.5, 2.2, h + 2);
    silo(V, m + 2.2, m + 9, 2.2, h - 2);
  } else {
    silo(V, m + 0.9, m + a / 2, 1.2, h + 1);
  }
}

const SECTOR_MODELS = {
  robotics: modelRobotics, automotive: modelAutomotive, ai_ml: modelAI, industrial: modelIndustrial,
  software: modelSoftware, defense: modelDefense, agriculture: modelAgriculture,
};

// A lab keeps its sector's roof colour and a small version of its rooftop object, so
// the Type axis (stone and columns) and the Sector axis stay independent.
function sectorProp(V, sector, u, v, z, tall, frame, emit) {
  switch (sector) {
    case 'robotics':    robotArm(V, u + 1, v + 1, z, tall ? 1 : 0, frame); break;
    case 'automotive':  V.box(u, v, z, u + 3, v + 2, z + 1, CAR_BODIES[1]); break;
    case 'ai_ml':       coolingFan(V, u, v, z, frame); break;
    case 'industrial':  chimney(V, u, v, z, z + (tall ? 6 : 4), emit); break;
    case 'software':    tree(V, u + 1, v + 1, z, 1.4); break;
    case 'defense':     radome(V, u + 1, v + 1, z, 1.6); break;
    case 'agriculture': silo(V, u + 1.5, v + 1.5, 1.2, z + 3); break;
  }
}

function modelLab(V, sector, T, h, seed, frame, emit) {
  const c = sectorRamp(sector), { m, a } = T;
  // The columned porch faces left; the right wall has tall, narrow windows.
  const porch = (i, z) => {
    if (z === 0) return STONE.t;
    if (z >= h - 1) return STONE.l;
    return i % 2 === 0 ? 0xFBF7EB : 0x5D6A72;
  };
  const tallWindows = (i, z) => (z >= 1 && z < h - 1 && onWindowColumn(i) && (z - 1) % 4 < 3 ? (hash(seed, i >> 2, z >> 2) % 4 ? 0x567688 : LIT_SHADE) : STONE.r);
  V.box(m, m, 0, m + a, m + a, h, { t: c.t, l: porch, r: tallWindows });

  // Pediment: a shallow gable over the front half of the roof, ridge running back along v.
  const front = Math.ceil(a / 2);
  for (let u = 0; u < a; u++) {
    const rise = Math.round(Math.min(u + 1, a - u) * (T.cells > 1 ? 0.5 : 0.6));
    if (rise > 0) V.box(m + u, m + a - front, h, m + u + 1, m + a, h + rise, { t: c.t, l: 0xF8F4E8, r: c.r });
  }
  const back = m + a - front - 1;
  if (T.cells > 1) {
    // The one global-sized lab gets a dome in its sector colour.
    V.cylinder(m + 4.5, m + 4.5, 3, h, h + 3, { t: c.t, l: 0xFBF7EB, r: STONE.r });
    V.sphere(m + 4.5, m + 4.5, h + 3, 3, c);
    sectorProp(V, sector, m + 9, m + 1, h, true, frame, emit);
  } else {
    sectorProp(V, sector, m + (a >> 1) - 1, Math.max(m, back - 2), h, h > 8, frame, emit);
  }
}

// ── Sprites ───────────────────────────────────────────────────────────────────

// h: three heights per band, so a street is not one building repeated. Bands stay apart,
// because height is the size class, but only as far as they must: every extra pixel of
// tower hides the lot behind it. The two-cell footprint already marks a global company.
const TIERS = {
  startup: { cells: 1, m: 1, a: 5, h: [4, 4, 5] },
  mid:     { cells: 1, m: 0, a: 7, h: [7, 8, 9] },
  big:     { cells: 1, m: 0, a: 7, h: [12, 13, 15] },
  global:  { cells: 2, m: 1, a: 13, h: [15, 17, 20] },
};

// Sectors with a moving part. The rest have a single frame.
const SPRITE_FRAMES = { robotics: 4, ai_ml: 4 };
const framesOf = sector => SPRITE_FRAMES[sector] ?? 1;

const SPRITE_CACHE = new Map();

function toCanvas(px, w, h) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  const img = g.createImageData(w, h);
  for (let i = 0; i < px.length; i++) {
    const c = px[i];
    if (c === -1) continue;
    img.data[i * 4] = (c >> 16) & 255; img.data[i * 4 + 1] = (c >> 8) & 255;
    img.data[i * 4 + 2] = c & 255; img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return cv;
}

function sprite({ sector, size, isLab, variant, isNew }, frame = 0) {
  frame %= framesOf(sector);
  const key = `${sector}|${size}|${isLab ? 1 : 0}|${variant}|${isNew ? 1 : 0}|${frame}`;
  let s = SPRITE_CACHE.get(key);
  if (s) return s;

  const T = TIERS[size] ?? TIERS.mid;
  const h = T.h[variant % T.h.length];
  const edge = T.cells * 8;
  const V = new Voxels(edge, edge, h + 34);
  const emit = [];
  const seed = hash(hashStr(sector), hashStr(size), variant);
  if (isLab) modelLab(V, sector, T, Math.max(h - (T.cells > 1 ? 4 : 0), 4), seed, frame, emit);
  else SECTOR_MODELS[sector](V, T, h, seed, frame, emit);
  if (isNew) pennant(V, T.m, T.m, h);

  const shot = raycast(V);
  const px = finish(shot);

  // Crop to the silhouette, keeping the anchor (voxel origin) so lots line up.
  let x0 = shot.sw, x1 = 0, y0 = shot.sh, y1 = 0;
  for (let y = 0; y < shot.sh; y++) for (let x = 0; x < shot.sw; x++) {
    if (px[y * shot.sw + x] === -1) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const w = x1 - x0 + 1, ht = y1 - y0 + 1;
  const crop = new Int32Array(w * ht);
  for (let y = 0; y < ht; y++) crop.set(px.subarray((y + y0) * shot.sw + x0, (y + y0) * shot.sw + x0 + w), y * w);
  const ox = shot.ox - x0, oy = shot.oy - y0;

  s = {
    w, h: ht, ox, oy, px: crop, cells: T.cells,
    canvas: toCanvas(crop, w, ht),
    footprint: { u0: T.m, v0: T.m, u1: T.m + T.a, v1: T.m + T.a, h },
    emit: emit.map(e => ({ x: ox + (e.u - e.v), y: oy + Math.round((e.u + e.v) / 2) - e.z })),
    pixels: crop.reduce((n, c) => n + (c !== -1 ? 1 : 0), 0),
    ghost: null, halo: null,
  };
  SPRITE_CACHE.set(key, s);
  return s;
}

// A building outside the current filter stays standing as a pale model: the city keeps
// its shape, and only the matches keep their colour.
function ghostOf(s) {
  if (s.ghost) return s.ghost;
  const px = s.px.map(c => {
    if (c === -1) return -1;
    const grey = 0.3 * ((c >> 16) & 255) + 0.59 * ((c >> 8) & 255) + 0.11 * (c & 255);
    const v = Math.round(92 + grey * 0.22);
    return (v << 16) | ((v + 6) << 8) | (v + 4);
  });
  return (s.ghost = toCanvas(px, s.w, s.h));
}

// A white rim drawn behind the hovered or selected building.
function haloOf(s) {
  if (s.halo) return s.halo;
  const w = s.w + 2, h = s.h + 2;
  const px = new Int32Array(w * h).fill(-1);
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
    if (s.px[y * s.w + x] === -1) continue;
    for (const [dx, dy] of [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [1, 1], [0, 2], [1, 2], [2, 2]]) {
      px[(y + dy) * w + x + dx] = 0xFFFFFF;
    }
  }
  return (s.halo = toCanvas(px, w, h));
}
