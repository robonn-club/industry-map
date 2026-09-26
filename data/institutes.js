// Research institutes & university robotics groups. Same field schema as the
// company files. To add one: copy an entry below.
//
// `sector` is the DOMAIN the group works in — robotics, ai_ml, industrial, … —
// exactly as for a company. It used to be "research" for every entry here, which
// meant a student filtering the map for "Robotics" saw 28 companies and none of
// DLR, Fraunhofer IPA, DFKI or the Bonn labs. What makes this an institute rather
// than a company is the file it lives in, surfaced as the Type filter.
//
// `size` is the headcount of THE GROUP, not of its parent university or society:
// a named professor's chair is almost always <100 people, even at a 40,000-student
// university. Getting this wrong made every lab marker the size of a mid-cap firm.
//   "startup" (<100 staff) | "mid" (100–1000) | "big" (1000–5000) | "global" (5000+)

const INSTITUTES = [

  // ── BONN (home of Robonn) ─────────────────────────────────────────────────
  {
    name: "Uni Bonn — Autonomous Intelligent Systems", city: "Bonn", state: "nrw",
    lat: 50.727452, lng: 7.08531,
    address: "Friedrich-Hirzebruch-Allee 8, 53115, Bonn",
    sector: "robotics", size: "startup", founded: 2008,
    description: "Sven Behnke's group at the University of Bonn researching humanoid robots, perception, and deep learning.",
    website: "https://www.ais.uni-bonn.de"
  },
  {
    name: "Uni Bonn — Photogrammetry & Robotics", city: "Bonn", state: "nrw",
    lat: 50.727364, lng: 7.087113,
    address: "Nußallee 15, 53115, Bonn",
    sector: "robotics", size: "startup", founded: 2017,
    description: "Cyrill Stachniss' lab pioneering SLAM, mapping, and perception for agricultural and mobile robots.",
    website: "https://www.ipb.uni-bonn.de"
  },

  // ── PUBLIC RESEARCH CENTERS ───────────────────────────────────────────────
  {
    name: "DLR Robotics & Mechatronics", city: "Oberpfaffenhofen", state: "bavaria",
    lat: 48.085399, lng: 11.279037,
    address: "Münchener Straße 20, 82234, Weichselbaum",
    sector: "robotics", size: "mid", founded: 1969,
    description: "German Aerospace Center — world-leading research in torque-controlled manipulation and space robotics.",
    website: "https://www.dlr.de/rm"
  },
  {
    name: "DFKI", city: "Kaiserslautern", state: "rhineland_palatinate",
    lat: 49.429299, lng: 7.751504,
    address: "DFKI Plaza, 67663, Kaiserslautern",
    sector: "ai_ml", size: "big", founded: 1988,
    description: "German Research Center for AI — Europe's leading AI lab with strong robotics groups across four sites.",
    website: "https://www.dfki.de"
  },
  {
    name: "Fraunhofer IPA", city: "Stuttgart", state: "bw",
    lat: 48.740271, lng: 9.099754,
    address: "Nobelstraße, 70569, Stuttgart",
    sector: "robotics", size: "big", founded: 1959,
    description: "Fraunhofer institute for manufacturing engineering and automation, specializing in robot systems.",
    website: "https://www.ipa.fraunhofer.de"
  },
  {
    name: "Fraunhofer IAIS", city: "Sankt Augustin", state: "nrw",
    lat: 50.748989, lng: 7.205566,
    address: "Schloss Birlinghoven 1, 53757, Sankt Augustin",
    sector: "ai_ml", size: "mid", founded: 2001,
    description: "Fraunhofer institute for intelligent analysis and information systems — AI and ML for industry.",
    website: "https://www.iais.fraunhofer.de"
  },
  {
    name: "Max Planck Institute for Intelligent Systems", city: "Tübingen", state: "bw",
    lat: 48.535504, lng: 9.057922,
    address: "Max-Planck-Ring 4, 72076, Tübingen",
    sector: "robotics", size: "mid", founded: 2011,
    description: "Fundamental research on perception, learning systems, and micro/nano robotics across Tübingen and Stuttgart.",
    website: "https://is.mpg.de"
  },
  {
    name: "FZI Research Center", city: "Karlsruhe", state: "bw",
    lat: 49.012038, lng: 8.424696,
    address: "Haid-und-Neu-Straße 10-14, 76131, Karlsruhe",
    sector: "robotics", size: "mid", founded: 1985,
    description: "Applied IT research bridging academia and industry in autonomous driving, robotics, and AI.",
    website: "https://www.fzi.de"
  },

  // ── UNIVERSITY ROBOTICS GROUPS ────────────────────────────────────────────
  {
    name: "TUM — MIRMI", city: "Munich", state: "bavaria",
    lat: 48.176341, lng: 11.525048,
    address: "Georg-Brauchle-Ring, 80992, München",
    sector: "robotics", size: "mid", founded: 2018,
    description: "Munich Institute of Robotics and Machine Intelligence — collaborative robots, medical and AI robotics.",
    website: "https://www.mirmi.tum.de"
  },
  {
    name: "KIT — High Performance Humanoid Tech", city: "Karlsruhe", state: "bw",
    lat: 49.011155, lng: 8.416375,
    address: "Straße am Forum 2, 76131, Karlsruhe",
    sector: "robotics", size: "startup", founded: 2009,
    description: "Karlsruhe Institute of Technology lab behind the ARMAR humanoid robots and grasping research.",
    website: "https://h2t.iar.kit.edu"
  },
  {
    name: "RWTH Aachen Robotics", city: "Aachen", state: "nrw",
    lat: 50.778826, lng: 6.059327,
    address: "Ahornstraße 55, 52074, Aachen",
    sector: "robotics", size: "mid", founded: 1870,
    description: "Robotics and automation research across one of Europe's largest technical universities.",
    website: "https://www.rwth-aachen.de"
  },
  {
    name: "Uni Freiburg — Autonomous Systems", city: "Freiburg", state: "bw",
    lat: 48.004806, lng: 7.861815,
    address: "Jacobistraße, 79104, Freiburg im Breisgau",
    sector: "robotics", size: "startup", founded: 2009,
    description: "Mobile robotics and SLAM research group with a long legacy in robot navigation and learning.",
    website: "https://www.informatik.uni-freiburg.de"
  },
  {
    name: "TU Darmstadt — Intelligent Autonomous Systems", city: "Darmstadt", state: "hesse",
    lat: 49.877509, lng: 8.654546,
    address: "Hochschulstraße 10, 64289, Darmstadt",
    sector: "robotics", size: "startup", founded: 2011,
    description: "Jan Peters' group advancing robot learning, imitation, and reinforcement learning for manipulation.",
    website: "https://www.ias.informatik.tu-darmstadt.de"
  },

  // ── CURATED ADDITIONS (2026-06) ────────────────────────────────────────────
  {
    name: "Fraunhofer IML", city: "Dortmund", state: "nrw",
    lat: 51.494028, lng: 7.407545,
    address: "Joseph-von-Fraunhofer-Straße 2-4, 44227, Dortmund",
    sector: "industrial", size: "big", founded: 1981,
    description: "Fraunhofer institute for material flow and logistics, including warehouse and mobile-robot research.",
    website: "https://www.iml.fraunhofer.de"
  },
  {
    name: "Fraunhofer FKIE", city: "Wachtberg", state: "nrw",
    lat: 50.617501, lng: 7.129508,
    address: "Fraunhoferstraße 20, 53343, Werthhoven",
    sector: "defense", size: "mid", founded: 1963,
    description: "Fraunhofer institute for communication, information processing, and ergonomics, with defence robotics research.",
    website: "https://www.fkie.fraunhofer.de"
  },
  {
    name: "Fraunhofer IOSB", city: "Karlsruhe", state: "bw",
    lat: 49.01546, lng: 8.426213,
    address: "Fraunhoferstraße 1, 76131, Karlsruhe",
    sector: "defense", size: "big", founded: 2010,
    description: "Fraunhofer institute for optronics, system technologies, and image exploitation, including autonomous systems.",
    website: "https://www.iosb.fraunhofer.de"
  },
  {
    name: "Fraunhofer IIS", city: "Erlangen", state: "bavaria",
    lat: 49.546882, lng: 11.021642,
    address: "Am Wolfsmantel, 91058, Tennenlohe",
    sector: "industrial", size: "big", founded: 1985,
    description: "Fraunhofer institute for integrated circuits (the MP3 inventors), researching sensors, imaging, and edge AI.",
    website: "https://www.iis.fraunhofer.de"
  },
  {
    name: "Fraunhofer IFF", city: "Magdeburg", state: "saxony_anhalt",
    lat: 52.141597, lng: 11.657302,
    address: "Joseph-von-Fraunhofer-Straße 1, 39106, Magdeburg",
    sector: "industrial", size: "mid", founded: 1992,
    description: "Fraunhofer institute for factory operation and automation, specialising in robotics and digital production.",
    website: "https://www.iff.fraunhofer.de"
  },
  {
    name: "Fraunhofer IWU", city: "Chemnitz", state: "saxony",
    lat: 50.812572, lng: 12.927323,
    address: "Baustellenzufahrt TUC Chemie, 09126, Chemnitz",
    sector: "industrial", size: "mid", founded: 1991,
    description: "Fraunhofer institute for machine tools and forming technology for smart production systems.",
    website: "https://www.iwu.fraunhofer.de"
  },
  {
    name: "Fraunhofer IPK", city: "Berlin", state: "berlin",
    lat: 52.523821, lng: 13.323574,
    address: "Pascalstraße 8-9, 10587, Berlin",
    sector: "industrial", size: "mid", founded: 1976,
    description: "Fraunhofer institute for production systems and design technology, from automation to medical engineering.",
    website: "https://www.ipk.fraunhofer.de"
  },
  {
    name: "Fraunhofer HHI", city: "Berlin", state: "berlin",
    lat: 52.516442, lng: 13.324879,
    address: "Einsteinufer 37, 10587, Berlin",
    sector: "software", size: "mid", founded: 1928,
    description: "Fraunhofer Heinrich Hertz Institute for telecoms, photonics, and video coding; co-developer of video standards.",
    website: "https://www.hhi.fraunhofer.de"
  },
  {
    name: "Forschungszentrum Jülich", city: "Jülich", state: "nrw",
    lat: 50.902289, lng: 6.399604,
    address: "Wilhelm-Johnen-Straße, 52428, Jülich",
    sector: "ai_ml", size: "global", founded: 1956,
    description: "Major national research centre running some of Europe's fastest supercomputers for AI and simulation.",
    website: "https://www.fz-juelich.de"
  },
  {
    name: "CISPA Helmholtz Center", city: "Saarbrücken", state: "saarland",
    lat: 49.260734, lng: 7.051492,
    address: "Dudweilerstraße, 66123, Saarbrücken",
    sector: "software", size: "mid", founded: 2011,
    description: "Helmholtz Center for Information Security researching cybersecurity, privacy, and trustworthy AI.",
    website: "https://cispa.de"
  },
  {
    name: "MPI for Informatics", city: "Saarbrücken", state: "saarland",
    lat: 49.257933, lng: 7.045779,
    address: "Campus E1 4, 66123, Saarbrücken",
    sector: "ai_ml", size: "mid", founded: 1988,
    description: "Max Planck institute for computer science, with leading groups in computer vision, graphics, and algorithms.",
    website: "https://www.mpi-inf.mpg.de"
  },
  {
    name: "MPI for Biological Cybernetics", city: "Tübingen", state: "bw",
    lat: 48.536912, lng: 9.059225,
    address: "Max-Planck-Ring 8, 72076, Tübingen",
    sector: "ai_ml", size: "mid", founded: 1968,
    description: "Max Planck institute researching perception, neural computation, and the brain's information processing.",
    website: "https://www.kyb.tuebingen.mpg.de"
  },
  {
    name: "Lamarr Institute", city: "Dortmund", state: "nrw",
    lat: 51.490088, lng: 7.405194,
    address: "Joseph-von-Fraunhofer-Straße 25, 44227, Dortmund",
    sector: "ai_ml", size: "mid", founded: 2022,
    description: "National competence centre for machine learning and AI, run jointly by TU Dortmund, Uni Bonn, and Fraunhofer.",
    website: "https://lamarr-institute.org"
  },
  {
    name: "ELLIS Institute Tübingen", city: "Tübingen", state: "bw",
    lat: 48.538549, lng: 9.055889,
    address: "Maria-von-Linden-Straße 2, 72076, Tübingen",
    sector: "ai_ml", size: "startup", founded: 2023,
    description: "Foundational AI research institute and the first of the European ELLIS network's institutes.",
    website: "https://institute-tue.ellis.eu"
  },
  {
    name: "ScaDS.AI Dresden/Leipzig", city: "Dresden", state: "saxony",
    lat: 51.035777, lng: 13.74309,
    address: "Strehlener Straße, 01069, Dresden",
    sector: "ai_ml", size: "mid", founded: 2014,
    description: "Center for scalable data analytics and AI, one of Germany's national AI competence centres.",
    website: "https://scads.ai"
  },
  {
    name: "hessian.AI", city: "Darmstadt", state: "hesse",
    lat: 49.87489, lng: 8.656553,
    address: "Karolinenplatz 5, 64289, Darmstadt",
    sector: "ai_ml", size: "mid", founded: 2020,
    description: "The Hessian Center for Artificial Intelligence, networking AI research across the state's universities.",
    website: "https://hessian.ai"
  },
  {
    name: "TU Berlin — Robotics and Biology Lab", city: "Berlin", state: "berlin",
    lat: 52.516629, lng: 13.323536,
    address: "Marchstraße 23, 10587, Berlin",
    sector: "robotics", size: "startup", founded: 2009,
    description: "Oliver Brock's lab studying soft manipulation and how biological principles inform robot intelligence.",
    website: "https://www.tu.berlin/en/robotics"
  },
  {
    name: "TU Dresden — CeTI", city: "Dresden", state: "saxony",
    lat: 51.02684, lng: 13.722932,
    address: "Helmholtzstraße 18, 01069, Dresden",
    sector: "robotics", size: "mid", founded: 2019,
    description: "Cluster of excellence on the Tactile Internet, linking humans and robots with low-latency interaction.",
    website: "https://ceti.one"
  },
  {
    name: "Bielefeld University — CITEC", city: "Bielefeld", state: "nrw",
    lat: 52.035057, lng: 8.502465,
    address: "Kurt-Schumacher-Straße 6, 33615, Bielefeld",
    sector: "robotics", size: "mid", founded: 2007,
    description: "Center for Cognitive Interaction Technology researching cognitive robots and human-machine interaction.",
    website: "https://www.uni-bielefeld.de/zwe/citec"
  },
  {
    name: "Uni Hamburg — Knowledge Technology", city: "Hamburg", state: "hamburg",
    lat: 53.590905, lng: 9.975376,
    sector: "robotics", size: "startup", founded: 2011,
    description: "Stefan Wermter's group on neural-network robotics, crossmodal learning, and social robots.",
    website: "https://www.inf.uni-hamburg.de/en/inst/ab/wtm.html"
  },
  {
    name: "Leibniz Uni Hannover — Mechatronic Systems", city: "Hannover", state: "lower_saxony",
    lat: 52.382554, lng: 9.701162,
    address: "Pannenflickergang, 30167, Hannover",
    sector: "robotics", size: "startup", founded: 2009,
    description: "University institute researching mechatronics, medical robotics, and control of dynamic systems.",
    website: "https://www.imes.uni-hannover.de"
  },
  {
    name: "Uni Bremen — Institute for AI", city: "Bremen", state: "bremen",
    lat: 53.107965, lng: 8.855665,
    address: "Bibliothekstraße 1, 28359, Bremen",
    sector: "robotics", size: "startup", founded: 2012,
    description: "Michael Beetz's institute on cognition-enabled robots that reason about everyday manipulation tasks.",
    website: "https://ai.uni-bremen.de"
  },
  {
    name: "FAU Erlangen — Pattern Recognition Lab", city: "Erlangen", state: "bavaria",
    lat: 49.594133, lng: 11.027211,
    address: "Konrad-Zuse-Straße, 91052, Erlangen",
    sector: "ai_ml", size: "startup", founded: 1975,
    description: "Pattern-recognition and machine-learning lab with a strong focus on medical image analysis.",
    website: "https://lme.tf.fau.de"
  },
  {
    name: "Uni Lübeck — Robotics & Cognitive Systems", city: "Lübeck", state: "schleswig_holstein",
    lat: 53.835344, lng: 10.709653,
    address: "Ratzeburger Allee 160, 23562, Lübeck",
    sector: "robotics", size: "startup", founded: 2008,
    description: "University institute pioneering medical and surgical robotics and cognitive systems.",
    website: "https://www.rob.uni-luebeck.de"
  },
  {
    name: "Uni Stuttgart — Institute for AI", city: "Stuttgart", state: "bw",
    lat: 48.782826, lng: 9.109657,
    address: "Schaftriebweg, 70195, Stuttgart",
    sector: "ai_ml", size: "startup", founded: 2023,
    description: "University institute pairing AI for simulation with intelligent robotics research.",
    website: "https://www.ki.uni-stuttgart.de"
  },

  // ── ROBOTICS & AI ADDITIONS (2026-06) ──────────────────────────────────────
  {
    name: "Fraunhofer IKS", city: "Munich", state: "bavaria",
    lat: 48.266319, lng: 11.66456,
    sector: "ai_ml", size: "mid", founded: 2019,
    description: "Fraunhofer institute for cognitive systems and the safety assurance of AI in autonomous and critical systems.",
    website: "https://www.iks.fraunhofer.de"
  },
  {
    name: "Fraunhofer IGD", city: "Darmstadt", state: "hesse",
    lat: 49.874313, lng: 8.659876,
    address: "Fraunhoferstraße 5, 64283, Darmstadt",
    sector: "software", size: "mid", founded: 1987,
    description: "Fraunhofer institute for computer graphics research — visual computing, AR/VR, and 3D for industry and medicine.",
    website: "https://www.igd.fraunhofer.de"
  },
  {
    name: "Fraunhofer IAO", city: "Stuttgart", state: "bw",
    lat: 48.740835, lng: 9.098716,
    address: "Nobelstraße 12, 70569, Stuttgart",
    sector: "industrial", size: "mid", founded: 1981,
    description: "Fraunhofer institute for industrial engineering — work, human-technology interaction, and applied AI.",
    website: "https://www.iao.fraunhofer.de"
  },
  {
    name: "Fraunhofer IPT", city: "Aachen", state: "nrw",
    lat: 50.784698, lng: 6.047172,
    address: "Steinbachstraße 17, 52074, Aachen",
    sector: "industrial", size: "mid", founded: 1980,
    description: "Fraunhofer institute for production technology — automation, robotics, and precision manufacturing.",
    website: "https://www.ipt.fraunhofer.de"
  },
  {
    name: "Fraunhofer IMS", city: "Duisburg", state: "nrw",
    lat: 51.42877, lng: 6.796852,
    address: "Finkenstraße 61, 47057, Duisburg",
    sector: "industrial", size: "mid", founded: 1984,
    description: "Fraunhofer institute for microelectronic circuits and systems, building AI sensors and edge-AI hardware.",
    website: "https://www.ims.fraunhofer.de"
  },
  {
    name: "Fraunhofer IESE", city: "Kaiserslautern", state: "rhineland_palatinate",
    lat: 49.43151, lng: 7.752412,
    address: "Fraunhofer-Platz 1, 67663, Kaiserslautern",
    sector: "software", size: "mid", founded: 1996,
    description: "Fraunhofer institute for experimental software engineering, focused on autonomous and embedded systems.",
    website: "https://www.iese.fraunhofer.de"
  },
  {
    name: "Fraunhofer IOSB-INA", city: "Lemgo", state: "nrw",
    lat: 52.017421, lng: 8.902484,
    address: "Campusallee 1, 32657, Lemgo",
    sector: "industrial", size: "startup", founded: 2009,
    description: "Fraunhofer industrial-automation lab in the 'it's OWL' cluster, researching Industry 4.0 and machine learning.",
    website: "https://www.iosb-ina.fraunhofer.de"
  },
  {
    name: "Fraunhofer ITWM", city: "Kaiserslautern", state: "rhineland_palatinate",
    lat: 49.43151, lng: 7.752412,
    address: "Fraunhofer-Platz 1, 67663, Kaiserslautern",
    sector: "industrial", size: "mid", founded: 1995,
    description: "Fraunhofer institute for industrial mathematics — simulation, optimisation, machine learning, and HPC.",
    website: "https://www.itwm.fraunhofer.de"
  },
  {
    name: "BIFOLD", city: "Berlin", state: "berlin",
    lat: 52.512951, lng: 13.320037,
    address: "Ernst-Reuter-Platz 7, 10587, Berlin",
    sector: "ai_ml", size: "mid", founded: 2019,
    description: "Berlin's national AI center for the foundations of machine learning and big data, based at TU Berlin.",
    website: "https://www.bifold.berlin"
  },
  {
    name: "MCML", city: "Munich", state: "bavaria",
    lat: 48.149739, lng: 11.594364,
    address: "Oettingenstraße 67, 80538, München",
    sector: "ai_ml", size: "mid", founded: 2018,
    description: "Munich Center for Machine Learning, a national AI competence center run jointly by LMU and TUM.",
    website: "https://mcml.ai"
  },
  {
    name: "Tübingen AI Center", city: "Tübingen", state: "bw",
    lat: 48.538631, lng: 9.055018,
    address: "Maria-von-Linden-Straße 1, 72076, Tübingen",
    sector: "ai_ml", size: "mid", founded: 2019,
    description: "National AI competence center in Tübingen advancing robust and resource-efficient machine learning.",
    website: "https://tuebingen.ai"
  },
  {
    name: "Science of Intelligence", city: "Berlin", state: "berlin",
    lat: 52.516629, lng: 13.323536,
    address: "Marchstraße 23, 10587, Berlin",
    sector: "robotics", size: "mid", founded: 2019,
    description: "Berlin cluster of excellence uniting robotics, AI, and cognitive science to understand intelligence.",
    website: "https://www.scienceofintelligence.de"
  },
  {
    name: "Hasso Plattner Institute", city: "Potsdam", state: "brandenburg",
    lat: 52.393799, lng: 13.1319,
    address: "Prof.-Dr.-Helmert-Straße 2-3, 14482, Potsdam",
    sector: "software", size: "mid", founded: 1998,
    description: "Institute for digital engineering with strong AI, machine learning, and systems research near Berlin.",
    website: "https://hpi.de"
  },
  {
    name: "DFKI — Robotics Innovation Center", city: "Bremen", state: "bremen",
    lat: 53.112096, lng: 8.857721,
    address: "Robert-Hooke-Straße 1, 28359, Bremen",
    sector: "robotics", size: "mid", founded: 2006,
    description: "DFKI's robotics arm building space, underwater, and AI-driven robots; led by Frank Kirchner.",
    website: "https://robotik.dfki-bremen.de"
  },
  {
    name: "DFKI Niedersachsen", city: "Osnabrück", state: "lower_saxony",
    lat: 52.270979, lng: 8.061676,
    address: "Hamburger Straße 24, 49084, Osnabrück",
    sector: "robotics", size: "startup", founded: 2019,
    description: "DFKI's Lower Saxony lab researching plan-based robot control, interactive ML, and marine perception.",
    website: "https://www.dfki.de"
  },
  {
    name: "DLR — Institute for AI Safety and Security", city: "Sankt Augustin", state: "nrw",
    lat: 50.776035, lng: 7.185835,
    address: "Rathausallee 12, 53757, Sankt Augustin",
    sector: "ai_ml", size: "startup", founded: 2020,
    description: "DLR institute researching reliable, safe, and secure artificial intelligence for critical systems.",
    website: "https://www.dlr.de/en/ki"
  },
  {
    name: "Uni Bonn — Humanoid Robots Lab", city: "Bonn", state: "nrw",
    lat: 50.727452, lng: 7.08531,
    address: "Friedrich-Hirzebruch-Allee 8, 53115, Bonn",
    sector: "robotics", size: "startup", founded: 2016,
    description: "Maren Bennewitz's lab integrating humanoid robots into human environments through perception and learning.",
    website: "https://www.hrl.uni-bonn.de"
  },
  {
    name: "Uni Freiburg — Robot Learning Lab", city: "Freiburg", state: "bw",
    lat: 48.004806, lng: 7.861815,
    address: "Jacobistraße, 79104, Freiburg im Breisgau",
    sector: "robotics", size: "startup", founded: 2019,
    description: "Abhinav Valada's lab on robot learning, perception, and navigation for autonomy at scale.",
    website: "https://rl.uni-freiburg.de"
  },
  {
    name: "TU Berlin — Learning & Intelligent Systems", city: "Berlin", state: "berlin",
    lat: 52.516629, lng: 13.323536,
    address: "Marchstraße 23, 10587, Berlin",
    sector: "robotics", size: "startup", founded: 2020,
    description: "Marc Toussaint's lab combining machine learning, optimisation, and AI reasoning for robot manipulation.",
    website: "https://argmin.lis.tu-berlin.de"
  },
  {
    name: "TUM — Robotics, AI & Real-time Systems", city: "Munich", state: "bavaria",
    lat: 48.262554, lng: 11.668043,
    address: "Boltzmannstraße 3, 85748, Garching bei München",
    sector: "robotics", size: "startup", founded: 2001,
    description: "Alois Knoll's chair on human-robot interaction, medical and cognitive robotics, and embedded systems.",
    website: "https://www.ce.cit.tum.de/air"
  },
  {
    name: "KIT — Autonomous Learning Robots", city: "Karlsruhe", state: "bw",
    lat: 49.012748, lng: 8.419027,
    sector: "robotics", size: "startup", founded: 2020,
    description: "Gerhard Neumann's chair on data-efficient machine learning for robot manipulation and assembly.",
    website: "https://alr.iar.kit.edu"
  },
  {
    name: "TU Braunschweig — Robotics and Process Control", city: "Braunschweig", state: "lower_saxony",
    lat: 52.275998, lng: 10.537681,
    address: "Hans-Sommer-Straße, 38106, Braunschweig",
    sector: "robotics", size: "startup", founded: 1986,
    description: "One of Germany's oldest robotics chairs, working on manipulation, sensor-based control, and automation.",
    website: "https://www.tu-braunschweig.de/irp"
  },
  {
    name: "RPTU — Robotics Research Lab", city: "Kaiserslautern", state: "rhineland_palatinate",
    lat: 49.425673, lng: 7.751942,
    address: "Paul-Ehrlich-Straße, 67663, Kaiserslautern",
    sector: "robotics", size: "startup", founded: 2003,
    description: "Karsten Berns's lab on complex autonomous robots, including off-road, construction, and agricultural machines.",
    website: "https://rrlab.cs.rptu.de"
  },
  {
    name: "TU Ilmenau — Neuroinformatics & Cognitive Robotics", city: "Ilmenau", state: "thuringia",
    lat: 50.681732, lng: 10.940209,
    address: "Helmholtzplatz 5, 98693, Ilmenau",
    sector: "robotics", size: "startup", founded: 2000,
    description: "Horst-Michael Gross's lab on assistive and social robots for care, rehabilitation, and retail.",
    website: "https://www.tu-ilmenau.de/neurob"
  },
  {
    name: "Uni Würzburg — Robotics and Telematics", city: "Würzburg", state: "bavaria",
    lat: 49.768832, lng: 9.941577,
    address: "Wiesenweg, 97084, Würzburg",
    sector: "robotics", size: "startup", founded: 2003,
    description: "Klaus Schilling's chair on small-satellite formations and networked autonomous robotic systems.",
    website: "https://www.informatik.uni-wuerzburg.de/robotics/"
  },
  {
    name: "Constructor University — Robotics", city: "Bremen", state: "bremen",
    lat: 53.167519, lng: 8.651119,
    address: "Campus Ring 1, 28759, Bremen",
    sector: "robotics", size: "startup", founded: 2001,
    description: "Andreas Birk's group on marine, rescue, and planetary robots operating in unstructured environments.",
    website: "https://robotics.constructor.university"
  },
  {
    name: "Uni Koblenz — Active Vision Group", city: "Koblenz", state: "rhineland_palatinate",
    lat: 50.363585, lng: 7.558308,
    address: "Universitätsstraße 1, 56070, Koblenz",
    sector: "robotics", size: "startup", founded: 2002,
    description: "Dietrich Paulus's group on active vision and autonomous mobile robots, multiple RoboCup world champions.",
    website: "https://www.uni-koblenz.de/de/informatik/icv/paulus"
  },
  {
    name: "TU Chemnitz — Robotics and Human-Machine Interaction", city: "Chemnitz", state: "saxony",
    lat: 50.815794, lng: 12.92949,
    address: "Reichenhainer Straße 70, 09126, Chemnitz",
    sector: "robotics", size: "startup", founded: 2016,
    description: "Ulrike Thomas's chair on assembly, service, and medical robotics with natural human-robot interaction.",
    website: "https://www.tu-chemnitz.de/etit/robosys"
  },
  {
    name: "Uni Magdeburg — Neuro-Information Technology", city: "Magdeburg", state: "saxony_anhalt",
    lat: 52.140571, lng: 11.639806,
    address: "Gareisstraße, 39106, Magdeburg",
    sector: "ai_ml", size: "startup", founded: 2008,
    description: "OvGU lab on image analysis, pattern recognition, and human-robot interaction for assistive systems.",
    website: "https://www.nit.ovgu.de"
  },
  {
    name: "Hochschule Bonn-Rhein-Sieg — Autonomous Systems", city: "Sankt Augustin", state: "nrw",
    lat: 50.77956, lng: 7.18217,
    address: "Grantham-Allee 20, 53757, Sankt Augustin",
    sector: "robotics", size: "startup", founded: 2002,
    description: "Home of Germany's first Autonomous Systems master and the RoboCup-winning b-it-bots robotics team.",
    website: "https://www.h-brs.de"
  },
  {
    name: "TUM — Computer Vision & AI", city: "Munich", state: "bavaria",
    lat: 48.262554, lng: 11.668043,
    address: "Boltzmannstraße 3, 85748, Garching bei München",
    sector: "ai_ml", size: "startup", founded: 2009,
    description: "Daniel Cremers's chair on visual SLAM, 3D reconstruction, deep learning, and self-driving perception.",
    website: "https://cvg.cit.tum.de"
  },
  {
    name: "Uni Tübingen — Autonomous Vision Group", city: "Tübingen", state: "bw",
    lat: 48.52495, lng: 9.05779,
    sector: "ai_ml", size: "startup", founded: 2018,
    description: "Andreas Geiger's group on computer vision and machine learning for autonomous driving (KITTI benchmark).",
    website: "https://www.cvlibs.net"
  },
  {
    name: "RWTH Aachen — Computer Vision Group", city: "Aachen", state: "nrw",
    lat: 50.791756, lng: 6.129771,
    address: "Auf der Hüls, 52080, Aachen",
    sector: "ai_ml", size: "startup", founded: 2011,
    description: "Bastian Leibe's group on visual recognition, tracking, and 3D scene understanding for robots and vehicles.",
    website: "https://www.vision.rwth-aachen.de"
  },
  {
    name: "Uni Heidelberg — Computer Vision & Learning Lab", city: "Heidelberg", state: "bw",
    lat: 49.400607, lng: 8.677045,
    address: "Czernyring, 69115, Heidelberg",
    sector: "ai_ml", size: "startup", founded: 2017,
    description: "Carsten Rother's lab on 3D computer vision and explainable machine learning at the IWR.",
    website: "https://hci.iwr.uni-heidelberg.de"
  },
  {
    name: "TU Darmstadt — Visual Inference Lab", city: "Darmstadt", state: "hesse",
    lat: 49.877509, lng: 8.654546,
    address: "Hochschulstraße 10, 64289, Darmstadt",
    sector: "ai_ml", size: "startup", founded: 2013,
    description: "Stefan Roth's lab on statistical models and deep learning for computer vision and visual inference.",
    website: "https://www.visinf.tu-darmstadt.de"
  },
  {
    name: "Uni Freiburg — Machine Learning Lab", city: "Freiburg", state: "bw",
    lat: 48.004806, lng: 7.861815,
    address: "Jacobistraße, 79104, Freiburg im Breisgau",
    sector: "ai_ml", size: "startup", founded: 2013,
    description: "Frank Hutter's lab pioneering automated machine learning (AutoML), neural architecture search, and meta-learning.",
    website: "https://ml.informatik.uni-freiburg.de"
  },
  {
    name: "Uni Bonn — Computer Vision Group", city: "Bonn", state: "nrw",
    lat: 50.727452, lng: 7.08531,
    address: "Friedrich-Hirzebruch-Allee 8, 53115, Bonn",
    sector: "ai_ml", size: "startup", founded: 2013,
    description: "Jürgen Gall's group on action recognition, video understanding, and human pose estimation.",
    website: "https://pages.iai.uni-bonn.de/gall_juergen/"
  },
  {
    name: "Uni Hamburg — TAMS", city: "Hamburg", state: "hamburg",
    lat: 53.590905, lng: 9.975376,
    sector: "robotics", size: "startup", founded: 2002,
    description: "Jianwei Zhang's group on multimodal robot perception, grasping, manipulation, and service robots.",
    website: "https://tams.informatik.uni-hamburg.de"
  },
  {
    name: "Bielefeld University — Neuroinformatics", city: "Bielefeld", state: "nrw",
    lat: 52.044462, lng: 8.492716,
    address: "Interaktion 1, 33619, Bielefeld",
    sector: "robotics", size: "startup", founded: 1993,
    description: "Helge Ritter's group on neural networks, cognitive robotics, and manual intelligence.",
    website: "https://www.uni-bielefeld.de/fakultaeten/technische-fakultaet/forschung/ag-ueberblick/neuroinformatik/"
  },
  {
    name: "Leibniz Uni Hannover — TNT", city: "Hannover", state: "lower_saxony",
    lat: 52.382554, lng: 9.701162,
    address: "Pannenflickergang, 30167, Hannover",
    sector: "ai_ml", size: "startup", founded: 1973,
    description: "Institute for Information Processing under Bodo Rosenhahn — computer vision, representation learning, and AutoML.",
    website: "https://www.tnt.uni-hannover.de"
  },
  {
    name: "Uni Mannheim — Artificial Intelligence", city: "Mannheim", state: "bw",
    lat: 49.487735, lng: 8.458048,
    address: "B6 26, 68159 Mannheim",
    sector: "ai_ml", size: "startup", founded: 2008,
    description: "Heiner Stuckenschmidt's AI group at Mannheim's Data and Web Science Group — NLP, reasoning, and trustworthy AI.",
    website: "https://www.uni-mannheim.de/dws"
  },
  {
    name: "Uni Osnabrück — Cognitive Science", city: "Osnabrück", state: "lower_saxony",
    lat: 52.270377, lng: 8.041673,
    address: "Schloßwall, 49074, Osnabrück",
    sector: "ai_ml", size: "startup", founded: 2001,
    description: "Interdisciplinary institute bridging AI, neuroscience, and cognition — one of Germany's first such programs.",
    website: "https://www.uni-osnabrueck.de/fb8/ikw"
  },
  {
    name: "Uni Ulm — Measurement, Control & Microtechnology", city: "Ulm", state: "bw",
    lat: 48.420886, lng: 9.947939,
    address: "Albert-Einstein-Allee 41, 89081, Ulm",
    sector: "automotive", size: "startup", founded: 2000,
    description: "Klaus Dietmayer's institute on perception, sensor fusion, and behaviour planning for automated driving.",
    website: "https://www.uni-ulm.de/in/mrm"
  },
  {
    name: "OFFIS", city: "Oldenburg", state: "lower_saxony",
    lat: 53.148745, lng: 8.200255,
    address: "Escherweg 2, 26121, Oldenburg",
    sector: "software", size: "mid", founded: 1991,
    description: "Independent applied-IT institute working on AI, embedded systems, and digitalisation for energy, health, and mobility.",
    website: "https://www.offis.de"
  },
  {
    name: "Heinz Nixdorf Institut", city: "Paderborn", state: "nrw",
    lat: 51.73175, lng: 8.734716,
    address: "Fürstenallee 11, 33102, Paderborn",
    sector: "robotics", size: "mid", founded: 1987,
    description: "Paderborn University's interdisciplinary research center for intelligent technical systems and robotics.",
    website: "https://www.hni.uni-paderborn.de"
  },
];
