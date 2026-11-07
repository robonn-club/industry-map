# New startups: method, sources and coverage

The **Startups** page ([`startups.html`](startups.html)) lists tech startups founded in
Germany in the last three years; on the map, the same startups wear a gold ring. Every entry has been checked against the German commercial register, the company's
own imprint and an independent source. This page explains what counts, where the data
comes from, how it is checked and kept current, and how complete it is: **not very, and
the page says so.**

- Data: [`data/companies/new-startups.js`](data/companies/new-startups.js) (the startups)
  and [`data/companies/new-startups.review.js`](data/companies/new-startups.review.js)
  (national baseline, every candidate checked and left out, open leads)
- Finder: `node scripts/find-startups.mjs` ([new names every two weeks](#new-names-every-two-weeks))
- Report: `node scripts/new-startups.mjs` (coverage, gaps, what needs doing)
- Last full review: **2026-10-05**

## What counts as a tech startup here

All five must hold:

1. **Founded in the last three years.** The first entry in the commercial register falls
   inside a rolling three-year window, measured to the day (see [Dates](#dates)).
2. **German.** The company is entered in a German commercial register (GmbH, UG, AG, SE,
   KG…) and its imprint gives a German address. A German team behind a foreign holding
   counts only through its German operating company.
3. **New and independent.** A new business, not a subsidiary, joint venture, carve-out or
   holding of an established company, and not an older business that was renamed or
   re-registered. University and research spin-offs count.
4. **Technology is the product.** It builds its own software, hardware or deep tech in one
   of the map's seven domains: robotics, automotive & mobility, AI & ML, industrial
   technology, software & tech, aerospace & defence, agriculture. Agencies, consultancies,
   IT service providers, resellers and shops do not count. Neither do fintech, biotech,
   medtech, consumer apps or e-commerce: real tech startups, but outside what this map
   is for.
5. **Built to grow.** The same test the national statistics use: an innovative product
   and/or a scalable model. Supporting evidence is recorded where public: an external
   funding round, a selective accelerator, or a research-transfer programme such as EXIST.

Size does not matter. A three-year-old company with 300 staff (STARK) is still a new
startup.

## Dates

A startup has several dates, and they disagree more often than you would think:

| Date | What it is | Where it comes from | Used for |
|---|---|---|---|
| `registered` | First entry in the commercial register: the day the company legally came into existence | Handelsregister (via its publications) | **The three-year window** |
| `founded` | The founding year the company or the press states | Company site, press | Shown to readers; contradiction check |
| Articles of association | The notarised founding act (*Gesellschaftsvertrag vom …*), usually weeks before registration | Register printout | Not recorded |

**Why the window runs on `registered`:** it is precise to the day, official, the same for
every company, and anyone can check it. It is also how the national counts are made
([Startup-Verband / startupdetector](#how-complete-it-is) count startups when they enter
the register), so the coverage figure compares like with like.

**The stated founding year can still rule a startup out.** If a company says it was
founded before the window opened, it is not listed, whatever its register date says
(a team that ran for years before incorporating). The register date can also rule one
out: a company that says "founded 2024" but was registered in September 2023 is out.

**`founded` is never inferred.** It is filled in only when a source states it, and the
source is linked. Where none does, the field is empty and readers see the register date
alone. In the current data the two disagree by a year for two startups: eternal.ag
(registered November 2024, "founded 2025") and Twentyfour Industries (registered
January 2025, "incorporated late 2024").

**Edge cases.** A startup that bought a shelf company has a register date older than its
business: it falls out of the window and is excluded, which errs on the safe side.
Moving seat or changing name keeps the register entry and its first date (BFL GmbH was
registered in Munich and moved to Freiburg four months later), so a move is not a new
founding.

## Sources

What each source covers, how it can be accessed, what its terms allow, and the role it
plays here. Checked October 2026.

| Source | Coverage | Access | Reuse terms | Role here |
|---|---|---|---|---|
| **Handelsregister** ([Registerportal](https://www.handelsregister.de)) | Every German company, complete and authoritative: legal name, court and number, seat, registration and deletion | Free web search and printouts since August 2022. **No API, no bulk download.** Capped at 60 retrievals per hour; the portal's FAQ warns that automated mass retrieval can be a criminal offence (§§ 303a, 303b StGB) and it is regularly overloaded | Register facts are public. Bulk extraction is ruled out by the cap | **Authoritative check of every entry.** Looked up one company at a time. Never scraped |
| EU high-value datasets ([Reg. (EU) 2023/138](https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX%3A32023R0138)) | Would require free API and bulk access to company-register data since June 2024 | Germany has **not** published one; an [IFG request](https://fragdenstaat.de/anfrage/antrag-nach-ss-1-informationsfreiheitsgesetz-ifg-umsetzung-von-ss-9-dng-vo-eu-2023-138-fuer-das-unternehmensregister/) asking when was still unanswered in September 2026 | Would be open (CC BY 4.0 or freer) | None yet. **Would change everything:** with a bulk feed, every new registration could be screened automatically |
| [North Data](https://www.northdata.de) | Mirror of the register's publications: first registration, seat and name history, deletions, insolvencies | Free page views; paid data service | No reuse licence for the database | **Convenient view of the register entry.** Each entry from October 2026 links its North Data page *and* names court + number, so the fact can be checked on the Registerportal itself. It answers automated readers with HTTP 429, so it is for people |
| [online-handelsregister.de](https://www.online-handelsregister.de) | A public page per company, built from the register: first entry, moves of seat, filed documents | Free page views (it sells the documents). Its robots.txt allows automated readers | Facts with a link | **First-entry date, for the finder and for review.** A mirror, not the register, with two traps: see [below](#new-names-every-two-weeks) |
| [OffeneRegister.de](https://offeneregister.de) (OKF / OpenCorporates) | 5.1 million companies from the register's publications | Open download | Open data | None: a snapshot from February 2019, never updated, so nothing in the window |
| [OpenCorporates](https://opencorporates.com) | German register data among 140+ jurisdictions | API needs a key | ODbL (share-alike) | None |
| **Startup-Verband & startupdetector**, [*Next Generation*](https://startupverband.de/media/file/rs-nextgenerationstartupneugruendungenh12026) reports, [Startup Dashboard](https://www.startup-dashboard-deutschland.de) | Every new register entry screened, about 3% classed as startups; half-year counts by state and sector since 2019 | Free reports, twice a year | Counts are citable; **the list of names is a commercial product** | **The denominator** for coverage, by state |
| [appliedAI German AI Startup Landscape](https://www.appliedai-institute.de/en/hub/2025-ai-german-startup-landscape) | 935 German AI startups (2025), at least two staff, founded 2015 or later | Free interactive database and poster, yearly | CC BY 4.0 | Not used yet. A good next source for AI, though by its own account it lists startups only some time after they are founded |
| [Wikidata](https://www.wikidata.org) | ~270 German organisations with a founding date in the window, mostly agencies, shops and self-created items; few real startups | Free SPARQL API | CC0 | Automated leads (`fetch-candidates.mjs --since`). Low yield: the October 2026 run returned three candidates, one of them a Continental carve-out, while two of its seven sector queries failed (rate limit, timeout) |
| Startup databases: Crunchbase, Dealroom, PitchBook, Tracxn, CB Insights, [Startbase](https://www.startbase.de), [VCNews list](https://vcnews.de/startup-liste), [Startup-Radar](https://startupradar.substack.com) | Broad, skewed to funded startups | Paid, or free pages | No redistribution (Startbase terms § 5(4), the rest by licence) | At most a place to spot names. **Nothing is copied from them** |
| Press and ecosystem: deutsche-startups.de, StartingUp, tech.eu, Sifted, Munich Startup, Berlin Partner… | Funding rounds, launches, "startups to watch" | Free | Facts with a link | **Discovery and independent confirmation** |
| Universities and research transfer: TUM Venture Labs, CISPA, Fraunhofer, RWTH, TU Dresden, Helmholtz… | Spin-offs of their own labs | Free | Facts with a link | **Discovery and independent confirmation** |
| The company's own imprint (§ 5 DDG) | Legal name, register court and number, address: legally required | Free | Facts | **Ties the website to the register entry.** The map pin goes on the imprint address |

**Why not just scrape the register?** It would cover everything, but the terms forbid it
at any useful rate, the portal is overloaded as it is, and the register says nothing
about what a company does: about 97 of every 100 new entries are not startups. Telling
them apart takes reading, which is what startupdetector does by hand and sells.

## New names every two weeks

[`scripts/find-startups.mjs`](scripts/find-startups.mjs) runs on the 1st and 15th of each
month ([`find-startups.yml`](.github/workflows/find-startups.yml)) and opens one pull request,
*New startups to review*. **It finds names and decides nothing:** a lead joins the list only
after the five-step check below.

| It reads | Because | Expect |
|---|---|---|
| deutsche-startups.de, *#Brandneu* | Companies founded "in the last weeks and months", about 15 a week, each with its website and city | The newest names in the German press, which is where the list is thinnest |
| Hamburg Startups | Hamburg has no entry yet, against 7% of national foundings | Profiles and funding news |
| Robotics & Automation News (search: German startup) | Robotics is what the club is for | Few, mostly funded |
| AgFunderNews (search: Germany) | So is agriculture | Few, many out of scope |

What it does with a name:

1. **Drops what is already known:** on the map, on the rejected list, an open lead, or
   proposed before (`new-startups.seen.json`). A lead deleted in review therefore stays gone.
2. **Drops what the article rules out:** based abroad, a stated founding year before the
   window, or no word from the map's domains. Robotics, agriculture, energy, logistics,
   aerospace and defence rank first. AI and software fit half of all new startups, so they
   rank below.
3. **Reads the company's own imprint** for its legal name, register entry and city. Tried on
   the 32 startups listed in November 2026, it read 25, and all 25 matched the checked
   number, court and legal name. The other 7 draw their imprint with JavaScript and land under
   *Needs a look*.
4. **Reads the first-entry date** from the company's page on online-handelsregister.de. It takes
   a date only if the page states it as the first entry, or if the page's date field agrees
   with the first shareholder list filed. Tried on the 66 entries already checked by hand, it
   gave a date for 54, all of them right, and declined the other 12.
5. **Drops whatever is already too old:** any date on that page before the window, and any
   register number below one known to predate the window at the same court. Those dates can be
   too late but never too early, so they rule a company out even where they could not rule it in.
6. **Proposes the best 20.** The rest wait for the next run.

The mirror's "first entry" is the first entry *under this court and number*, which is wrong in
two cases. A company that **moved seat** arrives at its new court with a new date, so the finder
follows the page's "bisher … Amtsgericht … HRB …" back to the old court. A company **converted**
from another legal form ("Umwandlung") existed before this number did, so the date settles
nothing and the lead goes under *Needs a look*. If the page names the company differently from
its imprint, that goes there too: it is how an older company under a new name shows up.

**What stays manual:** the judgement that this is a new, independent technology company, the
independent source, and the date for anything under *Needs a look*. The finder never contacts
the register or North Data.

**What it keeps:** names, links, legal entity, register number and city. It does not keep
article text, because those paragraphs name founders.

**Reviewing the pull request.** The next run rewrites it, so finish within two weeks. For each
lead: confirm the first-entry date, do the rest of the check below, then add it to
`new-startups.js` and remove the lead, or move it to `rejected` with the reason. Delete a lead
that is plainly wrong. A lead you have no time for can stay: merging lists it on the page as
named in sources, not checked yet.

**robots.txt.** The finder reads robots.txt before every site and skips one that closes itself
to it; the pull request says so. deutsche-startups.de allows ordinary clients, sets
`search=yes, ai-train=no, use=reference`, and names AI agents, Claude among them, as disallowed
(read November 2026). The finder is a plain script with no AI in it, and it keeps only names
and links back to the article, so it falls under the rule for ordinary clients. **An AI agent
must not read that site:** run from Claude Code, the finder obeys the rules for AI agents and
skips the source by itself, and during a review a person opens those articles. companyhouse.de
and unternehmen24.info bar AI agents in the same way.

**Setup, once:** tick *Allow GitHub Actions to create and approve pull requests* under
*Settings → Actions → General → Workflow permissions*. The organisation allows it, but each
repository has its own box. Scheduled workflows only run from `main`.

## How entries are collected and checked

**1. Find leads.** From the finder's pull request, press, accelerators, university spin-off
pages, the open leads in `new-startups.review.js`, and
`node scripts/fetch-candidates.mjs --since <window start>` for Wikidata.

**2. Check the register.** Find the company's entry: on the
[Registerportal](https://www.handelsregister.de) (advanced search, then the current printout),
its [North Data](https://www.northdata.de) page, or its page on
[online-handelsregister.de](https://www.online-handelsregister.de), reading that one
[with care](#new-names-every-two-weeks). Note the **legal name, court and number, and the date
of the first entry**. If that date is before the window, stop: it goes on the rejected list as
`before-window`.

**3. Check the company's own imprint.** It must name the same legal entity (court and
number, or name and address). No imprint, a parked domain, or an imprint naming someone
else means `unverified`, however promising the startup looks.

**4. Find one independent source.** A press article, university or investor page that
confirms what the company does and, if it says so, when it was founded. Record what it
confirms in the source's `note`.

**5. Apply the definition** (above). Out of scope or not new: rejected, with the reason.

**6. Record it.** Copy an entry in `new-startups.js` under its sector. Coordinates come
from the imprint address (`node scripts/geocode.mjs` reads it). Set `verified` to the day
of the check. Then run:

```bash
node scripts/validate.mjs              # fields, register, sources, duplicates
node scripts/check-links.mjs --changed # the website resolves
node scripts/new-startups.mjs          # coverage now
```

The validator enforces the parts that can be enforced: a register entry in the form
`Amtsgericht <court> HRB <number>`, real dates, sources of all three kinds, a register
number and website used by no other entry, and no entry that is already on the rejected list.

**Personal data stays out.** Register entries name managing directors and founders, and
none of that is copied. Only company facts are recorded.

## Duplicates and inactive companies

- **One legal entity, one entry.** The register number is the key: the validator refuses a
  second entry with the same number, a website host shared with any other entry on the map,
  and a name or register number that sits on the rejected list. Brand and legal name often
  differ (Black Forest Labs is BFL GmbH, STARK is SKD SE), so both are recorded and
  `fetch-candidates.mjs` dedupes on both.
- **Already on the map.** Black Forest Labs and STARK were in the size files. They moved
  here with their evidence, and STARK's pin moved from Munich to its registered address in
  Berlin. Alpine Eagle stayed where it was: registered July 2023, before the window.
- **Inactive.** A startup that is deleted from the register, in liquidation or insolvent gets
  `status: "inactive"` and a `statusNote` saying why and since when. It stays in the file
  so it is not re-added, but it is not drawn on the map or counted. The Startups page names it
  under "Checked and left out". None is inactive as of the last full review (October
  2026). One candidate (stackOcean, Kiel) was deleted from the register in July 2026; it was outside
  the window anyway.
- **Ageing out.** When an entry's register date leaves the window it stops being "new" in
  the app automatically, and `scripts/new-startups.mjs` lists it so it can move to the size
  file that fits, keeping its sources.

## How complete it is

**As of 2026-11-07: 42 startups**, first registered between 7 November 2023 and today.

| Measure | Value |
|---|---|
| Startups founded in Germany in the window, all sectors (national count) | **≈ 11,900**: half-yearly counts from Startup-Verband / startupdetector, prorated to the window, with ≈ 2,200 extrapolated for July–November 2026, which no report covers yet |
| Listed here | **42, about 0.4 %** |
| Candidates checked | 95: 42 listed, 40 registered before the window, 6 unverifiable, 4 out of scope, 2 older businesses under a new name, 1 not German |
| States with no entry | Thuringia and Mecklenburg-Vorpommern. What turned up there so far was too old or out of scope, and is on the rejected list |
| Over-represented | Bavaria: 33 % of the list against 21 % of national foundings |
| Register date verified | 42 of 42: 32 on North Data in October 2026, 10 on online-handelsregister.de in November |
| Stated founding year found | 24 of 42. The other 18 show the register date only |

**This is a verified sample, not a census, and nothing here should be read as complete.**
Even within the map's seven domains (software alone is over a quarter of national
foundings, and a third of all new startups use AI), the true number is in the
thousands. The sample leans towards what discovery could see:

- **funded and announced** startups, because press and investor announcements were the main
  discovery channel; bootstrapped and stealth startups are under-represented;
- **Munich and Berlin**, because that is where the startup press concentrates;
- **robotics, AI and defence**, because the search started there, being the map's focus;
- **older entries over the newest months**, because press coverage lags founding by months.
  A startup registered last month is rarely findable yet.

The Startups page shows all of this to readers: the coverage figure, a state-by-state
comparison with the national counts, every rejected candidate with its reason, and the open
leads. A state with no entries says so, next to its national count.

## Keeping it current

| When | What | How |
|---|---|---|
| Every two weeks (automatic) | New names from the startup press | [`.github/workflows/find-startups.yml`](.github/workflows/find-startups.yml) opens or updates one pull request, *New startups to review* |
| Every two weeks (automatic) | Entries aged out, entries due for re-check, stale national counts, a finder that has added nothing for 45 days | [`.github/workflows/new-startups.yml`](.github/workflows/new-startups.yml) keeps one issue, *New startups: maintenance due*, current, and closes it when nothing is due |
| Weekly (automatic) | Every website still resolves | The existing link sweep covers this file too. A dead site is often the first sign a startup has closed |
| Every ~180 days per entry | Re-check register status and imprint | Update `verified`; mark `inactive` with a note if deleted, in liquidation or insolvent |
| January and July | Add the new *Next Generation* half-year to `national` in the review file | The report flags it once the latest half-year is over 270 days old |
| Each expansion pass | Work through `leads`, then the states with no entries | Same five-step check; add rejects to the review file too |

**Five more entries leave the window before the end of 2026** (last days: Hula 7 November,
Mirelo 9 November, Pruna AI 21 November, Hypersonica 5 December, Deepslate 18 December). Without
new additions the page shrinks by about one entry a month. The finder keeps new names coming,
but each still takes a person's check, so reviewing its pull request has to be a habit.

**To expand fastest:**

1. Clear the open leads in the review file.
2. Target the two states with no entries through their programmes and prizes: Thuringia (the
   ThEx AWARD, whose 2026 winners come out in November; StarTH) and Mecklenburg-Vorpommern (the
   OZ-Existenzgründerpreis, also November; Stapellauf Nordost, Startup Factory MV). What filled the
   other four in November 2026: the [ESA BIC Northern Germany portfolio](https://esa-bic.de/ng/portfolio/),
   StartUp SH's Überflieger competition, the state winners of the
   [KfW Award Gründen](https://www.kfw.de/%C3%9Cber-die-KfW/Newsroom/Aktuelles/News-Details_910208.html),
   the GROW in RLP cohort, and Hamburg's [Startup City directory](https://startupcity.hamburg/startups-ecosystem).
3. Work through the appliedAI landscape (CC BY 4.0) for AI startups registered inside the
   window.
4. Sweep the spin-off lists of the large research organisations (Fraunhofer AHEAD,
   Helmholtz, Max Planck, Leibniz) and the EXIST-Forschungstransfer announcements.
5. Should Germany publish the company register as a high-value dataset, screen every new
   registration in the window by the register's own `Gegenstand` (business purpose) and
   review the hits. That is the one route to a list that could honestly be called complete.
