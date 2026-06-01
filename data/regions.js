// Regional profiles for Germany's industrial clusters.
// Sector percentages are computed dynamically from COMPANIES data in app.js.
// "connections" lists region ids that share notable supply-chain or industry ties.

const REGIONS = [
  {
    id: "bavaria",
    name: "Bavaria",
    capital: "Munich",
    lat: 48.7904, lng: 11.4979,
    tagline: "Germany's Tech & Mobility Powerhouse",
    overview: "Bavaria is Germany's largest state by area and its economic engine — combining a deep automotive heritage with a fast-growing AI and robotics scene centered in Munich.",
    strengths: [
      "Highest concentration of robotics companies in Germany",
      "Munich ranked Europe's #1 city for AI startup investment",
      "DLR (German Aerospace Center) drives public R&D in robotics and aerospace"
    ],
    connections: ["bw", "lower_saxony", "hamburg"]
  },
  {
    id: "bw",
    name: "Baden-Württemberg",
    capital: "Stuttgart",
    lat: 48.6616, lng: 9.3501,
    tagline: "Precision Engineering & Automation Hub",
    overview: "Baden-Württemberg is the birthplace of the automobile and remains Germany's most export-intensive industrial state. Its Mittelstand companies set global standards in automation, mechatronics, and enterprise software.",
    strengths: [
      "Home to Bosch, Mercedes-Benz, ZF — the core of German automotive supply chain",
      "SAP in Walldorf: world's largest enterprise software company",
      "Strong university-industry links via KIT, Stuttgart, and Heidelberg universities"
    ],
    connections: ["bavaria", "hesse", "rhineland_palatinate"]
  },
  {
    id: "nrw",
    name: "North Rhine-Westphalia",
    capital: "Düsseldorf",
    lat: 51.4332, lng: 7.6616,
    tagline: "Industrial Heartland in Transformation",
    overview: "NRW is Germany's most populous state and its traditional industrial core. The Ruhr Valley is transforming from steel and coal into advanced manufacturing, automation, and digital logistics.",
    strengths: [
      "Leading cluster for electrical and automation suppliers (Phoenix Contact, Beckhoff)",
      "DeepL and igus show growing deep-tech presence",
      "CLAAS makes NRW an agricultural machinery export powerhouse"
    ],
    connections: ["lower_saxony", "hesse", "bw"]
  },
  {
    id: "lower_saxony",
    name: "Lower Saxony",
    capital: "Hannover",
    lat: 52.6367, lng: 9.8451,
    tagline: "Automotive & Agricultural Machinery Corridor",
    overview: "Lower Saxony is defined by the Wolfsburg-Hannover automotive axis and a strong agricultural machinery tradition in the west. It bridges the industrial south with the northern ports.",
    strengths: [
      "Volkswagen Group headquarters and largest single factory in Wolfsburg",
      "Continental leads ADAS and smart sensor development from Hannover",
      "World-class agri-machinery manufacturers (Amazone, Grimme) in the region"
    ],
    connections: ["nrw", "hamburg", "bavaria"]
  },
  {
    id: "berlin",
    name: "Berlin",
    capital: "Berlin",
    lat: 52.5200, lng: 13.4050,
    tagline: "Germany's AI & Deep Tech Capital",
    overview: "Berlin is Germany's largest city and its startup capital. While light on heavy industry, it hosts a fast-growing AI, software, and agri-tech ecosystem supported by world-class universities.",
    strengths: [
      "Europe's 3rd largest startup ecosystem by investment volume",
      "Strong research base: TU Berlin, Humboldt University, HPI",
      "Growing agri-tech and climate-tech presence"
    ],
    connections: ["saxony", "lower_saxony", "hesse"]
  },
  {
    id: "hamburg",
    name: "Hamburg",
    capital: "Hamburg",
    lat: 53.5753, lng: 10.0153,
    tagline: "Aerospace, Logistics & Maritime Innovation",
    overview: "Hamburg is Germany's gateway to global trade. Airbus' main European production site anchors a strong aerospace cluster, while the port drives innovation in autonomous logistics and digital shipping.",
    strengths: [
      "Airbus' largest European final assembly lines for A320 and A380 families",
      "Europe's 3rd largest port — testbed for autonomous logistics and smart shipping",
      "Growing maritime robotics and drone delivery R&D"
    ],
    connections: ["lower_saxony", "bavaria"]
  },
  {
    id: "saxony",
    name: "Saxony",
    capital: "Dresden",
    lat: 51.1045, lng: 13.2017,
    tagline: "Silicon Saxony — Microelectronics & Emerging Robotics",
    overview: "Saxony is reinventing itself as Germany's microelectronics and semiconductor hub. Dresden's 'Silicon Saxony' cluster hosts major chip fabs alongside an emerging robotics and software scene.",
    strengths: [
      "Dresden hosts Bosch, Infineon, and TSMC semiconductor fabs",
      "Wandelbots pioneering intuitive robot programming from Dresden",
      "Strong academic base: TU Dresden ranks among Germany's top technical universities"
    ],
    connections: ["bavaria", "berlin"]
  },
  {
    id: "rhineland_palatinate",
    name: "Rhineland-Palatinate",
    capital: "Mainz",
    lat: 49.9000, lng: 7.4667,
    tagline: "AI Research & Chemical Industry Base",
    overview: "Home to DFKI — one of Europe's most influential AI research centers — and BASF, the world's largest chemical company, Rhineland-Palatinate punches above its size in research output.",
    strengths: [
      "DFKI Kaiserslautern: 35+ years of AI and robotics research, 1000+ publications",
      "BASF in Ludwigshafen: global leader in chemicals and agri-science",
      "University of Kaiserslautern-Landau (RPTU) closely integrated with DFKI"
    ],
    connections: ["bw", "hesse", "nrw"]
  },
  {
    id: "hesse",
    name: "Hesse",
    capital: "Wiesbaden",
    lat: 50.6521, lng: 9.1624,
    tagline: "Finance-Tech & Enterprise Software Corridor",
    overview: "Frankfurt — Europe's financial capital — drives fintech and enterprise software demand. Hesse connects Germany's industrial south with its logistics and services economy in the north.",
    strengths: [
      "Frankfurt: Europe's largest financial center, home to the ECB and Deutsche Börse",
      "Software AG in Darmstadt: global IoT and enterprise integration platform",
      "DE-CIX Frankfurt: world's largest internet exchange point"
    ],
    connections: ["bw", "nrw", "berlin"]
  },
  {
    id: "brandenburg",
    name: "Brandenburg",
    capital: "Potsdam",
    lat: 52.4000, lng: 13.0000,
    tagline: "Berlin's Industrial Hinterland",
    overview: "Surrounding Berlin, Brandenburg has become a magnet for large-scale manufacturing and clean energy, anchored by Tesla's first European factory.",
    strengths: [
      "Tesla Gigafactory in Grünheide — Europe's largest EV plant",
      "Fast-growing logistics and rail corridor around Berlin",
      "Emerging battery and clean-energy industry"
    ],
    connections: ["berlin", "saxony", "saxony_anhalt"]
  },
  {
    id: "bremen",
    name: "Bremen",
    capital: "Bremen",
    lat: 53.0800, lng: 8.8000,
    tagline: "Aerospace, Maritime & Logistics",
    overview: "Germany's smallest state is a heavyweight in aerospace and shipping, combining a major port complex with one of Europe's densest space and aviation clusters.",
    strengths: [
      "Aerospace cluster — Airbus, OHB, and ArianeGroup",
      "Second-largest German port complex (with Bremerhaven)",
      "Mercedes-Benz's largest German car plant"
    ],
    connections: ["lower_saxony", "hamburg"]
  },
  {
    id: "mv",
    name: "Mecklenburg-Vorpommern",
    capital: "Schwerin",
    lat: 53.6000, lng: 12.7000,
    tagline: "Maritime Economy & Renewable Energy",
    overview: "This Baltic coastal state builds its economy on shipbuilding, offshore wind, and a growing biotech and research base in Rostock and Greifswald.",
    strengths: [
      "Shipbuilding and maritime industry on the Baltic coast",
      "A leading region for offshore wind energy",
      "Biotech and plasma research at Rostock & Greifswald"
    ],
    connections: ["hamburg", "schleswig_holstein", "brandenburg"]
  },
  {
    id: "saarland",
    name: "Saarland",
    capital: "Saarbrücken",
    lat: 49.3800, lng: 7.0200,
    tagline: "Automotive & AI in Transformation",
    overview: "A small western border state with a dense automotive-supplier base and a steel heritage, now reinventing itself around AI and cybersecurity research.",
    strengths: [
      "Dense automotive supplier cluster (Ford, ZF, Bosch)",
      "CISPA Helmholtz Center for Information Security",
      "Cross-border industry with France and Luxembourg"
    ],
    connections: ["rhineland_palatinate"]
  },
  {
    id: "saxony_anhalt",
    name: "Saxony-Anhalt",
    capital: "Magdeburg",
    lat: 51.9500, lng: 11.6000,
    tagline: "Chemicals, Semiconductors & Hydrogen",
    overview: "A central industrial state with vast chemical parks and ambitious plans in semiconductors and green hydrogen.",
    strengths: [
      "Planned Intel semiconductor megafab in Magdeburg",
      "Major chemical parks at Leuna and Bitterfeld-Wolfen",
      "Leading green-hydrogen and renewable-energy projects"
    ],
    connections: ["saxony", "brandenburg", "lower_saxony"]
  },
  {
    id: "schleswig_holstein",
    name: "Schleswig-Holstein",
    capital: "Kiel",
    lat: 54.2000, lng: 9.7000,
    tagline: "Maritime, Wind & Medical Tech",
    overview: "Germany's northernmost state sits between two seas, leading in wind energy and shipbuilding while building a strong medical-technology cluster.",
    strengths: [
      "German leader in onshore and offshore wind energy",
      "Shipbuilding and naval industry in Kiel",
      "Growing medical-technology cluster"
    ],
    connections: ["hamburg", "mv", "lower_saxony"]
  },
  {
    id: "thuringia",
    name: "Thuringia",
    capital: "Erfurt",
    lat: 50.9000, lng: 11.0000,
    tagline: "Optics, Precision & Automotive",
    overview: "The 'green heart' of Germany is a powerhouse in optics and precision engineering, centred on the historic photonics cluster in Jena.",
    strengths: [
      "World-class optics & photonics in Jena (Zeiss, Jenoptik)",
      "Strong precision-engineering and toolmaking base",
      "Growing automotive-supplier and battery industry"
    ],
    connections: ["saxony", "saxony_anhalt", "hesse", "bavaria"]
  },
];
