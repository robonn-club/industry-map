// What the Startups page (startups.html) is measured against, and every candidate that
// was checked and left out. Coverage is a number, not an impression, and nobody
// has to re-research a startup that was already ruled out. NEW-STARTUPS.md explains
// the method; scripts/new-startups.mjs turns this into a coverage report.

const NEW_STARTUP_REVIEW = {
  // The day the last full review pass finished (every entry and rejection checked).
  reviewed: "2026-10-05",
  // The national baseline. Update it each time the report series publishes a new
  // half-year (January and July); scripts/new-startups.mjs warns when it goes stale.
  national: {
    source: "Startup-Verband and startupdetector, “Next Generation – Startup-Neugründungen in Deutschland”, January–June 2026",
    url: "https://startupverband.de/media/file/rs-nextgenerationstartupneugruendungenh12026",
    published: "2026-07",
    definition: "New entries in German commercial registers, screened by hand for an innovative product and/or strong growth potential; about 3% of all new entries qualify. Counted when registered, all sectors.",
    // Startup foundings per half-year, all sectors (report chart, page 3).
    halfYears: {
      "2023-H1": 1111,
      "2023-H2": 1201,
      "2024-H1": 1384,
      "2024-H2": 1382,
      "2025-H1": 1557,
      "2025-H2": 2011,
      "2026-H1": 3053
    },
    // Startup foundings per Bundesland in the latest half-year (page 5).
    states: {
      bavaria: 626,
      nrw: 539,
      berlin: 429,
      bw: 377,
      hesse: 270,
      hamburg: 212,
      lower_saxony: 175,
      saxony: 95,
      brandenburg: 80,
      rhineland_palatinate: 76,
      schleswig_holstein: 75,
      bremen: 23,
      saarland: 21,
      saxony_anhalt: 20,
      thuringia: 18,
      mv: 17
    },
    // The report's own top-10 sectors for the latest half-year (page 10). They are
    // not the map's seven domains, so they are context, not a denominator.
    sectorsH1: {
      Software: 844,
      Medicine: 274,
      Food: 181,
      Media: 138,
      Education: 136,
      Industry: 128,
      Advertising: 120,
      Finance: 114,
      HR: 108,
      eCommerce: 108
    },
    aiShareH1: 0.34
  },
  reasons: {
    "before-window": "First registered before the three-year window opened.",
    "not-german": "Not entered in a German commercial register.",
    "out-of-scope": "Outside the map's seven domains, or not a technology product.",
    unverified: "No website could be tied to the register entry through the company's own imprint.",
    "not-new": "A renamed, re-registered or carved-out older business.",
    duplicate: "Already on the map under another name or entity.",
    inactive: "Deleted, in liquidation or insolvent."
  },
  // Every candidate checked and left out. The validator refuses a new entry whose
  // register number appears here, so a ruled-out startup cannot slip back in by
  // accident; move it out of this list deliberately if the reason no longer holds
  // (an "unverified" one whose website turns up, say).
  rejected: [
    {
      name: "TYTAN Technologies",
      reason: "before-window",
      legalName: "TYTAN Technologies GmbH",
      register: "Amtsgericht München HRB 287624",
      registered: "2023-09-26",
      checked: "2026-10-05",
      source: "https://www.northdata.de/TYTAN+Technologies+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+287624",
      note: "Registered nine days before the window opened."
    },
    {
      name: "Manex AI",
      reason: "before-window",
      legalName: "Manex AI GmbH",
      register: "Amtsgericht München HRB 287573",
      registered: "2023-09-22",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Manex+AI+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+287573"
    },
    {
      name: "Interloom",
      reason: "before-window",
      legalName: "Interloom Technologies GmbH",
      register: "Amtsgericht München HRB 287622",
      registered: "2023-09-26",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Interloom+Technologies+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+287622"
    },
    {
      name: "Alpine Eagle",
      reason: "before-window",
      legalName: "Alpine Eagle GmbH",
      register: "Amtsgericht München HRB 286074",
      registered: "2023-07-17",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Alpine+Eagle+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+286074",
      note: "Stays on the map as a regular startup."
    },
    {
      name: "Proxima Fusion",
      reason: "before-window",
      legalName: "Proxima Fusion GmbH",
      register: "Amtsgericht München HRB 283423",
      registered: "2023-03-23",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Proxima+Fusion+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+283423"
    },
    {
      name: "Olivaw",
      reason: "before-window",
      legalName: "Olivaw GmbH",
      register: "Amtsgericht München HRB 283129",
      registered: "2023-03-14",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Olivaw+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+283129"
    },
    {
      name: "Langdock",
      reason: "before-window",
      legalName: "Langdock GmbH",
      register: "Amtsgericht Charlottenburg (Berlin) HRB 254499 B",
      registered: "2023-07-11",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Langdock+GmbH,+Berlin/Amtsgericht+Charlottenburg+(Berlin)+HRB+254499+B"
    },
    {
      name: "Synthflow",
      reason: "before-window",
      legalName: "AgentFlow AI GmbH",
      register: "Amtsgericht Charlottenburg (Berlin) HRB 255004 B",
      registered: "2023-07-26",
      checked: "2026-10-05",
      source: "https://www.northdata.de/AgentFlow+AI+GmbH,+Berlin/Amtsgericht+Charlottenburg+(Berlin)+HRB+255004+B",
      note: "Legal entity AgentFlow AI GmbH."
    },
    {
      name: "Telekinesis",
      reason: "before-window",
      legalName: "Telekinesis GmbH",
      register: "Amtsgericht Darmstadt HRB 105059",
      registered: "2023-06-06",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Telekinesis+GmbH,+Darmstadt/Amtsgericht+Darmstadt+HRB+105059"
    },
    {
      name: "red cable robots",
      reason: "before-window",
      legalName: "red cable robots GmbH",
      register: "Amtsgericht Kleve HRB 20816",
      registered: "2023-07-03",
      checked: "2026-10-05",
      source: "https://www.northdata.de/red+cable+robots+GmbH,+Duisburg/Amtsgericht+Kleve+HRB+20816"
    },
    {
      name: "ISPTech",
      reason: "before-window",
      legalName: "InSpacePropulsion Technologies GmbH",
      register: "Amtsgericht Stuttgart HRB 790914",
      registered: "2023-08-29",
      checked: "2026-10-05",
      source: "https://www.northdata.de/InSpacePropulsion+Technologies+GmbH,+Ludwigsburg/Amtsgericht+Stuttgart+HRB+790914",
      note: "Legal entity InSpacePropulsion Technologies GmbH."
    },
    {
      name: "Mana Robotics",
      reason: "before-window",
      legalName: "Mana Robotics GmbH",
      register: "Amtsgericht Dresden HRB 44022",
      registered: "2023-05-10",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Mana+Robotics+GmbH,+Dresden/Amtsgericht+Dresden+HRB+44022"
    },
    {
      name: "GEMESYS",
      reason: "before-window",
      legalName: "GEMESYS GmbH",
      register: "Amtsgericht Bochum HRB 20697",
      registered: "2023-04-06",
      checked: "2026-10-05",
      source: "https://www.northdata.de/GEMESYS+GmbH,+Bochum/Amtsgericht+Bochum+HRB+20697"
    },
    {
      name: "bitteiler",
      reason: "before-window",
      legalName: "bitteiler GmbH",
      register: "Amtsgericht Dresden HRB 43792",
      registered: "2023-02-28",
      checked: "2026-10-05",
      source: "https://www.northdata.de/bitteiler+GmbH,+Dresden/Amtsgericht+Dresden+HRB+43792"
    },
    {
      name: "deeplify",
      reason: "before-window",
      legalName: "deeplify GmbH",
      register: "Amtsgericht Düsseldorf HRB 113755",
      registered: "2023-02-27",
      checked: "2026-10-05",
      source: "https://www.northdata.de/deeplify+GmbH,+D%C3%BCsseldorf/Amtsgericht+D%C3%BCsseldorf+HRB+113755"
    },
    {
      name: "N Robotics",
      reason: "before-window",
      legalName: "N Robotics GmbH",
      register: "Amtsgericht Charlottenburg (Berlin) HRB 232374 B",
      registered: "2021-08-10",
      checked: "2026-10-05",
      source: "https://www.northdata.de/N+Robotics+GmbH,+Berlin/Amtsgericht+Charlottenburg+(Berlin)+HRB+232374+B"
    },
    {
      name: "sequire technology",
      reason: "before-window",
      legalName: "sequire technology GmbH",
      register: "Amtsgericht Saarbrücken HRB 107636",
      registered: "2021-07-27",
      checked: "2026-10-05",
      source: "https://www.northdata.de/sequire+technology+GmbH,+Saarbr%C3%BCcken/Amtsgericht+Saarbr%C3%BCcken+HRB+107636"
    },
    {
      name: "nerou",
      reason: "before-window",
      legalName: "nerou GmbH",
      register: "Amtsgericht Köln HRB 105571",
      registered: "2021-04-12",
      checked: "2026-10-05",
      source: "https://www.northdata.de/nerou+GmbH,+K%C3%B6ln/Amtsgericht+K%C3%B6ln+HRB+105571"
    },
    {
      name: "NanoStruct",
      reason: "before-window",
      legalName: "NanoStruct GmbH",
      register: "Amtsgericht Würzburg HRB 15520",
      registered: "2021-02-16",
      checked: "2026-10-05",
      source: "https://www.northdata.de/NanoStruct+GmbH,+W%C3%BCrzburg/Amtsgericht+W%C3%BCrzburg+HRB+15520"
    },
    {
      name: "Framework Robotics",
      reason: "before-window",
      legalName: "Framework Robotics GmbH",
      register: "Amtsgericht Rostock HRB 15088",
      registered: "2020-10-29",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Framework+Robotics+GmbH,+Rostock/Amtsgericht+Rostock+HRB+15088"
    },
    {
      name: "encentive",
      reason: "before-window",
      legalName: "encentive GmbH",
      register: "Amtsgericht Kiel HRB 22238 KI",
      registered: "2020-10-05",
      checked: "2026-10-05",
      source: "https://www.northdata.de/encentive+GmbH,+Neum%C3%BCnster/Amtsgericht+Kiel+HRB+22238+KI"
    },
    {
      name: "Agvolution",
      reason: "before-window",
      legalName: "Agvolution GmbH",
      register: "Amtsgericht Göttingen HRB 206002",
      registered: "2020-05-27",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Agvolution+GmbH,+G%C3%B6ttingen/Amtsgericht+G%C3%B6ttingen+HRB+206002"
    },
    {
      name: "stackOcean",
      reason: "before-window",
      legalName: "stackOcean GmbH",
      register: "Amtsgericht Kiel HRB 21270 KI",
      registered: "2019-12-06",
      checked: "2026-10-05",
      source: "https://www.northdata.de/stackOcean+GmbH,+Kiel/Amtsgericht+Kiel+HRB+21270+KI",
      note: "Also deleted from the register on 2026-07-15."
    },
    {
      name: "akeno",
      reason: "before-window",
      legalName: "akeno GmbH",
      register: "Amtsgericht Hamburg HRB 155727",
      registered: "2017-06-30",
      checked: "2026-10-05",
      source: "https://www.northdata.de/akeno+GmbH,+Hamburg/Amtsgericht+Hamburg+HRB+155727",
      note: "An older company renamed, not a new founding."
    },
    {
      name: "DAIKI",
      reason: "not-german",
      legalName: "DAIKI GmbH",
      registered: "2023-06-06",
      checked: "2026-10-05",
      source: "https://www.northdata.de/DAIKI+GmbH,+Wien",
      note: "Registered in the Austrian Firmenbuch (Vienna)."
    },
    {
      name: "Twogee Biotech",
      reason: "out-of-scope",
      legalName: "Twogee Biotech GmbH",
      register: "Amtsgericht München HRB 305097",
      registered: "2025-07-24",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Twogee+Biotech+GmbH,+Planegg/Amtsgericht+M%C3%BCnchen+HRB+305097",
      note: "Biotech, outside the map's seven domains."
    },
    {
      name: "SynthesEyes",
      reason: "out-of-scope",
      legalName: "SynthesEyes GmbH",
      register: "Amtsgericht München HRB 294071",
      registered: "2024-06-26",
      checked: "2026-10-05",
      source: "https://www.northdata.de/SynthesEyes+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+294071",
      note: "Surgical training simulators (medtech), outside the map's domains."
    },
    {
      name: "DeepEn",
      reason: "out-of-scope",
      legalName: "DeepEn GmbH",
      register: "Amtsgericht Jena HRB 521680",
      registered: "2024-02-14",
      checked: "2026-10-05",
      source: "https://www.northdata.de/DeepEn+GmbH,+Jena/Amtsgericht+Jena+HRB+521680",
      note: "Holographic endoscopes for neuroscience (medtech), outside the map's domains."
    },
    {
      name: "Project Q",
      reason: "unverified",
      legalName: "Project Q GmbH",
      register: "Amtsgericht München HRB 293687",
      registered: "2024-06-07",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Project+Q+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+293687",
      note: "project-q.eu serves no working HTTPS and its HTTP page names a different address; no website could be tied to the register entry."
    },
    {
      name: "SE3 Labs",
      reason: "unverified",
      legalName: "SE3 Labs GmbH",
      register: "Amtsgericht München HRB 289526",
      registered: "2023-12-18",
      checked: "2026-10-05",
      source: "https://www.northdata.de/SE3+Labs+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+289526",
      note: "se3labs.com is a parked domain; no website could be tied to the register entry."
    },
    {
      name: "VREY",
      reason: "unverified",
      legalName: "RE Joule GmbH",
      register: "Amtsgericht Charlottenburg (Berlin) HRB 267874 B",
      registered: "2024-09-24",
      checked: "2026-10-05",
      source: "https://www.northdata.de/RE+Joule+GmbH,+Berlin/Amtsgericht+Charlottenburg+(Berlin)+HRB+267874+B",
      note: "Legal entity RE Joule GmbH; vrey.de has an invalid TLS certificate and no readable imprint."
    },
    {
      name: "The Robot Learning Company",
      reason: "unverified",
      legalName: "The Robot Learning Company GmbH",
      register: "Amtsgericht München HRB 301278",
      registered: "2025-04-02",
      checked: "2026-10-05",
      source: "https://www.northdata.de/The+Robot+Learning+Company+GmbH,+M%C3%BCnchen/Amtsgericht+M%C3%BCnchen+HRB+301278",
      note: "robot-learning.co shows no imprint, so the site cannot be tied to the register entry."
    },
    {
      name: "2Sync",
      reason: "unverified",
      legalName: "2Sync GmbH",
      register: "Amtsgericht Potsdam HRB 39154",
      registered: "2024-02-23",
      checked: "2026-10-05",
      source: "https://www.northdata.de/2Sync+GmbH,+Potsdam/Amtsgericht+Potsdam+HRB+39154",
      note: "2sync.com belongs to someone else, and a vendor listing dates the business to 2018."
    },
    {
      name: "Nomadic Drones",
      reason: "unverified",
      legalName: "Yellow-TS UG",
      register: "Amtsgericht Frankfurt am Main HRB 123329",
      registered: "2021-06-11",
      checked: "2026-10-05",
      source: "https://www.northdata.de/Yellow-TS+UG,+Frankfurt+a.+Main/Amtsgericht+Frankfurt+am+Main+HRB+123329",
      note: "The imprint on nomadic-drones.com names Yellow-TS UG, registered 2021."
    },
    {
      name: "revel8",
      reason: "before-window",
      legalName: "revel8 GmbH",
      register: "Amtsgericht München HRB 287782",
      registered: "2023-10-05",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/by/Muenchen/HRB/287782",
      note: "A month before the window opened; the register page still names it CS Company Shield GmbH."
    },
    {
      name: "DeepSynergy.AI",
      reason: "before-window",
      legalName: "DeepSynergy.AI GmbH",
      register: "Amtsgericht Traunstein HRB 31965",
      registered: "2023-05-26",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/by/Traunstein/HRB/31965"
    },
    {
      name: "Inline Process Solutions",
      reason: "before-window",
      legalName: "Inline Process Solutions GmbH",
      register: "Amtsgericht Kaiserslautern HRB 33787",
      registered: "2023-10-10",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/rp/Kaiserslautern/HRB/33787"
    },
    {
      name: "Marble Imaging",
      reason: "before-window",
      legalName: "Marble Imaging GmbH",
      register: "Amtsgericht Bremen HRB 41893 HB",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/hb/Bremen/HRB/41893HB",
      note: "Says it was founded in August 2023, and its first shareholder list is dated 18 September 2023. The register page's April 2024 date is later than that, so it cannot be the first entry."
    },
    {
      name: "Astrait",
      reason: "before-window",
      legalName: "ASTRAIT UG (haftungsbeschränkt)",
      register: "Amtsgericht Bremen HRB 36985 HB",
      checked: "2026-11-07",
      source: "https://www.starthaus-bremen.de/en/page/media-centre/success-stories/astrait-esa",
      note: "Started in 2021 as Levity Space; the register page's date field says June 2021."
    },
    {
      name: "goodBytz",
      reason: "before-window",
      legalName: "GoodBytz GmbH",
      register: "Amtsgericht Hamburg HRB 171538",
      registered: "2021-10-19",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/hh/Hamburg/HRB/171538"
    },
    {
      name: "Procuros",
      reason: "before-window",
      legalName: "Procuros GmbH",
      register: "Amtsgericht Hamburg HRB 169672",
      registered: "2021-06-28",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/hh/Hamburg/HRB/169672"
    },
    {
      name: "hansetherm",
      reason: "not-new",
      legalName: "hansetherm GmbH",
      register: "Amtsgericht Hamburg HRB 174065",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/hh/Hamburg/HRB/174065",
      note: "Its register entry dates from March 2022, under the name KLT Health Services GmbH."
    },
    {
      name: "Rabot Energy",
      reason: "not-new",
      legalName: "RABOT Energy DE GmbH",
      register: "Amtsgericht Hamburg HRB 194021",
      checked: "2026-11-07",
      source: "https://www.htgf.de/en/portfolio/htgffamily/rabot-energy/",
      note: "Founded in 2021 as Rabot Charge; this entity came out of a conversion in 2025."
    },
    {
      name: "Digid",
      reason: "before-window",
      legalName: "digid GmbH",
      register: "Amtsgericht Mainz HRB 50564",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/rp/Mainz/HRB/50564",
      note: "Moved from Frankfurt, where it was entered in March 2021 under another name."
    },
    {
      name: "TENTA VISION",
      reason: "before-window",
      checked: "2026-11-07",
      source: "https://www.hochschule-trier.de/hochschule/aktuelles/news-und-pressemitteilungen/news-detail/erfolgreiche-wissenschaftliche-ausgruendung-an-der-hochschule-trier",
      note: "Founded in autumn 2022."
    },
    {
      name: "Bareways",
      reason: "before-window",
      legalName: "Bareways GmbH",
      register: "Amtsgericht Lübeck HRB 19028 HL",
      registered: "2019-06-28",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/sh/Luebeck/HRB/19028HL"
    },
    {
      name: "HEIONTEC",
      reason: "before-window",
      legalName: "HEIONIT GmbH",
      register: "Amtsgericht Lübeck HRB 23116 HL",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/sh/Luebeck/HRB/23116HL",
      note: "The register page's date field says November 2022."
    },
    {
      name: "Flucto",
      reason: "before-window",
      legalName: "Flucto GmbH",
      register: "Amtsgericht Bremen HRB 36239 HB",
      registered: "2020-11-24",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/hb/Bremen/HRB/36239HB"
    },
    {
      name: "thermal DRONES",
      reason: "before-window",
      legalName: "thermal DRONES GmbH",
      register: "Amtsgericht Stralsund HRB 21335",
      registered: "2020-08-31",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/mv/Stralsund/HRB/21335"
    },
    {
      name: "Warmwind",
      reason: "before-window",
      legalName: "Warmwind AG",
      register: "Amtsgericht Jena HRB 519308",
      checked: "2026-11-07",
      source: "https://www.online-handelsregister.de/handelsregisterauszug/th/Jena/HRB/519308",
      note: "The register page's date field says March 2022; it was renamed from eva AG in 2025."
    },
    {
      name: "Quantum Optics Jena",
      reason: "before-window",
      checked: "2026-11-07",
      source: "https://www.iof.fraunhofer.de/en/pressrelease/2021/quantum-optics-jena.html",
      note: "Spun out of Fraunhofer IOF in 2020."
    },
    {
      name: "Voodin Blade Technology",
      reason: "before-window",
      checked: "2026-11-07",
      source: "https://electrek.co/2024/05/03/german-startup-pioneering-recyclable-wooden-wind-turbine-blades/",
      note: "Founded in 2021."
    },
    {
      name: "Lumeox",
      reason: "out-of-scope",
      legalName: "Lumeox GmbH",
      register: "Amtsgericht Lübeck HRB 24934 HL",
      registered: "2024-05-06",
      checked: "2026-11-07",
      source: "https://lumeox.health/en/about/",
      note: "Blood analysis for emergency medicine: medtech."
    }
  ],
  // Named in a source as a young German tech startup, but not yet checked. The next
  // review pass starts here. scripts/find-startups.mjs adds to the end of this list, with
  // whatever it could find: `source` is the article, `imprint` and `register` what the
  // company's own imprint says, `registered` and `registerPage` the first entry where a
  // public mirror settled it (all unconfirmed until the five-step check), `note` its guess
  // at the sector and what is still open. It expects this array to stay the last thing in the file.
  leads: [
    {
      name: "Project-S",
      city: "Munich",
      note: "space safety and orbital intelligence; says it is Project-S Space and Beyond Technologies GmbH, founded in 2024, but its imprint could not be read and no register page turned up",
      source: "https://www.munich-startup.de/en/news/millions-in-funding-for-project-s"
    },
    {
      name: "disait",
      city: "Bottrop",
      note: "collaborative robot for clay plastering; register entry read, but no company website found yet, so no imprint to tie it to",
      source: "https://www.umweltwirtschaft.nrw.de/nachrichten/details/26-zukunftstechnologien-aus-nordrhein-westfalen-erhalten-rueckenwind-136-millionen-euro-foerderung-fuer-gruene-start-ups-durch-land-nordrhein-westfalen-und-eu",
      legalName: "disait - Design in Science and in Technology GmbH",
      register: "Amtsgericht Gelsenkirchen HRB 19987",
      registered: "2026-07-17",
      registerPage: "https://www.online-handelsregister.de/handelsregisterauszug/nw/Gelsenkirchen/HRB/19987"
    },
    {
      name: "Reware Labs",
      city: "Saarbrücken",
      note: "AI software security (CISPA); the imprint gives no register number yet",
      website: "https://rewarelabs.com",
      source: "https://cispa.de/cispa-startups",
      imprint: "https://rewarelabs.com/imprint/"
    },
    {
      name: "CyberTide",
      city: "Saarbrücken",
      note: "self-hosted data-security platform (CISPA); website and imprint not found yet",
      source: "https://cispa.de/en/interview-cybertide"
    },
    {
      name: "elementarhy",
      city: "Hamburg",
      note: "sector guess: industrial; hydrogen technology, a spin-off of the Leibniz Institute for Plasma Research in Greifswald; the register page only has a date field (2024-09-02), with nothing to confirm it",
      website: "https://elementarhy.com",
      source: "https://startupcity.hamburg/news-events/stories/elementarhy-makes-green-hydrogen-cheaper",
      found: "2026-11-07",
      legalName: "elementarhy GmbH",
      register: "Amtsgericht Hamburg HRB 188418",
      registerPage: "https://www.online-handelsregister.de/handelsregisterauszug/hh/Hamburg/HRB/188418",
      imprint: "https://elementarhy.com/imprint/"
    },
    {
      name: "Hofer Photonics",
      city: "Hamburg",
      note: "sector guess: industrial; laser technology for real-time material analysis; the register page only has a date field (2024-07-29), with nothing to confirm it",
      website: "https://hofer-photonics.com",
      source: "https://startupcity.hamburg/startups-ecosystem/hofer-photonics-gmbh",
      found: "2026-11-07",
      legalName: "Hofer Photonics GmbH",
      register: "Amtsgericht Hamburg HRB 187917",
      registerPage: "https://www.online-handelsregister.de/handelsregisterauszug/hh/Hamburg/HRB/187917",
      imprint: "https://www.hofer-photonics.com/imprint.html"
    },
    {
      name: "fiberior",
      city: "Neustadt an der Weinstraße",
      note: "sector guess: industrial; fibre-reinforced thermoplastic parts; moved from Kaiserslautern in 2025, so the first entry is at another court, and no register page turned up",
      website: "https://fiberior.de",
      source: "https://isb.rlp.de/home/detailansicht/isb-beteiligt-sich-an-der-fiberior-gmbh.html",
      found: "2026-11-07",
      legalName: "fiberior GmbH",
      register: "Amtsgericht Ludwigshafen am Rhein HRB 70563",
      imprint: "https://fiberior.de/imprint"
    },
    {
      name: "Uniform Robotics",
      city: "Hamburg",
      note: "sector guess: robotics; machine-safety compliance for industrial robots and humanoids; its site blocks automated reads and no register entry turned up",
      website: "https://www.uniform-studio.eu/de",
      source: "https://startupcity.hamburg/startups-ecosystem/uniform-robotics-gmbh",
      found: "2026-11-07"
    },
    {
      name: "Batteriepasswerk",
      city: "Hamburg",
      note: "sector guess: industrial; listed under Energy, established 2026; the imprint gives no register number yet",
      website: "https://www.batteriepasswerk.com",
      source: "https://startupcity.hamburg/startups-ecosystem/batteriepasswerk",
      found: "2026-11-07"
    },
    {
      name: "Termalio",
      city: "Hamburg",
      note: "sector guess: industrial; listed under Energy, established 2026; the imprint gives no register number yet",
      website: "https://termalio.de",
      source: "https://startupcity.hamburg/startups-ecosystem/termalio",
      found: "2026-11-07"
    }
  ]
};
