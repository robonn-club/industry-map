// Companies sized "big" (1000–5000 employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_BIG = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
  {
    name: "Schunk", city: "Lauffen am Neckar", state: "bw",
    lat: 49.0749, lng: 9.1514,
    sector: "robotics", size: "big", founded: 1945,
    description: "World-leading manufacturer of gripping systems and clamping technology.",
    website: "https://www.schunk.com"
  },
  {
    name: "igus", city: "Cologne", state: "nrw",
    lat: 50.9180, lng: 6.9920,
    sector: "robotics", size: "big", founded: 1964,
    description: "Motion plastics specialist; makes affordable REBEL collaborative robot arms.",
    website: "https://www.igus.de"
  },

  // ── AI & ML ───────────────────────────────────────────────────────────────
  {
    name: "Celonis", city: "Munich", state: "bavaria",
    lat: 48.1500, lng: 11.5450,
    sector: "ai_ml", size: "big", founded: 2011,
    description: "World-leading process mining platform — uses AI to surface and fix business inefficiencies.",
    website: "https://www.celonis.com"
  },

  // ── INDUSTRIAL ────────────────────────────────────────────────────────────
  {
    name: "Beckhoff Automation", city: "Verl", state: "nrw",
    lat: 51.8855, lng: 8.5108,
    sector: "industrial", size: "big", founded: 1980,
    description: "Pioneer of PC-based control — TwinCAT and EtherCAT are globally adopted industrial standards.",
    website: "https://www.beckhoff.com"
  },
  {
    name: "Pilz", city: "Ostfildern", state: "bw",
    lat: 48.7228, lng: 9.2456,
    sector: "industrial", size: "big", founded: 1948,
    description: "Specialist in safe automation — safety controllers and protection systems for industrial machinery.",
    website: "https://www.pilz.com"
  },
  {
    name: "HARTING", city: "Espelkamp", state: "nrw",
    lat: 52.3800, lng: 8.6200,
    sector: "industrial", size: "big", founded: 1945,
    description: "Specialist in industrial connectors and infrastructure for machinery and the Industrial IoT.",
    website: "https://www.harting.com"
  },
  {
    name: "WAGO", city: "Minden", state: "nrw",
    lat: 52.2880, lng: 8.9170,
    sector: "industrial", size: "big", founded: 1951,
    description: "Electrical interconnection and automation technology — spring-clamp connectors and PLCs.",
    website: "https://www.wago.com"
  },
  {
    name: "Lenze", city: "Aerzen", state: "lower_saxony",
    lat: 52.0470, lng: 9.2700,
    sector: "industrial", size: "big", founded: 1947,
    description: "Motion-centric automation: drives, motors, and control for machine builders.",
    website: "https://www.lenze.com"
  },

  // ── SOFTWARE & TECH ───────────────────────────────────────────────────────
  {
    name: "TeamViewer", city: "Göppingen", state: "bw",
    lat: 48.7028, lng: 9.6532,
    sector: "software", size: "big", founded: 2005,
    description: "Remote connectivity leader expanding into industrial AR and IoT for smart manufacturing.",
    website: "https://www.teamviewer.com"
  },
  {
    name: "Personio", city: "Munich", state: "bavaria",
    lat: 48.1380, lng: 11.5760,
    sector: "software", size: "big", founded: 2015,
    description: "Europe's leading HR software platform for SMEs — recruiting, onboarding, and HR automation.",
    website: "https://www.personio.com"
  },
  {
    name: "Contentful", city: "Berlin", state: "berlin",
    lat: 52.5200, lng: 13.4100,
    sector: "software", size: "big", founded: 2013,
    description: "Headless content platform that powers digital experiences for thousands of global brands.",
    website: "https://www.contentful.com"
  },
  {
    name: "Trade Republic", city: "Berlin", state: "berlin",
    lat: 52.5230, lng: 13.4110,
    sector: "software", size: "big", founded: 2015,
    description: "Mobile-first investment broker bringing low-cost trading and savings plans to millions in Europe.",
    website: "https://traderepublic.com"
  },
  {
    name: "N26", city: "Berlin", state: "berlin",
    lat: 52.5000, lng: 13.4200,
    sector: "software", size: "big", founded: 2013,
    description: "Mobile-first neobank serving millions of customers across Europe.",
    website: "https://n26.com"
  },

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "OHB SE", city: "Bremen", state: "bremen",
    lat: 53.0510, lng: 8.8340,
    sector: "defense", size: "big", founded: 1981,
    description: "Space-systems company building satellites, exploration payloads, and launch technology.",
    website: "https://www.ohb.de"
  },
  {
    name: "Diehl Defence", city: "Überlingen", state: "bw",
    lat: 47.7700, lng: 9.1600,
    sector: "defense", size: "big", founded: 1902,
    description: "Guided missiles, ammunition, and defense electronics.",
    website: "https://www.diehl.com"
  },
  {
    name: "KNDS Deutschland", city: "Munich", state: "bavaria",
    lat: 48.1750, lng: 11.5600,
    sector: "defense", size: "big", founded: 1873,
    description: "Land-defense systems including the Leopard 2 main battle tank (KMW).",
    website: "https://www.knds.de"
  },
  {
    name: "Lürssen", city: "Bremen", state: "bremen",
    lat: 53.1700, lng: 8.6400,
    sector: "defense", size: "big", founded: 1875,
    description: "Shipbuilder of naval vessels and large custom yachts.",
    website: "https://www.luerssen.de"
  },

  // ── AGRICULTURE ───────────────────────────────────────────────────────────
  {
    name: "Amazone", city: "Hasbergen", state: "lower_saxony",
    lat: 52.2614, lng: 7.9806,
    sector: "agriculture", size: "big", founded: 1883,
    description: "Precision agricultural machinery for spraying, fertilizing, and seeding with GPS-guided automation.",
    website: "https://www.amazone.de"
  },
  {
    name: "HORSCH", city: "Schwandorf", state: "bavaria",
    lat: 49.3267, lng: 12.1067,
    sector: "agriculture", size: "big", founded: 1984,
    description: "Tillage, seeding, and crop protection machinery with growing autonomous field robot capabilities.",
    website: "https://www.horsch.com"
  },
  {
    name: "Grimme", city: "Damme", state: "lower_saxony",
    lat: 52.5226, lng: 8.1940,
    sector: "agriculture", size: "big", founded: 1861,
    description: "World market leader in root crop harvesting and storage technology for potatoes and sugar beet.",
    website: "https://www.grimme.com"
  },
  {
    name: "LEMKEN", city: "Alpen", state: "nrw",
    lat: 51.5800, lng: 6.5100,
    sector: "agriculture", size: "big", founded: 1780,
    description: "Tillage, seeding, and crop-care machinery with growing investment in autonomous farming.",
    website: "https://lemken.com"
  },
  {
    name: "Krone", city: "Spelle", state: "lower_saxony",
    lat: 52.3700, lng: 7.4700,
    sector: "agriculture", size: "big", founded: 1906,
    description: "Manufacturer of forage-harvesting machinery and commercial trailers for modern agriculture.",
    website: "https://www.krone-agriculture.com"
  },
  {
    name: "Big Dutchman", city: "Vechta", state: "lower_saxony",
    lat: 52.7270, lng: 8.2870,
    sector: "agriculture", size: "big", founded: 1938,
    description: "Automated feeding and housing systems for poultry and pig farming.",
    website: "https://www.bigdutchman.com"
  },

  // ── INDUSTRIAL (added 2026-06) ─────────────────────────────────────────────
  {
    name: "EOS", city: "Krailling", state: "bavaria",
    lat: 48.095, lng: 11.418,
    sector: "industrial", size: "big", founded: 1989,
    description: "Pioneer of industrial 3D printing, building metal and polymer additive-manufacturing systems.",
    website: "https://www.eos.info"
  },
  {
    name: "Jenoptik", city: "Jena", state: "thuringia",
    lat: 50.927, lng: 11.589,
    sector: "industrial", size: "big", founded: 1991,
    description: "Photonics group making optical systems, sensors, and precision measurement technology in Jena.",
    website: "https://www.jenoptik.com"
  },
  // ── SOFTWARE (added 2026-06) ───────────────────────────────────────────────
  {
    name: "SUSE", city: "Nuremberg", state: "bavaria",
    lat: 49.448, lng: 11.078,
    sector: "software", size: "big", founded: 1992,
    description: "Maker of SUSE Linux Enterprise; the first company to bring Linux to the enterprise market.",
    website: "https://www.suse.com"
  },
  {
    name: "Scout24", city: "Munich", state: "bavaria",
    lat: 48.162, lng: 11.598,
    sector: "software", size: "big", founded: 1998,
    description: "Operator of ImmoScout24 and digital marketplaces connecting buyers, renters, and providers of real estate.",
    website: "https://www.scout24.com"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "MBDA Deutschland", city: "Schrobenhausen", state: "bavaria",
    lat: 48.561, lng: 11.268,
    sector: "defense", size: "big", founded: 2006,
    description: "German arm of European missile maker MBDA, developing guided missiles and air-defence systems.",
    website: "https://www.mbda-deutschland.de"
  },
  {
    name: "Renk Group", city: "Augsburg", state: "bavaria",
    lat: 48.354, lng: 10.921,
    sector: "defense", size: "big", founded: 1873,
    description: "Maker of transmissions and drive systems for military tracked vehicles, ships, and heavy industry.",
    website: "https://www.renk.com"
  },
  {
    name: "Heckler & Koch", city: "Oberndorf am Neckar", state: "bw",
    lat: 48.287, lng: 8.567,
    sector: "defense", size: "big", founded: 1949,
    description: "Maker of small arms and service rifles supplying the Bundeswehr and NATO armed forces.",
    website: "https://www.heckler-koch.com"
  },
];
