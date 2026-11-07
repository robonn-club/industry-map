#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// The startup finder: propose leads for the Startups page, every two weeks.
//
//   node scripts/find-startups.mjs                 show what would be proposed
//   node scripts/find-startups.mjs --write         add the proposals to the review file
//   node scripts/find-startups.mjs --report FILE   also write the summary to FILE
//   node scripts/find-startups.mjs --since DATE    look further back than LOOKBACK_DAYS
//
// It reads the startup press (SOURCES below), keeps the names that fall inside the
// map's seven domains, and reads each company's own imprint for its legal entity and
// register number. The "Find startups" workflow then opens one pull request for a
// person to review. A lead is only a name: nothing joins the list of startups until
// the five-step check in NEW-STARTUPS.md has been done. Everything proposed is
// remembered in new-startups.seen.json, so a lead deleted in review does not return.
//
// What it never does:
//   • Contact the commercial register or North Data. The first-entry date stays a
//     manual check, because the register's terms forbid automated retrieval.
//   • Copy article text. Those paragraphs name founders; only company facts and a
//     link back to the article are kept.
//   • Read a page that robots.txt closes to it. Run by an AI agent, it obeys the rules
//     written for AI agents, because some sources allow scripts but not those.
//
// No dependencies. Node 18+ for global fetch; CI pins Node 22.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REVIEW_FILE = "data/companies/new-startups.review.js";
const SEEN_FILE = "data/companies/new-startups.seen.json";

const LOOKBACK_DAYS = 35;   // longer than the gap between runs, so a failed run is caught up
const MAX_PROPOSALS = 20;   // what one review sitting can check; the rest wait for the next run
const WINDOW_YEARS = 3;
const TIMEOUT_MS = 15000;
const PAUSE_MS = 1000;      // between one company's site and the next
const TEXT_LIMIT = 700;     // how much of an article the scope words are matched against: its opening

const AGENT_NAME = "robonn-industry-map-finder";
const AGENT = `${AGENT_NAME}/1.0 (+https://github.com/robonn-club/industry-map)`;
// Claude Code sets CLAUDECODE. A site that closes itself to AI agents has closed itself
// to a session running this script, whatever the User-Agent header says.
const AI_AGENT = process.env.CLAUDECODE ? "Claude-User" : null;

const wordpress = (host, query = {}) => ({ api: `https://${host}/wp-json/wp/v2/posts`, query });

// Each source is a public WordPress API, read once per run. To follow another one, add
// it here. A source that lists companies under bold headings needs a reader like
// readColumn; for ordinary articles, readTitleLinks works as it is.
//
// deutsche-startups.de's robots.txt allows ordinary clients, sets search=yes and
// ai-train=no, and names AI agents (Claude among them) as disallowed. See NEW-STARTUPS.md.
export const SOURCES = [
  // "5 neue Startups": founded in the last weeks and months, the newest names in the press.
  { label: "deutsche-startups.de, #Brandneu", ...wordpress("www.deutsche-startups.de", { tags: 1756 }), read: readColumn },
  // Hamburg has no entry yet, against 7% of national foundings.
  { label: "Hamburg Startups", ...wordpress("www.hamburg-startups.net"), read: readTitleLinks },
  // Robotics and agriculture are what Robonn exists for; both write about the world, so
  // the search narrows them and the imprint decides what is really German.
  { label: "Robotics & Automation News", ...wordpress("roboticsandautomationnews.com", { search: "German startup" }), read: readTitleLinks },
  { label: "AgFunderNews", ...wordpress("agfundernews.com", { search: "Germany" }), read: readTitleLinks },
];

// ── Text ──────────────────────────────────────────────────────────────────────

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", shy: "", ndash: "–", mdash: "—", copy: "©",
  auml: "ä", ouml: "ö", uuml: "ü", Auml: "Ä", Ouml: "Ö", Uuml: "Ü", szlig: "ß", sect: "§", eacute: "é",
};
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (all, e) => {
  if (e[0] !== "#") return ENTITIES[e] ?? all;
  const code = /^#x/i.test(e) ? parseInt(e.slice(2), 16) : +e.slice(1);
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : all;
});

// One line of running text, from a fragment of an article.
export const inlineText = (html) =>
  decode(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

// A whole page as lines. An imprint's layout is its structure: the legal name sits on
// the lines above the postcode, so block elements have to stay line breaks.
export const pageText = (html) => decode(html
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<(script|style|noscript|svg|head)\b[\s\S]*?<\/\1>/gi, " ")
  .replace(/<br\s*\/?>|<\/(?:p|div|li|h[1-6]|tr|td|section|article|address|ul|ol|table|header|footer)>/gi, "\n")
  .replace(/<[^>]+>/g, " "))
  .replace(/[ \t ]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{2,}/g, "\n").trim();

const hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; }
};

// Names compared without legal form or punctuation: "Foo GmbH" and "foo" are one company.
export const normName = (s) => String(s ?? "").toLowerCase()
  .replace(/\b(?:gmbh|ug|ag|se|kg|haftungsbeschränkt)\b|[()&.,]/g, " ").replace(/\s+/g, " ").trim();

// ── Reading the sources ───────────────────────────────────────────────────────

const NOT_A_COMPANY_SITE = /(?:^|\.)(?:linkedin|twitter|x|facebook|instagram|youtube|youtu|xing|tiktok|wikipedia|github|apple|google|medium|substack|bit)\.[a-z.]+$/;

// A column that lists several startups: the post's title names them after a colon, and
// each has a bold heading with its paragraph below. Holding headings to the title's list
// leaves out the column's other bold text (adverts, job boards, photo credits).
export function readColumn(post) {
  const html = post.content.rendered;
  const title = inlineText(post.title.rendered);
  const listed = new Set(title.slice(title.indexOf(":") + 1).split(",").map(n => normName(n)).filter(Boolean));
  const out = [];
  for (const m of html.matchAll(/<strong>((?:(?!<\/strong>)[\s\S])*?)<\/strong>/g)) {
    const name = inlineText(m[1]);
    if (!listed.has(normName(name))) continue;
    const from = m.index + m[0].length;
    const next = html.indexOf("<strong", from);
    const body = html.slice(from, next === -1 ? html.length : next);
    const links = [...body.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)].map(l => l[1]);
    out.push({
      name,
      website: links.find(u => !NOT_A_COMPANY_SITE.test(hostOf(u))) ?? "",
      text: inlineText(body).slice(0, TEXT_LIMIT),
    });
  }
  return out;
}

// An ordinary article: a link to another site whose text also appears in the title is
// the company the article is about. "HydroMapper ist Schäden auf der Spur", with
// HydroMapper linked in the text, names one; links to investors and partners do not
// appear in the title, so they drop out.
export function readTitleLinks(post) {
  const title = inlineText(post.title.rendered);
  const own = hostOf(post.link);
  const text = inlineText(post.content.rendered).slice(0, TEXT_LIMIT);
  const found = new Map();
  for (const m of post.content.rendered.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const name = inlineText(m[2]);
    const host = hostOf(m[1]);
    if (name.length < 3 || name.length > 40 || !host || host === own || NOT_A_COMPANY_SITE.test(host)) continue;
    if (!title.toLowerCase().includes(name.toLowerCase())) continue;
    const key = normName(name);
    if (!found.has(key)) found.set(key, { name, website: m[1], text: `${title}. ${text}` });
  }
  return [...found.values()];
}

// ── Is it in scope? ───────────────────────────────────────────────────────────
// Strong words are what Robonn exists for: robots, agriculture, energy, logistics, plus
// aerospace and defence. Weak ones (AI, software) fit half of all new startups, so they
// rank lower. Words that rule a startup out (NEW-STARTUPS.md, point 4) beat the weak
// words but not robots: a robot for hospitals is worth a person's look. The German nouns
// are matched case-sensitively, so the verb "steuern" (to control) is not a tax startup
// and "Preise" is not a "Reise".

const ROBOTICS = /robot|cobot|drohne|drone|\bAMRs?\b|autonome[rsn]? (?:fahr|system|maschin)|autonomous (?:vehicle|system|machine|mobile)/i;
const AEROSPACE_DEFENCE = /defen[cs]e|verteidigung|rüstung|raumfahrt|satellit|aerospace|luftfahrt|rakete|\bspace ?tech/i;
const OUT_OF_SCOPE = /\b(?:Fin|Insur|Health|Med|Bio|Food|Age|Prop|Legal|Ed|HR|Travel|Reg|Tax|Pet)Tech\b|\b(?:fintech|insurtech|healthtech|medtech|biotech|foodtech|proptech|legaltech|edtech)\b|Versicher|\bBank|Kredit|\bSteuer(?:n|berat\w*|erklär\w*|kanzlei\w*)?\b|Buchhaltung|Mietkaution|Krypto|Krankenh|\bPflege|Patient|Ärzt|\bArzt|Medizin|Gesundheit|Therap|Longevity|E-Commerce|Online-?[Ss]hop|Fashion|Kosmetik|Getränk|Lebensmittel|Nahrungsergänzung|Haustier|\bReise|Dating|Eltern|Kinder|\bSchule|Schüler|Lern-?App|Hochzeit|Immobilien|Recruiting|Bewerb|\balt[- ](?:meat|protein|dairy)|\bmeat\b|cultivated|\bprotein\b|ferment|\bpatient|clinical|\bcosmetics\b/;
const AGRICULTURE = /landwirt|agrar|\bagri|agtech|\backer|\bernte\b|\bfarmer|\bfarm(?:ing)?\b|gewächshaus|greenhouse|\bcrops?\b|\bsoil\b/i;
const ENERGY_LOGISTICS = /logisti[ks]|lieferkette|supply chain|fracht|freight|warehouse|lagerhal|energiewende|energiewirtschaft|energiemanagement|energieversorg|stromnetz|netzbetreiber|batterie|battery|photovoltaik|\bsolar|wärmepumpe|windkraft|windenergie|wasserstoff|hydrogen|\benergy\b/i;
const WEAK = [
  ["industrial", /deeptech|industrie|fertigung|produktion|maschinenbau|fabrik|sensor|halbleiter|\bchip|quanten|photonik|hardware|3d-druck|climatetech|cleantech|recycling/i],
  ["automotive", /mobilität|automotive|fahrzeug|ladeinfrastruktur|e-auto/i],
  ["ai_ml", /\bKI\b|künstliche[rn]? Intelligenz|\bAI\b|machine learning|sprachmodell/],
  ["software", /software|saas|plattform|cloud|cyber|it-sicherheit|angriffsfläche|open.source|entwickler|\bapi\b/i],
];

export function classify(text) {
  if (ROBOTICS.test(text)) return { sector: "robotics", strong: true };
  if (AEROSPACE_DEFENCE.test(text)) return { sector: "defense", strong: true };
  const out = text.match(OUT_OF_SCOPE);
  if (out) return { why: `out of scope ("${out[0]}")` };
  if (AGRICULTURE.test(text)) return { sector: "agriculture", strong: true };
  if (ENERGY_LOGISTICS.test(text)) return { sector: "industrial", strong: true };
  for (const [sector, words] of WEAK) if (words.test(text)) return { sector, strong: false };
  return { why: "no word from the map's domains" };
}

// ── What the article says about the company ───────────────────────────────────

const DEMONYMS = {
  Münchner: "München", Kölner: "Köln", Dresdner: "Dresden", Bremer: "Bremen", Hannoveraner: "Hannover",
  Hallenser: "Halle", Münsteraner: "Münster", Darmstädter: "Darmstadt", Karlsruher: "Karlsruhe",
  Aachener: "Aachen", Essener: "Essen",
};
const NOT_A_PLACE = /^(?:Sicht|Daten|Papier|Holz|Kunststoff|Deutschland|Europa|Erfahrung|Überzeugung|Leidenschaft|Liebe)$/;

// The imprint's city is the better answer; this one covers a site that cannot be read.
export function cityFromText(text) {
  const from = text.match(/\baus (St\. ?[A-ZÄÖÜ][\wäöüß-]+|[A-ZÄÖÜ][\wäöüß-]+(?: (?:am|an der|im|in der) [A-ZÄÖÜ][\wäöüß-]+)?)/);
  if (from && !NOT_A_PLACE.test(from[1])) return from[1];
  const adjective = text.match(/\b([A-ZÄÖÜ][a-zäöüß]+er) (?:Firma|Startup|Start-up|Jungfirma|Unternehmen|Jungunternehmen|[A-Z][a-z]*Tech)\b/);
  if (adjective) return DEMONYMS[adjective[1]] ?? adjective[1].slice(0, -2);
  return text.match(/\b([A-Z][a-zäöüß]+)-based\b/)?.[1] ?? "";
}

const FOREIGN_PLACE = /^(?:Wien|Graz|Linz|Innsbruck|Salzburg|Klagenfurt|Bregenz|Dornbirn|Zürich|Basel|Bern|Luzern|Lugano|Genf|Lausanne|St\. ?Gallen|St\. ?Moritz|Winterthur|Vaduz)$/;
const FOREIGN_WORD = /\b(?:Schweizer|(?:nieder|ober)?österreichische[sr]?|Grazer|Wiener|Linzer|Zürcher|Basler|Swiss|Austrian|British|Dutch|French|Finnish|Swedish|Danish|Norwegian|Estonian|American|UK-based|US-based)\s(?:\S+\s){0,3}?(?:Startup|Start-up|Firma|Jungfirma|Unternehmen|startup|company|[A-Z][a-z]*Tech|[a-z]+tech)\b|\baus (?:St\. )?[^.,]{2,30} in (?:Österreich|der Schweiz)\b/;
export const soundsForeign = (text) => FOREIGN_WORD.test(text) || FOREIGN_PLACE.test(cityFromText(text));

// Only a year the article itself states. It can rule a startup out (NEW-STARTUPS.md,
// Dates), and it is never used to rule one in.
export function statedFounding(text) {
  const m = text.match(/(?:gegründet|founded|established)\D{0,20}((?:19|20)\d\d)|((?:19|20)\d\d)\s+(?:gegründet|founded|ins Leben gerufen)/i);
  return m ? +(m[1] ?? m[2]) : null;
}

// Investors, events and other links that are not the company an article is about.
const NOT_A_STARTUP = /\b(?:Ventures?|Capital|Partners|Summit|Conference|Awards?|Inkubator|Incubator|Accelerator|Kanzlei|Fund)\b/i;

// ── The imprint ───────────────────────────────────────────────────────────────

const REGISTER_NUMBER = /\b(HR ?[AB]|GnR)\b[\s.:#\-–]*(?:Nr\.?|Nummer|No\.?|Number)?[\s.:#]*(\d{2,7})(?: (B|P|CB|FF|NP|HL|KI|FL|PI)\b)?/;
const REGISTER_NUMBER_WORDED = /\b(?:Handelsregister|Register)[- ]?(?:nummer|nr\.?|number|no\.?)[\s.:#]*(?:HRB[\s.:#]*)?(\d{3,7})\b/i;
const COURT_WORDS = "Amtsgerichts?|Registergerichts?|Handelsregister|Register ?[Cc]ourt|Registry [Cc]ourt|Registration [Cc]ourt|Court of [Rr]egist\\w+|Local [Cc]ourt|District [Cc]ourt";
const COURT_NAME = "(?:Bad )?[A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)?(?: ?\\([A-ZÄÖÜ][a-zäöüß]+\\)| (?:am|an der|im|in der) [A-ZÄÖÜ][a-zäöüß]+)?";
const COURT = new RegExp(`\\b(?:${COURT_WORDS})\\b[\\s:.,\\-–]*(?:(?:des|of|at|in|beim|am|Amtsgerichts?|Local [Cc]ourt|District [Cc]ourt)\\s+)*(${COURT_NAME})`, "g");
const COURT_SHORT = new RegExp(`\\bAG (${COURT_NAME})`, "g");
const NOT_A_COURT = /^(?:Register|Handelsregister|Eintragung|Eintrag|Nummer|Number|Deutschland|Germany|Sitz)|str(?:\.|aße)?$/;
const LEGAL_FORM = "(?:gGmbH|GmbH(?: ?& ?Co\\.? ?KG)?|UG(?: ?\\(haftungsbeschränkt\\))?(?: ?& ?Co\\.? ?KG)?|AG|SE|KG|OHG|eG)";
const PLACE_WORD = "[A-ZÄÖÜ][a-zäöüß.\\-]+";
const PLACE = new RegExp(`\\b(\\d{5})[ \\u00a0]+(${PLACE_WORD}(?: (?:am|an der|im|in der|ob der|bei|vor der|\\([A-ZÄÖÜ][a-zäöüß. ]+\\)|${PLACE_WORD}))*)`, "g");
const NOT_PLACE_ANYMORE = /\s(?:Deutschland|Germany|Telefon|Tel\.?|Phone|Fon|Fax|Mail|E-Mail|Email|Vertreten|Geschäftsführ\S*|USt\S*|Umsatzsteuer\S*|Register\S*|Handelsregister|Amtsgericht|Kontakt|Contact|Sitz|Web|Website).*$/;
const TEMPLATE = /Musterstadt|Mustermann|Musterfirma|Musterstra(?:ß|ss)e|\bHR[AB] ?12345(?:6)?\b|lorem ipsum/i;
const FOREIGN_IMPRINT = /\bFirmenbuch|\bFN ?\d{3,}|\bATU ?\d{6,}|\bCHE[- ]?\d{3}|Handelsregister des Kantons|Companies House|\bDelaware\b|\bO[ÜU]\b|\bS\.r\.l\.|\bB\.V\.|\bLLC\b|\bLtd\b/;
const LOOKS_LIKE_IMPRINT = /impressum|imprint|legal notice|angaben gemäß|§ ?5 (?:TMG|DDG)|handelsregister|registergericht|commercial register/i;

// How the register's own court names are written in our data.
const COURT_SPELLING = {
  munich: "München", muenchen: "München", cologne: "Köln", koeln: "Köln", nuremberg: "Nürnberg", nuernberg: "Nürnberg",
  duesseldorf: "Düsseldorf", hanover: "Hannover", frankfurt: "Frankfurt am Main",
};
export function normaliseCourt(raw) {
  const name = raw.replace(/\s+/g, " ").trim();
  if (/charlottenburg|^berlin/i.test(name)) return "Charlottenburg (Berlin)";
  return COURT_SPELLING[name.toLowerCase()] ?? name;
}

// The court named closest to the register number, if any is.
function courtNear(text, at) {
  const start = Math.max(0, at - 200);
  const part = text.slice(start, at + 200);
  const hits = [
    ...[...part.matchAll(COURT)].map(m => ({ name: m[1], dist: Math.abs(start + m.index - at) })),
    ...[...part.matchAll(COURT_SHORT)].map(m => ({ name: m[1], dist: Math.abs(start + m.index - at) }))
      .filter(h => h.dist <= 40),
  ].filter(h => !NOT_A_COURT.test(h.name));
  return hits.sort((a, b) => a.dist - b.dist)[0]?.name ?? "";
}

function legalNameFrom(lines, placeLine) {
  const tail = new RegExp(`^(.{2,70}?\\s${LEGAL_FORM})(?=$|[\\s,;|(])`);
  const clean = (line) => line
    .replace(/^.*(?:©|\bcopyright\b|\bder |\bdes |\bfor |\bby |\bc\/o |[:|—–])\s*/i, "")
    .replace(/^(?:\d{4}|\d+\.)\s+/, "").trim();
  // The name sits just above the address; the rest of the page is the fallback.
  const near = placeLine < 0 ? [] : lines.slice(Math.max(0, placeLine - 4), placeLine + 1).reverse();
  for (const line of [...near, ...lines]) {
    const m = clean(line).match(tail);
    if (m && m[1].split(/\s+/).length <= 7) return m[1];
  }
  return "";
}

// Company facts only: legal name, register entry, city. An imprint also names the
// managing directors, and nothing here reads or returns that.
export function parseImprint(text) {
  if (TEMPLATE.test(text)) return { problem: "the imprint is still a template" };
  const out = {};
  const lines = text.split("\n").map(s => s.trim()).filter(Boolean);

  const reg = text.match(REGISTER_NUMBER);
  const worded = reg ? null : text.match(REGISTER_NUMBER_WORDED);
  if (reg || worded) {
    const hit = reg ?? worded;
    out.number = reg ? `${reg[1].replace(/\s/g, "").toUpperCase().replace("GNR", "GnR")} ${reg[2]}${reg[3] ? ` ${reg[3]}` : ""}` : `HRB ${worded[1]}`;
    // A "B" after the number is how only Charlottenburg writes it, court named or not.
    const court = courtNear(text, hit.index) || (reg?.[3] === "B" ? "Berlin" : "");
    if (court) out.register = `Amtsgericht ${normaliseCourt(court)} ${out.number}`;
  }

  let placeLine = -1;
  for (const m of text.matchAll(PLACE)) {
    const city = m[2].replace(NOT_PLACE_ANYMORE, "").trim();
    if (/\bStr\.|stra(?:ß|ss)e|\bWeg$|\bAllee$/i.test(m[2]) || city.length < 2) continue;
    out.city = city;
    placeLine = lines.findIndex(l => l.includes(m[1]));
    break;
  }
  const legalName = legalNameFrom(lines, placeLine);
  if (legalName) out.legalName = legalName;

  if (!out.number) {
    if (FOREIGN_IMPRINT.test(text)) out.foreign = true;
    else if (/\bi\. ?G\.|in Gründung/.test(text)) out.problem = "the imprint says it is not registered yet";
    else out.problem = "no register number in the imprint";
  } else if (!out.register) {
    out.problem = `${out.number} in the imprint, but no court`;
  }
  return out;
}

// Register numbers run in order within a court, so a number below one known to predate
// the window predates it too. Numbers near the edge can run a few weeks out of order
// (Charlottenburg does), so one above any known number inside the window is left alone.
// A company that moved seat gets a high number at its new court, which this cannot see:
// that direction stays with the manual check.
const registerParts = (register) => {
  const m = String(register ?? "").match(/^Amtsgericht (.+?) (HRB|HRA|GnR|PR|VR) (\d+)/);
  return m ? { court: m[1], kind: m[2], number: +m[3] } : null;
};
const registerKey = (register) => register.replace(/ [A-Z]{1,2}$/, "");
export function olderThanWindow(register, known, windowStart) {
  const me = registerParts(register);
  if (!me) return null;
  let before = null;
  let inside = Infinity;
  for (const k of known) {
    const p = registerParts(k.register);
    if (!p || !k.registered || p.court !== me.court || p.kind !== me.kind) continue;
    if (k.registered >= windowStart) inside = Math.min(inside, p.number);
    else if (!before || p.number > before.number) before = { ...k, number: p.number };
  }
  return before && me.number <= before.number && me.number < inside ? before : null;
}

// ── robots.txt ────────────────────────────────────────────────────────────────

// The group for this agent if there is one, otherwise "*"; the longest matching rule
// wins, and a tie goes to Allow. A Content-Signal is a condition of access where a site
// sets one: this script builds a list of names and links, which is its "search" use.
export function robotsAllow(robotsTxt, path, agent, refusedSignal = /\bsearch=no\b/) {
  const groups = [];
  let group = null;
  let inAgents = false;
  for (const raw of robotsTxt.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    if (key === "user-agent") {
      if (!inAgents) groups.push(group = { agents: [], rules: [], signals: [] });
      group.agents.push(m[2].toLowerCase());
      inAgents = true;
      continue;
    }
    inAgents = false;
    if (!group) continue;
    if (key === "allow" || key === "disallow") group.rules.push({ allow: key === "allow", path: m[2] });
    if (key === "content-signal") group.signals.push(m[2]);
  }
  const own = groups.filter(g => g.agents.includes(agent.toLowerCase()));
  const chosen = own.length ? own : groups.filter(g => g.agents.includes("*"));
  if (chosen.some(g => g.signals.some(s => refusedSignal.test(s)))) return false;
  let best = null;
  for (const rule of chosen.flatMap(g => g.rules)) {
    if (!rule.path) continue; // an empty Disallow allows everything
    const pattern = rule.path.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    if (!new RegExp(`^${pattern}`).test(path)) continue;
    if (!best || rule.path.length > best.path.length || (rule.path.length === best.path.length && rule.allow)) best = rule;
  }
  return best ? best.allow : true;
}

// ── Fetching ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const robotsCache = new Map();

class RobotsClosed extends Error {}

async function mayRead(url) {
  const { origin, pathname, search } = new URL(url);
  if (!robotsCache.has(origin)) {
    let txt = "";
    try {
      const res = await fetch(`${origin}/robots.txt`, { headers: { "User-Agent": AGENT }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (res.ok) txt = await res.text();
      else await res.body?.cancel();
    } catch { /* no robots.txt to read: nothing is closed */ }
    robotsCache.set(origin, txt);
  }
  const txt = robotsCache.get(origin);
  return robotsAllow(txt, pathname + search, AI_AGENT ?? AGENT_NAME, AI_AGENT ? /\b(?:search|ai-input)=no\b/ : undefined);
}

async function get(url) {
  if (!await mayRead(url)) throw new RobotsClosed(`robots.txt does not allow ${AI_AGENT ?? AGENT_NAME}`);
  const res = await fetch(url, {
    headers: { "User-Agent": AGENT, Accept: "text/html,application/json;q=0.9,*/*;q=0.5", "Accept-Language": "de,en" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    await res.body?.cancel(); // without this Node holds the socket open
    throw new Error(`HTTP ${res.status}`);
  }
  return { url: res.url, body: await res.text() };
}

const IMPRINT_LINK = /impressum|imprint|legal[- ]?(?:notice|disclosure)|rechtliches|anbieterkennzeichnung/i;
const IMPRINT_PATHS = ["impressum", "imprint", "legal-notice", "de/impressum"];

export async function readImprint(website) {
  let home;
  try {
    home = await get(website);
  } catch (e) {
    return { problem: e instanceof RobotsClosed ? `the site's ${e.message}` : `the site could not be read (${e.message})` };
  }
  const linked = [...home.body.matchAll(/<a\b[^>]*href="([^"#]+)"[^>]*>([\s\S]{0,200}?)<\/a>/gi)]
    .filter(m => IMPRINT_LINK.test(`${m[1]} ${m[2]}`) && !/privacy|datenschutz/i.test(m[1]))
    .map(m => { try { return new URL(m[1], home.url).href; } catch { return null; } })
    .filter(u => u?.startsWith("http"));
  const origin = new URL(home.url).origin;
  const tries = [...new Set([...linked, ...IMPRINT_PATHS.map(p => `${origin}/${p}`)])].slice(0, 4);
  for (const url of tries) {
    try {
      const page = await get(url);
      const text = pageText(page.body);
      if (text.length > 150 && LOOKS_LIKE_IMPRINT.test(text)) return { imprint: page.url, ...parseImprint(text) };
    } catch { /* try the next address */ }
    await sleep(300);
  }
  return { problem: "the imprint could not be read (probably drawn by JavaScript)" };
}

// ── The dataset ───────────────────────────────────────────────────────────────

const load = (file, varName) =>
  new Function(`${readFileSync(join(ROOT, file), "utf8")};return ${varName};`)();

// Keep in step with `sources` in scripts/validate.mjs.
function loadKnown() {
  const review = load(REVIEW_FILE, "NEW_STARTUP_REVIEW");
  const entries = [
    ...load("data/companies/global.js", "COMPANIES_GLOBAL"),
    ...load("data/companies/big.js", "COMPANIES_BIG"),
    ...load("data/companies/mid.js", "COMPANIES_MID"),
    ...load("data/companies/startup.js", "COMPANIES_STARTUP"),
    ...load("data/companies/new-startups.js", "NEW_STARTUPS"),
    ...load("data/institutes.js", "INSTITUTES"),
    ...review.rejected,
    ...review.leads,
  ];
  const seen = JSON.parse(readFileSync(join(ROOT, SEEN_FILE), "utf8"));
  const names = new Set();
  const hosts = new Set();
  const registers = new Map();
  for (const e of [...entries, ...seen.seen]) {
    if (e.name) names.add(normName(e.name));
    if (e.legalName) names.add(normName(e.legalName));
    const host = e.host ?? hostOf(e.website);
    if (host) hosts.add(host);
    if (e.register) registers.set(registerKey(e.register), e.name);
  }
  return { names, hosts, registers, entries, seen: seen.seen, leads: review.leads.length };
}

// ── Writing ───────────────────────────────────────────────────────────────────

const leadSource = (lead) => `    {\n${Object.entries(lead).map(([k, v]) => `      ${k}: ${JSON.stringify(v)}`).join(",\n")}\n    }`;

// Add to the end of the `leads` array, at the end of the review file. The result is
// loaded again before anything is written: a change in the file's layout must stop the
// run, not corrupt the dataset.
export function addLeads(src, leads) {
  const m = src.match(/(\n  leads: \[)([\s\S]*?)(\s*\]\n\};\s*)$/);
  if (!m) throw new Error(`${REVIEW_FILE}: cannot find the end of the leads array`);
  const body = m[2].trimEnd();
  const added = leads.map(leadSource).join(",\n");
  const next = src.slice(0, m.index) + m[1] + (body ? `${body},\n` : "\n") + added + m[3];
  const count = (s) => new Function(`${s};return NEW_STARTUP_REVIEW.leads.length;`)();
  if (count(next) !== count(src) + leads.length) throw new Error(`${REVIEW_FILE}: leads were not added cleanly`);
  return next;
}

export const seenFile = (updated, seen) => {
  const lines = seen.map(e => `    ${JSON.stringify(e)}`).join(",\n");
  return `{\n  "updated": ${JSON.stringify(updated)},\n  "seen": [${lines ? `\n${lines}\n  ` : ""}]\n}\n`;
};

// ── The summary ───────────────────────────────────────────────────────────────

const cell = (s) => String(s ?? "").replace(/\|/g, "\\|");
const lookUp = (p) => `https://www.northdata.de/?q=${encodeURIComponent(p.legalName || p.name)}`;

export function renderReport({ today, proposals, heldBack, leftOut, read, known }) {
  const links = (p) => [
    p.website && `[site](${p.website})`,
    p.imprint && `[imprint](${p.imprint})`,
    `[article](${p.article})`,
    `[North Data](${lookUp(p)})`,
  ].filter(Boolean).join(" · ");
  const ready = proposals.filter(p => p.register);
  const look = proposals.filter(p => !p.register);
  const out = [];
  out.push(proposals.length
    ? `The finder read the startup press on ${today} and proposes **${proposals.length} ${proposals.length === 1 ? "lead" : "leads"}**. A lead is only a name: nothing joins the list of startups until someone has checked it.`
    : `The finder read the startup press on ${today} and found nothing new.`, "");
  if (ready.length) {
    out.push("### Ready to check", "", "The imprint names a register entry. The first-entry date is the one thing left to look up.", "");
    out.push("| Startup | Sector guess | City | Legal entity | Register | Links |", "|---|---|---|---|---|---|");
    for (const p of ready) out.push(`| **${cell(p.name)}** | ${p.sector}${p.strong ? "" : " (weak)"} | ${cell(p.city)} | ${cell(p.legalName)} | ${cell(p.register)} | ${links(p)} |`);
    out.push("");
  }
  if (look.length) {
    out.push("### Needs a look", "", "The finder could not tie these to a register entry. A person can often see in a minute what it could not.", "");
    out.push("| Startup | Sector guess | City | Why | Links |", "|---|---|---|---|---|");
    for (const p of look) out.push(`| **${cell(p.name)}** | ${p.sector}${p.strong ? "" : " (weak)"} | ${cell(p.city)} | ${cell(p.problem)} | ${links(p)} |`);
    out.push("");
  }
  if (heldBack) out.push(`${heldBack} more were held back to keep this review short. They come up again in the next run while they are still in the lookback period.`, "");
  if (proposals.length) {
    out.push("### Reviewing this", "",
      "This pull request is rewritten by the next run, so finish it before then. For each lead in `data/companies/new-startups.review.js`:", "",
      "1. Look up the first-entry date on the [Registerportal](https://www.handelsregister.de) or North Data.",
      "2. Do the rest of the five-step check in [NEW-STARTUPS.md](../blob/main/NEW-STARTUPS.md).",
      "3. If it passes, add it to `new-startups.js` and remove the lead. If it fails, move it to `rejected` with the reason.",
      "4. Delete a lead that is plainly wrong. It will not be proposed again.", "",
      "A lead you have no time for can stay: merging lists it on the page as named in sources, not checked yet.", "");
  }
  if (leftOut.length) {
    out.push(`<details><summary>Left out by the finder (${leftOut.length})</summary>`, "");
    for (const l of leftOut) out.push(`- [${l.name.replace(/[[\]]/g, "")}](${l.article}): ${l.why}`);
    out.push("", "</details>", "");
  }
  out.push("### Sources read", "");
  for (const r of read) out.push(`- ${r.label}: ${r.error ? `**could not be read (${r.error})**` : `${r.posts} posts, ${r.names} names${r.posts && !r.names ? " — **no names found, so its format may have changed**" : ""}`}`);
  out.push("", `${known} names were already on the map, checked, or proposed before.`);
  return out.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function readSource(source, since) {
  const params = new URLSearchParams({
    ...source.query,
    per_page: "50",
    after: `${since}T00:00:00`,
    _fields: "date,link,title,content",
  });
  const { body } = await get(`${source.api}?${params}`);
  return JSON.parse(body);
}

async function main() {
  const argv = process.argv.slice(2);
  const flag = (name) => { const i = argv.indexOf(name); return i === -1 ? null : argv[i + 1]; };
  const write = argv.includes("--write");
  const reportFile = flag("--report");
  const sinceArg = flag("--since");
  if (sinceArg !== null && !/^\d{4}-\d{2}-\d{2}$/.test(sinceArg)) {
    console.error("✗ --since needs a date, e.g. --since 2026-09-01");
    process.exit(2);
  }

  const now = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const today = iso(now);
  const since = sinceArg ?? iso(new Date(now.getTime() - LOOKBACK_DAYS * 864e5));
  const windowStart = iso(new Date(Date.UTC(now.getUTCFullYear() - WINDOW_YEARS, now.getUTCMonth(), now.getUTCDate())));
  const known = loadKnown();

  // 1. Read the sources. One that fails is reported and the rest carry on.
  const read = [];
  const found = new Map();
  for (const source of SOURCES) {
    try {
      const posts = await readSource(source, since);
      let names = 0;
      for (const post of posts) {
        for (const c of source.read(post)) {
          names++;
          const key = normName(c.name);
          if (!found.has(key)) found.set(key, { ...c, article: post.link, published: post.date.slice(0, 10), source: source.label });
        }
      }
      read.push({ label: source.label, posts: posts.length, names });
    } catch (e) {
      read.push({ label: source.label, error: e.message });
    }
    process.stderr.write(`${read.at(-1).label}: ${read.at(-1).error ?? `${read.at(-1).posts} posts, ${read.at(-1).names} names`}\n`);
  }

  // 2. Keep what the article alone cannot rule out.
  let alreadyKnown = 0;
  const leftOut = [];
  const candidates = [];
  for (const c of found.values()) {
    const scope = classify(c.text);
    const year = statedFounding(c.text);
    if (known.names.has(normName(c.name)) || known.hosts.has(hostOf(c.website))) alreadyKnown++;
    else if (NOT_A_STARTUP.test(c.name)) leftOut.push({ ...c, why: "an investor, event or similar, not a startup" });
    else if (soundsForeign(c.text)) leftOut.push({ ...c, why: "based abroad, according to the article" });
    else if (year && year < +windowStart.slice(0, 4)) leftOut.push({ ...c, why: `the article says founded in ${year}, before the window` });
    else if (!scope.sector) leftOut.push({ ...c, why: scope.why });
    else candidates.push({ ...c, ...scope });
  }

  // 3. Read each one's imprint. Mission-first, so a slow site costs the weak names.
  const assessed = [];
  const remembered = [];
  candidates.sort((a, b) => b.strong - a.strong);
  for (const c of candidates) {
    const imprint = c.website ? await readImprint(c.website) : { problem: "the article links no website" };
    process.stderr.write(`  ${c.name}: ${imprint.register ?? imprint.problem ?? "read"}\n`);
    const older = olderThanWindow(imprint.register, known.entries, windowStart);
    const twin = imprint.register && known.registers.get(registerKey(imprint.register));
    const why = imprint.foreign ? "the imprint names a company abroad"
      : twin ? `same register entry as ${twin}`
      : older ? `register number below ${older.name}'s (registered ${older.registered}), so before the window`
      : null;
    if (why) {
      leftOut.push({ ...c, why });
      remembered.push({ name: c.name, host: hostOf(c.website), found: today, outcome: why, source: c.article });
    } else {
      assessed.push({ ...c, ...imprint, city: imprint.city || cityFromText(c.text) });
    }
    if (c.website) await sleep(PAUSE_MS);
  }

  // 4. Best first: mission over weak, a readable register over none, newest first.
  assessed.sort((a, b) => b.strong - a.strong || !!b.register - !!a.register || b.published.localeCompare(a.published));
  const proposals = assessed.slice(0, MAX_PROPOSALS);
  const heldBack = assessed.length - proposals.length;

  const report = renderReport({ today, proposals, heldBack, leftOut, read, known: alreadyKnown });
  console.log(report);
  if (reportFile) writeFileSync(resolve(ROOT, reportFile), `${report}\n`);

  if (write && proposals.length) {
    const leads = proposals.map(p => ({
      name: p.name,
      ...(p.city ? { city: p.city } : {}),
      note: `sector guess: ${p.sector}; from ${p.source}`,
      ...(p.website ? { website: p.website } : {}),
      source: p.article,
      found: today,
      ...(p.legalName ? { legalName: p.legalName } : {}),
      ...(p.register ? { register: p.register } : {}),
      ...(p.imprint ? { imprint: p.imprint } : {}),
    }));
    const reviewPath = join(ROOT, REVIEW_FILE);
    writeFileSync(reviewPath, addLeads(readFileSync(reviewPath, "utf8"), leads));
    const seen = [
      ...known.seen,
      ...proposals.map(p => ({ name: p.name, host: hostOf(p.website), found: today, outcome: "proposed", source: p.article })),
      ...remembered,
    ];
    writeFileSync(join(ROOT, SEEN_FILE), seenFile(today, seen));
    process.stderr.write(`Added ${leads.length} leads to ${REVIEW_FILE}.\n`);
  }

  // A run that read nothing would otherwise pass in silence, with no pull request either.
  if (read.every(r => r.error)) {
    console.error("✗ no source could be read");
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
