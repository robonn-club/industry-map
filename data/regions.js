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
];
