#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Link checker. Every entry on the map carries a `website` — that link is the
// whole point of a dot, so a dead one silently breaks the map.
//
//   node scripts/check-links.mjs             check every entry
//   node scripts/check-links.mjs --changed   only URLs added/changed vs the base
//   node scripts/check-links.mjs --json      machine-readable report on stdout
//   node scripts/check-links.mjs --base main  base ref for --changed (default: origin/main)
//
// Verdicts — the point is to be trustworthy, not strict. A checker that cries
// wolf gets muted, and then it protects nothing.
//
//   ok            2xx/3xx
//   moved         resolved onto a different host — the entry should be updated
//   unverifiable  401/403/429/5xx — blocked or server-side. Never fails the run.
//   unreachable   timeout, reset, refused, TLS error. Never fails the run.
//   dead          404/410/451, or DNS said the host does not exist
//
// Only `dead` fails the run, and `dead` means the *server answered definitively*
// that nothing is there. This distinction is load-bearing: a trial run of all 245
// URLs from a sandboxed network produced 119 "dead" entries — BMW, Siemens, SAP
// and Deutsche Telekom among them — every one a timeout or a connection reset,
// and not one a real HTTP error. Treating those as dead would have filed a weekly
// issue full of false alarms until nobody read it.
//
// Exits non-zero only when something is `dead`. No dependencies (Node 18+ fetch).
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const JSON_OUT = argv.includes("--json");
const CHANGED = argv.includes("--changed");
const flagValue = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};
const BASE = flagValue("--base", "origin/main");

const UA = "robonn-industry-map-linkcheck/1.0 (https://github.com/robonn-club/industry-map; +link health)";
// Some hosts serve a plain 403 to anything that doesn't look like a browser, and
// we would rather re-check with a browser UA than mark a live site unverifiable.
const BROWSER_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
// Big corporate sites are slow to first byte and throttle parallel connections
// from a single address, so this errs toward patience over speed.
const CONCURRENCY = 6;
const TIMEOUT_MS = 15000;
const RETRIES = 2;            // extra GETs for timeouts / transient sockets only

// A definitive "nothing here" from the server. Everything else is a maybe.
const DEAD_STATUS = new Set([404, 410, 451]);
// DNS-level "this host does not exist". EAI_AGAIN is deliberately absent — it is
// a transient resolver failure, not a missing domain.
const DEAD_DNS = new Set(["ENOTFOUND"]);
// Statuses where a different method or User-Agent might still succeed.
const RETRYABLE = new Set([403, 405, 429, 500, 502, 503]);

// Same loader and source list as scripts/validate.mjs — one definition of where
// the data lives, so the two scripts can never disagree about what is on the map.
function load(file, varName) {
  try {
    const src = readFileSync(join(ROOT, file), "utf8");
    return new Function(`${src};return typeof ${varName}!=="undefined"?${varName}:null;`)();
  } catch {
    return null;
  }
}

const SOURCES = [
  ["data/companies/global.js", "COMPANIES_GLOBAL"],
  ["data/companies/big.js", "COMPANIES_BIG"],
  ["data/companies/mid.js", "COMPANIES_MID"],
  ["data/companies/startup.js", "COMPANIES_STARTUP"],
  ["data/institutes.js", "INSTITUTES"],
];

function collectEntries() {
  const out = [];
  for (const [file, varName] of SOURCES) {
    const arr = load(file, varName);
    if (arr == null) {
      console.error(`✗ ${file}: could not load ${varName}`);
      process.exit(2);
    }
    for (const e of arr) if (e?.website) out.push({ name: e.name, url: e.website, file });
  }
  return out;
}

// --changed: only the URLs this branch actually touched, so a one-company PR
// costs one request instead of 245.
function changedUrls() {
  let diff = "";
  for (const range of [`${BASE}...HEAD`, "HEAD~1...HEAD", ""]) {
    try {
      diff = execSync(`git diff --unified=0 ${range} -- data/`, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      if (diff.trim()) break;
    } catch { /* ref not available (shallow clone, first commit) — try the next */ }
  }
  const urls = new Set();
  for (const line of diff.split("\n")) {
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    for (const m of line.matchAll(/https?:\/\/[^\s"'`,)]+/g)) urls.add(m[0]);
  }
  return urls;
}

const hostOf = (u) => { try { return new URL(u).host.replace(/^www\./, ""); } catch { return null; } };

async function request(url, method, ua) {
  const res = await fetch(url, {
    method,
    redirect: "follow",
    headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml,*/*" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // Release the socket. Without this Node keeps every connection open and the
  // process never exits — it just hangs with all output stuck in the pipe.
  try { await res.body?.cancel(); } catch { /* already consumed or empty */ }
  return res;
}

// HEAD first (cheap), but a HEAD rejection says nothing about the page, so fall
// back to GET, then to GET with a browser UA, before believing a failure.
// Retries after that are network-errors-only and GET-only: once a server has
// returned a real status code, asking again just burns runner minutes. That caps
// one URL at 5 requests rather than the 9 an earlier version allowed.
async function check(url) {
  if (!/^https?:\/\//i.test(url)) return { verdict: "dead", detail: "not an http(s) URL" };

  const conclusive = (r) => r && r.status > 0 && (r.status < 400 || !RETRYABLE.has(r.status));
  let last = null;

  for (const [method, ua] of [["HEAD", UA], ["GET", UA], ["GET", BROWSER_UA]]) {
    try {
      const res = await request(url, method, ua);
      last = { status: res.status, final: res.url };
      if (conclusive(last)) break;
    } catch (e) {
      last = { status: 0, detail: e?.cause?.code || e?.name || "request failed" };
    }
  }

  // Only a network-level failure earns a retry — and only as a GET.
  for (let round = 0; last && last.status === 0 && !DEAD_DNS.has(last.detail) && round < RETRIES; round++) {
    await new Promise((r) => setTimeout(r, 800 * (round + 1)));
    try {
      const res = await request(url, "GET", BROWSER_UA);
      last = { status: res.status, final: res.url };
    } catch (e) {
      last = { status: 0, detail: e?.cause?.code || e?.name || "request failed" };
    }
  }

  if (!last) return { verdict: "unreachable", detail: "no response" };

  if (last.status === 0) {
    return DEAD_DNS.has(last.detail)
      ? { verdict: "dead", detail: last.detail }
      : { verdict: "unreachable", detail: last.detail };
  }
  if (last.status < 400) {
    const from = hostOf(url), to = hostOf(last.final);
    if (from && to && from !== to) return { verdict: "moved", status: last.status, final: last.final };
    return { verdict: "ok", status: last.status };
  }
  if (DEAD_STATUS.has(last.status)) return { verdict: "dead", status: last.status };
  return { verdict: "unverifiable", status: last.status };   // 401/403/429/5xx — blocked or flaky
}

async function main() {
  let entries = collectEntries();

  if (CHANGED) {
    const urls = changedUrls();
    entries = entries.filter((e) => urls.has(e.url));
    if (!entries.length) {
      if (JSON_OUT) console.log(JSON.stringify({ checked: 0, ok: 0, dead: [], moved: [], unverifiable: [], unreachable: [] }, null, 2));
      else console.log("✓ no website URLs added or changed — nothing to check.");
      return 0;
    }
  }

  const results = [];
  let i = 0, done = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < entries.length) {
      const e = entries[i++];
      const r = await check(e.url);
      results.push({ ...e, ...r });
      done++;
      // Progress on stderr so --json stdout stays clean and pipeable.
      if (!JSON_OUT) process.stderr.write(`\r  checked ${done}/${entries.length}…`);
    }
  }));
  if (!JSON_OUT) process.stderr.write("\r" + " ".repeat(32) + "\r");

  const by = (v) => results.filter((r) => r.verdict === v).sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name));
  const dead = by("dead"), moved = by("moved"), unver = by("unverifiable"),
        unreach = by("unreachable"), ok = by("ok");

  if (JSON_OUT) {
    console.log(JSON.stringify(
      { checked: results.length, ok: ok.length, dead, moved, unverifiable: unver, unreachable: unreach }, null, 2));
    return dead.length ? 1 : 0;
  }

  console.log(`checked ${results.length}  ·  ok ${ok.length}  ·  moved ${moved.length}`
    + `  ·  unverifiable ${unver.length}  ·  unreachable ${unreach.length}  ·  dead ${dead.length}\n`);

  if (dead.length) {
    console.log(`✗ ${dead.length} dead link(s) — these need fixing:`);
    for (const r of dead) console.log(`  [${r.status || r.detail}] ${r.name} — ${r.url}  (${r.file})`);
    console.log("");
  }
  if (moved.length) {
    console.log(`→ ${moved.length} link(s) now resolve to a different host — worth updating:`);
    for (const r of moved) console.log(`  ${r.name}: ${r.url}  →  ${r.final}  (${r.file})`);
    console.log("");
  }
  if (unver.length) {
    console.log(`? ${unver.length} link(s) blocked the checker or errored server-side (not broken):`);
    for (const r of unver) console.log(`  [${r.status}] ${r.name} — ${r.url}`);
    console.log("");
  }
  if (unreach.length) {
    console.log(`~ ${unreach.length} link(s) could not be reached from here — network, not the link:`);
    for (const r of unreach) console.log(`  [${r.detail}] ${r.name} — ${r.url}`);
    console.log("");
  }
  if (!dead.length) console.log("✓ no dead links.");
  return dead.length ? 1 : 0;
}

// Explicit exit: even with every body cancelled, a keep-alive socket can hold
// the event loop open long after the report is written.
main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(2); });
