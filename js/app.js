// ── Config ───────────────────────────────────────────────────────────────────

// Muted, editorial palette harmonized with the Robonn brand (#293740 / #485F66).
// All tones share mid-lightness and low saturation so they sit beside the dark
// teal brand without clashing — Robotics anchors on the brand teal itself.
// Each sector also carries an `icon`: inline SVG inner-markup on a 24×24 grid,
// stroked with currentColor (fill none) so it inherits the surrounding text/glyph
// colour. Rendered everywhere sector appears via sectorIconSvg(), so the eight
// hard-to-distinguish colours are no longer the only cue — engineers scan by glyph.
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
  research:    { label: 'Research',            color: '#BE9A45', // ochre
    icon: '<path d="M9.5 3h5M10.5 3v6l-5 9a1 1 0 0 0 .9 1.5h11.2a1 1 0 0 0 .9-1.5l-5-9V3"/><path d="M7.5 15h9"/>' },
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
// one schema (institutes are sector "research"). Everything on the map works
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

const escapeAttr = s => String(s).replace(/"/g, '&quot;');

// Popup is built on demand (function form passed to bindPopup) so the distance
// line always reflects the current origin without re-binding markers.
function popupHtml(c) {
  const cfg = SECTOR_CONFIG[c.sector];
  const websiteHtml = c.website
    ? `<a href="${escapeAttr(c.website)}" target="_blank" rel="noopener noreferrer" class="co-link">Visit website &rarr;</a>`
    : '';
  const jobsHtml =
    `<a href="${escapeAttr(jobsUrl(c))}" target="_blank" rel="noopener noreferrer" class="co-link co-jobs">Find roles &#8599;</a>`;
  return `
    <div class="co-popup">
      <div class="co-head">
        <span class="co-name">${c.name}</span>
        <span class="co-badge" style="background:${cfg.color}">${sectorIconSvg(c.sector, 'sector-icon badge-icon')}${cfg.label}</span>
      </div>
      <div class="co-meta">
        ${c.city} &middot; ${SIZE_RANGE[c.size] ?? c.size}
        <span class="co-dist">${c.distKm} km from ${origin.name}</span>
      </div>
      <p class="co-desc">${c.description}</p>
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
  attributionControl: true,   // CARTO / OpenStreetMap require attribution
});

// Zoom controls top-right, sitting under the Sector Grid button
map.zoomControl.setPosition('topright');

// ── Basemap: CARTO Dark Matter (OpenStreetMap data) ───────────────────────────
// A precise, world-wide dark slippy basemap. The coloured sector dots and the
// Bundesland overlay sit on top and read vividly against the dark ground.
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  subdomains: 'abcd',
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);

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

  btn.addEventListener('click', () => {
    if (sector === 'all') activeSectors.clear();
    else activeSectors.has(sector) ? activeSectors.delete(sector) : activeSectors.add(sector);
    applyFilters();
  });
  document.getElementById('filter-btns').appendChild(btn);
});

// Spatial filters — reused by the chip visibility and the sector grid.
// The distance filter and a selected region are mutually exclusive (one focus at a time).
function passesOrigin(c) {
  return !bonnFilterActive || c.distKm <= bonnRadiusKm;
}
function passesRegion(c) {
  return !selectedRegion || c.state === selectedRegion;
}

// Single source of truth: an entity is shown only if it passes every active
// filter. Add a new filter here and the whole pipeline picks it up.
function isVisible(c) {
  const sectorOk = activeSectors.size === 0 || activeSectors.has(c.sector);
  return sectorOk && passesOrigin(c) && passesRegion(c);
}

// Hide sectors with nothing in range (e.g. under Near Bonn), but always keep a
// selected sector visible so an active filter can never become invisible.
function updateChipVisibility() {
  document.querySelectorAll('#filter-btns .filter-btn').forEach(b => {
    const s = b.dataset.sector;
    if (s === 'all') return;
    const n = ENTITIES.filter(c => c.sector === s && passesOrigin(c) && passesRegion(c)).length;
    b.classList.toggle('chip-hidden', n === 0 && !activeSectors.has(s));
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
  // Button active states ("All" active only when nothing is selected)
  document.querySelectorAll('#filter-btns .filter-btn').forEach(b => {
    const s = b.dataset.sector;
    b.classList.toggle('active', s === 'all' ? activeSectors.size === 0 : activeSectors.has(s));
  });
  refreshMarkers();
  updateChipVisibility();
  // URL state (comma-separated)
  const url = new URL(window.location);
  activeSectors.size === 0
    ? url.searchParams.delete('s')
    : url.searchParams.set('s', [...activeSectors].join(','));
  history.replaceState(null, '', url);
  updateStats();
  if (listVisible) buildList();
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
  const r = SIZE_RADIUS[c.size] ?? COMPANY_RADIUS;
  const isInst = c.isInstitute;
  const marker = L.circleMarker([c.lat, c.lng], {
    radius: r,
    fillColor: cfg.color,
    color: isInst ? cfg.color : 'rgba(255,255,255,0.92)',
    weight: isInst ? 2 : 1.5,
    fillOpacity: isInst ? 0.22 : 0.95,
    bubblingMouseEvents: false,   // clicking a marker shouldn't close the region panel
  });

  // Function-form content: rebuilt each open so the distance line tracks the
  // current origin without re-binding the marker.
  marker.bindPopup(() => popupHtml(c), { maxWidth: 285 });

  marker.on('mouseover', function () {
    this.setStyle({ weight: 3, fillOpacity: isInst ? 0.35 : 1 });
    this.bringToFront();
  });
  marker.on('mouseout', function () {
    this.setStyle({ weight: isInst ? 2 : 1.5, fillOpacity: isInst ? 0.22 : 0.95 });
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
      html: `<div class="bonn-pin"><span class="bonn-dot"></span><span class="bonn-label">${o.name}</span></div>`,
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
  updateChipVisibility();
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
  originSelect.insertAdjacentHTML('beforeend', `<option value="${i}">${c.name}</option>`);
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
    updateChipVisibility();
    updateStats();
  }
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
  updateChipVisibility();
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
        <span class="sb-lbl">${cfg.label}</span>
        <div class="sb-track"><div class="sb-fill" style="width:${pct}%;background:${cfg.color}"></div></div>
        <span class="sb-num">${byS[s]}</span>
      </div>`;
    }).join('');

  const connHtml = region.connections
    .map(id => REGIONS.find(r => r.id === id)).filter(Boolean)
    .map(r => `<button class="conn-tag" data-rid="${r.id}">${r.name}</button>`)
    .join('');

  panelContent.innerHTML = `
    <div class="panel-name">${region.name}</div>
    <div class="panel-tagline">${region.tagline}</div>
    <p class="panel-overview">${region.overview}</p>
    <div class="panel-sec">SECTOR BREAKDOWN &mdash; ${total} companies</div>
    ${barsHtml || '<p class="panel-empty">No companies tracked yet.</p>'}
    <div class="panel-sec">KEY STRENGTHS</div>
    <ul class="panel-strengths">${region.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
    <div class="panel-sec">CONNECTED REGIONS</div>
    <div class="panel-conns">${connHtml}</div>
  `;

  selectState(region.id);
  panel.classList.remove('panel-hidden');
  legend.classList.add('shifted');

  refreshMarkers();          // show only this region's entities
  updateChipVisibility();    // chips scope to what exists here
  updateStats();
  if (listVisible) buildList();
}

function closePanel() {
  if (selectedRegion) {
    selectedRegion = null;
    refreshMarkers();
    updateChipVisibility();
    updateStats();
    if (listVisible) buildList();
  }
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
        stroke="white" stroke-width="0.8"><title>${c.name} · ${c.city}</title></circle>`;
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
}

document.getElementById('grid-toggle').addEventListener('click', () => {
  deactivateBonn();   // grid is a clean Germany-wide overview — clear spatial filters
  closePanel();       // also clears any selected region
  refreshMarkers();   // ensure the map reflects the cleared filters on return
  updateChipVisibility();
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
    const roles = `<a href="${escapeAttr(jobsUrl(c))}" target="_blank" rel="noopener noreferrer" class="co-link" onclick="event.stopPropagation()">Find roles &#8599;</a>`;
    return `<tr data-i="${i}">
      <td><span class="list-name">${c.name}</span></td>
      <td><span class="list-sector" style="color:${cfg.color}">${sectorIconSvg(c.sector)}<span class="list-sector-lbl">${cfg.label}</span></span></td>
      <td>${c.city}</td>
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

// Read URL sector param
const initParam = new URLSearchParams(window.location.search).get('s');
if (initParam) {
  initParam.split(',').forEach(s => { if (SECTOR_CONFIG[s]) activeSectors.add(s); });
}
applyFilters();
