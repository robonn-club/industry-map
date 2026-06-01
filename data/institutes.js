// Research institutes & university robotics groups. Same field schema as
// companies.js (sector is always "research"). To add one: copy an entry below.
// Sizes:  "startup" (<100 staff) | "mid" (100–1000) | "big" (1000–5000) | "global" (5000+)

const INSTITUTES = [

  // ── BONN (home of Robonn) ─────────────────────────────────────────────────
  {
    name: "Uni Bonn — Autonomous Intelligent Systems", city: "Bonn", state: "nrw",
    lat: 50.7236, lng: 7.0857,
    sector: "research", size: "mid", founded: 2008,
    description: "Sven Behnke's group at the University of Bonn researching humanoid robots, perception, and deep learning.",
    website: "https://www.ais.uni-bonn.de"
  },
  {
    name: "Uni Bonn — Photogrammetry & Robotics", city: "Bonn", state: "nrw",
    lat: 50.7270, lng: 7.0982,
    sector: "research", size: "mid", founded: 2017,
    description: "Cyrill Stachniss' lab pioneering SLAM, mapping, and perception for agricultural and mobile robots.",
    website: "https://www.ipb.uni-bonn.de"
  },

  // ── PUBLIC RESEARCH CENTERS ───────────────────────────────────────────────
  {
    name: "DLR Robotics & Mechatronics", city: "Oberpfaffenhofen", state: "bavaria",
    lat: 48.0844, lng: 11.2844,
    sector: "research", size: "global", founded: 1969,
    description: "German Aerospace Center — world-leading research in torque-controlled manipulation and space robotics.",
    website: "https://www.dlr.de/rm"
  },
  {
    name: "DFKI", city: "Kaiserslautern", state: "rhineland_palatinate",
    lat: 49.4401, lng: 7.7491,
    sector: "research", size: "big", founded: 1988,
    description: "German Research Center for AI — Europe's leading AI lab with strong robotics groups across four sites.",
    website: "https://www.dfki.de"
  },
  {
    name: "Fraunhofer IPA", city: "Stuttgart", state: "bw",
    lat: 48.7500, lng: 9.1700,
    sector: "research", size: "big", founded: 1959,
    description: "Fraunhofer institute for manufacturing engineering and automation, specializing in robot systems.",
    website: "https://www.ipa.fraunhofer.de"
  },
  {
    name: "Fraunhofer IAIS", city: "Sankt Augustin", state: "nrw",
    lat: 50.7739, lng: 7.1858,
    sector: "research", size: "mid", founded: 2001,
    description: "Fraunhofer institute for intelligent analysis and information systems — AI and ML for industry.",
    website: "https://www.iais.fraunhofer.de"
  },
  {
    name: "Max Planck Institute for Intelligent Systems", city: "Tübingen", state: "bw",
    lat: 48.5380, lng: 9.0580,
    sector: "research", size: "big", founded: 2011,
    description: "Fundamental research on perception, learning systems, and micro/nano robotics across Tübingen and Stuttgart.",
    website: "https://is.mpg.de"
  },
  {
    name: "FZI Research Center", city: "Karlsruhe", state: "bw",
    lat: 49.0130, lng: 8.4250,
    sector: "research", size: "mid", founded: 1985,
    description: "Applied IT research bridging academia and industry in autonomous driving, robotics, and AI.",
    website: "https://www.fzi.de"
  },

  // ── UNIVERSITY ROBOTICS GROUPS ────────────────────────────────────────────
  {
    name: "TUM — MIRMI", city: "Munich", state: "bavaria",
    lat: 48.1496, lng: 11.5680,
    sector: "research", size: "big", founded: 2018,
    description: "Munich Institute of Robotics and Machine Intelligence — collaborative robots, medical and AI robotics.",
    website: "https://www.mirmi.tum.de"
  },
  {
    name: "KIT — High Performance Humanoid Tech", city: "Karlsruhe", state: "bw",
    lat: 49.0119, lng: 8.4170,
    sector: "research", size: "big", founded: 2009,
    description: "Karlsruhe Institute of Technology lab behind the ARMAR humanoid robots and grasping research.",
    website: "https://h2t.iar.kit.edu"
  },
  {
    name: "RWTH Aachen Robotics", city: "Aachen", state: "nrw",
    lat: 50.7780, lng: 6.0608,
    sector: "research", size: "big", founded: 1870,
    description: "Robotics and automation research across one of Europe's largest technical universities.",
    website: "https://www.rwth-aachen.de"
  },
  {
    name: "Uni Freiburg — Autonomous Systems", city: "Freiburg", state: "bw",
    lat: 48.0030, lng: 7.8320,
    sector: "research", size: "mid", founded: 2009,
    description: "Mobile robotics and SLAM research group with a long legacy in robot navigation and learning.",
    website: "https://www.informatik.uni-freiburg.de"
  },
  {
    name: "TU Darmstadt — Intelligent Autonomous Systems", city: "Darmstadt", state: "hesse",
    lat: 49.8770, lng: 8.6512,
    sector: "research", size: "mid", founded: 2011,
    description: "Jan Peters' group advancing robot learning, imitation, and reinforcement learning for manipulation.",
    website: "https://www.ias.informatik.tu-darmstadt.de"
  },
];
