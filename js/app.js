// ── Config ───────────────────────────────────────────────────────────────────

// Muted, editorial palette harmonized with the Robonn brand (#293740 / #485F66).
// All tones share mid-lightness and low saturation so they sit beside the dark
// teal brand without clashing — Robotics anchors on the brand teal itself.
// Each sector also carries an `icon`: inline SVG inner-markup on a 24×24 grid,
// stroked with currentColor (fill none) so it inherits the surrounding text/glyph
// colour. Rendered everywhere sector appears via sectorIconSvg(), so the eight
// hard-to-distinguish colours are no longer the only cue — engineers scan by glyph.
// Sectors are DOMAINS — what an organisation works on. There is deliberately no
// "research" sector: that described what an entry *is*, not what it does, and it
// swallowed a third of the dataset, so "Robotics" showed 28 companies while DLR,
// Fraunhofer IPA, DFKI and both Bonn labs sat invisible behind a chip no robotics
// student would ever click. Company-vs-institute is the separate Type axis.
const SECTOR_CONFIG = {
  robotics:    { label: 'Robotics',            color: '#35707F', // brand teal
    icon: '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 8V4M9 4h6"/><circle cx="9.5" cy="13" r="1.1"/><circle cx="14.5" cy="13" r="1.1"/>' },
  automotive:  { label: 'Automotive',          color: '#BD7A4F', // terracotta
    icon: '<path d="M4 14l2-5h12l2 5v3H4z"/><path d="M5 14h14"/><circle cx="8" cy="17.5" r="1.5"/><circle cx="16" cy="17.5" r="1.5"/>' },
  ai_ml:       { label: 'AI & ML',             color: '#7B6A9C', // dusty plum
    icon: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/>' },
  industrial:  { label: 'Industrial',          color: '#5E7A99', // steel blue
    icon: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3.5M12 18v3.5M2.5 12h3.5M18 12h3.5M5.2 5.2l2.5 2.5M16.3 16.3l2.5 2.5M18.8 5.2l-2.5 2.5M7.7 16.3l-2.5 2.5"/>' },
  software:    { label: 'Software & Tech',     color: '#6F9966', // sage green
    icon: '<path d="M9 8l-4 4 4 4M15 8l4 4-4 4M13.5 6.5l-3 11"/>' },
  defense:     { label: 'Aerospace & Defense', color: '#A85550', // brick red
    icon: '<path d="M21 3L3 11l6 2 2 6 3-5.5 4-10.5z"/><path d="M9 13l5.5-5"/>' },
  agriculture: { label: 'Agriculture',         color: '#8B9A4E', // olive
    icon: '<path d="M12 21v-8M12 13c0-4 3-7 8-7 0 5-3 8-8 8M12 15c0-3-2-5-6-5 0 4 2 6 6 6"/>' },
};

// Single source of truth for sector glyphs — reused by chips, legend, list,
// popup badge, grid headers and the map markers.
function sectorIconSvg(sector, cls = 'sector-icon') {
  const cfg = SECTOR_CONFIG[sector];
  return cfg ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${cfg.icon}</svg>` : '';
}

const SIZE_CONFIG = [
  { key: 'startup', label: 'Startup', range: '<100',      radius: 3.5 },
  { key: 'mid',     label: 'Mid',     range: '100–1000',  radius: 5   },
  { key: 'big',     label: 'Large',   range: '1000–5000', radius: 7   },
  { key: 'global',  label: 'Global',  range: '5000+',     radius: 9.5 },
];

const SIZE_RADIUS = Object.fromEntries(SIZE_CONFIG.map(s => [s.key, s.radius]));
const SIZE_RANGE  = Object.fromEntries(SIZE_CONFIG.map(s => [s.key, s.range]));

const BONN = [50.7374, 7.0982];
let bonnRadiusKm = 100;   // adjustable via the distance slider
const COMPANY_RADIUS = 6.5;   // uniform — sector (colour) is the encoding, size shown in popup

// Institute markers are hollow rings, which read much lighter than a filled disc
// of the same radius, so they carry a size floor and extra ink to stay findable.
const INSTITUTE_MIN_R = 5;
const INST_WEIGHT = 2.2;
const INST_FILL = 0.38;

// Distance origin — defaults to Bonn (Robonn's home) but any student can pick
// their own university city, so "near me" works wherever they study. The list
// below seeds the picker; Bonn must stay first (it is the default origin).
const UNIVERSITY_CITIES = [
  { name: 'Bonn',           lat: 50.7374, lng: 7.0982 },
  { name: 'Aachen',         lat: 50.7753, lng: 6.0839 },
  { name: 'Cologne',        lat: 50.9375, lng: 6.9603 },
  { name: 'Dortmund',       lat: 51.5136, lng: 7.4653 },
  { name: 'Münster',        lat: 51.9607, lng: 7.6261 },
  { name: 'Frankfurt',      lat: 50.1109, lng: 8.6821 },
  { name: 'Darmstadt',      lat: 49.8728, lng: 8.6512 },
  { name: 'Mainz',          lat: 49.9929, lng: 8.2473 },
  { name: 'Kaiserslautern', lat: 49.4401, lng: 7.7491 },
  { name: 'Saarbrücken',    lat: 49.2402, lng: 6.9969 },
  { name: 'Stuttgart',      lat: 48.7758, lng: 9.1829 },
  { name: 'Karlsruhe',      lat: 49.0069, lng: 8.4037 },
  { name: 'Heidelberg',     lat: 49.3988, lng: 8.6724 },
  { name: 'Tübingen',       lat: 48.5216, lng: 9.0576 },
  { name: 'Freiburg',       lat: 47.9990, lng: 7.8421 },
  { name: 'Munich',         lat: 48.1351, lng: 11.5820 },
  { name: 'Nuremberg',      lat: 49.4521, lng: 11.0767 },
  { name: 'Berlin',         lat: 52.5200, lng: 13.4050 },
  { name: 'Hamburg',        lat: 53.5511, lng: 9.9937 },
  { name: 'Bremen',         lat: 53.0793, lng: 8.8017 },
  { name: 'Hannover',       lat: 52.3759, lng: 9.7320 },
  { name: 'Dresden',        lat: 51.0504, lng: 13.7373 },
  { name: 'Leipzig',        lat: 51.3397, lng: 12.3731 },
  { name: 'Ilmenau',        lat: 50.6831, lng: 10.9180 },
  { name: 'Magdeburg',      lat: 52.1205, lng: 11.6276 },
];
let origin = UNIVERSITY_CITIES[0];   // mutable: the active "near me" centre

// Companies and research institutes are kept in separate data files but share
// one schema, including `sector` — an institute carries the domain it works in,
// the same as a company, and the file it came from is what marks it an institute
// (surfaced as `isInstitute` and the Type filter). Everything on the map works
// off this merged list.
const ENTITIES = [
  ...COMPANIES,
  ...INSTITUTES.map(e => Object.assign(e, { isInstitute: true })),
];

// ── Haversine distance (km) ───────────────────────────────────────────────────

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Distance from the active origin is cached on each entity so the filter, the
// list and the popups all read one value. Recompute whenever the origin changes.
function recomputeDistances() {
  ENTITIES.forEach(c => { c.distKm = Math.round(haversine(c.lat, c.lng, origin.lat, origin.lng)); });
}

// ── Job-seeker helpers ────────────────────────────────────────────────────────

// Research institutes take thesis & working-student (HiWi) applicants by nature,
// so we surface that as a reliable, derived signal — no per-entity data needed.
function isStudentFriendly(c) { return !!c.isInstitute; }

// One click from a dot to actual openings. Institutes rarely post on LinkedIn,
// so bias their search toward the roles students can take; companies go straight
// to a LinkedIn jobs search scoped to Germany.
function jobsUrl(c) {
  if (isStudentFriendly(c)) {
    const q = `"${c.name}" (thesis OR Werkstudent OR HiWi OR PhD)`;
    return 'https://www.google.com/search?q=' + encodeURIComponent(q);
  }
  return 'https://www.linkedin.com/jobs/search/?keywords='
    + encodeURIComponent(c.name) + '&location=Germany';
}

// Name the roles link for what it actually opens. For a lab that is a search for
// thesis / HiWi / PhD openings — the door a student actually walks through —
// so calling both "Find roles" hid the more useful half.
const jobsLabel = (c) => (isStudentFriendly(c) ? 'Thesis &amp; HiWi roles' : 'Find roles');

const escapeAttr = s => String(s).replace(/"/g, '&quot;');

// Contributor-supplied strings (name, city, description, region prose) are
// interpolated into HTML all over this file. Anyone can open a PR adding an
// entry, so every one of those values goes through esc() — a stray "<" in a
// company name should render as text, never as markup.
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC_MAP[c]);

// Popup is built on demand (function form passed to bindPopup) so the distance
// line always reflects the current origin without re-binding markers.
function popupHtml(c) {
  const cfg = SECTOR_CONFIG[c.sector];
  const websiteHtml = c.website
    ? `<a href="${escapeAttr(c.website)}" target="_blank" rel="noopener noreferrer" class="co-link">Visit website &rarr;</a>`
    : '';
  const jobsHtml =
    `<a href="${escapeAttr(jobsUrl(c))}" target="_blank" rel="noopener noreferrer" class="co-link co-jobs">${jobsLabel(c)} &#8599;</a>`;
  return `
    <div class="co-popup">
      <div class="co-head">
        <span class="co-name">${esc(c.name)}</span>
        <span class="co-badge" style="background:${cfg.color}">${sectorIconSvg(c.sector, 'sector-icon badge-icon')}${cfg.label}</span>
      </div>
      <div class="co-meta">
        ${esc(c.city)} &middot; ${c.isInstitute ? 'Research lab' : 'Company'}
        &middot; ${esc(SIZE_RANGE[c.size] ?? c.size)} staff
        <span class="co-dist">${c.distKm} km from ${esc(origin.name)}</span>
      </div>
      <p class="co-desc">${esc(c.description)}</p>
      <div class="co-footer">${jobsHtml}${websiteHtml}</div>
    </div>`;
}

// ── Map ───────────────────────────────────────────────────────────────────────

// Standard Web Mercator (Leaflet default) so the whole world renders and zooms
// from globe to street — the projection real tile basemaps use.
const map = L.map('map', {
  center: [51.0, 10.2], zoom: 6,
  minZoom: 2, maxZoom: 19,   // street level — the markers sit on real HQ buildings
  worldCopyJump: true,
  attributionControl: true,   // Esri / OpenStreetMap require attribution
});

// Zoom controls top-right, sitting under the Sector Grid button
map.zoomControl.setPosition('topright');

// ── Basemap: Esri Dark Gray Canvas ────────────────────────────────────────────
// A world-wide dark canvas basemap, designed to sit under data: quiet geometry,
// no competing colour, so the sector dots and the Bundesland overlay carry the
// eye. Keyless — no signup, no token in a public repo.
//
// We were on CARTO Dark Matter, but CARTO moved their basemap CDN behind an API
// key and now stamps "API KEY REQUIRED" diagonally across every tile served
// without one, which defaced the whole live map. Anything on basemaps.cartocdn.com
// is off the table unless the club registers a key.
//
// Esri splits geometry and labels into two layers, so labels draw on top of the
// ground but still under our overlay (statePane, z 210).
const ESRI_ATTR = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, '
  + '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Dark Gray Canvas has no imagery past z16. maxNativeZoom lets Leaflet upscale
// the z16 tile for the street-level zooms instead of requesting tiles that come
// back as a light-grey "Map data not yet available" placeholder — the ground
// softens as you close in, but the markers stay crisp vectors on their real HQ.
const ESRI_TILE_OPTS = { maxZoom: 19, maxNativeZoom: 16, attribution: ESRI_ATTR };

L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  ESRI_TILE_OPTS).addTo(map);

// City / region names, as a separate transparent overlay.
L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
  { ...ESRI_TILE_OPTS, attribution: '' }).addTo(map);

// Overlay panes sit above the tiles (z 200) but below the markers (paths in the
// overlayPane at z 400), so the interactive states never cover the dots.
map.createPane('statePane');
map.getPane('statePane').style.zIndex = 210;

map.createPane('borderPane');
map.getPane('borderPane').style.zIndex = 215;
map.getPane('borderPane').style.pointerEvents = 'none';

// germany.js / bundeslaender.js are still the topology-true layers built by
// scripts/build-geo.mjs (the outline is the exact dissolve of the states); here
// they form the interactive state-highlight overlay on top of the basemap.
const germanyFeature = GERMANY_GEO;

// Bundesländer — translucent so the dark basemap reads through, with light
// borders marking the internal divisions; interactive, with persistent selection.
const STATE_BASE     = { fillColor: '#9FB4C0', fillOpacity: 0.06, color: 'rgba(180,200,212,0.45)', weight: 0.8, lineJoin: 'round', lineCap: 'round' };
const STATE_HOVER    = { fillColor: '#CFE0EA', fillOpacity: 0.16, color: 'rgba(214,228,238,0.85)', weight: 1.3, lineJoin: 'round', lineCap: 'round' };
const STATE_SELECTED = { fillColor: '#DCE8F0', fillOpacity: 0.24, color: '#E7EDF1', weight: 1.8, lineJoin: 'round', lineCap: 'round' };

const stateLayersByRid = {};
let selectedState = null;
let selectedRegion = null;   // rid of the clicked Bundesland — scopes markers & chips

function selectState(rid) {
  if (selectedState) { selectedState.setStyle(STATE_BASE); selectedState = null; }
  const layer = rid ? stateLayersByRid[rid] : null;
  if (layer) { layer.setStyle(STATE_SELECTED); layer.bringToFront(); selectedState = layer; }
}

const statesLayer = L.geoJSON(BUNDESLAENDER_GEO, {
  pane: 'statePane',
  smoothFactor: 0.3,
  style: STATE_BASE,
  onEachFeature: (feat, layer) => {
    const { name, rid } = feat.properties;
    if (rid) stateLayersByRid[rid] = layer;
    layer.bindTooltip(name, { sticky: true, direction: 'top', className: 'region-tooltip' });
    layer.on('mouseover', () => { if (layer !== selectedState) layer.setStyle(STATE_HOVER); });
    layer.on('mouseout',  () => { if (layer !== selectedState) layer.setStyle(STATE_BASE); });
    layer.on('click', e => {
      const region = REGIONS.find(r => r.id === rid);
      if (!region) return;
      L.DomEvent.stopPropagation(e);
      selectedRegion === rid ? closePanel() : openPanel(region);   // click again to clear
    });
  },
}).addTo(map);

// Crisp national outline on top — a light hairline so Germany reads as framed
// against the dark basemap.
L.geoJSON(germanyFeature, {
  pane: 'borderPane',
  interactive: false,
  smoothFactor: 0.3,
  style: { fillOpacity: 0, color: 'rgba(223,233,240,0.7)', weight: 1.4, lineJoin: 'round', lineCap: 'round' },
}).addTo(map);

// ── Bonn range circle (hidden until Near Bonn activated) ──────────────────────

const bonnCircle = L.circle(BONN, {
  radius: bonnRadiusKm * 1000,   // km → metres
  color: 'rgba(223,233,240,0.85)', weight: 1.5, dashArray: '6 5',
  fillColor: '#9FB4C0', fillOpacity: 0.08,
  interactive: false,
});

// ── Filter bar (multi-select) ─────────────────────────────────────────────────
// An empty set means "All". Selecting sectors shows only those; "All" clears.

const activeSectors = new Set();
// Empty means "both", mirroring the sector chips.
const activeTypes = new Set();

const typeOf = (c) => (c.isInstitute ? 'institute' : 'company');

const allFilters = [
  ['all', 'All', '#64748b'],
  ...Object.entries(SECTOR_CONFIG).map(([k, v]) => [k, v.label, v.color]),
];

allFilters.forEach(([sector, label, color]) => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.style.setProperty('--clr', color);
  btn.dataset.sector = sector;

  if (sector !== 'all') {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'chip-icon';        // colour via --clr in CSS; flips to white when .active
    iconWrap.innerHTML = sectorIconSvg(sector);
    btn.appendChild(iconWrap);
  }

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;
  btn.appendChild(labelSpan);

  // Filled by updateChipCounts() — how many entities this chip would show under
  // whatever spatial filters are currently active.
  const countSpan = document.createElement('span');
  countSpan.className = 'chip-count';
  btn.appendChild(countSpan);

  btn.addEventListener('click', () => {
    if (sector === 'all') activeSectors.clear();
    else activeSectors.has(sector) ? activeSectors.delete(sector) : activeSectors.add(sector);
    applyFilters();
  });
  document.getElementById('filter-btns').appendChild(btn);
});

document.querySelectorAll('#type-btns .type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.dataset.type;
    activeTypes.has(t) ? activeTypes.delete(t) : activeTypes.add(t);
    applyFilters();
  });
});

// When the sector strip overflows, clicking a partly-visible chip makes the
// browser scroll it into view — sliding the whole row ~127 px out from under the
// cursor, so the chip you just clicked is no longer where you clicked it.
//
// That scroll lands after the click handler returns, so restoring scrollLeft in
// applyFilters() is too early to help. Suppress the implicit focus that causes
// it instead, then focus deliberately with preventScroll so keyboard users still
// get a focus ring. Tab-focus is untouched and still scrolls, which is what a
// keyboard user actually wants.
let stripScrollBeforeClick = null;
document.getElementById('filter-btns').addEventListener('mousedown', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  e.preventDefault();
  btn.focus({ preventScroll: true });
}, true);

// ── Reset ─────────────────────────────────────────────────────────────────────
// "All" only clears sectors, so a user who has drilled into a Bundesland and a
// 50 km radius has no single way back. This is it — one control that clears
// every filter at once, shown only when there is something to undo.

const resetBtn = document.getElementById('filter-reset');

function anyFilterActive() {
  return activeSectors.size > 0 || activeTypes.size > 0 || !!selectedRegion || bonnFilterActive;
}

resetBtn.addEventListener('click', () => {
  activeSectors.clear();
  activeTypes.clear();
  closePanel();       // clears selectedRegion
  deactivateBonn();   // clears the distance filter (leaves the repaint to us)
  applyFilters();
});

// Spatial filters — reused by the chip counts and the sector grid.
// The distance filter and a selected region are mutually exclusive (one focus at a time).
function passesOrigin(c) {
  return !bonnFilterActive || c.distKm <= bonnRadiusKm;
}
function passesRegion(c) {
  return !selectedRegion || c.state === selectedRegion;
}
function passesType(c) {
  return activeTypes.size === 0 || activeTypes.has(typeOf(c));
}

// Single source of truth: an entity is shown only if it passes every active
// filter. Add a new filter here and the whole pipeline picks it up.
function isVisible(c) {
  const sectorOk = activeSectors.size === 0 || activeSectors.has(c.sector);
  return sectorOk && passesType(c) && passesOrigin(c) && passesRegion(c);
}

// Show every chip its count under the current spatial filters, so you can see
// where the data is before clicking. Sectors with nothing in range dim in place
// instead of disappearing — a chip that vanishes takes the neighbouring chips'
// positions with it, and the target you were aiming at moves out from under the
// cursor. A selected sector never dims, so an active filter can't look disabled.
function updateChipCounts() {
  let inScope = 0;
  document.querySelectorAll('#filter-btns .filter-btn').forEach(b => {
    const s = b.dataset.sector;
    if (s === 'all') return;
    const n = ENTITIES.filter(c => c.sector === s && passesType(c) && passesOrigin(c) && passesRegion(c)).length;
    b.querySelector('.chip-count').textContent = n;
    b.classList.toggle('chip-empty', n === 0 && !activeSectors.has(s));
    inScope += n;
  });
  // "All" shows what clearing the sector filter would leave you with.
  const allBtn = document.querySelector('#filter-btns .filter-btn[data-sector="all"]');
  if (allBtn) allBtn.querySelector('.chip-count').textContent = inScope;

  // Each type chip counts what it would show under the *other* active filters,
  // so "Labs 37" next to an active Robotics chip means 37 robotics labs.
  document.querySelectorAll('#type-btns .type-btn').forEach(b => {
    const t = b.dataset.type;
    const sectorOk = (c) => activeSectors.size === 0 || activeSectors.has(c.sector);
    const n = ENTITIES.filter(c => typeOf(c) === t && sectorOk(c) && passesOrigin(c) && passesRegion(c)).length;
    b.querySelector('.chip-count').textContent = n;
    b.classList.toggle('active', activeTypes.has(t));
  });
}

// Every entity is its own marker — no clustering. Each dot keeps its sector
// colour, size and type; dense cities (Munich, Stuttgart, Berlin) overlap until
// you zoom in, which is the honest tradeoff for never hiding the encoding.
const markerLayer = L.layerGroup().addTo(map);

// One render pass: add/remove each marker based on isVisible()
function refreshMarkers() {
  allMarkers.forEach(({ marker, company }) => {
    const vis = isVisible(company);
    if (vis && !markerLayer.hasLayer(marker)) markerLayer.addLayer(marker);
    else if (!vis && markerLayer.hasLayer(marker)) markerLayer.removeLayer(marker);
  });
}

function applyFilters() {
  // Pin the strip's scroll offset across the repaint — see stripScrollBeforeClick.
  const strip = document.getElementById('filter-btns');
  const keepScroll = stripScrollBeforeClick ?? strip.scrollLeft;
  stripScrollBeforeClick = null;

  // Button active states ("All" active only when nothing is selected)
  document.querySelectorAll('#filter-btns .filter-btn').forEach(b => {
    const s = b.dataset.sector;
    b.classList.toggle('active', s === 'all' ? activeSectors.size === 0 : activeSectors.has(s));
  });
  refreshMarkers();
  updateChipCounts();
  resetBtn.hidden = !anyFilterActive();
  strip.scrollLeft = keepScroll;   // undo any scroll-into-view the click caused
  syncUrl();
  updateStats();
  if (listVisible) buildList();
}

// ── Shareable state ───────────────────────────────────────────────────────────
// Every filter lives in the query string, so a link pasted into Discord restores
// exactly what the sender was looking at — not just the sector. syncUrl() runs
// from each mutation path; readUrl() replays a link once on load through those
// same public helpers, so there is one code path per state rather than two.
//
//   s  sectors, comma-separated      r  Bundesland id
//   o  origin city (name)            d  distance km — presence means "filter on"
//   v  open overlay: list | grid

let booting = true;   // suppress URL writes while readUrl() replays a link

function syncUrl() {
  if (booting) return;
  const url = new URL(window.location);
  const p = url.searchParams;
  const set = (k, v) => (v === null || v === undefined || v === '') ? p.delete(k) : p.set(k, v);

  set('s', activeSectors.size ? [...activeSectors].join(',') : null);
  set('t', activeTypes.size ? [...activeTypes].join(',') : null);
  set('r', selectedRegion);
  // The default origin is implied — only a deliberate change is worth a param.
  set('o', origin === UNIVERSITY_CITIES[0] ? null : origin.name);
  set('d', bonnFilterActive ? bonnRadiusKm : null);
  set('v', listVisible ? 'list' : gridVisible ? 'grid' : null);

  history.replaceState(null, '', url);
}

// Select exactly one sector (used by the sector-grid cards)
function setOnlySector(sector) {
  activeSectors.clear();
  activeSectors.add(sector);
  applyFilters();
}

// ── Company markers ───────────────────────────────────────────────────────────

const allMarkers = [];

recomputeDistances();   // seed c.distKm for the default origin (Bonn) before first paint

ENTITIES.forEach(c => {
  const cfg = SECTOR_CONFIG[c.sector];
  if (!cfg) return;

  // Radius encodes headcount; fill encodes type — filled disc = company,
  // hollow ring = research institute. Pure vector markers: crisp, lightweight,
  // and centred exactly on the coordinate. Sector is read from the category row.
  //
  // Institutes need a floor and a heavier stroke. Once lab sizes were corrected
  // to the group's real headcount, most became "startup" (<100) — true, but a
  // 3.5 px hollow ring at 22% fill is a ghost, and "show me the robotics labs"
  // rendered as 37 near-invisible dots. A ring reads far lighter than a filled
  // disc of the same radius, so it gets INSTITUTE_MIN_R and more ink to sit at
  // the same visual weight.
  const isInst = c.isInstitute;
  const base = SIZE_RADIUS[c.size] ?? COMPANY_RADIUS;
  const r = isInst ? Math.max(base, INSTITUTE_MIN_R) : base;
  const marker = L.circleMarker([c.lat, c.lng], {
    radius: r,
    fillColor: cfg.color,
    color: isInst ? cfg.color : 'rgba(255,255,255,0.92)',
    weight: isInst ? INST_WEIGHT : 1.5,
    fillOpacity: isInst ? INST_FILL : 0.95,
    bubblingMouseEvents: false,   // clicking a marker shouldn't close the region panel
  });

  // Function-form content: rebuilt each open so the distance line tracks the
  // current origin without re-binding the marker.
  marker.bindPopup(() => popupHtml(c), { maxWidth: 285 });

  marker.on('mouseover', function () {
    this.setStyle({ weight: 3.2, fillOpacity: isInst ? 0.55 : 1 });
    this.bringToFront();
  });
  marker.on('mouseout', function () {
    this.setStyle({ weight: isInst ? INST_WEIGHT : 1.5, fillOpacity: isInst ? INST_FILL : 0.95 });
  });

  allMarkers.push({ marker, company: c });
});

// ── De-collision: fan out markers that share one building ─────────────────────
// Several research groups (3 Uni Bonn labs at one CS building, both Kaiserslautern
// Fraunhofers at Fraunhofer-Platz 1, …) and a couple of startups sit at the exact
// same address, so their markers would stack and only the topmost stays clickable.
// The data keeps the true coordinate — distance, the list and "locate" all read
// c.lat/c.lng — and we nudge only the *rendered* marker onto a small ring so each
// entity is individually hoverable. ~22 m radius: sub-pixel (invisible) at country
// zoom, clearly separated in the street-level zooms where the precision matters.
(function fanOutColocated() {
  const groups = new Map();
  allMarkers.forEach(m => {
    const key = m.company.lat.toFixed(4) + ',' + m.company.lng.toFixed(4);
    (groups.get(key) ?? groups.set(key, []).get(key)).push(m);
  });
  const R = 22;   // metres from the shared point
  for (const members of groups.values()) {
    if (members.length < 2) continue;
    members.forEach(({ marker, company }, i) => {
      const angle = (2 * Math.PI * i) / members.length - Math.PI / 2;
      const dLat = (R * Math.sin(angle)) / 111320;
      const dLng = (R * Math.cos(angle)) / (111320 * Math.cos(company.lat * Math.PI / 180));
      marker.setLatLng([company.lat + dLat, company.lng + dLng]);
    });
  }
})();

// ── "Near me" distance filter (origin = Bonn by default, any campus optional) ──

let bonnFilterActive = false;

const bonnControl = document.getElementById('bonn-control');
const originSelect = document.getElementById('origin-city');

// A neutral, labelled pin marks the active origin (same for every city).
function makeOriginPin(o) {
  return L.marker([o.lat, o.lng], {
    interactive: false,
    icon: L.divIcon({
      className: '',
      html: `<div class="bonn-pin"><span class="bonn-dot"></span><span class="bonn-label">${esc(o.name)}</span></div>`,
      iconSize: [0, 0],
      iconAnchor: [6, 6],
    }),
  });
}

// The origin pin currently on the map.
let originLayer = null;
function showOriginMarker() {
  if (originLayer) map.removeLayer(originLayer);
  originLayer = makeOriginPin(origin);
  originLayer.addTo(map);
}
function hideOriginMarker() {
  if (originLayer) { map.removeLayer(originLayer); originLayer = null; }
}

function collapseBonnSlider() {
  bonnControl.classList.remove('expanded');   // hide controls, leave the filter as-is
}

// Turn the distance filter off without refreshing (caller refreshes)
function deactivateBonn() {
  if (!bonnFilterActive) return;
  bonnFilterActive = false;
  document.getElementById('bonn-filter').classList.remove('active');
  bonnControl.classList.remove('expanded');
  map.removeLayer(bonnCircle);
  hideOriginMarker();
}

// Pure on/off toggle: lit pin always means the filter is on; clicking it always
// flips that state (no hidden modes). The controls follow the filter.
function toggleBonnFilter() {
  bonnFilterActive = !bonnFilterActive;
  document.getElementById('bonn-filter').classList.toggle('active', bonnFilterActive);
  bonnControl.classList.toggle('expanded', bonnFilterActive);   // controls show iff on

  if (bonnFilterActive) {
    if (selectedRegion) closePanel();   // one spatial focus at a time
    bonnCircle.addTo(map);
    showOriginMarker();
    map.flyToBounds(bonnCircle.getBounds(), { padding: [40, 40], duration: 1 });
  } else {
    map.removeLayer(bonnCircle);
    hideOriginMarker();
  }
  refreshMarkers();   // out-of-range entities are hidden, in line with the sector filter
  updateChipCounts();
  resetBtn.hidden = !anyFilterActive();
  syncUrl();
  updateStats();
  if (listVisible) buildList();
}

document.getElementById('bonn-filter').addEventListener('click', toggleBonnFilter);

// Click anywhere outside the control collapses the slider (filter stays as-is)
document.addEventListener('click', e => {
  if (bonnControl.classList.contains('expanded') && !bonnControl.contains(e.target)) {
    collapseBonnSlider();
  }
});

// Origin picker — seed from UNIVERSITY_CITIES (Bonn default/first)
UNIVERSITY_CITIES.forEach((c, i) => {
  originSelect.insertAdjacentHTML('beforeend', `<option value="${i}">${esc(c.name)}</option>`);
});

originSelect.addEventListener('change', () => {
  origin = UNIVERSITY_CITIES[+originSelect.value] || UNIVERSITY_CITIES[0];
  document.getElementById('bonn-filter').title = `Filter by distance from ${origin.name}`;
  recomputeDistances();
  bonnCircle.setLatLng([origin.lat, origin.lng]);
  map.closePopup();   // an open popup's distance line would be stale
  if (bonnFilterActive) {
    showOriginMarker();
    map.flyToBounds(bonnCircle.getBounds(), { padding: [40, 40], duration: 1 });
    refreshMarkers();
    updateChipCounts();
    updateStats();
  }
  syncUrl();
  if (listVisible) buildList();
});

// Distance slider (only visible while the filter is on) — circle, filter and count update live
const bonnRange = document.getElementById('bonn-range');
const bonnKmLabel = document.getElementById('bonn-km');

bonnRange.addEventListener('input', () => {
  bonnRadiusKm = +bonnRange.value;
  bonnKmLabel.textContent = `${bonnRadiusKm} km`;
  bonnCircle.setRadius(bonnRadiusKm * 1000);
  refreshMarkers();
  updateChipCounts();
  syncUrl();
  updateStats();
  if (listVisible) buildList();
});

// ── Region panel ──────────────────────────────────────────────────────────────

const panel        = document.getElementById('region-panel');
const panelContent = document.getElementById('panel-content');
const legend       = document.getElementById('legend');

document.getElementById('panel-close').addEventListener('click', closePanel);
map.on('click', closePanel);

panelContent.addEventListener('click', e => {
  const btn = e.target.closest('[data-rid]');
  if (btn) {
    const r = REGIONS.find(r => r.id === btn.dataset.rid);
    if (r) openPanel(r);
  }
});

function openPanel(region) {
  deactivateBonn();              // region and Near Bonn are mutually exclusive
  selectedRegion = region.id;    // scope markers & chips to this Bundesland

  const companies = ENTITIES.filter(c => c.state === region.id);
  const total = companies.length;
  const byS = {};
  companies.forEach(c => { byS[c.sector] = (byS[c.sector] || 0) + 1; });

  const barsHtml = Object.entries(SECTOR_CONFIG)
    .filter(([s]) => byS[s])
    .sort((a, b) => (byS[b[0]] || 0) - (byS[a[0]] || 0))
    .map(([s, cfg]) => {
      const pct = total ? Math.round((byS[s] / total) * 100) : 0;
      return `<div class="sb-row">
        <span class="sb-lbl">${esc(cfg.label)}</span>
        <div class="sb-track"><div class="sb-fill" style="width:${pct}%;background:${cfg.color}"></div></div>
        <span class="sb-num">${byS[s]}</span>
      </div>`;
    }).join('');

  const connHtml = region.connections
    .map(id => REGIONS.find(r => r.id === id)).filter(Boolean)
    .map(r => `<button class="conn-tag" data-rid="${escapeAttr(r.id)}">${esc(r.name)}</button>`)
    .join('');

  panelContent.innerHTML = `
    <div class="panel-name">${esc(region.name)}</div>
    <div class="panel-tagline">${esc(region.tagline)}</div>
    <p class="panel-overview">${esc(region.overview)}</p>
    <div class="panel-sec">SECTOR BREAKDOWN &mdash; ${total} companies</div>
    ${barsHtml || '<p class="panel-empty">No companies tracked yet.</p>'}
    <div class="panel-sec">KEY STRENGTHS</div>
    <ul class="panel-strengths">${region.strengths.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <div class="panel-sec">CONNECTED REGIONS</div>
    <div class="panel-conns">${connHtml}</div>
  `;

  selectState(region.id);
  panel.classList.remove('panel-hidden');
  legend.classList.add('shifted');

  refreshMarkers();          // show only this region's entities
  updateChipCounts();        // chips scope to what exists here
  resetBtn.hidden = !anyFilterActive();
  syncUrl();
  updateStats();
  if (listVisible) buildList();
}

function closePanel() {
  if (selectedRegion) {
    selectedRegion = null;
    refreshMarkers();
    updateChipCounts();
    resetBtn.hidden = !anyFilterActive();
    updateStats();
    if (listVisible) buildList();
  }
  syncUrl();
  selectState(null);
  panel.classList.add('panel-hidden');
  legend.classList.remove('shifted');
}

// ── Small multiples ───────────────────────────────────────────────────────────

const GEO = { W: 5.7, E: 15.3, S: 47.1, N: 55.2 };
const SVG_W = 200, SVG_H = 186;

function project(lat, lng, pad = 10) {
  const x = pad + ((lng - GEO.W) / (GEO.E - GEO.W)) * (SVG_W - pad * 2);
  const y = pad + ((GEO.N - lat) / (GEO.N - GEO.S)) * (SVG_H - pad * 2);
  return [+x.toFixed(1), +y.toFixed(1)];
}

// Precise Germany outline ([lat,lng]) from the boundary data, for the mini-maps
const GERMANY_OUTLINE = germanyFeature.geometry.coordinates[0][0].map(([lng, lat]) => [lat, lng]);
const germanyPoints = GERMANY_OUTLINE.map(([lat, lng]) => project(lat, lng).join(',')).join(' ');

function buildGrid() {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';

  Object.entries(SECTOR_CONFIG).forEach(([sector, cfg]) => {
    // Respect active spatial filters so the preview matches the resulting map
    const companies = ENTITIES.filter(c => c.sector === sector && passesOrigin(c) && passesRegion(c));

    const dots = companies.map(c => {
      const [x, y] = project(c.lat, c.lng);
      const r = 3.2;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${cfg.color}" fill-opacity="0.88"
        stroke="white" stroke-width="0.8"><title>${esc(c.name)} · ${esc(c.city)}</title></circle>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'mini-card';
    card.style.setProperty('--sector-clr', cfg.color);
    card.innerHTML = `
      <div class="mini-header">
        <span class="mini-icon" style="color:${cfg.color}">${sectorIconSvg(sector)}</span>
        <span class="mini-label">${cfg.label}</span>
        <span class="mini-count">${companies.length}</span>
      </div>
      <svg class="mini-svg" viewBox="0 0 ${SVG_W} ${SVG_H}" xmlns="http://www.w3.org/2000/svg">
        <polygon points="${germanyPoints}" class="germany-poly"/>
        ${dots}
      </svg>`;

    card.addEventListener('click', () => {
      toggleGrid(false);
      setOnlySector(sector);
      const bounds = companies.map(c => [c.lat, c.lng]);
      if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    });

    container.appendChild(card);
  });
}

let gridVisible = false;

function toggleGrid(show) {
  gridVisible = (show !== undefined) ? show : !gridVisible;
  if (gridVisible) toggleList(false);   // grid and list overlays are mutually exclusive
  document.getElementById('grid-overlay').classList.toggle('grid-hidden', !gridVisible);
  document.body.classList.toggle('grid-active', gridVisible);
  document.getElementById('grid-toggle').classList.toggle('active', gridVisible);
  if (gridVisible) buildGrid();
  syncUrl();
}

document.getElementById('grid-toggle').addEventListener('click', () => {
  deactivateBonn();   // grid is a clean Germany-wide overview — clear spatial filters
  closePanel();       // also clears any selected region
  refreshMarkers();   // ensure the map reflects the cleared filters on return
  updateChipCounts();
  updateStats();
  toggleGrid(true);   // buildGrid now sees no spatial filters → full Germany view
});
document.getElementById('grid-close').addEventListener('click',  () => toggleGrid(false));

// ── List / table view ─────────────────────────────────────────────────────────
// A scannable, sortable table of every currently-visible entity — the surface
// for working through applications. It shares isVisible(), so it tracks the very
// same filters as the map.

let listVisible = false;
let listRows = [];                               // current rows, in display order
let listSort = { key: 'distKm', dir: 1 };        // default: closest first
const SIZE_ORDER = { startup: 0, mid: 1, big: 2, global: 3 };

const LIST_COLS = [
  { key: 'name',   label: 'Company' },
  { key: 'sector', label: 'Sector' },
  { key: 'city',   label: 'City' },
  { key: 'distKm', label: 'Distance' },
  { key: 'roles',  label: 'Roles', sortable: false },
];

function listCompare(a, b) {
  const k = listSort.key;
  let av, bv;
  if (k === 'size')                       { av = SIZE_ORDER[a.size] ?? 0; bv = SIZE_ORDER[b.size] ?? 0; }
  else if (k === 'distKm' || k === 'founded') { av = a[k]; bv = b[k]; }
  else                                    { av = String(a[k] ?? '').toLowerCase(); bv = String(b[k] ?? '').toLowerCase(); }
  if (av < bv) return -listSort.dir;
  if (av > bv) return  listSort.dir;
  return 0;
}

function buildList() {
  const container = document.getElementById('list-container');
  const q = (document.getElementById('list-search').value || '').trim().toLowerCase();

  listRows = ENTITIES.filter(isVisible);
  if (q) listRows = listRows.filter(c =>
    (`${c.name} ${c.city} ${c.description}`).toLowerCase().includes(q));
  listRows.sort(listCompare);

  const ind = key => listSort.key === key ? `<span class="sort-ind">${listSort.dir > 0 ? '▲' : '▼'}</span>` : '';
  const head = LIST_COLS.map(col => {
    const lbl = col.key === 'distKm' ? `From ${origin.name}` : col.label;
    return col.sortable === false
      ? `<th class="nosort">${lbl}</th>`
      : `<th data-key="${col.key}">${lbl}${ind(col.key)}</th>`;
  }).join('');

  const body = listRows.map((c, i) => {
    const cfg = SECTOR_CONFIG[c.sector] || { label: c.sector, color: '#888' };
    const roles = `<a href="${escapeAttr(jobsUrl(c))}" target="_blank" rel="noopener noreferrer" class="co-link" onclick="event.stopPropagation()">${jobsLabel(c)} &#8599;</a>`;
    return `<tr data-i="${i}">
      <td><span class="list-name">${esc(c.name)}</span></td>
      <td><span class="list-sector" style="color:${cfg.color}">${sectorIconSvg(c.sector)}<span class="list-sector-lbl">${esc(cfg.label)}</span></span></td>
      <td>${esc(c.city)}</td>
      <td class="list-dist">${c.distKm} km</td>
      <td>${roles}</td>
    </tr>`;
  }).join('');

  container.innerHTML = listRows.length
    ? `<table class="list-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
    : `<p class="list-empty">No companies match the current filters.</p>`;
}

function locateEntity(c) {
  toggleList(false);
  const entry = allMarkers.find(m => m.company === c);
  if (!entry) return;
  if (!markerLayer.hasLayer(entry.marker)) markerLayer.addLayer(entry.marker);
  // Fly to the entity and open its popup once the move settles.
  map.flyTo([c.lat, c.lng], Math.max(map.getZoom(), 9), { duration: 0.8 });
  map.once('moveend', () => entry.marker.openPopup());
}

function toggleList(show) {
  listVisible = (show !== undefined) ? show : !listVisible;
  if (listVisible) toggleGrid(false);   // grid and list overlays are mutually exclusive
  document.getElementById('list-overlay').classList.toggle('grid-hidden', !listVisible);
  document.body.classList.toggle('list-active', listVisible);
  document.getElementById('list-toggle').classList.toggle('active', listVisible);
  if (listVisible) buildList();
  syncUrl();
}

// Open the list without disturbing filters — unlike the grid, the list is a
// view of exactly what the current filters produce.
document.getElementById('list-toggle').addEventListener('click', () => toggleList());
document.getElementById('list-close').addEventListener('click', () => toggleList(false));
document.getElementById('list-search').addEventListener('input', () => { if (listVisible) buildList(); });

// Sort on header click; clicking the active column flips direction.
document.getElementById('list-container').addEventListener('click', e => {
  const th = e.target.closest('th[data-key]');
  if (th) {
    const key = th.dataset.key;
    if (listSort.key === key) listSort.dir *= -1;   // same column → flip direction
    else listSort = { key, dir: 1 };                // new column → ascending
    buildList();
    return;
  }
  const tr = e.target.closest('tr[data-i]');
  if (tr) locateEntity(listRows[+tr.dataset.i]);
});

// ── Search ────────────────────────────────────────────────────────────────────
// The map's job is to answer "where is X, and what else is near it". Until now
// the only text search lived inside the list overlay, so finding a lab you had
// heard of meant leaving the map. This searches every entity by name, city,
// sector and description, and flies to the pick.
//
// It deliberately ignores the active filters: someone who types "DFKI" wants
// DFKI, not a lecture about their current sector selection. locateEntity() adds
// the marker back to the layer if a filter had hidden it.

const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const SEARCH_LIMIT  = 8;

let searchHits = [];
let searchCursor = -1;

// Rank by how early and how strongly the query lands: an exact name beats a
// prefix, a prefix beats a mid-name hit, and a description mention comes last.
function scoreEntity(c, q) {
  const name = c.name.toLowerCase();
  const city = c.city.toLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  // Match the start of any word, so "bonn" finds "Uni Bonn — …" and "hbrs" does not.
  if (new RegExp(`(^|[\\s—–-])${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(name)) return 2;
  if (name.includes(q)) return 3;
  if (city.startsWith(q)) return 4;
  if (city.includes(q)) return 5;
  if ((SECTOR_CONFIG[c.sector]?.label || '').toLowerCase().includes(q)) return 6;
  if (c.description.toLowerCase().includes(q)) return 7;
  return -1;
}

function runSearch(raw) {
  const q = raw.trim().toLowerCase();
  if (q.length < 2) return [];
  return ENTITIES
    .map(c => ({ c, score: scoreEntity(c, q) }))
    .filter(r => r.score >= 0)
    .sort((a, b) => a.score - b.score || a.c.name.localeCompare(b.c.name))
    .slice(0, SEARCH_LIMIT)
    .map(r => r.c);
}

function renderSearch() {
  if (!searchHits.length) {
    searchResults.innerHTML = '<li class="sr-empty">No match on the map yet.</li>';
    return;
  }
  searchResults.innerHTML = searchHits.map((c, i) => {
    const cfg = SECTOR_CONFIG[c.sector] || { label: c.sector, color: '#888' };
    const mark = c.isInstitute ? 'sr-ring' : 'sr-disc';
    return `<li class="sr-item" role="option" id="sr-${i}" data-i="${i}" aria-selected="${i === searchCursor}">
      <span class="${mark}" style="color:${cfg.color}"></span>
      <span class="sr-name">${esc(c.name)}</span>
      <span class="sr-meta">${esc(c.city)} &middot; ${esc(cfg.label)}</span>
    </li>`;
  }).join('');
}

function openSearch() {
  searchResults.hidden = false;
  searchInput.setAttribute('aria-expanded', 'true');
}
function closeSearch() {
  searchResults.hidden = true;
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.removeAttribute('aria-activedescendant');
  searchCursor = -1;
}

function moveCursor(delta) {
  if (!searchHits.length) return;
  searchCursor = (searchCursor + delta + searchHits.length) % searchHits.length;
  renderSearch();
  searchInput.setAttribute('aria-activedescendant', `sr-${searchCursor}`);
  searchResults.querySelector(`[data-i="${searchCursor}"]`)?.scrollIntoView({ block: 'nearest' });
}

function chooseSearch(i) {
  const c = searchHits[i];
  if (!c) return;
  closeSearch();
  searchInput.blur();
  locateEntity(c);
}

searchInput.addEventListener('input', () => {
  searchHits = runSearch(searchInput.value);
  searchCursor = -1;
  if (searchInput.value.trim().length < 2) { closeSearch(); return; }
  renderSearch();
  openSearch();
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown')      { e.preventDefault(); moveCursor(1); }
  else if (e.key === 'ArrowUp')   { e.preventDefault(); moveCursor(-1); }
  else if (e.key === 'Enter')     { e.preventDefault(); chooseSearch(searchCursor === -1 ? 0 : searchCursor); }
  else if (e.key === 'Escape')    { searchInput.value = ''; searchHits = []; closeSearch(); }
});

searchInput.addEventListener('focus', () => { if (searchHits.length) openSearch(); });

searchResults.addEventListener('mousedown', e => {
  // mousedown, not click: blur would tear the list down before click lands.
  const li = e.target.closest('.sr-item');
  if (li) { e.preventDefault(); chooseSearch(+li.dataset.i); }
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-box').contains(e.target)) closeSearch();
});

// "/" focuses search from anywhere, the convention people already have.
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// ── Legend ────────────────────────────────────────────────────────────────────

const legS = document.getElementById('legend-sectors');
Object.entries(SECTOR_CONFIG).forEach(([sector, cfg]) => {
  legS.insertAdjacentHTML('beforeend',
    `<div class="leg-row"><span class="leg-dot" style="background:${cfg.color}"></span><span class="leg-icon" style="color:${cfg.color}">${sectorIconSvg(sector)}</span><span>${cfg.label}</span></div>`);
});

// Size — graduated swatch matching the map's marker radii
const legSize = document.getElementById('legend-sizes');
SIZE_CONFIG.forEach(s => {
  const d = s.radius * 2;
  legSize.insertAdjacentHTML('beforeend',
    `<div class="leg-row"><span class="leg-size-slot"><span class="leg-dot" style="width:${d}px;height:${d}px"></span></span><span>${s.range}</span></div>`);
});

// Type — filled disc (company) vs hollow ring (institute)
document.getElementById('legend-types').insertAdjacentHTML('beforeend',
  `<div class="leg-row"><span class="leg-size-slot"><span class="leg-dot"></span></span><span>Company</span></div>
   <div class="leg-row"><span class="leg-size-slot"><span class="leg-ring"></span></span><span>Institute</span></div>`);

// Collapse the legend to a small info chip in the corner; click it to reopen.
const legendCollapse = document.getElementById('legend-collapse');
legendCollapse.addEventListener('click', () => {
  const collapsed = legend.classList.toggle('collapsed');
  legendCollapse.setAttribute('aria-expanded', String(!collapsed));
  legendCollapse.title = collapsed ? 'Show legend' : 'Hide legend';
});

// On a phone an open legend would cover a third of the map, so it starts as the
// small info chip — but it *is* there. Hiding it outright (as the mobile CSS used
// to) left eight colours and two marker shapes unexplained on exactly the devices
// most people open a shared link on.
if (window.matchMedia('(max-width: 640px)').matches) {
  legend.classList.add('collapsed');
  legendCollapse.setAttribute('aria-expanded', 'false');
  legendCollapse.title = 'Show legend';
}


// ── Stats ─────────────────────────────────────────────────────────────────────

function updateStats() {
  const vis = ENTITIES.filter(isVisible).length;
  document.getElementById("count-total").textContent   = ENTITIES.length;
  document.getElementById('count-visible').textContent = vis;
}

// ── Welcome card (opens only via the ? button, never on load) ─────────────────

function showWelcome() {
  document.getElementById('welcome-overlay').classList.remove('welcome-hidden');
}

function hideWelcome() {
  document.getElementById('welcome-overlay').classList.add('welcome-hidden');
}

document.getElementById('welcome-cta').addEventListener('click', hideWelcome);
document.getElementById('welcome-overlay').addEventListener('click', e => {
  if (e.target.id === 'welcome-overlay') hideWelcome();
});
document.getElementById('welcome-reopen').addEventListener('click', showWelcome);

// ── Init ──────────────────────────────────────────────────────────────────────

// Open fitted to Germany so the data fills the frame (world stays as backdrop)
map.fitBounds(statesLayer.getBounds(), { padding: [30, 30] });

// Replay a shared link. Each param is applied through the same helper the UI
// uses, so a restored view and a clicked-together one cannot drift apart.
function readUrl() {
  const p = new URLSearchParams(window.location.search);

  (p.get('s') || '').split(',').forEach(s => { if (SECTOR_CONFIG[s]) activeSectors.add(s); });
  (p.get('t') || '').split(',').forEach(t => { if (t === 'company' || t === 'institute') activeTypes.add(t); });

  const oi = UNIVERSITY_CITIES.findIndex(c => c.name === p.get('o'));
  if (oi > 0) {
    origin = UNIVERSITY_CITIES[oi];
    originSelect.value = String(oi);
    document.getElementById('bonn-filter').title = `Filter by distance from ${origin.name}`;
    recomputeDistances();
    bonnCircle.setLatLng([origin.lat, origin.lng]);
  }

  applyFilters();   // paints chips, markers and stats for the sector + origin state

  // Distance and region are mutually exclusive spatial focuses — same rule the
  // UI enforces — so at most one of them is restored.
  const d = Number(p.get('d'));
  const region = REGIONS.find(r => r.id === p.get('r'));
  if (p.has('d') && Number.isFinite(d) && d >= Number(bonnRange.min) && d <= Number(bonnRange.max)) {
    bonnRadiusKm = d;
    bonnRange.value = String(d);
    bonnKmLabel.textContent = `${d} km`;
    bonnCircle.setRadius(d * 1000);
    toggleBonnFilter();          // switches it on, flies to the circle, refreshes
  } else if (region) {
    openPanel(region);
  }

  const v = p.get('v');
  if (v === 'list') toggleList(true);
  else if (v === 'grid') toggleGrid(true);

  booting = false;
  syncUrl();   // normalise the link (drops unknown or malformed params)
}

readUrl();
