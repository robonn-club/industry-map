// Companies sized "mid" (100–1000 employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_MID = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
  {
    name: "Agile Robots", city: "Munich", state: "bavaria",
    lat: 48.1450, lng: 11.5620,
    sector: "robotics", size: "mid", founded: 2018,
    description: "AI-powered robotic systems combining precision hardware with deep learning.",
    website: "https://www.agile-robots.com"
  },
  {
    name: "NEURA Robotics", city: "Metzingen", state: "bw",
    lat: 48.5370, lng: 9.2830,
    sector: "robotics", size: "mid", founded: 2019,
    description: "Cognitive robots and humanoids combining AI, sensing, and cobot hardware for everyday tasks.",
    website: "https://neura-robotics.com"
  },

  // ── AI & ML ───────────────────────────────────────────────────────────────
  {
    name: "DeepL", city: "Cologne", state: "nrw",
    lat: 50.9450, lng: 6.9620,
    sector: "ai_ml", size: "mid", founded: 2017,
    description: "AI translation service producing the most accurate and natural-sounding translations.",
    website: "https://www.deepl.com"
  },
  {
    name: "Helsing", city: "Munich", state: "bavaria",
    lat: 48.1200, lng: 11.6000,
    sector: "ai_ml", size: "mid", founded: 2021,
    description: "European AI defense company building sensor fusion and decision-support systems.",
    website: "https://www.helsing.ai"
  },
  {
    name: "Aleph Alpha", city: "Heidelberg", state: "bw",
    lat: 49.3988, lng: 8.6724,
    sector: "ai_ml", size: "mid", founded: 2019,
    description: "European sovereign LLM company building explainable AI for enterprise and government.",
    website: "https://www.aleph-alpha.com"
  },
  {
    name: "Parloa", city: "Berlin", state: "berlin",
    lat: 52.5210, lng: 13.4030,
    sector: "ai_ml", size: "mid", founded: 2018,
    description: "AI agent platform automating customer-service phone and chat conversations at enterprise scale.",
    website: "https://www.parloa.com"
  },
  {
    name: "Cognigy", city: "Düsseldorf", state: "nrw",
    lat: 51.2200, lng: 6.7900,
    sector: "ai_ml", size: "mid", founded: 2016,
    description: "Enterprise conversational-AI platform automating customer service across voice and chat.",
    website: "https://www.cognigy.com"
  },
  {
    name: "KONUX", city: "Munich", state: "bavaria",
    lat: 48.1500, lng: 11.5800,
    sector: "ai_ml", size: "mid", founded: 2014,
    description: "AI and IoT systems for predictive maintenance of railway networks.",
    website: "https://www.konux.com"
  },

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "Quantum Systems", city: "Gilching", state: "bavaria",
    lat: 48.1050, lng: 11.2900,
    sector: "defense", size: "mid", founded: 2015,
    description: "Maker of autonomous vertical-takeoff drones with AI-driven reconnaissance for defense and survey.",
    website: "https://quantum-systems.com"
  },

  // ── ROBOTICS (added 2026-06) ───────────────────────────────────────────────
  {
    name: "idealworks", city: "Munich", state: "bavaria",
    lat: 48.177, lng: 11.556,
    sector: "robotics", size: "mid", founded: 2020,
    description: "Autonomous mobile robots and fleet-management software for factory logistics, spun out of BMW.",
    website: "https://idealworks.com"
  },
  {
    name: "SAFELOG", city: "Markt Schwaben", state: "bavaria",
    lat: 48.19, lng: 11.87,
    sector: "robotics", size: "mid", founded: 1996,
    description: "Manufacturer of compact automated guided vehicles and fleet software for order-picking and intralogistics.",
    website: "https://www.safelog.de"
  },
  // ── AI_ML (added 2026-06) ──────────────────────────────────────────────────
  {
    name: "IDnow", city: "Munich", state: "bavaria",
    lat: 48.131, lng: 11.56,
    sector: "ai_ml", size: "mid", founded: 2014,
    description: "AI-driven identity verification and KYC platform for banks, fintechs, and regulated industries.",
    website: "https://www.idnow.io"
  },
  {
    name: "Ada Health", city: "Berlin", state: "berlin",
    lat: 52.501, lng: 13.423,
    sector: "ai_ml", size: "mid", founded: 2011,
    description: "AI symptom-assessment app that guides patients using a structured clinical knowledge base.",
    website: "https://ada.com"
  },
  {
    name: "Aignostics", city: "Berlin", state: "berlin",
    lat: 52.526, lng: 13.377,
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
    lat: 48.182, lng: 11.586,
    sector: "software", size: "mid", founded: 2006,
    description: "Headless, API-first commerce platform powering composable e-commerce for large retailers.",
    website: "https://www.commercetools.com"
  },
  {
    name: "Camunda", city: "Berlin", state: "berlin",
    lat: 52.494, lng: 13.392,
    sector: "software", size: "mid", founded: 2008,
    description: "Open-source process orchestration and workflow automation platform built on BPMN.",
    website: "https://camunda.com"
  },
  {
    name: "ATOSS Software", city: "Munich", state: "bavaria",
    lat: 48.129, lng: 11.601,
    sector: "software", size: "mid", founded: 1987,
    description: "Workforce management software for time tracking, scheduling, and personnel planning.",
    website: "https://www.atoss.com"
  },
  {
    name: "Exasol", city: "Nuremberg", state: "bavaria",
    lat: 49.453, lng: 11.09,
    sector: "software", size: "mid", founded: 2000,
    description: "High-performance in-memory analytics database for data warehousing and BI workloads.",
    website: "https://www.exasol.com"
  },
  {
    name: "Jedox", city: "Freiburg", state: "bw",
    lat: 47.996, lng: 7.842,
    sector: "software", size: "mid", founded: 2002,
    description: "Planning, budgeting, and business-intelligence software for enterprise finance teams.",
    website: "https://www.jedox.com"
  },
  {
    name: "SER Group", city: "Bonn", state: "nrw",
    lat: 50.735, lng: 7.1,
    sector: "software", size: "mid", founded: 1984,
    description: "Enterprise content management and document-automation software (Doxis) for managing business information.",
    website: "https://www.doxis.com"
  },
  {
    name: "Shopware", city: "Schöppingen", state: "nrw",
    lat: 52.067, lng: 7.133,
    sector: "software", size: "mid", founded: 2000,
    description: "Open commerce platform powering online shops for mid-market and enterprise retailers.",
    website: "https://www.shopware.com"
  },
  {
    name: "Staffbase", city: "Chemnitz", state: "saxony",
    lat: 50.833, lng: 12.92,
    sector: "software", size: "mid", founded: 2014,
    description: "Employee-communications platform with branded intranets and apps connecting frontline and office staff.",
    website: "https://staffbase.com"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "IABG", city: "Ottobrunn", state: "bavaria",
    lat: 48.064, lng: 11.667,
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
    lat: 53.65, lng: 9.833,
    sector: "defense", size: "mid", founded: 1919,
    description: "Maker of safety and survivability systems — parachutes, restraints, and crew protection for defence vehicles.",
    website: "https://www.autoflug.com"
  },
  {
    name: "German Naval Yards Kiel", city: "Kiel", state: "schleswig_holstein",
    lat: 54.368, lng: 10.15,
    sector: "defense", size: "mid", founded: 2015,
    description: "Kiel shipyard building and maintaining naval surface vessels such as corvettes and frigates.",
    website: "https://www.germannaval.com"
  },
  // ── AGRICULTURE (added 2026-06) ────────────────────────────────────────────
  {
    name: "RAUCH", city: "Sinzheim", state: "bw",
    lat: 48.767, lng: 8.167,
    sector: "agriculture", size: "mid", founded: 1921,
    description: "Manufacturer of precision fertiliser spreaders for accurate, GPS-controlled nutrient application.",
    website: "https://rauch.de"
  },
  {
    name: "Holmer", city: "Schierling", state: "bavaria",
    lat: 48.833, lng: 12.133,
    sector: "agriculture", size: "mid", founded: 1969,
    description: "Maker of self-propelled sugar-beet harvesters and a world leader in beet-lifting machinery.",
    website: "https://www.holmer-maschinenbau.com"
  },
  {
    name: "ROPA", city: "Sittelsdorf", state: "bavaria",
    lat: 48.817, lng: 11.917,
    sector: "agriculture", size: "mid", founded: 1986,
    description: "Builder of self-propelled sugar-beet and potato harvesters and cleaning-loading machines.",
    website: "https://www.ropa-maschinenbau.de"
  },
  {
    name: "Strautmann", city: "Bad Laer", state: "lower_saxony",
    lat: 52.1, lng: 8.083,
    sector: "agriculture", size: "mid", founded: 1930,
    description: "Family maker of forage, loader, and feed-mixer wagons for livestock and biogas operations.",
    website: "https://www.strautmann.com"
  },
];
