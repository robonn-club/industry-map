// The startup finder, tested on small made-up copies of what the sources publish.
//
//   node --test scripts/*.test.mjs
//
// No network, and no real article text: the shapes below follow the real pages, with
// invented companies, so no founder's name ends up in the repository. A change in the
// finder's rules shows up here first.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SOURCES, addLeads, cityFromText, classify, inlineText, judge, normName, normaliseCourt, olderThanWindow, pageText,
  parseImprint, parseRegisterPage, readColumn, readTitleLinks, registerPages, renderReport, robotsAllow, seenFile,
  soundsForeign, statedFounding,
} from "./find-startups.mjs";

const COLUMN = {
  link: "https://press.example/2026/11/04/5-neue-startups/",
  title: { rendered: "5 neue Startups: Greifwerk, selbst&shy;fahrer., Grazly" },
  content: {
    rendered: `
<p>Wir zeigen euch heute junge Unternehmen. Mehr im Newsletter <strong><a href="https://news.example/">Startup-Radar</a></strong>.</p>
<p><strong>Greifwerk<br /></strong>Mit <a href="http://greifwerk.example/" target="_blank">Greifwerk</a> aus Darmstadt, von A. Beispiel gegründet, greifen Roboter in Lagerhallen.<br /><br />
<strong>selbstfahrer.</strong><br />Die frische Münchner Firma <a href="https://www.linkedin.com/company/x">auf LinkedIn</a> und <a href="https://selbstfahrer.example/de">selbstfahrer.</a> plant Software.</p>
<p><strong>Grazly</strong><br />Beim Grazer Startup <a href="https://grazly.example/">Grazly</a> dreht sich alles um KI.</p>
<p><strong>Tipp:</strong> Unser <a href="https://news.example/">Newsletter</a>.</p>
<p><strong>Jobbörse</strong> Auf der Suche nach einer Herausforderung?</p>`,
  },
};

test("a column yields the startups in its title and no other bold text", () => {
  const out = readColumn(COLUMN);
  assert.deepEqual(out.map(c => c.name), ["Greifwerk", "selbstfahrer.", "Grazly"]);
  assert.equal(out[0].website, "http://greifwerk.example/");
  assert.equal(out[1].website, "https://selbstfahrer.example/de", "a social link is not the company's site");
  assert.ok(!out[2].text.includes("Newsletter"), "a paragraph stops at the next bold text");
});

test("an article yields the linked name its title mentions, not investors", () => {
  const out = readTitleLinks({
    link: "https://www.startups.example/feldwerk/",
    title: { rendered: "Millionen für Feldwerk und Hofbot" },
    content: { rendered: `<p><a href="https://feldwerk.example/">Feldwerk</a> und <a href="https://hofbot.example/">Hofbot</a> erhalten Geld von <a href="https://fund.example/">Beispiel Capital</a>. <a href="https://www.startups.example/x/">Hofbot</a> <a href="https://www.linkedin.com/company/f">Feldwerk</a></p>` },
  });
  assert.deepEqual(out.map(c => [c.name, c.website]), [["Feldwerk", "https://feldwerk.example/"], ["Hofbot", "https://hofbot.example/"]]);
});

test("scope: mission words first, German nouns matched as nouns", () => {
  assert.deepEqual(classify("Roboter für Krankenhäuser"), { sector: "robotics", strong: true }, "a robot beats an out-of-scope word");
  assert.deepEqual(classify("Drohnen für die Verteidigung"), { sector: "robotics", strong: true });
  assert.deepEqual(classify("Satelliten für Unternehmen"), { sector: "defense", strong: true });
  assert.deepEqual(classify("Für Landwirte, die ihre Felder kartieren"), { sector: "agriculture", strong: true });
  assert.deepEqual(classify("Das ClimateTech will Wärmepumpen steuern"), { sector: "industrial", strong: true }, "the verb steuern is not tax");
  assert.deepEqual(classify("Plattform für bessere Preise"), { sector: "software", strong: false }, "Preise is not Reise");
  assert.deepEqual(classify("KI-Plattform für Unternehmen"), { sector: "ai_ml", strong: false });
  assert.match(classify("KI prüft Abrechnungen im Krankenhaus").why, /out of scope/);
  assert.match(classify("Das FinTech mit KI").why, /out of scope/);
  assert.match(classify("Beratung für Steuern mit KI").why, /out of scope/);
  assert.match(classify("Austrian alt meat startup on a platform").why, /out of scope/);
  assert.match(classify("Ein schöner Laden in der Stadt").why, /no word/);
});

test("the article's city, and what gives away a company abroad", () => {
  assert.equal(cityFromText("Greifwerk aus Darmstadt baut Greifer"), "Darmstadt");
  assert.equal(cityFromText("Die Firma aus Frankfurt am Main"), "Frankfurt am Main");
  assert.equal(cityFromText("Die frische Münchner Firma baut"), "München");
  assert.equal(cityFromText("Das Berliner AgeTech hilft"), "Berlin");
  assert.equal(cityFromText("A Munich-based startup"), "Munich");
  assert.equal(cityFromText("von zwei Freunden aus der Taufe gehoben"), "");
  assert.equal(cityFromText("aus Sicht der Kunden"), "");
  assert.ok(soundsForeign("Beim Grazer Startup Foo"));
  assert.ok(soundsForeign("Beim Schweizer DeepTech Foo"));
  assert.ok(soundsForeign("Das niederösterreichische DeepTech Foo"));
  assert.ok(soundsForeign("Foo aus St. Gallen baut"));
  assert.ok(soundsForeign("Das Startup Foo aus St. Wolfgang in Österreich bietet"));
  assert.ok(soundsForeign("Austrian alt meat startup Foo"));
  assert.ok(!soundsForeign("Foo aus Berlin verkauft in Deutschland, Österreich und der Schweiz"));
  assert.ok(!soundsForeign("Das Berliner Startup Foo"));
});

test("a stated founding year is read only where the article states one", () => {
  assert.equal(statedFounding("Das 2019 gegründete Unternehmen"), 2019);
  assert.equal(statedFounding("wurde 2019 gegründet und"), 2019);
  assert.equal(statedFounding("gegründet im Jahr 2025 von"), 2025);
  assert.equal(statedFounding("Founded in 2017, the company"), 2017);
  assert.equal(statedFounding("Plant 2026 den Markteintritt"), null);
});

const imprint = (body) => pageText(`<html><head><title>x</title><script>var a="HRB 999";</script></head><body>${body}</body></html>`);

test("an imprint gives the legal entity, register entry and city, in our spelling", () => {
  const ok = parseImprint(imprint(`<h1>Impressum</h1><p>Greifwerk Systems GmbH<br>Musterweg 3<br>64283 Darmstadt<br>Deutschland</p><p>Geschäftsführer: A. Beispiel</p><p>Registergericht: Amtsgericht Darmstadt<br>HRB 109240</p>`));
  assert.deepEqual(ok, { number: "HRB 109240", register: "Amtsgericht Darmstadt HRB 109240", city: "Darmstadt", legalName: "Greifwerk Systems GmbH" });
  const forms = [
    ["Eingetragen im Handelsregister des Amtsgerichts Köln unter HRB 129795", "Amtsgericht Köln HRB 129795"],
    ["HRB 125354, Amtsgericht Köln", "Amtsgericht Köln HRB 125354"],
    ["Registered at the Local Court of Munich, HRB 303108", "Amtsgericht München HRB 303108"],
    ["Register court: Munich. Commercial register: HRB 315627", "Amtsgericht München HRB 315627"],
    ["Registergericht: München, Registernummer: 314803", "Amtsgericht München HRB 314803"],
    ["Amtsgericht Berlin-Charlottenburg, HRB 267384 B", "Amtsgericht Charlottenburg (Berlin) HRB 267384 B"],
    ["Amtsgericht Charlottenburg (Berlin) HRB 287132 B", "Amtsgericht Charlottenburg (Berlin) HRB 287132 B"],
    ["AG Hamburg HRB 195802", "Amtsgericht Hamburg HRB 195802"],
    ["Amtsgericht Frankfurt am Main HRB 143100", "Amtsgericht Frankfurt am Main HRB 143100"],
    ["Amtsgericht Kempten (Allgäu), HRB 17458", "Amtsgericht Kempten (Allgäu) HRB 17458"],
    ["Handelsregister: HRB-Nr. 12399, Amtsgericht Ulm", "Amtsgericht Ulm HRB 12399"],
    ["Amtsgericht Kiel HRB 22238 KI", "Amtsgericht Kiel HRB 22238 KI"],
    ["Handelsregister Hamburg, HRB 169672", "Amtsgericht Hamburg HRB 169672"],
    ["Handelsregister: Amtsgericht Bonn, HRB 1234", "Amtsgericht Bonn HRB 1234"],
    ["Amtsgericht Hamburg (Hamburg Local Court) HRB 199171", "Amtsgericht Hamburg HRB 199171"],
    ["Commercial register: HRB 260878 B", "Amtsgericht Charlottenburg (Berlin) HRB 260878 B"],
  ];
  for (const [line, register] of forms) assert.equal(parseImprint(`Impressum\nFoo GmbH\n${line}`).register, register, line);
});

test("a number on its own line does not take the next line's letter as a suffix", () => {
  assert.equal(parseImprint("Foo GmbH\nAmtsgericht München\nHRB 315627\nD").number, "HRB 315627");
});

test("words from the sentence around a court are not a court", () => {
  assert.equal(parseImprint("Foo GmbH\nRegister court: Commercial register HRB 53947").register, undefined);
  assert.equal(parseImprint("Foo GmbH\nAmtsgericht Local Court HRB 53947").register, undefined);
});

test("Bremen's letters are read with the number", () => {
  assert.equal(parseImprint("Foo UG\nAmtsgericht Bremen HRB 41502 HB").register, "Amtsgericht Bremen HRB 41502 HB");
});

test("the legal name is cleaned of what surrounds it on the page", () => {
  const nameOf = (line) => parseImprint(`${line}\nMusterweg 1\n10115 Berlin\nAmtsgericht Charlottenburg HRB 1000 B`).legalName;
  assert.equal(nameOf("Impressum — RM Werk GmbH"), "RM Werk GmbH");
  assert.equal(nameOf("Copyright © 2026 foo pisy GmbH"), "foo pisy GmbH");
  assert.equal(nameOf("2026 nunq GmbH"), "nunq GmbH");
  assert.equal(nameOf("Pflichtangaben der ANORA Technologies GmbH"), "ANORA Technologies GmbH");
  assert.equal(nameOf("Impressum (Legal Notice) for CoBrowser Technology GmbH"), "CoBrowser Technology GmbH");
  assert.equal(nameOf("Kontakt eine Marke der proxima idea KG"), "proxima idea KG");
  assert.equal(nameOf("Foo c/o claiverly GmbH"), "claiverly GmbH");
  assert.equal(nameOf("1. VANEA AG"), "VANEA AG");
  assert.equal(nameOf("Foo UG (haftungsbeschränkt)"), "Foo UG (haftungsbeschränkt)");
});

test("an imprint's city stops where the address does", () => {
  const cityOf = (line) => parseImprint(`Foo GmbH\n${line}\nHRB 1000`).city;
  assert.equal(cityOf("44787 Bochum Registereintrag"), "Bochum");
  assert.equal(cityOf("60489 Frankfurt am Main"), "Frankfurt am Main");
  assert.equal(cityOf("67065 Ludwigshafen am Rhein"), "Ludwigshafen am Rhein");
  assert.equal(cityOf("10115 Berlin Germany"), "Berlin");
  assert.equal(cityOf("87647 Marktoberdorfer Str. 11"), undefined, "a street after the postcode is not a city");
});

test("imprints that cannot name a German register entry say why", () => {
  assert.match(parseImprint("Impressum\nFoo GmbH / AG\n12345 Musterstadt\nHRB 12345").problem, /template/);
  assert.equal(parseImprint("Impressum\nFoo GmbH\nFirmenbuch FN 123456a\nHandelsgericht Graz").foreign, true);
  assert.equal(parseImprint("Foo AG\nCHE-123.456.789\nZürich").foreign, true);
  assert.match(parseImprint("Foo GmbH i.G.\nMusterweg 1\n10115 Berlin").problem, /not registered yet/);
  assert.match(parseImprint("Foo GmbH\nWeg 1\n10115 Berlin\nUSt-IdNr. DE123456789").problem, /no register number/);
  assert.match(parseImprint("Foo GmbH\nHRB 77123").problem, /no court/);
  assert.equal(parseImprint("Foo GmbH\nHRB 77123").register, undefined);
});

test("court names are written the way our data writes them", () => {
  assert.equal(normaliseCourt("Berlin"), "Charlottenburg (Berlin)");
  assert.equal(normaliseCourt("Berlin (Charlottenburg)"), "Charlottenburg (Berlin)");
  assert.equal(normaliseCourt("Cologne"), "Köln");
  assert.equal(normaliseCourt("Frankfurt"), "Frankfurt am Main");
  assert.equal(normaliseCourt("Frankfurt (Oder)"), "Frankfurt (Oder)");
});

test("a register number below a pre-window one is older than the window", () => {
  const known = [
    { name: "Old", register: "Amtsgericht München HRB 287624", registered: "2023-09-26" },
    { name: "New", register: "Amtsgericht München HRB 288799", registered: "2023-11-21" },
    { name: "OldB", register: "Amtsgericht Charlottenburg (Berlin) HRB 259214 B", registered: "2023-10-24" },
    { name: "NewB", register: "Amtsgericht Charlottenburg (Berlin) HRB 258001 B", registered: "2023-11-09" },
    { name: "NoDate", register: "Amtsgericht Köln HRB 500000" },
  ];
  const at = "2023-11-07";
  assert.equal(olderThanWindow("Amtsgericht München HRB 200000", known, at).name, "Old");
  assert.equal(olderThanWindow("Amtsgericht München HRB 287624", known, at).name, "Old");
  assert.equal(olderThanWindow("Amtsgericht München HRB 300000", known, at), null);
  assert.equal(olderThanWindow("Amtsgericht Charlottenburg (Berlin) HRB 249025 B", known, at).name, "OldB");
  assert.equal(olderThanWindow("Amtsgericht Charlottenburg (Berlin) HRB 258500 B", known, at), null, "numbers near the edge run out of order");
  assert.equal(olderThanWindow("Amtsgericht Ulm HRB 1", known, at), null, "a court with no data says nothing");
  assert.equal(olderThanWindow("Amtsgericht Köln HRB 1", known, at), null, "an entry with no date says nothing");
  assert.equal(olderThanWindow(undefined, known, at), null);
});

test("a register entry's page is addressed by state, court and number", () => {
  const base = "https://www.online-handelsregister.de/handelsregisterauszug";
  assert.deepEqual(registerPages("Amtsgericht Hamburg HRB 199171"), [`${base}/hh/Hamburg/HRB/199171`]);
  assert.deepEqual(registerPages("Amtsgericht München HRB 1"), [`${base}/by/Muenchen/HRB/1`]);
  assert.deepEqual(registerPages("Amtsgericht Frankfurt am Main HRB 1"), [`${base}/he/Frankfurt-am-Main/HRB/1`]);
  assert.deepEqual(registerPages("Amtsgericht Frankfurt (Oder) HRB 1"), [`${base}/br/Frankfurt-Oder/HRB/1FF`, `${base}/br/Frankfurt-Oder/HRB/1`]);
  assert.deepEqual(registerPages("Amtsgericht Kiel HRB 28535 KI"), [`${base}/sh/Kiel/HRB/28535KI`, `${base}/sh/Kiel/HRB/28535`]);
  assert.deepEqual(registerPages("Amtsgericht Kempten (Allgäu) HRB 1"), [`${base}/by/Kempten/HRB/1`]);
  assert.deepEqual(registerPages("Amtsgericht Charlottenburg (Berlin) HRB 260878 B", "SKD SE"), [
    `${base}/be/Berlin-Charlottenburg/HRB/260878B`, `${base}/be/Berlin-Charlottenburg/HRB/260878`, `${base}/be/Berlin-Charlottenburg/HRB/260878/SKD-SE`,
  ]);
  assert.equal(registerPages("Amtsgericht Traunstein HRB 31965", "DeepSynergy.AI GmbH").at(-1), `${base}/by/Traunstein/HRB/31965/DeepSynergyAI-GmbH`);
  assert.equal(registerPages("Amtsgericht Foo UG HRB 1", "Bar UG (haftungsbeschränkt)").length, 0, "a court not in the list has no page");
  assert.deepEqual(registerPages(undefined), []);
});

test("a register page gives a date only where it states one or two facts agree", () => {
  const stated = "Die Ersteintragung von Foo GmbH ins\nHandelsregister erfolgte am 10.09.2024. Gründungsdatum: 10.09.2024";
  assert.equal(parseRegisterPage(stated).registered, "2024-09-10");
  assert.equal(parseRegisterPage("Neueintragung vom 15.05.2026 (Eintrag Nr. 1)").registered, "2026-05-15");
  const list = (d) => `Liste der Gesellschafter - Aufnahme in den Registerordner am ${d} 29,80 €`;
  assert.equal(parseRegisterPage(`Gründungsdatum: 02.07.2024 ${list("02.07.2024")}`).registered, "2024-07-02", "field and first list agree");
  const zepta = parseRegisterPage(`Gründungsdatum: 06.02.2025 ${list("02.02.2026")} ${list("21.11.2024")}`);
  assert.equal(zepta.registered, undefined, "the first list exposes a wrong field");
  assert.equal(zepta.seenDate, "2025-02-06");
  assert.equal(zepta.firstList, "2024-11-21");
  assert.equal(parseRegisterPage("Gründungsdatum: 07.11.2023").registered, undefined, "a field alone settles nothing");
});

test("a register page shows a move and a conversion", () => {
  assert.equal(parseRegisterPage("Sitz, bisher Düsseldorf, Amtsgericht Düsseldorf HRB 110642) beschlossen").movedFrom, "Amtsgericht Düsseldorf HRB 110642");
  assert.equal(parseRegisterPage("(bisher Amtsgericht Duisburg HRB 36807 ) nach Moers").movedFrom, "Amtsgericht Duisburg HRB 36807");
  assert.equal(parseRegisterPage("Firma, bisher Foo GmbH, geändert").movedFrom, undefined, "an old name is not a move");
  assert.equal(parseRegisterPage("Umwandlungsvertrag vom 07.05.2025").converted, true);
});

test("judge: what rules a company out, and what still needs a person", () => {
  const known = { registers: new Map([["Amtsgericht Bonn HRB 7", "Twin"]]), entries: [{ name: "Old", register: "Amtsgericht Bonn HRB 500", registered: "2020-01-01" }] };
  const window = "2023-11-07";
  const imprint = { register: "Amtsgericht Bonn HRB 900", legalName: "Foo GmbH" };
  const out = (i, f) => judge(i, f, known, window);

  assert.match(out({ foreign: true }, {}).why, /abroad/);
  assert.match(out({ register: "Amtsgericht Bonn HRB 7" }, {}).why, /same register entry as Twin/);
  assert.match(out({ register: "Amtsgericht Bonn HRB 7 B" }, {}).why, /Twin/, "the court's letter does not hide a twin");
  assert.match(out({ register: "Amtsgericht Bonn HRB 400" }, {}).why, /below Old's/);

  assert.match(out(imprint, { registered: "2023-10-05" }).why, /2023-10-05, before the window/);
  assert.match(out(imprint, { seenDate: "2021-06-29" }).why, /before the window/, "a date too old to be trusted is still too old");
  assert.match(out(imprint, { seenDate: "2024-04-05", firstList: "2023-09-18", converted: true }).why, /2023-09-18/, "a list cannot predate the company");

  assert.deepEqual(out(imprint, { registered: "2025-05-27", registerPage: "https://x/" }), { registered: "2025-05-27", registerPage: "https://x/" });
  assert.equal(out(imprint, { registered: "2025-10-22", registerPage: "https://x/", movedFrom: "Amtsgericht Y HRB 1" }).movedFrom, "Amtsgericht Y HRB 1");

  assert.match(out(imprint, { registered: "2025-01-01", nameOnPage: "CS Company Shield GmbH" }).problem, /calls it CS Company Shield/, "a different name may be an older company");
  assert.equal(out(imprint, { registered: "2025-01-01", nameOnPage: "foo gmbh" }).registered, "2025-01-01");
  assert.match(out(imprint, { converted: true, seenDate: "2025-08-27" }).problem, /converted/);
  assert.match(out(imprint, { movedFrom: "Amtsgericht Y HRB 1", seenDate: "2025-12-31" }).problem, /moved from/);
  assert.match(out(imprint, { seenDate: "2024-09-02" }).problem, /only has a date field/);
  assert.match(out(imprint, {}).problem, /no register page/);
  assert.match(out({ problem: "the imprint could not be read" }, {}).problem, /could not be read/);
});

const ROBOTS = `
# As a condition of accessing this website...
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: GPTBot
Disallow: /

# AI Agents
User-agent: Perplexity-User
Disallow: /
User-agent: Claude-User
Disallow: /
`;

test("robots.txt: the agent's own group decides, otherwise the * group", () => {
  assert.equal(robotsAllow(ROBOTS, "/wp-json/wp/v2/posts", "robonn-industry-map-finder"), true);
  assert.equal(robotsAllow(ROBOTS, "/wp-json/wp/v2/posts", "Claude-User"), false, "an AI agent is held to the rules for AI agents");
  assert.equal(robotsAllow("", "/", "x"), true, "no robots.txt closes nothing");
  assert.equal(robotsAllow("User-agent: *\nDisallow:\n", "/x", "x"), true, "an empty Disallow allows everything");
  assert.equal(robotsAllow("User-agent: *\nDisallow: /\n", "/impressum", "x"), false);
  assert.equal(robotsAllow("User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n", "/wp-admin/admin-ajax.php", "x"), true);
  assert.equal(robotsAllow("User-agent: *\nDisallow: /wp-admin/\n", "/wp-admin/x", "x"), false);
  assert.equal(robotsAllow("User-agent: *\nDisallow: /*?add-to-cart=\n", "/shop?add-to-cart=1", "x"), false);
  assert.equal(robotsAllow("User-agent: a\nUser-agent: b\nDisallow: /\nUser-agent: *\nAllow: /\n", "/", "b"), false, "agents can share a group");
  assert.equal(robotsAllow("User-agent: *\nContent-Signal: search=no\nAllow: /\n", "/", "x"), false, "a refused signal closes the site");
});

test("leads are added at the end of the array, and nothing else moves", () => {
  const src = `const NEW_STARTUP_REVIEW = {\n  rejected: [\n    {\n      name: "A"\n    }\n  ],\n  leads: [\n    {\n      name: "B",\n      city: "Bonn"\n    }\n  ]\n};\n`;
  const next = addLeads(src, [{ name: 'C "the" Bot', source: "https://x.example/" }, { name: "D" }]);
  const review = new Function(`${next};return NEW_STARTUP_REVIEW;`)();
  assert.deepEqual(review.leads.map(l => l.name), ["B", 'C "the" Bot', "D"]);
  assert.equal(review.rejected.length, 1);
  assert.ok(next.startsWith(src.slice(0, src.indexOf("    }\n  ]\n};"))));
});

test("leads can be added to an empty array, and a changed layout stops the run", () => {
  const empty = `const NEW_STARTUP_REVIEW = {\n  rejected: [],\n  leads: []\n};\n`;
  const review = new Function(`${addLeads(empty, [{ name: "A" }])};return NEW_STARTUP_REVIEW;`)();
  assert.deepEqual(review.leads, [{ name: "A" }]);
  assert.throws(() => addLeads("const NEW_STARTUP_REVIEW = { leads: [] };", [{ name: "A" }]), /cannot find/);
});

test("the seen file has one entry per line and is valid JSON", () => {
  assert.deepEqual(JSON.parse(seenFile("2026-11-07", [])), { updated: "2026-11-07", seen: [] });
  const text = seenFile("2026-11-15", [{ name: "A", host: "a.example" }, { name: "B", host: "b.example" }]);
  assert.equal(JSON.parse(text).seen.length, 2);
  assert.equal(text.split("\n").filter(l => l.includes('"name"')).length, 2);
});

test("the summary sorts leads by what is left to do and copies no article text", () => {
  const base = { sector: "robotics", strong: true, website: "https://a.example/", article: "https://press.example/a", city: "Bonn", text: "von A. Beispiel gegründet" };
  const report = renderReport({
    today: "2026-11-15",
    proposals: [
      { ...base, name: "Ready", legalName: "Ready GmbH", register: "Amtsgericht Bonn HRB 1", registered: "2025-05-27", registerPage: "https://r.example/1", imprint: "https://a.example/impressum" },
      { ...base, name: "Dated later", legalName: "Dated GmbH", register: "Amtsgericht Bonn HRB 2", problem: "the register page only has a date field (2024-09-02), with nothing to confirm it" },
      { ...base, name: "Unclear", strong: false, sector: "ai_ml", problem: "the imprint could not be read" },
    ],
    heldBack: 2,
    leftOut: [{ name: "Far", article: "https://press.example/f", why: "based abroad" }],
    read: [{ label: "One", posts: 3, names: 6 }, { label: "Two", error: "HTTP 500" }, { label: "Three", posts: 4, names: 0 }],
    known: 5,
  });
  assert.ok(report.indexOf("Ready to check") < report.indexOf("Needs a look"));
  assert.match(report, /\*\*Ready\*\* \| robotics \| Bonn \| Ready GmbH \| Amtsgericht Bonn HRB 1 \| 2025-05-27/);
  assert.match(report, /\[register page\]\(https:\/\/r\.example\/1\)/);
  assert.match(report, /northdata\.de\/Ready\+GmbH,\+Bonn\/Amtsgericht\+Bonn\+HRB\+1\)/, "North Data has a page per company, not a search address");
  assert.ok(report.indexOf("Dated later") > report.indexOf("Needs a look"), "a register number without a settled date needs a person");
  assert.match(report, /\*\*Unclear\*\* \| ai_ml \(weak\)/);
  assert.match(report, /2 more were held back/);
  assert.match(report, /could not be read \(HTTP 500\)/);
  assert.match(report, /format may have changed/);
  assert.ok(!report.includes("Beispiel"), "no founder's name reaches the pull request");
  assert.match(renderReport({ today: "2026-11-15", proposals: [], heldBack: 0, leftOut: [], read: [], known: 0 }), /found nothing new/);
});

test("names compare without legal form or punctuation", () => {
  assert.equal(normName("Foo Robotics GmbH"), normName("foo robotics"));
  assert.equal(normName("selbstfahrer."), "selbstfahrer");
  assert.equal(inlineText("Foo&nbsp;<b>Bar</b><br />Baz &amp; &#8222;Qux&#8220;"), "Foo Bar Baz & „Qux“");
});

test("every source says what it is and how to read it", () => {
  for (const s of SOURCES) {
    assert.ok(s.label && /^https:\/\/.+\/wp-json\/wp\/v2\/posts$/.test(s.api), s.label);
    assert.equal(typeof s.read, "function");
  }
});
