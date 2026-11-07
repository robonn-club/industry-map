// Shared by the map (index.html → js/app.js), the startups page
// (startups.html → js/startups.js) and the pixel view (pixel.html → js/pixel.js):
// the sector palette, HTML escaping, and the rule that makes a startup "new". Load
// it after the data files and before a page's own script.

// ── Sectors ───────────────────────────────────────────────────────────────────

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
// popup badge, grid headers, the map markers and the startup cards.
function sectorIconSvg(sector, cls = 'sector-icon') {
  const cfg = SECTOR_CONFIG[sector];
  return cfg ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${cfg.icon}</svg>` : '';
}

// ── Escaping ──────────────────────────────────────────────────────────────────

const escapeAttr = s => String(s).replace(/"/g, '&quot;');

// Contributor-supplied strings (name, city, description, region prose) are
// interpolated into HTML all over both pages. Anyone can open a PR adding an
// entry, so every one of those values goes through esc() — a stray "<" in a
// company name should render as text, never as markup.
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC_MAP[c]);

// ── Job-seeker helpers ────────────────────────────────────────────────────────

// Research institutes take thesis & working-student (HiWi) applicants by nature,
// so we surface that as a reliable, derived signal — no per-entity data needed.
function isStudentFriendly(c) { return !!c.isInstitute; }

// One click from a dot (or a startup card) to actual openings. Institutes rarely post on LinkedIn,
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

// ── New startups: a rolling three-year window ─────────────────────────────────
// A startup counts as new while its first commercial-register entry falls in the
// last three years, measured to the day. The register date is the one every entry
// carries and anyone can check, and it is what national startup counts use, so
// the coverage figure compares like with like. A startup whose own stated
// founding year is already older than the window is not new, whatever its
// register date says. Entries age out on their own: no file has to change.
// scripts/new-startups.mjs applies the same rule.

const NEW_WINDOW_YEARS = 3;
const NEW_COLOR = '#E3A72F';   // the gold ring around a new startup's dot
const STARTUPS_PAGE = 'startups.html';

const isoDay = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const TODAY = isoDay(new Date());
const NEW_SINCE = (() => {
  const d = new Date();
  return isoDay(new Date(d.getFullYear() - NEW_WINDOW_YEARS, d.getMonth(), d.getDate()));
})();

function isNewStartup(c) {
  return !c.isInstitute && c.status !== 'inactive' && typeof c.registered === 'string'
    && c.registered >= NEW_SINCE && !(c.founded && c.founded < +NEW_SINCE.slice(0, 4));
}

// Each startup's card on the startups page has a stable anchor, so the map's
// popups can link straight to it: startups.html#startup-black-forest-labs.
const startupAnchor = name => 'startup-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// "5 Oct 2023" — the window start and register dates read as dates, not codes.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = iso => `${+iso.slice(8, 10)} ${MONTHS[+iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;

// The national baseline (Startup-Verband / startupdetector): half-year counts of
// startups as they enter the commercial register, all sectors, plus a per-state
// split of the latest half-year. Maintained in new-startups.review.js.
const NATIONAL = NEW_STARTUP_REVIEW.national;
const HALF_KEYS = Object.keys(NATIONAL.halfYears).sort();
const halfRange = key => {
  const [y, h] = key.split('-');
  return h === 'H1' ? [`${y}-01-01`, `${y}-07-01`] : [`${y}-07-01`, `${+y + 1}-01-01`];
};
const NATIONAL_LATEST_LABEL = (() => {
  const [y, h] = HALF_KEYS[HALF_KEYS.length - 1].split('-');
  return h === 'H1' ? `January–June ${y}` : `July–December ${y}`;
})();
