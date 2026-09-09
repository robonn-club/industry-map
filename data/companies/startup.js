// Companies sized "startup" (<100 employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_STARTUP = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
  {
    name: "Franka Robotics", city: "Munich", state: "bavaria",
    lat: 48.094352, lng: 11.53443,
    address: "Koppstraße 12, 81379, München",
    sector: "robotics", size: "startup", founded: 2017,
    description: "Force-controlled collaborative robot arms built for research and education.",
    website: "https://www.franka.de"
  },
  {
    name: "Magazino", city: "Munich", state: "bavaria",
    lat: 48.142537, lng: 11.510974,
    address: "Landsberger Straße 234, 80687, München",
    sector: "robotics", size: "startup", founded: 2014,
    description: "Autonomous mobile robots for e-commerce warehouses, picking individual items.",
    website: "https://www.magazino.eu"
  },
  {
    name: "Wandelbots", city: "Dresden", state: "saxony",
    lat: 51.03801, lng: 13.706073,
    address: "Tharandter Straße 33, 01159, Dresden",
    sector: "robotics", size: "startup", founded: 2017,
    description: "No-code robot programming — workers teach robots by demonstration, no coding needed.",
    website: "https://www.wandelbots.com"
  },
  {
    name: "RobCo", city: "Munich", state: "bavaria",
    lat: 48.145228, lng: 11.560571,
    address: "Augustenstraße 12, 80333, München",
    sector: "robotics", size: "startup", founded: 2020,
    description: "Modular, reconfigurable industrial robots designed to automate small and mid-sized manufacturers.",
    website: "https://www.rob.co"
  },
  {
    name: "Sereact", city: "Stuttgart", state: "bw",
    lat: 48.726481, lng: 9.12064,
    address: "Schockenriedstraße 17, 70565, Stuttgart",
    sector: "robotics", size: "startup", founded: 2021,
    description: "AI software giving pick-and-place robots general manipulation skills via vision-language models.",
    website: "https://sereact.ai"
  },
  {
    name: "KEWAZO", city: "Munich", state: "bavaria",
    lat: 48.268644, lng: 11.664521,
    address: "Lichtenbergstraße 8, 85748, Garching bei München",
    sector: "robotics", size: "startup", founded: 2018,
    description: "Robotic material-transport systems automating logistics on construction and industrial sites.",
    website: "https://www.kewazo.com"
  },
  {
    name: "fruitcore robotics", city: "Konstanz", state: "bw",
    lat: 47.678419, lng: 9.14806,
    address: "Macairestraße 3, 78467, Konstanz",
    sector: "robotics", size: "startup", founded: 2017,
    description: "HORST industrial robot arms making automation affordable for small and mid-sized manufacturers.",
    website: "https://fruitcore-robotics.com"
  },
  {
    name: "Synapticon", city: "Schönaich", state: "bw",
    lat: 48.669918, lng: 9.065445,
    address: "Daimlerstraße, 71101, Schönaich",
    sector: "robotics", size: "startup", founded: 2010,
    description: "Motion-control and servo-drive technology powering robots and autonomous machines.",
    website: "https://www.synapticon.com"
  },
  {
    name: "Micropsi Industries", city: "Berlin", state: "berlin",
    lat: 52.49807, lng: 13.380217,
    address: "Möckernstraße 120, 10963, Berlin",
    sector: "robotics", size: "startup", founded: 2014,
    description: "AI vision software (MIRAI) giving industrial robots real-time adaptive control.",
    website: "https://www.micropsi-industries.com"
  },

  // ── AI & ML ───────────────────────────────────────────────────────────────
  {
    name: "Merantix", city: "Berlin", state: "berlin",
    lat: 52.539439, lng: 13.383822,
    address: "Max-Urich-Straße 3, 13355, Berlin",
    sector: "ai_ml", size: "startup", founded: 2016,
    description: "AI venture studio building and funding companies in healthcare, climate, and enterprise AI.",
    website: "https://www.merantix.com"
  },
  {
    name: "Black Forest Labs", city: "Freiburg", state: "bw",
    lat: 48.014932, lng: 7.8468,
    address: "Ingeborg-Krummer-Schroth-Straße 18, 79106, Freiburg im Breisgau",
    sector: "ai_ml", size: "startup", founded: 2024,
    description: "Creators of the FLUX open-weight image-generation models, founded by ex-Stability researchers.",
    website: "https://bfl.ai"
  },
  {
    name: "deepset", city: "Berlin", state: "berlin",
    lat: 52.531551, lng: 13.382623,
    address: "Zinnowitzer Straße 1, 10115, Berlin",
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "Builders of the open-source Haystack framework for production LLM and search applications.",
    website: "https://www.deepset.ai"
  },
  {
    name: "brighter AI", city: "Berlin", state: "berlin",
    lat: 52.523103, lng: 13.366453,
    address: "Bertha-Benz-Straße 5, 10557, Berlin",
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "Privacy technology that anonymizes faces and licence plates in images and video.",
    website: "https://brighter.ai"
  },

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "ARX Robotics", city: "Munich", state: "bavaria",
    lat: 48.337875, lng: 11.83608,
    address: "Möslstraße, 85445, Schwaig",
    sector: "defense", size: "startup", founded: 2022,
    description: "Autonomous unmanned ground vehicles and software for defense and security.",
    website: "https://arx-robotics.com"
  },

  // ── AGRICULTURE ───────────────────────────────────────────────────────────
  {
    name: "365FarmNet", city: "Berlin", state: "berlin",
    lat: 52.512448, lng: 13.396763,
    address: "Hausvogteiplatz 10, 10117, Berlin",
    sector: "agriculture", size: "startup", founded: 2013,
    description: "Digital farming platform connecting farm management, precision data, and machine telemetry.",
    website: "https://www.365farmnet.com"
  },

  // ── ROBOTICS (added 2026-06) ───────────────────────────────────────────────
  {
    name: "Roboception", city: "Munich", state: "bavaria",
    lat: 48.149275, lng: 11.459972,
    address: "Kaflerstraße 2, 81241, München",
    sector: "robotics", size: "startup", founded: 2015,
    description: "3D stereo-vision sensors and software giving industrial robots real-time depth perception; a DLR spin-off.",
    website: "https://roboception.com"
  },
  {
    name: "sewts", city: "Munich", state: "bavaria",
    lat: 48.106494, lng: 11.537144,
    address: "Flößergasse 2, 81369, München",
    sector: "robotics", size: "startup", founded: 2019,
    description: "AI and material-simulation software enabling robots to grip and handle deformable textiles.",
    website: "https://www.sewts.com"
  },
  {
    name: "Filics", city: "Munich", state: "bavaria",
    lat: 48.118196, lng: 11.602731,
    address: "Balanstraße 73, 81541, München",
    sector: "robotics", size: "startup", founded: 2019,
    description: "Autonomous robot duo that lifts and moves pallets from below to automate warehouse transport.",
    website: "https://www.filics.com"
  },
  {
    name: "cellumation", city: "Bremen", state: "bremen",
    lat: 53.107807, lng: 8.862903,
    address: "Linzer Straße 5, 28359, Bremen",
    sector: "robotics", size: "startup", founded: 2017,
    description: "Maker of the celluveyor, a modular grid of omnidirectional cells that conveys and sorts goods.",
    website: "https://cellumation.com"
  },
  {
    name: "Unchained Robotics", city: "Paderborn", state: "nrw",
    lat: 51.694387, lng: 8.716069,
    address: "Pamplonastraße 44, 33106, Paderborn",
    sector: "robotics", size: "startup", founded: 2019,
    description: "Platform and integrator letting manufacturers compare, buy, and deploy industrial robots and automation.",
    website: "https://www.unchainedrobotics.de"
  },
  {
    name: "NODE Robotics", city: "Stuttgart", state: "bw",
    lat: 48.771235, lng: 9.157803,
    address: "Schwabstraße 30, 70197, Stuttgart",
    sector: "robotics", size: "startup", founded: 2020,
    description: "Navigation and fleet software that turns automated guided vehicles into autonomous mobile robots; a Fraunhofer IPA spin-off.",
    website: "https://node-robotics.com"
  },
  {
    name: "Götting KG", city: "Lehrte", state: "lower_saxony",
    lat: 52.415751, lng: 9.977281,
    address: "Celler Straße 5, 31275, Lehrte",
    sector: "robotics", size: "startup", founded: 1965,
    description: "Sensors and guidance technology for automating and teleoperating industrial vehicles and AGVs.",
    website: "https://www.goetting.de"
  },
  {
    name: "Robotise", city: "Munich", state: "bavaria",
    lat: 48.091193, lng: 11.646332,
    address: "Otto-Hahn-Ring 6, 81739, München",
    sector: "robotics", size: "startup", founded: 2016,
    description: "Maker of JEEVES, an autonomous service robot that delivers goods in hotels, airports, and care facilities.",
    website: "https://robotise.eu"
  },
  {
    name: "TEDIRO", city: "Ilmenau", state: "thuringia",
    lat: 50.684121, lng: 10.926411,
    address: "Ehrenbergstraße 11, 98693, Ilmenau",
    sector: "robotics", size: "startup", founded: 2020,
    description: "Healthcare robots for gait rehabilitation and diagnostics that help mobilise patients in clinics.",
    website: "https://tediro.com"
  },
  {
    name: "doks.innovation", city: "Kassel", state: "hesse",
    lat: 51.30595, lng: 9.444183,
    address: "Ludwig-Erhard-Straße 10, 34131, Kassel",
    sector: "robotics", size: "startup", founded: 2017,
    description: "Drone- and sensor-based robots that automate warehouse stocktaking and inventory tracking.",
    website: "https://doks-innovation.com"
  },
  {
    name: "voraus robotik", city: "Hannover", state: "lower_saxony",
    lat: 52.350403, lng: 9.657552,
    address: "Carl-Buderus-Straße 7, 30455, Hannover",
    sector: "robotics", size: "startup", founded: 2022,
    description: "Software-defined robotics platform providing real-time control software for mobile robots and cobots.",
    website: "https://vorausrobotik.com"
  },
  // ── AUTOMOTIVE (added 2026-06) ─────────────────────────────────────────────
  {
    name: "DeepDrive", city: "Munich", state: "bavaria",
    lat: 48.252615, lng: 11.606621,
    address: "Carl-von-Linde-Straße, 85748, Garching bei München",
    sector: "automotive", size: "startup", founded: 2021,
    description: "Developer of a radial-flux dual-rotor electric motor that cuts cost and material use in EV drivetrains.",
    website: "https://www.deepdrive.tech"
  },
  {
    name: "cylib", city: "Aachen", state: "nrw",
    lat: 50.772073, lng: 6.132403,
    address: "Vennbahnweg, 52068, Aachen",
    sector: "automotive", size: "startup", founded: 2022,
    description: "Battery-recycling company recovering lithium, nickel, and other raw materials from used EV cells.",
    website: "https://www.cylib.de"
  },
  // ── AI_ML (added 2026-06) ──────────────────────────────────────────────────
  {
    name: "Twaice", city: "Munich", state: "bavaria",
    lat: 48.185034, lng: 11.60535,
    address: "Joseph-Dollinger-Bogen 26, 80807, München",
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "Predictive battery analytics software modelling the health and lifetime of EV and storage batteries.",
    website: "https://www.twaice.com"
  },
  {
    name: "deepc", city: "Munich", state: "bavaria",
    lat: 48.132877, lng: 11.572052,
    address: "Blumenstraße 28, 80331, München",
    sector: "ai_ml", size: "startup", founded: 2019,
    description: "Cloud platform that integrates third-party radiology AI models into clinical imaging workflows.",
    website: "https://www.deepc.ai"
  },
  {
    name: "Vara", city: "Berlin", state: "berlin",
    lat: 52.539439, lng: 13.383822,
    address: "Max-Urich-Straße 3, 13355, Berlin",
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "AI mammography platform that flags suspicious scans to speed up breast-cancer screening.",
    website: "https://www.vara.ai"
  },
  {
    name: "Nect", city: "Hamburg", state: "hamburg",
    lat: 53.548448, lng: 9.990032,
    address: "Großer Burstah, 20457, Hamburg",
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "Fully automated AI identity verification using a smartphone selfie and ID-document scan.",
    website: "https://nect.com"
  },
  {
    name: "SpiNNcloud Systems", city: "Dresden", state: "saxony",
    lat: 51.049142, lng: 13.7217,
    address: "Freiberger Straße 37, 01067, Dresden",
    sector: "ai_ml", size: "startup", founded: 2021,
    description: "Builder of brain-inspired neuromorphic supercomputers for energy-efficient AI, spun out of TU Dresden.",
    website: "https://spinncloud.com"
  },
  {
    name: "Luminovo", city: "Munich", state: "bavaria",
    lat: 48.150271, lng: 11.575654,
    address: "Schellingstraße 29, 80799, München",
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "AI software that automates quoting, sourcing, and design for electronics and printed circuit boards.",
    website: "https://luminovo.com"
  },
  {
    name: "PLANET AI", city: "Rostock", state: "mv",
    lat: 54.093228, lng: 12.120155,
    address: "Warnowufer 60, 18057, Rostock",
    sector: "ai_ml", size: "startup", founded: 2015,
    description: "Deep-learning OCR and intelligent document processing that extracts data from unstructured documents.",
    website: "https://planet-ai.com"
  },
  {
    name: "understand.ai", city: "Karlsruhe", state: "bw",
    lat: 48.997409, lng: 8.464683,
    address: "An der RaumFabrik 33a, 76227, Karlsruhe",
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "AI-powered data annotation and validation for autonomous-driving perception; part of the dSPACE group.",
    website: "https://understand.ai"
  },
  {
    name: "mediaire", city: "Berlin", state: "berlin",
    lat: 52.500989, lng: 13.411789,
    address: "Ritterstraße, 10969, Berlin",
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "AI neuroimaging software (mdbrain) that automates and quantifies radiology findings from MRI scans.",
    website: "https://mediaire.ai"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "Alpine Eagle", city: "Munich", state: "bavaria",
    lat: 48.141822, lng: 11.593483,
    address: "Prinzregentenstraße 54, 80538, München",
    sector: "defense", size: "startup", founded: 2023,
    description: "Air-to-air counter-drone system that uses AI to detect and intercept hostile UAVs.",
    website: "https://www.alpine-eagle.com"
  },
  {
    name: "blackned", city: "Heimertingen", state: "bavaria",
    lat: 48.028894, lng: 10.150276,
    address: "Zugspitzstraße 1, 87751, Heimertingen",
    sector: "defense", size: "startup", founded: 2009,
    description: "Tactical communications middleware and software digitalising command and control for armed forces.",
    website: "https://blackned.de"
  },
  // ── AGRICULTURE (added 2026-06) ────────────────────────────────────────────
  {
    name: "Plantix", city: "Berlin", state: "berlin",
    lat: 52.527422, lng: 13.402368,
    address: "Rosenthaler Straße 13, 10119, Berlin",
    sector: "agriculture", size: "startup", founded: 2015,
    description: "AI smartphone app that diagnoses crop pests, diseases, and nutrient deficiencies from a photo.",
    website: "https://plantix.net"
  },
  {
    name: "Stenon", city: "Potsdam", state: "brandenburg",
    lat: 52.402788, lng: 13.056575,
    address: "Hegelallee 53, 14467, Potsdam",
    sector: "agriculture", size: "startup", founded: 2018,
    description: "Real-time soil analysis sensor and platform giving farmers instant nutrient and moisture data in the field.",
    website: "https://www.stenon.io"
  },
  {
    name: "Klim", city: "Berlin", state: "berlin",
    lat: 52.53328, lng: 13.410334,
    address: "Schwedter Straße 263, 10119, Berlin",
    sector: "agriculture", size: "startup", founded: 2020,
    description: "Digital platform paying farmers to adopt regenerative practices and sell verified carbon credits.",
    website: "https://www.klim.eco"
  },
  {
    name: "Farming Revolution", city: "Renningen", state: "bw",
    lat: 48.767, lng: 8.933,
    sector: "agriculture", size: "startup", founded: 2020,
    description: "Autonomous AI weeding robot that tells crops from weeds and removes them mechanically; an ex-Bosch team.",
    website: "https://farming-revolution.com"
  },
  {
    name: "Agvolution", city: "Göttingen", state: "lower_saxony",
    lat: 51.528712, lng: 9.943143,
    address: "Geismar Landstraße 11, 37083, Göttingen",
    sector: "agriculture", size: "startup", founded: 2019,
    description: "Solar-powered field sensors and AI software delivering real-time soil and microclimate data for precision farming.",
    website: "https://agvolution.com"
  },
];
