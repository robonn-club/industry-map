// Sizes:   "startup" (<100 employees) | "mid" (100–1000) | "big" (1000–5000) | "global" (5000+)
// Sectors: robotics | automotive | ai_ml | industrial | software | research | defense | agriculture

const COMPANIES = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
  {
    name: "KUKA", city: "Augsburg", state: "bavaria",
    lat: 48.3705, lng: 10.8978,
    sector: "robotics", size: "global", founded: 1898,
    description: "Global leader in industrial robot arms and automated production systems.",
    website: "https://www.kuka.com"
  },
  {
    name: "Festo", city: "Esslingen", state: "bw",
    lat: 48.7414, lng: 9.3125,
    sector: "robotics", size: "global", founded: 1925,
    description: "Pneumatic and electric automation technology; known for bionic robot research.",
    website: "https://www.festo.com"
  },
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
  {
    name: "Agile Robots", city: "Munich", state: "bavaria",
    lat: 48.1450, lng: 11.5620,
    sector: "robotics", size: "mid", founded: 2018,
    description: "AI-powered robotic systems combining precision hardware with deep learning.",
    website: "https://www.agile-robots.com"
  },
  {
    name: "Franka Robotics", city: "Munich", state: "bavaria",
    lat: 48.1283, lng: 11.5964,
    sector: "robotics", size: "startup", founded: 2017,
    description: "Force-controlled collaborative robot arms built for research and education.",
    website: "https://www.franka.de"
  },
  {
    name: "Magazino", city: "Munich", state: "bavaria",
    lat: 48.1350, lng: 11.5750,
    sector: "robotics", size: "startup", founded: 2014,
    description: "Autonomous mobile robots for e-commerce warehouses, picking individual items.",
    website: "https://www.magazino.eu"
  },
  {
    name: "Wandelbots", city: "Dresden", state: "saxony",
    lat: 51.0504, lng: 13.7373,
    sector: "robotics", size: "startup", founded: 2017,
    description: "No-code robot programming — workers teach robots by demonstration, no coding needed.",
    website: "https://www.wandelbots.com"
  },

  // ── AUTOMOTIVE ────────────────────────────────────────────────────────────
  {
    name: "Volkswagen Group", city: "Wolfsburg", state: "lower_saxony",
    lat: 52.4230, lng: 10.7865,
    sector: "automotive", size: "global", founded: 1937,
    description: "World's largest automaker by volume, investing in autonomous vehicles and smart factories.",
    website: "https://www.volkswagen-group.com"
  },
  {
    name: "Mercedes-Benz", city: "Stuttgart", state: "bw",
    lat: 48.7768, lng: 9.1719,
    sector: "automotive", size: "global", founded: 1926,
    description: "Luxury vehicle manufacturer leading in autonomous driving and electrification.",
    website: "https://www.mercedes-benz.com"
  },
  {
    name: "BMW Group", city: "Munich", state: "bavaria",
    lat: 48.1771, lng: 11.5562,
    sector: "automotive", size: "global", founded: 1916,
    description: "Premium automaker integrating advanced robotics and AI into production lines.",
    website: "https://www.bmwgroup.com"
  },
  {
    name: "Robert Bosch", city: "Gerlingen", state: "bw",
    lat: 48.7975, lng: 9.0583,
    sector: "automotive", size: "global", founded: 1886,
    description: "Global mobility and IoT solutions leader with one of Germany's largest R&D budgets.",
    website: "https://www.bosch.com"
  },
  {
    name: "Continental", city: "Hannover", state: "lower_saxony",
    lat: 52.3759, lng: 9.7320,
    sector: "automotive", size: "global", founded: 1871,
    description: "Major automotive supplier developing sensor systems, software, and ADAS technologies.",
    website: "https://www.continental.com"
  },
  {
    name: "ZF Friedrichshafen", city: "Friedrichshafen", state: "bw",
    lat: 47.6567, lng: 9.4800,
    sector: "automotive", size: "global", founded: 1915,
    description: "Driveline, chassis, and autonomous driving solutions for global vehicle manufacturers.",
    website: "https://www.zf.com"
  },
  {
    name: "Audi", city: "Ingolstadt", state: "bavaria",
    lat: 48.7665, lng: 11.4257,
    sector: "automotive", size: "global", founded: 1909,
    description: "Premium automaker (VW Group) pioneering autonomous driving and connected platforms.",
    website: "https://www.audi.com"
  },

  // ── AI & ML ───────────────────────────────────────────────────────────────
  {
    name: "Celonis", city: "Munich", state: "bavaria",
    lat: 48.1500, lng: 11.5450,
    sector: "ai_ml", size: "big", founded: 2011,
    description: "World-leading process mining platform — uses AI to surface and fix business inefficiencies.",
    website: "https://www.celonis.com"
  },
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
    name: "Merantix", city: "Berlin", state: "berlin",
    lat: 52.5200, lng: 13.4050,
    sector: "ai_ml", size: "startup", founded: 2016,
    description: "AI venture studio building and funding companies in healthcare, climate, and enterprise AI.",
    website: "https://www.merantix.com"
  },

  // ── INDUSTRIAL AUTOMATION ─────────────────────────────────────────────────
  {
    name: "Siemens", city: "Munich", state: "bavaria",
    lat: 48.1745, lng: 11.5416,
    sector: "industrial", size: "global", founded: 1847,
    description: "Global leader in industrial automation, digital twins, and smart infrastructure.",
    website: "https://www.siemens.com"
  },
  {
    name: "Dürr", city: "Bietigheim-Bissingen", state: "bw",
    lat: 48.9614, lng: 9.1350,
    sector: "industrial", size: "global", founded: 1896,
    description: "Plant engineering specialist for automotive production and environmental technology.",
    website: "https://www.durr.com"
  },
  {
    name: "Phoenix Contact", city: "Blomberg", state: "nrw",
    lat: 51.9486, lng: 9.0802,
    sector: "industrial", size: "global", founded: 1923,
    description: "Global market leader in electrical connection technology for industrial automation.",
    website: "https://www.phoenixcontact.com"
  },
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

  // ── SOFTWARE & TECH ───────────────────────────────────────────────────────
  {
    name: "SAP", city: "Walldorf", state: "bw",
    lat: 49.2942, lng: 8.6410,
    sector: "software", size: "global", founded: 1972,
    description: "World's largest enterprise software company — ERP, supply chain, and AI business applications.",
    website: "https://www.sap.com"
  },
  {
    name: "Software AG", city: "Darmstadt", state: "hesse",
    lat: 49.8728, lng: 8.6512,
    sector: "software", size: "global", founded: 1969,
    description: "Enterprise IoT platform, API management, and business process automation software.",
    website: "https://www.softwareag.com"
  },
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

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "Airbus", city: "Hamburg", state: "hamburg",
    lat: 53.6283, lng: 9.9853,
    sector: "defense", size: "global", founded: 1970,
    description: "Europe's largest aerospace manufacturer with major Hamburg production lines and avionics R&D.",
    website: "https://www.airbus.com"
  },
  {
    name: "Rheinmetall", city: "Düsseldorf", state: "nrw",
    lat: 51.2217, lng: 6.7762,
    sector: "defense", size: "global", founded: 1889,
    description: "Germany's largest defense company, expanding into autonomous systems and drone technology.",
    website: "https://www.rheinmetall.com"
  },
  {
    name: "MTU Aero Engines", city: "Munich", state: "bavaria",
    lat: 48.1740, lng: 11.5550,
    sector: "defense", size: "global", founded: 1934,
    description: "Germany's leading aircraft engine manufacturer for civil and military aviation.",
    website: "https://www.mtu.de"
  },

  // ── AGRICULTURE ───────────────────────────────────────────────────────────
  {
    name: "CLAAS", city: "Harsewinkel", state: "nrw",
    lat: 51.9617, lng: 8.2178,
    sector: "agriculture", size: "global", founded: 1913,
    description: "Europe's leading harvesting machinery manufacturer — combines, forage harvesters, precision farming.",
    website: "https://www.claas.com"
  },
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
    name: "365FarmNet", city: "Berlin", state: "berlin",
    lat: 52.5350, lng: 13.3980,
    sector: "agriculture", size: "startup", founded: 2013,
    description: "Digital farming platform connecting farm management, precision data, and machine telemetry.",
    website: "https://www.365farmnet.com"
  },

  // ── ROBOTICS (more) ───────────────────────────────────────────────────────
  {
    name: "NEURA Robotics", city: "Metzingen", state: "bw",
    lat: 48.5370, lng: 9.2830,
    sector: "robotics", size: "mid", founded: 2019,
    description: "Cognitive robots and humanoids combining AI, sensing, and cobot hardware for everyday tasks.",
    website: "https://neura-robotics.com"
  },
  {
    name: "RobCo", city: "Munich", state: "bavaria",
    lat: 48.1370, lng: 11.5750,
    sector: "robotics", size: "startup", founded: 2020,
    description: "Modular, reconfigurable industrial robots designed to automate small and mid-sized manufacturers.",
    website: "https://www.robco.de"
  },
  {
    name: "Sereact", city: "Stuttgart", state: "bw",
    lat: 48.7800, lng: 9.1800,
    sector: "robotics", size: "startup", founded: 2021,
    description: "AI software giving pick-and-place robots general manipulation skills via vision-language models.",
    website: "https://sereact.ai"
  },
  {
    name: "KEWAZO", city: "Munich", state: "bavaria",
    lat: 48.1500, lng: 11.5800,
    sector: "robotics", size: "startup", founded: 2018,
    description: "Robotic material-transport systems automating logistics on construction and industrial sites.",
    website: "https://www.kewazo.com"
  },

  // ── AUTOMOTIVE (more) ─────────────────────────────────────────────────────
  {
    name: "Porsche", city: "Stuttgart", state: "bw",
    lat: 48.8340, lng: 9.1520,
    sector: "automotive", size: "global", founded: 1931,
    description: "Sports-car manufacturer investing heavily in electrification, software, and automated production.",
    website: "https://www.porsche.com"
  },
  {
    name: "Schaeffler", city: "Herzogenaurach", state: "bavaria",
    lat: 49.5670, lng: 10.8860,
    sector: "automotive", size: "global", founded: 1946,
    description: "Motion-technology supplier of bearings, precision components, and e-mobility drive systems.",
    website: "https://www.schaeffler.com"
  },
  {
    name: "Brose", city: "Coburg", state: "bavaria",
    lat: 50.2580, lng: 10.9600,
    sector: "automotive", size: "global", founded: 1908,
    description: "Family-owned supplier of mechatronic systems for vehicle doors, seats, and electric drives.",
    website: "https://www.brose.com"
  },

  // ── AI & ML (more) ────────────────────────────────────────────────────────
  {
    name: "Black Forest Labs", city: "Freiburg", state: "bw",
    lat: 48.0000, lng: 7.8500,
    sector: "ai_ml", size: "startup", founded: 2024,
    description: "Creators of the FLUX open-weight image-generation models, founded by ex-Stability researchers.",
    website: "https://blackforestlabs.ai"
  },
  {
    name: "Parloa", city: "Berlin", state: "berlin",
    lat: 52.5210, lng: 13.4030,
    sector: "ai_ml", size: "mid", founded: 2018,
    description: "AI agent platform automating customer-service phone and chat conversations at enterprise scale.",
    website: "https://www.parloa.com"
  },
  {
    name: "deepset", city: "Berlin", state: "berlin",
    lat: 52.5180, lng: 13.4080,
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "Builders of the open-source Haystack framework for production LLM and search applications.",
    website: "https://www.deepset.ai"
  },

  // ── INDUSTRIAL (more) ─────────────────────────────────────────────────────
  {
    name: "TRUMPF", city: "Ditzingen", state: "bw",
    lat: 48.8300, lng: 9.0680,
    sector: "industrial", size: "global", founded: 1923,
    description: "World leader in machine tools and industrial lasers, pioneering smart-factory connectivity.",
    website: "https://www.trumpf.com"
  },
  {
    name: "SICK AG", city: "Waldkirch", state: "bw",
    lat: 48.0950, lng: 7.9600,
    sector: "industrial", size: "global", founded: 1946,
    description: "Sensor-intelligence company whose LiDAR, vision, and safety sensors underpin factory automation.",
    website: "https://www.sick.com"
  },
  {
    name: "SEW-EURODRIVE", city: "Bruchsal", state: "bw",
    lat: 49.1240, lng: 8.5980,
    sector: "industrial", size: "global", founded: 1931,
    description: "Global manufacturer of drive technology — motors, gearmotors, and automation for conveyors.",
    website: "https://www.sew-eurodrive.de"
  },
  {
    name: "HARTING", city: "Espelkamp", state: "nrw",
    lat: 52.3800, lng: 8.6200,
    sector: "industrial", size: "big", founded: 1945,
    description: "Specialist in industrial connectors and infrastructure for machinery and the Industrial IoT.",
    website: "https://www.harting.com"
  },

  // ── SOFTWARE (more) ───────────────────────────────────────────────────────
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

  // ── AEROSPACE & DEFENSE (more) ────────────────────────────────────────────
  {
    name: "HENSOLDT", city: "Taufkirchen", state: "bavaria",
    lat: 48.0400, lng: 11.6100,
    sector: "defense", size: "global", founded: 2017,
    description: "Sensor-solutions house for defense and security — radar, optronics, and electronic warfare.",
    website: "https://www.hensoldt.net"
  },
  {
    name: "OHB SE", city: "Bremen", state: "lower_saxony",
    lat: 53.0510, lng: 8.8340,
    sector: "defense", size: "big", founded: 1981,
    description: "Space-systems company building satellites, exploration payloads, and launch technology.",
    website: "https://www.ohb.de"
  },
  {
    name: "Quantum Systems", city: "Gilching", state: "bavaria",
    lat: 48.1050, lng: 11.2900,
    sector: "defense", size: "mid", founded: 2015,
    description: "Maker of autonomous vertical-takeoff drones with AI-driven reconnaissance for defense and survey.",
    website: "https://quantum-systems.com"
  },

  // ── AGRICULTURE (more) ────────────────────────────────────────────────────
  {
    name: "Fendt", city: "Marktoberdorf", state: "bavaria",
    lat: 47.7800, lng: 10.6200,
    sector: "agriculture", size: "global", founded: 1930,
    description: "Premium tractor brand (AGCO) developing autonomous field robots and electric drivetrains.",
    website: "https://www.fendt.com"
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
];
