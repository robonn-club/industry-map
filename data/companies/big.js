// Companies sized "big" (1000–5000 employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_BIG = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
  {
    name: "Schunk", city: "Lauffen am Neckar", state: "bw",
    lat: 49.071628, lng: 9.137509,
    sector: "robotics", size: "big", founded: 1945,
    description: "World-leading manufacturer of gripping systems and clamping technology.",
    website: "https://www.schunk.com"
  },
  {
    name: "igus", city: "Cologne", state: "nrw",
    lat: 50.845208, lng: 7.102321,
    address: "Niederkasseler Straße, 51147, Köln",
    sector: "robotics", size: "big", founded: 1964,
    description: "Motion plastics specialist; makes affordable REBEL collaborative robot arms.",
    website: "https://www.igus.de"
  },

  // ── AI & ML ───────────────────────────────────────────────────────────────
  {
    name: "Celonis", city: "Munich", state: "bavaria",
    lat: 48.147577, lng: 11.577341,
    address: "Theresienstraße, 80333, München",
    sector: "ai_ml", size: "big", founded: 2011,
    description: "World-leading process mining platform — uses AI to surface and fix business inefficiencies.",
    website: "https://www.celonis.com"
  },

  // ── INDUSTRIAL ────────────────────────────────────────────────────────────
  {
    name: "Beckhoff Automation", city: "Verl", state: "nrw",
    lat: 51.878987, lng: 8.472773,
    address: "Hülshorstweg 20, 33415, Verl",
    sector: "industrial", size: "big", founded: 1980,
    description: "Pioneer of PC-based control — TwinCAT and EtherCAT are globally adopted industrial standards.",
    website: "https://www.beckhoff.com"
  },
  {
    name: "Pilz", city: "Ostfildern", state: "bw",
    lat: 48.714411, lng: 9.306937,
    address: "Felix-Wankel-Straße 2, 73760, Nellingen",
    sector: "industrial", size: "big", founded: 1948,
    description: "Specialist in safe automation — safety controllers and protection systems for industrial machinery.",
    website: "https://www.pilz.com"
  },
  {
    name: "HARTING", city: "Espelkamp", state: "nrw",
    lat: 52.380126, lng: 8.624611,
    sector: "industrial", size: "big", founded: 1945,
    description: "Specialist in industrial connectors and infrastructure for machinery and the Industrial IoT.",
    website: "https://www.harting.com"
  },
  {
    name: "WAGO", city: "Minden", state: "nrw",
    lat: 52.299023, lng: 8.923419,
    address: "Ringstraße, 32423, Minden",
    sector: "industrial", size: "big", founded: 1951,
    description: "Electrical interconnection and automation technology — spring-clamp connectors and PLCs.",
    website: "https://www.wago.com"
  },
  {
    name: "Lenze", city: "Aerzen", state: "lower_saxony",
    lat: 52.069896, lng: 9.312939,
    sector: "industrial", size: "big", founded: 1947,
    description: "Motion-centric automation: drives, motors, and control for machine builders.",
    website: "https://www.lenze.com"
  },

  // ── SOFTWARE & TECH ───────────────────────────────────────────────────────
  {
    name: "TeamViewer", city: "Göppingen", state: "bw",
    lat: 48.700938, lng: 9.650711,
    address: "Bahnhofsplatz 2, 73033, Göppingen (Kernstadt)",
    sector: "software", size: "big", founded: 2005,
    description: "Remote connectivity leader expanding into industrial AR and IoT for smart manufacturing.",
    website: "https://www.teamviewer.com"
  },
  {
    name: "Personio", city: "Munich", state: "bavaria",
    lat: 48.143455, lng: 11.555699,
    address: "Rundfunkplatz 4, 80335, München",
    sector: "software", size: "big", founded: 2015,
    description: "Europe's leading HR software platform for SMEs — recruiting, onboarding, and HR automation.",
    website: "https://www.personio.com"
  },
  {
    name: "Contentful", city: "Berlin", state: "berlin",
    lat: 52.539461, lng: 13.38397,
    address: "Max-Urich-Straße 3, 13355, Berlin",
    sector: "software", size: "big", founded: 2013,
    description: "Headless content platform that powers digital experiences for thousands of global brands.",
    website: "https://www.contentful.com"
  },
  {
    name: "Trade Republic", city: "Berlin", state: "berlin",
    lat: 52.509836, lng: 13.425831,
    address: "Köpenicker Straße 40C, 10179, Berlin",
    sector: "software", size: "big", founded: 2015,
    description: "Mobile-first investment broker bringing low-cost trading and savings plans to millions in Europe.",
    website: "https://traderepublic.com"
  },
  {
    name: "N26", city: "Berlin", state: "berlin",
    lat: 52.51759, lng: 13.416622,
    address: "Voltairestraße, 10179, Berlin",
    sector: "software", size: "big", founded: 2013,
    description: "Mobile-first neobank serving millions of customers across Europe.",
    website: "https://n26.com"
  },

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "OHB SE", city: "Bremen", state: "bremen",
    lat: 53.10071, lng: 8.856516,
    address: "Manfred-Fuchs-Platz 2-4, 28359, Bremen",
    sector: "defense", size: "big", founded: 1981,
    description: "Space-systems company building satellites, exploration payloads, and launch technology.",
    website: "https://www.ohb.de"
  },
  {
    name: "Diehl Defence", city: "Überlingen", state: "bw",
    lat: 47.75795, lng: 9.186402,
    address: "Alte Nußdorfer Straße 13, 88662, Überlingen",
    sector: "defense", size: "big", founded: 1902,
    description: "Guided missiles, ammunition, and defense electronics.",
    website: "https://www.diehl.com"
  },
  {
    name: "KNDS Deutschland", city: "Munich", state: "bavaria",
    lat: 48.195362, lng: 11.471953,
    sector: "defense", size: "big", founded: 1873,
    description: "Land-defense systems including the Leopard 2 main battle tank (KMW).",
    website: "https://knds.com"
  },
  {
    name: "Lürssen", city: "Bremen", state: "bremen",
    lat: 53.167834, lng: 8.653924,
    sector: "defense", size: "big", founded: 1875,
    description: "Shipbuilder of naval vessels and large custom yachts.",
    website: "https://www.lurssen.com"
  },

  // ── AGRICULTURE ───────────────────────────────────────────────────────────
  {
    name: "Amazone", city: "Hasbergen", state: "lower_saxony",
    lat: 52.252715, lng: 7.937461,
    address: "Am Amazonenwerk 9-13, 49205, Hasbergen",
    sector: "agriculture", size: "big", founded: 1883,
    description: "Precision agricultural machinery for spraying, fertilizing, and seeding with GPS-guided automation.",
    website: "https://www.amazone.de"
  },
  {
    name: "HORSCH", city: "Schwandorf", state: "bavaria",
    lat: 49.333891, lng: 12.060056,
    sector: "agriculture", size: "big", founded: 1984,
    description: "Tillage, seeding, and crop protection machinery with growing autonomous field robot capabilities.",
    website: "https://www.horsch.com"
  },
  {
    name: "Grimme", city: "Damme", state: "lower_saxony",
    lat: 52.51787, lng: 8.193524,
    address: "Pastorskamp, 49401, Damme",
    sector: "agriculture", size: "big", founded: 1861,
    description: "World market leader in root crop harvesting and storage technology for potatoes and sugar beet.",
    website: "https://www.grimme.com"
  },
  {
    name: "LEMKEN", city: "Alpen", state: "nrw",
    lat: 51.585379, lng: 6.522303,
    address: "Weseler Straße 5, 46519, Drüpt",
    sector: "agriculture", size: "big", founded: 1780,
    description: "Tillage, seeding, and crop-care machinery with growing investment in autonomous farming.",
    website: "https://lemken.com"
  },
  {
    name: "Krone", city: "Spelle", state: "lower_saxony",
    lat: 52.349764, lng: 7.469203,
    sector: "agriculture", size: "big", founded: 1906,
    description: "Manufacturer of forage-harvesting machinery and commercial trailers for modern agriculture.",
    website: "https://www.krone-agriculture.com"
  },
  {
    name: "Big Dutchman", city: "Vechta", state: "lower_saxony",
    lat: 52.736258, lng: 8.286428,
    address: "Oldenburger Straße, 49377, Vechta",
    sector: "agriculture", size: "big", founded: 1938,
    description: "Automated feeding and housing systems for poultry and pig farming.",
    website: "https://www.bigdutchman.com"
  },

  // ── INDUSTRIAL (added 2026-06) ─────────────────────────────────────────────
  {
    name: "EOS", city: "Krailling", state: "bavaria",
    lat: 48.093384, lng: 11.356286,
    address: "Robert-Stirling-Ring, 82349, Pentenried",
    sector: "industrial", size: "big", founded: 1989,
    description: "Pioneer of industrial 3D printing, building metal and polymer additive-manufacturing systems.",
    website: "https://www.eos.info"
  },
  {
    name: "Jenoptik", city: "Jena", state: "thuringia",
    lat: 50.928093, lng: 11.580844,
    address: "Carl-Zeiß-Straße 1, 07743, Jena",
    sector: "industrial", size: "big", founded: 1991,
    description: "Photonics group making optical systems, sensors, and precision measurement technology in Jena.",
    website: "https://www.jenoptik.com"
  },
  // ── SOFTWARE (added 2026-06) ───────────────────────────────────────────────
  {
    name: "SUSE", city: "Nuremberg", state: "bavaria",
    lat: 49.428779, lng: 11.087172,
    address: "Frankenstraße, 90461, Nürnberg",
    sector: "software", size: "big", founded: 1992,
    description: "Maker of SUSE Linux Enterprise; the first company to bring Linux to the enterprise market.",
    website: "https://www.suse.com"
  },
  {
    name: "Scout24", city: "Munich", state: "bavaria",
    lat: 48.135459, lng: 11.6135,
    address: "Bothestraße, 81675, München",
    sector: "software", size: "big", founded: 1998,
    description: "Operator of ImmoScout24 and digital marketplaces connecting buyers, renters, and providers of real estate.",
    website: "https://www.scout24.com"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "MBDA Deutschland", city: "Schrobenhausen", state: "bavaria",
    lat: 48.570285, lng: 11.214926,
    sector: "defense", size: "big", founded: 2006,
    description: "German arm of European missile maker MBDA, developing guided missiles and air-defence systems.",
    website: "https://www.mbda-deutschland.de"
  },
  {
    name: "Renk Group", city: "Augsburg", state: "bavaria",
    lat: 48.353853, lng: 10.883009,
    address: "Gögginger Straße 73, 86159, Augsburg",
    sector: "defense", size: "big", founded: 1873,
    description: "Maker of transmissions and drive systems for military tracked vehicles, ships, and heavy industry.",
    website: "https://www.renk.com"
  },
  {
    name: "Heckler & Koch", city: "Oberndorf am Neckar", state: "bw",
    lat: 48.289531, lng: 8.553828,
    address: "Agathe-Heim-Straße, 78727, Oberndorf am Neckar",
    sector: "defense", size: "big", founded: 1949,
    description: "Maker of small arms and service rifles supplying the Bundeswehr and NATO armed forces.",
    website: "https://www.heckler-koch.com/en/"
  },

  // ── REGIONAL COVERAGE (added 2026-09) ──────────────────────────────────────
  {
    name: "Carl Zeiss Meditec", city: "Jena", state: "thuringia",
    lat: 50.885737, lng: 11.595028,
    address: "Göschwitzer Straße 51-52, 07745, Jena",
    sector: "industrial", size: "big", founded: 2002,
    description: "Builds ophthalmic diagnostic devices, surgical microscopes, and image-guided systems for eye and neurosurgery.",
    website: "https://www.zeiss.com/meditec"
  },
  {
    name: "Rolls-Royce Deutschland", city: "Blankenfelde-Mahlow", state: "brandenburg",
    lat: 52.30953, lng: 13.437818,
    address: "Eschenweg 11, 15827, Blankenfelde-Mahlow",
    sector: "defense", size: "big", founded: 1990,
    description: "Develops and assembles civil aero engines at Dahlewitz, and is the group's centre of excellence for two-shaft engines.",
    website: "https://www.rolls-royce.com/country-sites/deutschland.aspx"
  },
  {
    name: "OHB System", city: "Bremen", state: "bremen",
    lat: 53.101871, lng: 8.858061,
    address: "Universitätsallee 27-29, 28359, Bremen",
    sector: "defense", size: "big", founded: 1981,
    description: "Builds satellites and space systems, including Galileo navigation spacecraft and Earth-observation missions.",
    website: "https://www.ohb-system.de"
  },
];
