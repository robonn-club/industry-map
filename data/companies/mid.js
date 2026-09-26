// Companies sized "mid" (100–1000 employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_MID = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
  {
    name: "Agile Robots", city: "Munich", state: "bavaria",
    lat: 48.102804, lng: 11.540451,
    address: "Plinganserstraße 134, 81369, München",
    sector: "robotics", size: "mid", founded: 2018,
    description: "AI-powered robotic systems combining precision hardware with deep learning.",
    website: "https://www.agile-robots.com"
  },
  {
    name: "NEURA Robotics", city: "Metzingen", state: "bw",
    lat: 48.548004, lng: 9.274005,
    address: "Gutenbergstraße 44, 72555, Metzingen",
    sector: "robotics", size: "mid", founded: 2019,
    description: "Cognitive robots and humanoids combining AI, sensing, and cobot hardware for everyday tasks.",
    website: "https://neura-robotics.com"
  },

  // ── AI & ML ───────────────────────────────────────────────────────────────
  {
    name: "DeepL", city: "Cologne", state: "nrw",
    lat: 50.945606, lng: 6.897651,
    address: "Maarweg 165, 50825, Köln",
    sector: "ai_ml", size: "mid", founded: 2017,
    description: "AI translation service producing the most accurate and natural-sounding translations.",
    website: "https://www.deepl.com"
  },
  {
    name: "Helsing", city: "Munich", state: "bavaria",
    lat: 48.127963, lng: 11.610022,
    address: "Mühldorfstraße 8, 81671, München",
    sector: "ai_ml", size: "mid", founded: 2021,
    description: "European AI defense company building sensor fusion and decision-support systems.",
    website: "https://www.helsing.ai"
  },
  {
    name: "Aleph Alpha", city: "Heidelberg", state: "bw",
    lat: 49.398031, lng: 8.673011,
    address: "Speyerer Straße 14, 69115, Heidelberg",
    sector: "ai_ml", size: "mid", founded: 2019,
    description: "European sovereign LLM company building explainable AI for enterprise and government.",
    website: "https://www.aleph-alpha.com"
  },
  {
    name: "Parloa", city: "Berlin", state: "berlin",
    lat: 52.530034, lng: 13.411044,
    address: "Schönhauser Allee 9, 10119, Berlin",
    sector: "ai_ml", size: "mid", founded: 2018,
    description: "AI agent platform automating customer-service phone and chat conversations at enterprise scale.",
    website: "https://www.parloa.com"
  },
  {
    name: "Cognigy", city: "Düsseldorf", state: "nrw",
    lat: 51.214155, lng: 6.746465,
    address: "Kesselstraße 3, 40221, Düsseldorf",
    sector: "ai_ml", size: "mid", founded: 2016,
    description: "Enterprise conversational-AI platform automating customer service across voice and chat.",
    website: "https://www.cognigy.com"
  },
  {
    name: "KONUX", city: "Munich", state: "bavaria",
    lat: 48.106494, lng: 11.537144,
    address: "Flößergasse 2, 81369, München",
    sector: "ai_ml", size: "mid", founded: 2014,
    description: "AI and IoT systems for predictive maintenance of railway networks.",
    website: "https://www.konux.com"
  },

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "Quantum Systems", city: "Gilching", state: "bavaria",
    lat: 48.091999, lng: 11.304235,
    address: "Zeppelinstraße 18, 82205, Gilching",
    sector: "defense", size: "mid", founded: 2015,
    description: "Maker of autonomous vertical-takeoff drones with AI-driven reconnaissance for defense and survey.",
    website: "https://quantum-systems.com"
  },

  // ── ROBOTICS (added 2026-06) ───────────────────────────────────────────────
  {
    name: "idealworks", city: "Munich", state: "bavaria",
    lat: 48.178687, lng: 11.538097,
    address: "Riesstraße 22, 80992, München",
    sector: "robotics", size: "mid", founded: 2020,
    description: "Autonomous mobile robots and fleet-management software for factory logistics, spun out of BMW.",
    website: "https://idealworks.com"
  },
  {
    name: "SAFELOG", city: "Markt Schwaben", state: "bavaria",
    lat: 48.193459, lng: 11.852148,
    address: "Henleinstraße 4, 85570, Markt Schwaben",
    sector: "robotics", size: "mid", founded: 1996,
    description: "Manufacturer of compact automated guided vehicles and fleet software for order-picking and intralogistics.",
    website: "https://www.safelog.de"
  },
  // ── AI_ML (added 2026-06) ──────────────────────────────────────────────────
  {
    name: "IDnow", city: "Munich", state: "bavaria",
    lat: 48.122148, lng: 11.564802,
    address: "Auenstraße 100, 80469, München",
    sector: "ai_ml", size: "mid", founded: 2014,
    description: "AI-driven identity verification and KYC platform for banks, fintechs, and regulated industries.",
    website: "https://www.idnow.io"
  },
  {
    name: "Ada Health", city: "Berlin", state: "berlin",
    lat: 52.51944, lng: 13.402238,
    address: "Karl-Liebknecht-Straße 1, 10178, Berlin",
    sector: "ai_ml", size: "mid", founded: 2011,
    description: "AI symptom-assessment app that guides patients using a structured clinical knowledge base.",
    website: "https://ada.com"
  },
  {
    name: "Aignostics", city: "Berlin", state: "berlin",
    lat: 52.524081, lng: 13.332636,
    address: "Alt-Moabit 73, 10555, Berlin",
    sector: "ai_ml", size: "mid", founded: 2018,
    description: "Computational-pathology AI that analyses tissue slides for cancer diagnosis and drug research; a Charité spin-off.",
    website: "https://www.aignostics.com"
  },
  {
    name: "BRYTER", city: "Berlin", state: "berlin",
    lat: 52.518, lng: 13.388,
    sector: "ai_ml", size: "mid", founded: 2018,
    description: "No-code automation platform with built-in AI for legal, compliance, and operations teams.",
    website: "https://bryter.com"
  },
  // ── SOFTWARE (added 2026-06) ───────────────────────────────────────────────
  {
    name: "commercetools", city: "Munich", state: "bavaria",
    lat: 48.163503, lng: 11.558972,
    address: "Adams-Lehmann-Straße 44, 80797, München",
    sector: "software", size: "mid", founded: 2006,
    description: "Headless, API-first commerce platform powering composable e-commerce for large retailers.",
    website: "https://www.commercetools.com"
  },
  {
    name: "Camunda", city: "Berlin", state: "berlin",
    lat: 52.494756, lng: 13.396308,
    address: "Zossener Straße 55-58, 10961, Berlin",
    sector: "software", size: "mid", founded: 2008,
    description: "Open-source process orchestration and workflow automation platform built on BPMN.",
    website: "https://camunda.com"
  },
  {
    name: "ATOSS Software", city: "Munich", state: "bavaria",
    lat: 48.123281, lng: 11.603571,
    address: "Rosenheimer Straße 141h, 81671, München",
    sector: "software", size: "mid", founded: 1987,
    description: "Workforce management software for time tracking, scheduling, and personnel planning.",
    website: "https://www.atoss.com"
  },
  {
    name: "Exasol", city: "Nuremberg", state: "bavaria",
    lat: 49.481213, lng: 11.119789,
    address: "Neumeyerstraße, 90411, Nürnberg",
    sector: "software", size: "mid", founded: 2000,
    description: "High-performance in-memory analytics database for data warehousing and BI workloads.",
    website: "https://www.exasol.com"
  },
  {
    name: "Jedox", city: "Freiburg", state: "bw",
    lat: 47.997585, lng: 7.841749,
    address: "Bismarckallee 7a, 79098, Freiburg im Breisgau",
    sector: "software", size: "mid", founded: 2002,
    description: "Planning, budgeting, and business-intelligence software for enterprise finance teams.",
    website: "https://www.jedox.com"
  },
  {
    name: "SER Group", city: "Bonn", state: "nrw",
    lat: 50.719132, lng: 7.150857,
    address: "Joseph-Schumpeter-Allee 19, 53227, Bonn",
    sector: "software", size: "mid", founded: 1984,
    description: "Enterprise content management and document-automation software (Doxis) for managing business information.",
    website: "https://www.doxis.com"
  },
  {
    name: "Shopware", city: "Schöppingen", state: "nrw",
    lat: 52.088138, lng: 7.246517,
    sector: "software", size: "mid", founded: 2000,
    description: "Open commerce platform powering online shops for mid-market and enterprise retailers.",
    website: "https://www.shopware.com"
  },
  {
    name: "Staffbase", city: "Chemnitz", state: "saxony",
    lat: 50.823485, lng: 12.922082,
    address: "Annaberger Straße 73, 09111, Chemnitz",
    sector: "software", size: "mid", founded: 2014,
    description: "Employee-communications platform with branded intranets and apps connecting frontline and office staff.",
    website: "https://staffbase.com"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "IABG", city: "Ottobrunn", state: "bavaria",
    lat: 48.051479, lng: 11.659777,
    address: "Einsteinstraße 20, 85521, Ottobrunn",
    sector: "defense", size: "mid", founded: 1961,
    description: "Independent testing, analysis, and engineering services for aerospace, defence, and infrastructure.",
    website: "https://www.iabg.de"
  },
  {
    name: "STARK Defence", city: "Munich", state: "bavaria",
    lat: 48.16, lng: 11.55,
    sector: "defense", size: "mid", founded: 2024,
    description: "Develops AI-enabled loitering munitions and uncrewed strike drones for European defence.",
    website: "https://stark-defence.com"
  },
  {
    name: "Autoflug", city: "Rellingen", state: "schleswig_holstein",
    lat: 53.640278, lng: 9.889109,
    address: "Industriestraße 10a-f, 25462, Rellingen",
    sector: "defense", size: "mid", founded: 1919,
    description: "Maker of safety and survivability systems — parachutes, restraints, and crew protection for defence vehicles.",
    website: "https://www.autoflug.com"
  },
  {
    name: "German Naval Yards Kiel", city: "Kiel", state: "schleswig_holstein",
    lat: 54.320346, lng: 10.157152,
    sector: "defense", size: "mid", founded: 2015,
    description: "Kiel shipyard building and maintaining naval surface vessels such as corvettes and frigates.",
    website: "https://www.germannaval.com"
  },
  // ── AGRICULTURE (added 2026-06) ────────────────────────────────────────────
  {
    name: "RAUCH", city: "Sinzheim", state: "bw",
    lat: 48.761543, lng: 8.166721,
    address: "Franz-Rauch-Straße, 76547, Winden",
    sector: "agriculture", size: "mid", founded: 1921,
    description: "Manufacturer of precision fertiliser spreaders for accurate, GPS-controlled nutrient application.",
    website: "https://rauch.de"
  },
  {
    name: "Holmer", city: "Schierling", state: "bavaria",
    lat: 48.839588, lng: 12.183241,
    address: "Regensburger Straße 20, 84069, Eggmühl",
    sector: "agriculture", size: "mid", founded: 1969,
    description: "Maker of self-propelled sugar-beet harvesters and a world leader in beet-lifting machinery.",
    website: "https://www.holmer-maschinenbau.com"
  },
  {
    name: "ROPA", city: "Sittelsdorf", state: "bavaria",
    lat: 48.775971, lng: 12.06235,
    sector: "agriculture", size: "mid", founded: 1986,
    description: "Builder of self-propelled sugar-beet and potato harvesters and cleaning-loading machines.",
    website: "https://www.ropa-maschinenbau.de"
  },
  {
    name: "Strautmann", city: "Bad Laer", state: "lower_saxony",
    lat: 52.101833, lng: 8.100813,
    address: "Bielefelder Straße 53, 49196, Bad Laer",
    sector: "agriculture", size: "mid", founded: 1930,
    description: "Family maker of forage, loader, and feed-mixer wagons for livestock and biogas operations.",
    website: "https://www.strautmann.com"
  },

  // ── REGIONAL COVERAGE (added 2026-09) ──────────────────────────────────────
  {
    name: "Fabmatics", city: "Dresden", state: "saxony",
    lat: 51.134266, lng: 13.779145,
    sector: "robotics", size: "mid",
    description: "Builds mobile robots and handling automation for semiconductor fabs and cleanroom production.",
    website: "https://www.fabmatics.com"
  },
  {
    name: "Raytheon Anschütz", city: "Kiel", state: "schleswig_holstein",
    lat: 54.361755, lng: 10.14126,
    address: "Zeyestraße 16-24, 24106, Kiel",
    sector: "defense", size: "mid", founded: 1905,
    description: "Maker of gyro compasses, integrated bridge systems, and autonomous navigation technology for merchant and naval ships.",
    website: "https://www.raytheon-anschuetz.com"
  },
];
