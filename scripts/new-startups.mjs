#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// New startups: coverage and maintenance report.
//
//   node scripts/new-startups.mjs           report as Markdown (stdout)
//   node scripts/new-startups.mjs --json    the same, machine-readable
//
// Reads data/companies/new-startups.js and new-startups.review.js and answers the
// questions that keep the Startups page honest:
//
//   • How many startups does the page hold, against how many were founded in
//     Germany in the same three-year window (Startup-Verband / startupdetector)?
//   • Where are the gaps — by state, by sector?
//   • What needs doing: entries that have aged out of the window (move them to
//     the size file that fits), entries whose last check is older than
//     RECHECK_DAYS, national counts that are out of date, a finder that has added
//     nothing for FINDER_STALE_DAYS, and who ages out next.
//
// It never edits data and never contacts the commercial register: register
// lookups stay manual (see NEW-STARTUPS.md for why). No dependencies. New names
// come from scripts/find-startups.mjs.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JSON_OUT = process.argv.includes("--json");

const WINDOW_YEARS = 3;
const RECHECK_DAYS = 180;         // re-verify every entry about twice a year
const NATIONAL_STALE_DAYS = 270;  // a half-year report is due every ~6 months
const SOON_DAYS = 90;             // "ages out within" horizon
const FINDER_STALE_DAYS = 45;     // three runs of the two-weekly finder with nothing merged

const load = (file, varName) =>
  new Function(`${readFileSync(join(ROOT, file), "utf8")};return ${varName};`)();

const NEW = load("data/companies/new-startups.js", "NEW_STARTUPS");
const REVIEW = load("data/companies/new-startups.review.js", "NEW_STARTUP_REVIEW");
const FINDER = JSON.parse(readFileSync(join(ROOT, "data/companies/new-startups.seen.json"), "utf8"));

const DAY = 864e5;
const iso = (d) => d.toISOString().slice(0, 10);
const now = new Date();
const today = iso(now);
const since = iso(new Date(Date.UTC(now.getUTCFullYear() - WINDOW_YEARS, now.getUTCMonth(), now.getUTCDate())));
const daysBetween = (a, b) => Math.max(0, (Date.parse(b) - Date.parse(a)) / DAY);
const addYears = (day, n) => `${+day.slice(0, 4) + n}${day.slice(4)}`;

// Same rule as js/common.js: new while the first register entry is inside the window
// and the company's own stated founding year is not already older than it.
const isNew = (e) => e.status !== "inactive" && e.registered >= since
  && !(e.founded && e.founded < +since.slice(0, 4));

const listed = NEW.filter(isNew);
const agedOut = NEW.filter(e => e.status !== "inactive" && !isNew(e));
const inactive = NEW.filter(e => e.status === "inactive");
const overdue = listed.filter(e => daysBetween(e.verified, today) > RECHECK_DAYS);
const soon = listed
  .map(e => ({ e, leaves: addYears(e.registered, WINDOW_YEARS) }))
  .filter(({ leaves }) => daysBetween(today, leaves) <= SOON_DAYS)
  .sort((a, b) => a.leaves.localeCompare(b.leaves));
const dateGaps = listed.filter(e => e.founded && e.founded !== +e.registered.slice(0, 4));

// National baseline for the window, as the app computes it: half-years prorated
// by overlap, months not yet reported extrapolated from the latest daily rate.
const nat = REVIEW.national;
const keys = Object.keys(nat.halfYears).sort();
const halfRange = (k) => {
  const [y, h] = k.split("-");
  return h === "H1" ? [`${y}-01-01`, `${y}-07-01`] : [`${y}-07-01`, `${+y + 1}-01-01`];
};
const end = iso(new Date(Date.parse(today) + DAY));
let counted = 0;
for (const k of keys) {
  const [s, e] = halfRange(k);
  counted += nat.halfYears[k] * daysBetween(s > since ? s : since, e < end ? e : end) / daysBetween(s, e);
}
const [ls, le] = halfRange(keys[keys.length - 1]);
const extrapolated = nat.halfYears[keys[keys.length - 1]] / daysBetween(ls, le) * daysBetween(le > since ? le : since, end);
const estimate = counted + extrapolated;
const nationalAgeDays = daysBetween(le, today);
// When the finder's proposals last reached main. It finds about 30 names every two weeks,
// so a long silence means a pull request nobody reviewed, or a source that changed.
const finderAgeDays = daysBetween(FINDER.updated, today);

const count = (arr, key) => arr.reduce((m, e) => ((m[e[key]] = (m[e[key]] || 0) + 1), m), {});
const byState = count(listed, "state");
const bySector = count(listed, "sector");
const byReason = count(REVIEW.rejected, "reason");
const natTotal = Object.values(nat.states).reduce((a, b) => a + b, 0);
const stateRows = Object.entries(nat.states).sort((a, b) => b[1] - a[1]).map(([s, n]) => ({
  state: s, national: n, nationalShare: n / natTotal,
  listed: byState[s] || 0, listedShare: (byState[s] || 0) / (listed.length || 1),
}));

const report = {
  today, windowStart: since,
  listed: listed.length, agedOut: agedOut.map(e => e.name), inactive: inactive.map(e => e.name),
  national: {
    estimate: Math.round(estimate), extrapolated: Math.round(extrapolated),
    latestHalfYear: keys[keys.length - 1], ageDays: Math.round(nationalAgeDays),
    stale: nationalAgeDays > NATIONAL_STALE_DAYS,
  },
  coverage: listed.length / estimate,
  states: stateRows, sectors: bySector,
  reviewed: REVIEW.reviewed, rejected: REVIEW.rejected.length, rejectedByReason: byReason,
  leads: REVIEW.leads.length,
  overdue: overdue.map(e => ({ name: e.name, verified: e.verified })),
  agesOutSoon: soon.map(({ e, leaves }) => ({ name: e.name, leaves })),
  foundedDiffersFromRegistered: dateGaps.map(e => ({ name: e.name, founded: e.founded, registered: e.registered })),
  finder: { updated: FINDER.updated, seen: FINDER.seen.length, ageDays: Math.round(finderAgeDays), stale: finderAgeDays > FINDER_STALE_DAYS },
};
report.maintenanceDue = report.agedOut.length > 0 || report.overdue.length > 0 || report.national.stale || report.finder.stale;

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

const pct = (x) => (x >= 0.01 ? `${(100 * x).toFixed(0)}%` : `${(100 * x).toFixed(1)}%`);
const out = [];
out.push(`# New startups — coverage report (${today})`, "");
out.push(`Window: first register entry on or after **${since}**.`, "");
const approx = (n) => (Math.round(n / 100) * 100).toLocaleString("en-US");
out.push(`**${listed.length} startups listed** — about **${pct(report.coverage)}** of the`
  + ` ≈${approx(estimate)} startups founded in Germany in the window`
  + ` (Startup-Verband / startupdetector, all sectors; ≈${approx(extrapolated)}`
  + ` extrapolated from ${le} on). A verified sample, not a census.`, "");

out.push("## Maintenance", "");
const todo = [];
if (agedOut.length) todo.push(`- **Aged out of the window** — move to the size file that fits: ${agedOut.map(e => `${e.name} (registered ${e.registered})`).join(", ")}`);
if (overdue.length) todo.push(`- **Due for re-check** (last verified over ${RECHECK_DAYS} days ago): ${overdue.map(e => `${e.name} (${e.verified})`).join(", ")}`);
if (report.finder.stale) todo.push(`- **The finder has added nothing for ${report.finder.ageDays} days** — review the open pull request *New startups to review*, or read the *Find startups* run log: a source may have changed`);
if (report.national.stale) todo.push(`- **National counts are ${Math.round(nationalAgeDays)} days past their latest half-year (${keys[keys.length - 1]})** — add the newest report to new-startups.review.js`);
out.push(...(todo.length ? todo : ["- Nothing due."]), "");
if (soon.length) out.push(`Ageing out within ${SOON_DAYS} days (last day in the window): ${soon.map(({ e, leaves }) => `${e.name} ${leaves}`).join(", ")}.`, "");

out.push("## By state", "", "| State | national share | listed | share of list |", "|---|---:|---:|---:|");
for (const r of stateRows) out.push(`| ${r.state} | ${pct(r.nationalShare)} | ${r.listed} | ${r.listed ? pct(r.listedShare) : "—"} |`);
out.push("", `National shares: ${keys[keys.length - 1]} foundings per state.`
  + ` States with none listed: ${stateRows.filter(r => !r.listed).map(r => r.state).join(", ") || "none"}.`, "");

out.push("## By sector", "");
for (const [s, n] of Object.entries(bySector).sort((a, b) => b[1] - a[1])) out.push(`- ${s}: ${n}`);
out.push("");

out.push("## Review record", "");
out.push(`${listed.length + REVIEW.rejected.length} candidates checked (last pass ${REVIEW.reviewed}):`
  + ` ${listed.length} listed, ${Object.entries(byReason).map(([r, n]) => `${n} ${r}`).join(", ")}.`
  + ` ${REVIEW.leads.length} leads not yet checked.`, "");
if (dateGaps.length) {
  out.push(`Stated founding year differs from the register year (expected for some; check none is an older business):`);
  for (const e of dateGaps) out.push(`- ${e.name}: founded ${e.founded}, registered ${e.registered}`);
  out.push("");
}
console.log(out.join("\n"));
