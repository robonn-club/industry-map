// The startups page (startups.html): tech startups founded in Germany in the
// last three years, each with its register entry and sources, followed by how
// complete the list is. The data is data/companies/new-startups.js and
// new-startups.review.js; the sector palette, escaping, the roles link and the
// three-year rule come from js/common.js, shared with the map.
// Method: NEW-STARTUPS.md.

const REPO = 'https://github.com/robonn-club/industry-map/blob/main/';

// Every active startup still inside the window, newest register entry first.
// Inactive ones stay in the data file as a record and are named in the coverage
// panel, never listed as startups.
const STARTUPS = NEW_STARTUPS.filter(isNewStartup)
  .sort((a, b) => b.registered.localeCompare(a.registered) || a.name.localeCompare(b.name));
const INACTIVE = NEW_STARTUPS.filter(c => c.status === 'inactive');

const STATE_NAME = Object.fromEntries(REGIONS.map(r => [r.id, r.name]));
const stateName = id => STATE_NAME[id] ?? id;

const REASON_LABEL = {
  'before-window': 'registered before the window',
  'not-german': 'not registered in Germany',
  'out-of-scope': "outside the map's sectors",
  'unverified': 'website could not be verified',
  'not-new': 'an older business, renamed',
  'duplicate': 'already on the map',
  'inactive': 'no longer active',
};
const SOURCE_LABEL = { register: 'Register', company: 'Imprint', press: 'Press', institution: 'Institution' };

const fmtMonth = iso => `${MONTHS[+iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;
// "Munich, Bavaria", but "Berlin" rather than "Berlin, Berlin" for the city-states.
const placeOf = c => (stateName(c.state) === c.city ? c.city : `${c.city}, ${stateName(c.state)}`);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// ── Coverage arithmetic ───────────────────────────────────────────────────────
// The national count for the same window: each half-year the report covers is
// prorated by the days it overlaps the window, and the months it has not reached
// yet are extrapolated from its latest daily rate — kept separate, so the page
// can say how much of the figure is an estimate. scripts/new-startups.mjs does
// the same sum.

const daysBetween = (a, b) => Math.max(0, (Date.parse(b) - Date.parse(a)) / 864e5);

function nationalEstimate() {
  const end = isoDay(new Date(Date.parse(TODAY) + 864e5));   // the window includes today
  let counted = 0;
  for (const k of HALF_KEYS) {
    const [s, e] = halfRange(k);
    counted += NATIONAL.halfYears[k] * daysBetween(s < NEW_SINCE ? NEW_SINCE : s, e > end ? end : e) / daysBetween(s, e);
  }
  const lastKey = HALF_KEYS[HALF_KEYS.length - 1];
  const [ls, le] = halfRange(lastKey);
  const rate = NATIONAL.halfYears[lastKey] / daysBetween(ls, le);
  const extrapolated = rate * daysBetween(le > NEW_SINCE ? le : NEW_SINCE, end);
  return { total: counted + extrapolated, extrapolated, since: le };
}

// Estimates are only good to a few percent, so they are shown to the hundred.
const fmtApprox = n => (Math.round(n / 100) * 100).toLocaleString('en-US');
const pct = (part, whole) => {
  const p = 100 * part / whole;
  return p >= 1 ? `${p.toFixed(0)}%` : `${p.toFixed(1)}%`;
};
const EST = nationalEstimate();

// ── Filters: sectors (several), one state, free text — kept in the URL ───────
//   s  sectors, comma-separated   r  Bundesland id   q  search text

const active = { sectors: new Set(), state: '', q: '' };

const sectorOk = c => active.sectors.size === 0 || active.sectors.has(c.sector);
const stateOk = c => !active.state || c.state === active.state;
const textOk = c => !active.q || [c.name, c.legalName, c.city, stateName(c.state), c.description]
  .join(' ').toLowerCase().includes(active.q.toLowerCase());
const passes = c => sectorOk(c) && stateOk(c) && textOk(c);
const anyFilter = () => active.sectors.size > 0 || !!active.state || !!active.q;

function clearFilters() {
  active.sectors.clear(); active.state = ''; active.q = '';
}

function readUrl() {
  const p = new URLSearchParams(location.search);
  (p.get('s') || '').split(',').forEach(s => { if (SECTOR_CONFIG[s]) active.sectors.add(s); });
  if (STATE_NAME[p.get('r')]) active.state = p.get('r');
  active.q = (p.get('q') || '').trim();
}

function syncUrl() {
  const url = new URL(location.href);
  const set = (k, v) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
  set('s', [...active.sectors].join(','));
  set('r', active.state);
  set('q', active.q);
  history.replaceState(null, '', url);
}

// ── Hero: four numbers, and how far to trust the last one ────────────────────

function renderHero() {
  const states = new Set(STARTUPS.map(c => c.state)).size;
  const sectors = new Set(STARTUPS.map(c => c.sector)).size;
  const total = Object.keys(SECTOR_CONFIG).length;
  const stat = (value, label) => `<div class="su-stat"><dt>${label}</dt><dd>${value}</dd></div>`;
  document.getElementById('su-stats').innerHTML = [
    stat(STARTUPS.length, 'startups listed'),
    stat(`${states}<span class="su-of"> of 16</span>`, 'states'),
    stat(sectors === total ? `${sectors}` : `${sectors}<span class="su-of"> of ${total}</span>`, 'sectors'),
    stat(`≈${pct(STARTUPS.length, EST.total)}`,
      `of all startups founded in that time &middot; <a href="#su-coverage">how complete?</a>`),
  ].join('');
}

// ── Timeline: one dot per startup, placed by its register date ───────────────
// A dot plot with greedy stacking: dots are laid out oldest first, each one on
// the lowest row where it clears its neighbours, so dense months stack upward
// instead of overlapping. One colour (the gold that marks new startups on the
// map); a filter dims the dots it hides, so the strip and the list stay linked.
// The hit target is the nearest dot to the pointer, not the 10 px mark.

const tlPlot = document.getElementById('su-tl-plot');
const tlTip = document.getElementById('su-tip');
const TL_SURFACE = '#293740';
let tlDots = [];          // [{ c, x, y }] in plot pixels, from the last layout
let tlHover = null;

const byYear = () => {
  const out = {};
  STARTUPS.forEach(c => { const y = c.registered.slice(0, 4); out[y] = (out[y] || 0) + 1; });
  return out;
};

function renderTimelineCaption() {
  const years = Object.entries(byYear()).sort((a, b) => a[0].localeCompare(b[0]))
    .map(([y, n]) => `${n} in ${y}`);
  const summary = years.length > 1
    ? `${years.slice(0, -1).join(', ')} and ${years[years.length - 1]}`
    : (years[0] ?? 'none yet');
  document.getElementById('su-tl-cap').innerHTML =
    `<span>When each startup first entered the commercial register,
     ${esc(fmtDay(NEW_SINCE))} to today</span>
     <span class="su-sr">: ${esc(summary)}.</span>`;
}

function layoutTimeline() {
  const W = tlPlot.clientWidth;
  if (!W) return;
  const r = W < 560 ? 4.5 : 5.5;
  const gap = 2 * r + 3;                     // centre-to-centre spacing, ring included
  const padX = r + 4;
  const span = daysBetween(NEW_SINCE, TODAY) || 1;
  const xOf = iso => padX + (daysBetween(NEW_SINCE, iso) / span) * (W - 2 * padX);

  // Oldest first, each dot on the lowest free row.
  const rows = [];                           // rows[level] = x positions placed
  const placed = STARTUPS.slice().sort((a, b) => a.registered.localeCompare(b.registered)).map(c => {
    const x = xOf(c.registered);
    let level = 0;
    while ((rows[level] || []).some(px => Math.abs(px - x) < gap)) level++;
    (rows[level] = rows[level] || []).push(x);
    return { c, x, level };
  });
  const levels = Math.max(1, rows.length);
  const top = 6;
  const base = top + levels * gap + 4;       // y of the axis line
  const H = base + 30;                       // axis ticks and year labels
  tlDots = placed.map(d => ({ c: d.c, x: d.x, y: base - 4 - r - d.level * gap }));

  // Year boundaries inside the window, and a label centred in each year's span
  // when it fits: the year and how many startups it holds.
  const counts = byYear();
  const bounds = [NEW_SINCE];
  for (let y = +NEW_SINCE.slice(0, 4) + 1; `${y}-01-01` <= TODAY; y++) bounds.push(`${y}-01-01`);
  bounds.push(TODAY);
  const ticks = bounds.slice(1, -1).map(b =>
    `<line class="su-tl-tick" x1="${xOf(b)}" x2="${xOf(b)}" y1="${base}" y2="${base + 6}"/>`).join('');
  const labels = bounds.slice(0, -1).map((b, i) => {
    const x0 = xOf(b), x1 = xOf(bounds[i + 1]), w = x1 - x0;
    const year = b.slice(0, 4), n = counts[year] || 0;
    const full = `${year} · ${n}`;
    const text = w >= full.length * 7 + 8 ? full : w >= year.length * 7 + 4 ? year : '';
    return text ? `<text class="su-tl-year" x="${(x0 + x1) / 2}" y="${base + 20}" text-anchor="middle">${esc(text)}</text>` : '';
  }).join('');

  const dots = tlDots.map((d, i) =>
    `<circle class="su-dot" data-i="${i}" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${r}"/>`).join('');

  tlPlot.innerHTML = `<svg class="su-tl-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
      role="img" aria-labelledby="su-tl-cap">
    <line class="su-tl-axis" x1="${padX}" x2="${W - padX}" y1="${base}" y2="${base}"/>
    ${ticks}${labels}${dots}
  </svg>`;
  dimTimeline();
}

// Filters dim the dots they hide; the layout does not move.
function dimTimeline() {
  tlPlot.querySelectorAll('.su-dot').forEach(el => {
    el.classList.toggle('is-dim', !passes(tlDots[+el.dataset.i].c));
  });
}

function nearestDot(evt) {
  const box = tlPlot.getBoundingClientRect();
  const px = evt.clientX - box.left, py = evt.clientY - box.top;
  let best = null, bestD = 18;               // pointer only has to be closest, within 18 px
  tlDots.forEach((d, i) => {
    const dist = Math.hypot(d.x - px, d.y - py);
    if (dist < bestD) { best = i; bestD = dist; }
  });
  return best;
}

function showTip(i) {
  if (tlHover !== null) tlPlot.querySelector(`.su-dot[data-i="${tlHover}"]`)?.classList.remove('is-hover');
  tlHover = i;
  if (i === null) { tlTip.hidden = true; tlPlot.classList.remove('is-pointing'); return; }
  const d = tlDots[i];
  tlPlot.querySelector(`.su-dot[data-i="${i}"]`)?.classList.add('is-hover');
  tlPlot.classList.add('is-pointing');
  // Names are contributor data: built with textContent, never innerHTML.
  const name = document.createElement('strong');
  name.textContent = d.c.name;
  const when = document.createElement('span');
  when.textContent = `Registered ${fmtDay(d.c.registered)}`;
  const what = document.createElement('span');
  what.textContent = `${SECTOR_CONFIG[d.c.sector].label} · ${d.c.city}`;
  tlTip.replaceChildren(name, when, what);
  tlTip.hidden = false;
  // Above the dot, kept inside the figure.
  const plotBox = tlPlot.getBoundingClientRect(), figBox = tlTip.parentElement.getBoundingClientRect();
  const left = Math.min(Math.max(plotBox.left - figBox.left + d.x - tlTip.offsetWidth / 2, 0),
    figBox.width - tlTip.offsetWidth);
  tlTip.style.left = `${left}px`;
  tlTip.style.top = `${plotBox.top - figBox.top + d.y - tlTip.offsetHeight - 12}px`;
}

tlPlot.addEventListener('pointermove', e => {
  const i = nearestDot(e);
  if (i !== tlHover) showTip(i);
});
tlPlot.addEventListener('pointerleave', () => showTip(null));
tlPlot.addEventListener('click', e => {
  const i = nearestDot(e);
  if (i !== null) goToCard(tlDots[i].c);
});

// Re-lay the strip when its width changes (window resize, phone rotation).
let tlFrame = 0;
new ResizeObserver(() => {
  cancelAnimationFrame(tlFrame);
  tlFrame = requestAnimationFrame(() => { showTip(null); layoutTimeline(); });
}).observe(tlPlot);

// ── Toolbar ───────────────────────────────────────────────────────────────────

const sectorBox = document.getElementById('su-sectors');
const stateSelect = document.getElementById('su-state');
const searchInput = document.getElementById('su-search');
const clearBtn = document.getElementById('su-clear');

[['all', 'All', '#64748b'], ...Object.entries(SECTOR_CONFIG).map(([k, v]) => [k, v.label, v.color])]
  .forEach(([sector, label, color]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn';
    btn.dataset.sector = sector;
    btn.style.setProperty('--clr', color);
    btn.innerHTML = (sector === 'all' ? '' : `<span class="chip-icon">${sectorIconSvg(sector)}</span>`)
      + `<span>${esc(label)}</span><span class="chip-count"></span>`;
    btn.addEventListener('click', () => {
      if (sector === 'all') active.sectors.clear();
      else active.sectors.has(sector) ? active.sectors.delete(sector) : active.sectors.add(sector);
      render();
    });
    sectorBox.appendChild(btn);
  });

stateSelect.addEventListener('change', () => { active.state = stateSelect.value; render(); });
searchInput.addEventListener('input', () => { active.q = searchInput.value.trim(); render(); });
clearBtn.addEventListener('click', () => { clearFilters(); render(); });

// Each control counts what it would show under the *other* active filters, the
// same rule as the map's chips, so the numbers say where the startups are before
// anyone clicks.
function renderControls() {
  let inScope = 0;
  sectorBox.querySelectorAll('.filter-btn').forEach(b => {
    const s = b.dataset.sector;
    const pressed = s === 'all' ? active.sectors.size === 0 : active.sectors.has(s);
    b.classList.toggle('active', pressed);
    b.setAttribute('aria-pressed', String(pressed));
    if (s === 'all') return;
    const n = STARTUPS.filter(c => c.sector === s && stateOk(c) && textOk(c)).length;
    b.querySelector('.chip-count').textContent = n;
    const empty = n === 0 && !active.sectors.has(s);
    b.classList.toggle('chip-empty', empty);
    b.disabled = empty;   // inactive, for keyboards and screen readers too
    inScope += n;
  });
  sectorBox.querySelector('[data-sector="all"] .chip-count').textContent = inScope;

  // Every state is offered, the empty ones included: picking one shows the gap.
  const inState = id => STARTUPS.filter(c => c.state === id && sectorOk(c) && textOk(c)).length;
  const all = STARTUPS.filter(c => sectorOk(c) && textOk(c)).length;
  stateSelect.innerHTML = `<option value="">All states (${all})</option>`
    + REGIONS.slice().sort((a, b) => a.name.localeCompare(b.name))
      .map(r => `<option value="${escapeAttr(r.id)}">${esc(r.name)} (${inState(r.id)})</option>`).join('');
  stateSelect.value = active.state;
  if (searchInput.value.trim() !== active.q) searchInput.value = active.q;
  clearBtn.hidden = !anyFilter();
}

// ── The list ──────────────────────────────────────────────────────────────────

function cardHtml(c) {
  const cfg = SECTOR_CONFIG[c.sector];
  const sources = (c.sources || []).map(s => `<li>
      <a href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer">${esc(SOURCE_LABEL[s.type] ?? s.type)}&nbsp;&#8599;</a>
      <span>${esc(s.note || '')}</span>
    </li>`).join('');
  return `<article class="su-card" id="${escapeAttr(startupAnchor(c.name))}" tabindex="-1" style="--sector-clr:${cfg.color}">
    <div class="su-card-head">
      <h3 class="su-name">${esc(c.name)}</h3>
      <span class="su-reg" title="First entry in the commercial register: ${escapeAttr(fmtDay(c.registered))}">${esc(fmtMonth(c.registered))}</span>
    </div>
    <p class="su-meta"><span class="su-sector" style="color:${cfg.color}">${sectorIconSvg(c.sector)}</span>
      <span>${esc(cfg.label)} &middot; ${esc(placeOf(c))}${c.founded ? ` &middot; founded ${esc(c.founded)}` : ''}</span></p>
    <p class="su-desc">${esc(c.description)}</p>
    <div class="su-actions">
      <a class="su-btn" href="${escapeAttr(c.website)}" target="_blank" rel="noopener noreferrer">Website&nbsp;&#8599;</a>
      <a class="su-link" href="${escapeAttr(jobsUrl(c))}" target="_blank" rel="noopener noreferrer">${jobsLabel(c)}&nbsp;&#8599;</a>
      <a class="su-link" href="index.html?c=${encodeURIComponent(c.name)}">Show on map&nbsp;&rarr;</a>
    </div>
    <details class="su-sources">
      <summary>Sources <span class="su-n">${(c.sources || []).length}</span></summary>
      <ul>${sources}</ul>
      <p class="su-checked">${esc(c.legalName)} &middot; ${esc(c.register)} &middot; checked ${esc(fmtDay(c.verified))}</p>
    </details>
  </article>`;
}

function emptyHtml() {
  // A state with nothing listed at all is a gap in this list, not in the state:
  // say how many startups the national count puts there.
  if (active.state && !STARTUPS.some(c => c.state === active.state)) {
    const natHere = NATIONAL.states[active.state];
    return `<div class="su-empty">
      <p><strong>None listed in ${esc(stateName(active.state))} yet.</strong>
        ${natHere !== undefined ? `${natHere} startups were founded there in ${esc(NATIONAL_LATEST_LABEL)} alone, by the national count, so this is a gap in the list, not in the state.` : ''}</p>
      <p><a href="${REPO}CONTRIBUTING.md#add-a-new-startup" target="_blank" rel="noopener noreferrer">Suggest one</a>
        or <button type="button" class="su-empty-clear">show all states</button>.</p>
    </div>`;
  }
  return `<div class="su-empty">
    <p><strong>No startups match these filters.</strong></p>
    <p><button type="button" class="su-empty-clear">Clear filters</button></p>
  </div>`;
}

function renderList() {
  const list = STARTUPS.filter(passes);
  document.getElementById('su-count').textContent = anyFilter()
    ? `Showing ${list.length} of ${STARTUPS.length}`
    : plural(STARTUPS.length, 'startup', 'startups');

  // Grouped by the year of the register entry, newest first.
  const years = [...new Set(list.map(c => c.registered.slice(0, 4)))];
  document.getElementById('su-list').innerHTML = list.length
    ? years.map(y => {
        const cards = list.filter(c => c.registered.startsWith(y));
        return `<section class="su-year" aria-labelledby="su-y-${y}">
          <h2 class="su-year-title" id="su-y-${y}">Registered in ${y} <span class="su-n">${cards.length}</span></h2>
          <div class="su-cards">${cards.map(cardHtml).join('')}</div>
        </section>`;
      }).join('')
    : emptyHtml();
}

document.getElementById('su-list').addEventListener('click', e => {
  if (!e.target.closest('.su-empty-clear')) return;
  clearFilters();
  render();
});

// ── How complete it is ────────────────────────────────────────────────────────

function renderCoverage() {
  const listed = STARTUPS.length;
  const rej = NEW_STARTUP_REVIEW.rejected;
  const checked = listed + rej.length;

  // What was checked and left out, by reason, largest first.
  const byReason = {};
  rej.forEach(r => { byReason[r.reason] = (byReason[r.reason] || 0) + 1; });
  const reasons = Object.entries(byReason).sort((a, b) => b[1] - a[1])
    .map(([r, n]) => `${n} ${REASON_LABEL[r] ?? r}`);
  const items = rej.slice().sort((a, b) => a.name.localeCompare(b.name)).map(r => `<li>
      <span class="rej-name">${r.source ? `<a href="${escapeAttr(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>` : esc(r.name)}</span>
      <span class="rej-reason">${esc(REASON_LABEL[r.reason] ?? r.reason)}${r.registered ? ` &middot; registered ${esc(fmtDay(r.registered))}` : ''}</span>
      ${r.note ? `<span class="rej-note">${esc(r.note)}</span>` : ''}
    </li>`).join('');
  const leads = NEW_STARTUP_REVIEW.leads.map(l => {
    const name = l.source ? `<a href="${escapeAttr(l.source)}" target="_blank" rel="noopener noreferrer">${esc(l.name)}</a>` : esc(l.name);
    return l.city ? `${name} (${esc(l.city)})` : name;
  }).join(', ');

  // Where Germany's startups were founded in the latest half-year the report
  // covers, next to where this list has its entries. Emphasis form: this list in
  // gold, the national context in grey; every row carries both numbers, so the
  // bars never have to be read for an exact value. Sorted by the national count,
  // so the biggest gaps sit at the top.
  const natTotal = Object.values(NATIONAL.states).reduce((a, b) => a + b, 0);
  const byState = {};
  STARTUPS.forEach(c => { byState[c.state] = (byState[c.state] || 0) + 1; });
  const maxShare = Math.max(...Object.keys(NATIONAL.states).map(s =>
    Math.max(NATIONAL.states[s] / natTotal, (byState[s] || 0) / (listed || 1))));
  const rows = Object.entries(NATIONAL.states).sort((a, b) => b[1] - a[1]).map(([s, n]) => {
    const mine = byState[s] || 0;
    const wNat = (100 * (n / natTotal) / maxShare).toFixed(1);
    const wMine = (100 * (mine / (listed || 1)) / maxShare).toFixed(1);
    return `<li class="cov-row${mine ? '' : ' cov-gap'}">
      <span class="cov-state">${esc(stateName(s))}</span>
      <span class="cov-bars" aria-hidden="true">
        <span class="cov-bar cov-nat" style="width:${wNat}%"></span>
        <span class="cov-bar cov-mine" style="width:${wMine}%"></span>
      </span>
      <span class="cov-num">${pct(n, natTotal)}<span class="su-sr"> of German foundings,</span>
        <span class="cov-sep" aria-hidden="true">/</span> ${mine ? `${pct(mine, listed)}<span class="su-sr"> of this list</span>` : '—<span class="su-sr"> none on this list</span>'}</span>
    </li>`;
  }).join('');
  const missing = Object.keys(NATIONAL.states).filter(s => !byState[s]).map(stateName);

  document.getElementById('su-coverage').innerHTML = `
    <h2 class="su-h2" id="cov-title">How complete is this list?</h2>
    <div class="su-cov-grid">
      <div>
        <p class="su-cov-lead"><strong>${listed}</strong> of <strong>≈${fmtApprox(EST.total)}</strong>
          startups founded in Germany since ${esc(fmtDay(NEW_SINCE))}: about <strong>${pct(listed, EST.total)}</strong>.</p>
        <p class="su-text">Every entry is checked by hand, one company at a time. Discovery goes through
          press, investors and university spin-off pages, so the list leans towards funded startups that
          have been written about, and towards Munich and Berlin, where most of that writing happens.
          The newest months are the thinnest, because coverage lags founding. Every two weeks a script
          collects new names from the startup press, and each one waits below until it has been checked.</p>

        <h3 class="su-h3">What was checked</h3>
        <div class="su-meter" role="img" aria-label="${listed} of ${checked} candidates checked made the list">
          <span class="su-meter-fill" style="width:${checked ? (100 * listed / checked).toFixed(1) : 0}%"></span>
        </div>
        <p class="su-text"><strong>${listed} of ${checked}</strong> candidates made the list. Left out:
          ${esc(reasons.join(', '))}.</p>
        <details class="su-details">
          <summary>All ${rej.length} left out, with the reason</summary>
          <ul class="rej-list">${items}</ul>
        </details>
        ${INACTIVE.length ? `<p class="su-fine">No longer active, kept as a record: ${INACTIVE.map(c => esc(c.name)).join(', ')}.</p>` : ''}
        ${leads ? `<details class="su-details">
          <summary>${plural(NEW_STARTUP_REVIEW.leads.length, 'more name', 'more names')} from the press, not checked yet</summary>
          <p class="su-fine">Named in sources, and not on this list until someone has checked them: ${leads}.</p>
        </details>` : ''}
      </div>

      <div>
        <h3 class="su-h3">Where startups are founded, and where this list has them</h3>
        <p class="cov-key">
          <span class="cov-k"><span class="cov-swatch cov-nat"></span>Share of German startup foundings, ${esc(NATIONAL_LATEST_LABEL)}</span>
          <span class="cov-k"><span class="cov-swatch cov-mine"></span>Share of this list</span>
        </p>
        <ul class="cov-rows">${rows}</ul>
        ${missing.length ? `<p class="su-fine">No entries yet in ${esc(missing.join(', '))}.</p>` : ''}
      </div>
    </div>
    <p class="su-fine su-source">National count: <a href="${escapeAttr(NATIONAL.url)}" target="_blank" rel="noopener noreferrer">Startup-Verband and startupdetector</a>,
      all sectors, counted when a startup enters the register${EST.extrapolated >= 1
        ? `; the ≈${fmtApprox(EST.extrapolated)} since ${esc(fmtDay(EST.since))} are extrapolated from the latest half-year` : ''}.
      Last full check of this list ${esc(fmtDay(NEW_STARTUP_REVIEW.reviewed))}. A startup leaves this page three years
      after its register entry and stays on the map.
      <a href="${REPO}NEW-STARTUPS.md" target="_blank" rel="noopener noreferrer">How this list is built</a></p>`;
}

// ── Going to one startup ──────────────────────────────────────────────────────
// From a timeline dot, or from the map (startups.html#startup-…). If the filters
// hide that card, they are cleared first: asking for a startup by name should
// never land on nothing.

function goToCard(c) {
  const id = startupAnchor(c.name);
  if (location.hash === `#${id}`) revealCard(id);
  else location.hash = id;               // hashchange → revealCard
}

function revealCard(id) {
  let card = document.getElementById(id);
  if (!card && STARTUPS.some(c => startupAnchor(c.name) === id)) {
    clearFilters();
    render();
    card = document.getElementById(id);
  }
  if (!card) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  card.scrollIntoView({ block: 'center', behavior: motion });
  card.focus({ preventScroll: true });
}

window.addEventListener('hashchange', () => revealCard(location.hash.slice(1)));

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  renderControls();
  renderList();
  dimTimeline();
  syncUrl();
}

readUrl();
renderHero();
renderTimelineCaption();
renderCoverage();
render();
layoutTimeline();

// The browser jumps to a #startup-… anchor before this script has drawn the
// cards, so reveal it now that they exist; :target in the CSS highlights it.
if (location.hash) revealCard(location.hash.slice(1));
