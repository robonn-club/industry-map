// Companies sized "startup" (<100 employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_STARTUP = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
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

  // ── AI & ML ───────────────────────────────────────────────────────────────
  {
    name: "Merantix", city: "Berlin", state: "berlin",
    lat: 52.5200, lng: 13.4050,
    sector: "ai_ml", size: "startup", founded: 2016,
    description: "AI venture studio building and funding companies in healthcare, climate, and enterprise AI.",
    website: "https://www.merantix.com"
  },
  {
    name: "Black Forest Labs", city: "Freiburg", state: "bw",
    lat: 48.0000, lng: 7.8500,
    sector: "ai_ml", size: "startup", founded: 2024,
    description: "Creators of the FLUX open-weight image-generation models, founded by ex-Stability researchers.",
    website: "https://blackforestlabs.ai"
  },
  {
    name: "deepset", city: "Berlin", state: "berlin",
    lat: 52.5180, lng: 13.4080,
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "Builders of the open-source Haystack framework for production LLM and search applications.",
    website: "https://www.deepset.ai"
  },
  {
    name: "brighter AI", city: "Berlin", state: "berlin",
    lat: 52.5200, lng: 13.4050,
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "Privacy technology that anonymizes faces and licence plates in images and video.",
    website: "https://brighter.ai"
  },

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "ARX Robotics", city: "Munich", state: "bavaria",
    lat: 48.1400, lng: 11.5800,
    sector: "defense", size: "startup", founded: 2022,
    description: "Autonomous unmanned ground vehicles and software for defense and security.",
    website: "https://arx-robotics.com"
  },

  // ── AGRICULTURE ───────────────────────────────────────────────────────────
  {
    name: "365FarmNet", city: "Berlin", state: "berlin",
    lat: 52.5350, lng: 13.3980,
    sector: "agriculture", size: "startup", founded: 2013,
    description: "Digital farming platform connecting farm management, precision data, and machine telemetry.",
    website: "https://www.365farmnet.com"
  },

  // ── ROBOTICS (added 2026-06) ───────────────────────────────────────────────
  {
    name: "Roboception", city: "Munich", state: "bavaria",
    lat: 48.11, lng: 11.51,
    sector: "robotics", size: "startup", founded: 2015,
    description: "3D stereo-vision sensors and software giving industrial robots real-time depth perception; a DLR spin-off.",
    website: "https://roboception.com"
  },
  {
    name: "sewts", city: "Munich", state: "bavaria",
    lat: 48.15, lng: 11.58,
    sector: "robotics", size: "startup", founded: 2019,
    description: "AI and material-simulation software enabling robots to grip and handle deformable textiles.",
    website: "https://www.sewts.com"
  },
  {
    name: "Filics", city: "Munich", state: "bavaria",
    lat: 48.19, lng: 11.59,
    sector: "robotics", size: "startup", founded: 2019,
    description: "Autonomous robot duo that lifts and moves pallets from below to automate warehouse transport.",
    website: "https://www.filics.com"
  },
  {
    name: "cellumation", city: "Bremen", state: "bremen",
    lat: 53.11, lng: 8.84,
    sector: "robotics", size: "startup", founded: 2017,
    description: "Maker of the celluveyor, a modular grid of omnidirectional cells that conveys and sorts goods.",
    website: "https://cellumation.com"
  },
  {
    name: "Unchained Robotics", city: "Paderborn", state: "nrw",
    lat: 51.719, lng: 8.754,
    sector: "robotics", size: "startup", founded: 2019,
    description: "Platform and integrator letting manufacturers compare, buy, and deploy industrial robots and automation.",
    website: "https://www.unchainedrobotics.de"
  },
  {
    name: "NODE Robotics", city: "Stuttgart", state: "bw",
    lat: 48.745, lng: 9.101,
    sector: "robotics", size: "startup", founded: 2020,
    description: "Navigation and fleet software that turns automated guided vehicles into autonomous mobile robots; a Fraunhofer IPA spin-off.",
    website: "https://node-robotics.com"
  },
  {
    name: "Götting KG", city: "Lehrte", state: "lower_saxony",
    lat: 52.372, lng: 9.979,
    sector: "robotics", size: "startup", founded: 1965,
    description: "Sensors and guidance technology for automating and teleoperating industrial vehicles and AGVs.",
    website: "https://www.goetting.de"
  },
  {
    name: "Robotise", city: "Munich", state: "bavaria",
    lat: 48.145, lng: 11.54,
    sector: "robotics", size: "startup", founded: 2016,
    description: "Maker of JEEVES, an autonomous service robot that delivers goods in hotels, airports, and care facilities.",
    website: "https://robotise.eu"
  },
  {
    name: "TEDIRO", city: "Ilmenau", state: "thuringia",
    lat: 50.683, lng: 10.917,
    sector: "robotics", size: "startup", founded: 2020,
    description: "Healthcare robots for gait rehabilitation and diagnostics that help mobilise patients in clinics.",
    website: "https://tediro.com"
  },
  {
    name: "doks.innovation", city: "Kassel", state: "hesse",
    lat: 51.313, lng: 9.48,
    sector: "robotics", size: "startup", founded: 2017,
    description: "Drone- and sensor-based robots that automate warehouse stocktaking and inventory tracking.",
    website: "https://doks-innovation.com"
  },
  {
    name: "voraus robotik", city: "Hannover", state: "lower_saxony",
    lat: 52.3759, lng: 9.732,
    sector: "robotics", size: "startup", founded: 2022,
    description: "Software-defined robotics platform providing real-time control software for mobile robots and cobots.",
    website: "https://vorausrobotik.com"
  },
  // ── AUTOMOTIVE (added 2026-06) ─────────────────────────────────────────────
  {
    name: "DeepDrive", city: "Munich", state: "bavaria",
    lat: 48.18, lng: 11.53,
    sector: "automotive", size: "startup", founded: 2021,
    description: "Developer of a radial-flux dual-rotor electric motor that cuts cost and material use in EV drivetrains.",
    website: "https://www.deepdrive.tech"
  },
  {
    name: "cylib", city: "Aachen", state: "nrw",
    lat: 50.78, lng: 6.083,
    sector: "automotive", size: "startup", founded: 2022,
    description: "Battery-recycling company recovering lithium, nickel, and other raw materials from used EV cells.",
    website: "https://www.cylib.de"
  },
  // ── AI_ML (added 2026-06) ──────────────────────────────────────────────────
  {
    name: "Twaice", city: "Munich", state: "bavaria",
    lat: 48.196, lng: 11.558,
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "Predictive battery analytics software modelling the health and lifetime of EV and storage batteries.",
    website: "https://www.twaice.com"
  },
  {
    name: "deepc", city: "Munich", state: "bavaria",
    lat: 48.134, lng: 11.573,
    sector: "ai_ml", size: "startup", founded: 2019,
    description: "Cloud platform that integrates third-party radiology AI models into clinical imaging workflows.",
    website: "https://www.deepc.ai"
  },
  {
    name: "Vara", city: "Berlin", state: "berlin",
    lat: 52.508, lng: 13.39,
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "AI mammography platform that flags suspicious scans to speed up breast-cancer screening.",
    website: "https://www.vara.ai"
  },
  {
    name: "Nect", city: "Hamburg", state: "hamburg",
    lat: 53.548, lng: 9.992,
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "Fully automated AI identity verification using a smartphone selfie and ID-document scan.",
    website: "https://nect.com"
  },
  {
    name: "SpiNNcloud Systems", city: "Dresden", state: "saxony",
    lat: 51.05, lng: 13.737,
    sector: "ai_ml", size: "startup", founded: 2021,
    description: "Builder of brain-inspired neuromorphic supercomputers for energy-efficient AI, spun out of TU Dresden.",
    website: "https://spinncloud.com"
  },
  {
    name: "Luminovo", city: "Munich", state: "bavaria",
    lat: 48.124, lng: 11.58,
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "AI software that automates quoting, sourcing, and design for electronics and printed circuit boards.",
    website: "https://luminovo.com"
  },
  {
    name: "PLANET AI", city: "Rostock", state: "mv",
    lat: 54.092, lng: 12.099,
    sector: "ai_ml", size: "startup", founded: 2015,
    description: "Deep-learning OCR and intelligent document processing that extracts data from unstructured documents.",
    website: "https://planet-ai.com"
  },
  {
    name: "understand.ai", city: "Karlsruhe", state: "bw",
    lat: 49.009, lng: 8.404,
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "AI-powered data annotation and validation for autonomous-driving perception; part of the dSPACE group.",
    website: "https://understand.ai"
  },
  {
    name: "mediaire", city: "Berlin", state: "berlin",
    lat: 52.49, lng: 13.425,
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "AI neuroimaging software (mdbrain) that automates and quantifies radiology findings from MRI scans.",
    website: "https://mediaire.ai"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "Alpine Eagle", city: "Munich", state: "bavaria",
    lat: 48.138, lng: 11.575,
    sector: "defense", size: "startup", founded: 2023,
    description: "Air-to-air counter-drone system that uses AI to detect and intercept hostile UAVs.",
    website: "https://www.alpine-eagle.com"
  },
  {
    name: "blackned", city: "Heimertingen", state: "bavaria",
    lat: 48.017, lng: 10.15,
    sector: "defense", size: "startup", founded: 2009,
    description: "Tactical communications middleware and software digitalising command and control for armed forces.",
    website: "https://blackned.de"
  },
  // ── AGRICULTURE (added 2026-06) ────────────────────────────────────────────
  {
    name: "Plantix", city: "Berlin", state: "berlin",
    lat: 52.51, lng: 13.41,
    sector: "agriculture", size: "startup", founded: 2015,
    description: "AI smartphone app that diagnoses crop pests, diseases, and nutrient deficiencies from a photo.",
    website: "https://plantix.net"
  },
  {
    name: "Stenon", city: "Potsdam", state: "brandenburg",
    lat: 52.391, lng: 13.065,
    sector: "agriculture", size: "startup", founded: 2018,
    description: "Real-time soil analysis sensor and platform giving farmers instant nutrient and moisture data in the field.",
    website: "https://www.stenon.io"
  },
  {
    name: "Klim", city: "Berlin", state: "berlin",
    lat: 52.525, lng: 13.415,
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
    lat: 51.541, lng: 9.916,
    sector: "agriculture", size: "startup", founded: 2019,
    description: "Solar-powered field sensors and AI software delivering real-time soil and microclimate data for precision farming.",
    website: "https://agvolution.com"
  },
];
