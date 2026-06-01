// ── Config ───────────────────────────────────────────────────────────────────

// Muted, editorial palette harmonized with the Robonn brand (#293740 / #485F66).
// All tones share mid-lightness and low saturation so they sit beside the dark
// teal brand without clashing — Robotics anchors on the brand teal itself.
const SECTOR_CONFIG = {
  robotics:    { label: 'Robotics',            color: '#35707F' }, // brand teal
  automotive:  { label: 'Automotive',          color: '#BD7A4F' }, // terracotta
  ai_ml:       { label: 'AI & ML',             color: '#7B6A9C' }, // dusty plum
  industrial:  { label: 'Industrial',          color: '#5E7A99' }, // steel blue
  software:    { label: 'Software & Tech',     color: '#6F9966' }, // sage green
  research:    { label: 'Research',            color: '#BE9A45' }, // ochre
  defense:     { label: 'Aerospace & Defense', color: '#A85550' }, // brick red
  agriculture: { label: 'Agriculture',         color: '#8B9A4E' }, // olive
};

const SIZE_CONFIG = [
  { key: 'startup', label: 'Startup', radius: 5  },
  { key: 'mid',     label: 'Mid',     radius: 9  },
  { key: 'big',     label: 'Large',   radius: 13 },
  { key: 'global',  label: 'Global',  radius: 18 },
];

const SIZE_RADIUS = Object.fromEntries(SIZE_CONFIG.map(s => [s.key, s.radius]));
const SIZE_LABEL  = Object.fromEntries(SIZE_CONFIG.map(s => [s.key, s.label]));

const BONN = [50.7374, 7.0982];
let bonnRadiusKm = 100;   // adjustable via the Near Bonn slider
const COMPANY_RADIUS = 6.5;   // uniform — sector (colour) is the encoding, size shown in popup

// Companies and research institutes are kept in separate data files but share
// one schema (institutes are sector "research"). Everything on the map works
// off this merged list.
const ENTITIES = [...COMPANIES, ...INSTITUTES];

// ── Haversine distance (km) ───────────────────────────────────────────────────

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Map ───────────────────────────────────────────────────────────────────────

const map = L.map('map', {
  center: [50.6, 10.2], zoom: 5,
  minZoom: 2, maxZoom: 12,
  maxBounds: [[-85, -180], [85, 180]],
  maxBoundsViscosity: 0.5,
  worldCopyJump: true,
  attributionControl: false,
});

// Zoom controls top-right, sitting under the Sector Grid button
map.zoomControl.setPosition('topright');

// ── Vector basemap (no raster tiles) ──────────────────────────────────────────
// Germany is rendered precisely and highlighted; neighbours are flat shapes
// reduced to just their borders and a country-name label.

map.createPane('landPane');
map.getPane('landPane').style.zIndex = 200;
map.getPane('landPane').style.pointerEvents = 'none';

map.createPane('statePane');
map.getPane('statePane').style.zIndex = 210;

map.createPane('borderPane');
map.getPane('borderPane').style.zIndex = 215;
map.getPane('borderPane').style.pointerEvents = 'none';

// ── Border smoothing (Chaikin corner-cutting) ─────────────────────────────────
// Rounds the straight segments between vertices into smooth curves. Applied at
// runtime so the shipped GeoJSON stays compact.

function chaikinRing(ring, iterations) {
  let pts = ring;
  for (let it = 0; it < iterations; it++) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25]);
      out.push([ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    out.push(out[0]); // re-close the ring
    pts = out;
  }
  return pts;
}

function smoothGeo(geojson, iterations) {
  const clone = JSON.parse(JSON.stringify(geojson));
  const feats = clone.features || [clone];
  feats.forEach(f => {
    const g = f.geometry;
    if (g.type === 'Polygon') {
      g.coordinates = g.coordinates.map(r => chaikinRing(r, iterations));
    } else if (g.type === 'MultiPolygon') {
      g.coordinates = g.coordinates.map(poly => poly.map(r => chaikinRing(r, iterations)));
    }
  });
  return clone;
}

// Only the world backdrop is smoothed at runtime. The Germany outline and the
// Bundesländer are pre-smoothed in topology space (shared arcs smoothed once),
// so their borders match exactly — no jitter — and must NOT be re-smoothed here.
const WORLD_S = smoothGeo(WORLD_CONTEXT, 2);

// World context — all countries as flat shapes, no names, just for the backdrop.
// Stroke matches the fill (and is wide enough) so neighbouring countries tile
// seamlessly — no water slivers leak through gaps between simplified borders.
L.geoJSON(WORLD_S, {
  pane: 'landPane',
  interactive: false,
  smoothFactor: 0.5,
  style: { fillColor: '#EFF3F6', fillOpacity: 1, color: '#EFF3F6', weight: 1.4, lineJoin: 'round' },
}).addTo(map);

const germanyFeature = GERMANY_GEO;

// Solid Germany base — fills under the states so no water shows between states,
// and its wide same-colour stroke bridges the gap to the neighbouring countries.
L.geoJSON(germanyFeature, {
  pane: 'landPane',
  interactive: false,
  smoothFactor: 0.3,
  style: { fillColor: '#FFFFFF', fillOpacity: 1, color: '#FFFFFF', weight: 2, lineJoin: 'round' },
}).addTo(map);

// Bundesländer — clear internal subdivisions, interactive, with persistent selection
const STATE_BASE     = { fillColor: '#FFFFFF', fillOpacity: 1, color: '#9DB2BF', weight: 0.9, lineJoin: 'round', lineCap: 'round' };
const STATE_HOVER    = { fillColor: '#EAF0F3', fillOpacity: 1, color: '#485F66', weight: 1.3, lineJoin: 'round', lineCap: 'round' };
const STATE_SELECTED = { fillColor: '#D8E4E9', fillOpacity: 1, color: '#293740', weight: 1.8, lineJoin: 'round', lineCap: 'round' };

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

// Crisp national outline on top
L.geoJSON(germanyFeature, {
  pane: 'borderPane',
  interactive: false,
  smoothFactor: 0.3,
  style: { fillOpacity: 0, color: '#293740', weight: 1.7, lineJoin: 'round', lineCap: 'round' },
}).addTo(map);

// ── Bonn range circle (hidden until Near Bonn activated) ──────────────────────

const bonnCircle = L.circle(BONN, {
  radius: bonnRadiusKm * 1000,   // km → metres
  color: '#293740', weight: 1.5, dashArray: '6 5',
  fillColor: '#293740', fillOpacity: 0.05,
  interactive: false,
});

// ── Bonn home marker (humanoid robot) — shown while the Near Bonn filter is on ──

// RoBonn mascot — the full humanoid robot from the logo badge
const ROBOT_SVG = `
  <svg viewBox="0 0 64 80" fill="none" stroke="#293740" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="21" y="8" width="4" height="8" rx="2" fill="#fff"/>
    <rect x="39" y="8" width="4" height="8" rx="2" fill="#fff"/>
    <rect x="18" y="14" width="28" height="18" rx="4" fill="#fff"/>
    <circle cx="27" cy="23" r="2.2" fill="#293740" stroke="none"/>
    <circle cx="37" cy="23" r="2.2" fill="#293740" stroke="none"/>
    <rect x="28" y="31" width="8" height="4" rx="1.5" fill="#fff"/>
    <rect x="15" y="35" width="34" height="24" rx="5" fill="#fff"/>
    <rect x="22" y="41" width="20" height="12" rx="2.5" fill="#fff"/>
    <rect x="27" y="47" width="3" height="5" rx="1" fill="#293740" stroke="none"/>
    <rect x="31" y="45" width="3" height="7" rx="1" fill="#293740" stroke="none"/>
    <rect x="35" y="47" width="3" height="5" rx="1" fill="#293740" stroke="none"/>
    <path d="M14 40 L8 47 L8 52"/>
    <path d="M50 40 L56 47 L56 52"/>
    <circle cx="8" cy="55" r="3" fill="#fff"/>
    <circle cx="56" cy="55" r="3" fill="#fff"/>
    <circle cx="14" cy="40" r="2.4" fill="#fff"/>
    <circle cx="50" cy="40" r="2.4" fill="#fff"/>
    <path d="M26 59 L26 64"/>
    <path d="M38 59 L38 64"/>
    <circle cx="26" cy="66" r="2.4" fill="#fff"/>
    <circle cx="38" cy="66" r="2.4" fill="#fff"/>
    <path d="M26 68 L26 72"/>
    <path d="M38 68 L38 72"/>
    <rect x="22" y="72" width="9" height="5" rx="1.5" fill="#fff"/>
    <rect x="33" y="72" width="9" height="5" rx="1.5" fill="#fff"/>
  </svg>`;

const bonnRobot = L.marker(BONN, {
  icon: L.divIcon({
    className: '',
    html: `<div class="bonn-robot">${ROBOT_SVG}</div>`,
    iconSize: [30, 38],
    iconAnchor: [15, 37],
  }),
}).bindTooltip('RoBonn', { direction: 'top', offset: [0, -36], className: 'region-tooltip' });

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
    const dot = document.createElement('span');
    dot.className = 'btn-dot';
    dot.style.background = color;
    btn.appendChild(dot);
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
// Near Bonn and a selected region are mutually exclusive (one focus at a time).
function passesBonn(c) {
  return !bonnFilterActive || c.distKm <= bonnRadiusKm;
}
function passesRegion(c) {
  return !selectedRegion || c.state === selectedRegion;
}

// Single source of truth: an entity is shown only if it passes every active
// filter. Add a new filter here and the whole pipeline picks it up.
function isVisible(c) {
  const sectorOk = activeSectors.size === 0 || activeSectors.has(c.sector);
  return sectorOk && passesBonn(c) && passesRegion(c);
}

// Hide sectors with nothing in range (e.g. under Near Bonn), but always keep a
// selected sector visible so an active filter can never become invisible.
function updateChipVisibility() {
  document.querySelectorAll('#filter-btns .filter-btn').forEach(b => {
    const s = b.dataset.sector;
    if (s === 'all') return;
    const n = ENTITIES.filter(c => c.sector === s && passesBonn(c) && passesRegion(c)).length;
    b.classList.toggle('chip-hidden', n === 0 && !activeSectors.has(s));
  });
}

// One render pass: add/remove each marker based on isVisible()
function refreshMarkers() {
  allMarkers.forEach(({ marker, company }) => {
    const vis = isVisible(company);
    if (vis && !map.hasLayer(marker)) marker.addTo(map);
    else if (!vis && map.hasLayer(marker)) map.removeLayer(marker);
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
}

// Select exactly one sector (used by the sector-grid cards)
function setOnlySector(sector) {
  activeSectors.clear();
  activeSectors.add(sector);
  applyFilters();
}

// ── Company markers ───────────────────────────────────────────────────────────

const allMarkers = [];

ENTITIES.forEach(c => {
  const cfg = SECTOR_CONFIG[c.sector];
  if (!cfg) return;

  // Distance to Bonn is static — compute once and cache on the company
  c.distKm = Math.round(haversine(c.lat, c.lng, BONN[0], BONN[1]));

  const marker = L.circleMarker([c.lat, c.lng], {
    radius: COMPANY_RADIUS,
    fillColor: cfg.color,
    color: 'rgba(255,255,255,0.9)',
    weight: 1.5,
    fillOpacity: 0.85,
    bubblingMouseEvents: false,   // clicking a marker shouldn't close the region panel
  });

  const websiteHtml = c.website
    ? `<a href="${c.website}" target="_blank" rel="noopener noreferrer" class="co-link">Visit website &rarr;</a>`
    : '';

  marker.bindPopup(`
    <div class="co-popup">
      <div class="co-head">
        <span class="co-name">${c.name}</span>
        <span class="co-badge" style="background:${cfg.color}">${cfg.label}</span>
      </div>
      <div class="co-meta">
        ${c.city} &middot; ${SIZE_LABEL[c.size] ?? c.size} &middot; Est. ${c.founded}
        <span class="co-dist">${c.distKm} km from Bonn</span>
      </div>
      <p class="co-desc">${c.description}</p>
      ${websiteHtml ? `<div class="co-footer">${websiteHtml}</div>` : ''}
    </div>
  `, { maxWidth: 285 });

  marker.on('mouseover', function () {
    this.setStyle({ weight: 3, fillOpacity: 1 });
    this.bringToFront();
  });
  marker.on('mouseout', function () {
    this.setStyle({ weight: 1.5, fillOpacity: 0.85 });
  });

  allMarkers.push({ marker, company: c });
});

// ── Near Bonn filter ──────────────────────────────────────────────────────────

let bonnFilterActive = false;

const bonnControl = document.getElementById('bonn-control');

function collapseBonnSlider() {
  bonnControl.classList.remove('expanded');   // hide slider, leave the filter as-is
}

// Turn the Near Bonn filter off without refreshing (caller refreshes)
function deactivateBonn() {
  if (!bonnFilterActive) return;
  bonnFilterActive = false;
  document.getElementById('bonn-filter').classList.remove('active');
  bonnControl.classList.remove('expanded');
  map.removeLayer(bonnCircle);
  map.removeLayer(bonnRobot);
}

// Pure on/off toggle: lit pin always means the filter is on; clicking it always
// flips that state (no hidden modes). The slider follows the filter.
function toggleBonnFilter() {
  bonnFilterActive = !bonnFilterActive;
  document.getElementById('bonn-filter').classList.toggle('active', bonnFilterActive);
  bonnControl.classList.toggle('expanded', bonnFilterActive);   // slider shows iff on

  if (bonnFilterActive) {
    if (selectedRegion) closePanel();   // one spatial focus at a time
    bonnCircle.addTo(map);
    bonnRobot.addTo(map);
    map.flyToBounds(bonnCircle.getBounds(), { padding: [40, 40], duration: 1 });
  } else {
    map.removeLayer(bonnCircle);
    map.removeLayer(bonnRobot);
  }
  refreshMarkers();   // out-of-range entities are hidden, in line with the sector filter
  updateChipVisibility();
  updateStats();
}

document.getElementById('bonn-filter').addEventListener('click', toggleBonnFilter);

// Click anywhere outside the control collapses the slider (filter stays as-is)
document.addEventListener('click', e => {
  if (bonnControl.classList.contains('expanded') && !bonnControl.contains(e.target)) {
    collapseBonnSlider();
  }
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
}

function closePanel() {
  if (selectedRegion) {
    selectedRegion = null;
    refreshMarkers();
    updateChipVisibility();
    updateStats();
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
    const companies = ENTITIES.filter(c => c.sector === sector && passesBonn(c) && passesRegion(c));

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
        <span class="mini-dot" style="background:${cfg.color}"></span>
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
  document.getElementById('grid-overlay').classList.toggle('grid-hidden', !gridVisible);
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

// ── Legend ────────────────────────────────────────────────────────────────────

const legS = document.getElementById('legend-sectors');
Object.entries(SECTOR_CONFIG).forEach(([, cfg]) => {
  legS.insertAdjacentHTML('beforeend',
    `<div class="leg-row"><span class="leg-dot" style="background:${cfg.color}"></span><span>${cfg.label}</span></div>`);
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
