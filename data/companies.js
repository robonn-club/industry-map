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
    name: "OHB SE", city: "Bremen", state: "bremen",
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

  // ── ROBOTICS (batch 2) ────────────────────────────────────────────────────
  {
    name: "fruitcore robotics", city: "Konstanz", state: "bw",
    lat: 47.6779, lng: 9.1732,
    sector: "robotics", size: "startup", founded: 2017,
    description: "HORST industrial robot arms making automation affordable for small and mid-sized manufacturers.",
    website: "https://fruitcore-robotics.com"
  },
  {
    name: "Synapticon", city: "Schönaich", state: "bw",
    lat: 48.6560, lng: 9.0640,
    sector: "robotics", size: "startup", founded: 2010,
    description: "Motion-control and servo-drive technology powering robots and autonomous machines.",
    website: "https://www.synapticon.com"
  },
  {
    name: "Micropsi Industries", city: "Berlin", state: "berlin",
    lat: 52.5200, lng: 13.4050,
    sector: "robotics", size: "startup", founded: 2014,
    description: "AI vision software (MIRAI) giving industrial robots real-time adaptive control.",
    website: "https://www.micropsi-industries.com"
  },

  // ── AUTOMOTIVE (batch 2) ──────────────────────────────────────────────────
  {
    name: "Mahle", city: "Stuttgart", state: "bw",
    lat: 48.7758, lng: 9.1829,
    sector: "automotive", size: "global", founded: 1920,
    description: "Automotive supplier of powertrain, thermal management, and e-mobility components.",
    website: "https://www.mahle.com"
  },
  {
    name: "Webasto", city: "Stockdorf", state: "bavaria",
    lat: 48.0760, lng: 11.4000,
    sector: "automotive", size: "global", founded: 1901,
    description: "Supplier of roof systems, thermal solutions, and EV charging and battery systems.",
    website: "https://www.webasto-group.com"
  },
  {
    name: "HELLA", city: "Lippstadt", state: "nrw",
    lat: 51.6740, lng: 8.3480,
    sector: "automotive", size: "global", founded: 1899,
    description: "Lighting and electronics specialist for the automotive industry (part of FORVIA).",
    website: "https://www.hella.com"
  },
  {
    name: "Knorr-Bremse", city: "Munich", state: "bavaria",
    lat: 48.1830, lng: 11.5160,
    sector: "automotive", size: "global", founded: 1905,
    description: "World market leader in braking systems for rail and commercial vehicles.",
    website: "https://www.knorr-bremse.com"
  },
  {
    name: "MAN Truck & Bus", city: "Munich", state: "bavaria",
    lat: 48.1900, lng: 11.5430,
    sector: "automotive", size: "global", founded: 1758,
    description: "Manufacturer of trucks, buses, and transport solutions (TRATON / Volkswagen).",
    website: "https://www.man.eu"
  },

  // ── AI & ML (batch 2) ─────────────────────────────────────────────────────
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
  {
    name: "brighter AI", city: "Berlin", state: "berlin",
    lat: 52.5200, lng: 13.4050,
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "Privacy technology that anonymizes faces and licence plates in images and video.",
    website: "https://brighter.ai"
  },

  // ── INDUSTRIAL (batch 2) ──────────────────────────────────────────────────
  {
    name: "KION Group", city: "Frankfurt", state: "hesse",
    lat: 50.1100, lng: 8.6800,
    sector: "industrial", size: "global", founded: 2006,
    description: "Intralogistics leader in forklifts and warehouse automation (Linde, STILL, Dematic).",
    website: "https://www.kiongroup.com"
  },
  {
    name: "Jungheinrich", city: "Hamburg", state: "hamburg",
    lat: 53.5400, lng: 10.0700,
    sector: "industrial", size: "global", founded: 1953,
    description: "Intralogistics group for forklifts, automated warehouses, and material handling.",
    website: "https://www.jungheinrich.com"
  },
  {
    name: "Krones", city: "Neutraubling", state: "bavaria",
    lat: 48.9930, lng: 12.2050,
    sector: "industrial", size: "global", founded: 1951,
    description: "Lines and machines for filling and packaging beverages and liquid foods.",
    website: "https://www.krones.com"
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
  {
    name: "Endress+Hauser", city: "Weil am Rhein", state: "bw",
    lat: 47.5940, lng: 7.6200,
    sector: "industrial", size: "global", founded: 1953,
    description: "Process-automation instrumentation for measurement, analytics, and monitoring.",
    website: "https://www.endress.com"
  },
  {
    name: "Kärcher", city: "Winnenden", state: "bw",
    lat: 48.8780, lng: 9.4000,
    sector: "industrial", size: "global", founded: 1935,
    description: "Cleaning-equipment leader expanding into autonomous cleaning robots.",
    website: "https://www.kaercher.com"
  },

  // ── SOFTWARE (batch 2) ────────────────────────────────────────────────────
  {
    name: "Nemetschek", city: "Munich", state: "bavaria",
    lat: 48.1820, lng: 11.6100,
    sector: "software", size: "global", founded: 1963,
    description: "Software group for architecture, engineering, construction, and media (AEC/CAD).",
    website: "https://www.nemetschek.com"
  },
  {
    name: "IONOS", city: "Montabaur", state: "rhineland_palatinate",
    lat: 50.4380, lng: 7.8230,
    sector: "software", size: "global", founded: 1988,
    description: "One of Europe's largest web-hosting and cloud providers for SMEs.",
    website: "https://www.ionos.com"
  },
  {
    name: "N26", city: "Berlin", state: "berlin",
    lat: 52.5000, lng: 13.4200,
    sector: "software", size: "big", founded: 2013,
    description: "Mobile-first neobank serving millions of customers across Europe.",
    website: "https://n26.com"
  },

  // ── AEROSPACE & DEFENSE (batch 2) ─────────────────────────────────────────
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
  {
    name: "ARX Robotics", city: "Munich", state: "bavaria",
    lat: 48.1400, lng: 11.5800,
    sector: "defense", size: "startup", founded: 2022,
    description: "Autonomous unmanned ground vehicles and software for defense and security.",
    website: "https://arx-robotics.com"
  },

  // ── AGRICULTURE (batch 2) ─────────────────────────────────────────────────
  {
    name: "STIHL", city: "Waiblingen", state: "bw",
    lat: 48.8300, lng: 9.3200,
    sector: "agriculture", size: "global", founded: 1926,
    description: "Outdoor power equipment and robotic mowers for forestry, farming, and gardens.",
    website: "https://www.stihl.com"
  },
  {
    name: "Big Dutchman", city: "Vechta", state: "lower_saxony",
    lat: 52.7270, lng: 8.2870,
    sector: "agriculture", size: "big", founded: 1938,
    description: "Automated feeding and housing systems for poultry and pig farming.",
    website: "https://www.bigdutchman.com"
  },
  {
    name: "BayWa", city: "Munich", state: "bavaria",
    lat: 48.1500, lng: 11.5900,
    sector: "agriculture", size: "global", founded: 1923,
    description: "Agricultural trade, machinery, and digital farming services group.",
    website: "https://www.baywa.com"
  },
];
