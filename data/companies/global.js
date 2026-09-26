// Companies sized "global" (5000+ employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_GLOBAL = [

  // ── ROBOTICS ──────────────────────────────────────────────────────────────
  {
    name: "KUKA", city: "Augsburg", state: "bavaria",
    lat: 48.369389, lng: 10.936262,
    sector: "robotics", size: "global", founded: 1898,
    description: "Global leader in industrial robot arms and automated production systems.",
    website: "https://www.kuka.com"
  },
  {
    name: "Festo", city: "Esslingen", state: "bw",
    lat: 48.722513, lng: 9.307354,
    address: "Festo Campus 1, 73734, Esslingen am Neckar",
    sector: "robotics", size: "global", founded: 1925,
    description: "Pneumatic and electric automation technology; known for bionic robot research.",
    website: "https://www.festo.com"
  },

  // ── AUTOMOTIVE ────────────────────────────────────────────────────────────
  {
    name: "Volkswagen Group", city: "Wolfsburg", state: "lower_saxony",
    lat: 52.438935, lng: 10.764627,
    address: "Berliner Ring 2, 38440, Wolfsburg",
    sector: "automotive", size: "global", founded: 1937,
    description: "World's largest automaker by volume, investing in autonomous vehicles and smart factories.",
    website: "https://www.volkswagen-group.com"
  },
  {
    name: "Mercedes-Benz", city: "Stuttgart", state: "bw",
    lat: 48.779656, lng: 9.227374,
    address: "Nähterstraße, 70327, Stuttgart",
    sector: "automotive", size: "global", founded: 1926,
    description: "Luxury vehicle manufacturer leading in autonomous driving and electrification.",
    website: "https://www.mercedes-benz.com"
  },
  {
    name: "BMW Group", city: "Munich", state: "bavaria",
    lat: 48.188904, lng: 11.579248,
    address: "Taunusstraße, 80807, München",
    sector: "automotive", size: "global", founded: 1916,
    description: "Premium automaker integrating advanced robotics and AI into production lines.",
    website: "https://www.bmwgroup.com"
  },
  {
    name: "Robert Bosch", city: "Gerlingen", state: "bw",
    lat: 48.785354, lng: 9.062093,
    sector: "automotive", size: "global", founded: 1886,
    description: "Global mobility and IoT solutions leader with one of Germany's largest R&D budgets.",
    website: "https://www.bosch.com"
  },
  {
    name: "Continental", city: "Hannover", state: "lower_saxony",
    lat: 52.387188, lng: 9.732617,
    sector: "automotive", size: "global", founded: 1871,
    description: "Major automotive supplier developing sensor systems, software, and ADAS technologies.",
    website: "https://www.continental.com"
  },
  {
    name: "ZF Friedrichshafen", city: "Friedrichshafen", state: "bw",
    lat: 47.656211, lng: 9.485092,
    sector: "automotive", size: "global", founded: 1915,
    description: "Driveline, chassis, and autonomous driving solutions for global vehicle manufacturers.",
    website: "https://www.zf.com"
  },
  {
    name: "Audi", city: "Ingolstadt", state: "bavaria",
    lat: 48.790821, lng: 11.410566,
    address: "Am KWK-Kraftwerk, 85057, Ingolstadt",
    sector: "automotive", size: "global", founded: 1909,
    description: "Premium automaker (VW Group) pioneering autonomous driving and connected platforms.",
    website: "https://www.audi.com"
  },
  {
    name: "Porsche", city: "Stuttgart", state: "bw",
    lat: 48.834299, lng: 9.152447,
    address: "Porscheplatz 5, 70435, Stuttgart",
    sector: "automotive", size: "global", founded: 1931,
    description: "Sports-car manufacturer investing heavily in electrification, software, and automated production.",
    website: "https://www.porsche.com"
  },
  {
    name: "Schaeffler", city: "Herzogenaurach", state: "bavaria",
    lat: 49.56273, lng: 10.887813,
    sector: "automotive", size: "global", founded: 1946,
    description: "Motion-technology supplier of bearings, precision components, and e-mobility drive systems.",
    website: "https://www.schaeffler.com"
  },
  {
    name: "Brose", city: "Coburg", state: "bavaria",
    lat: 50.246707, lng: 10.966517,
    sector: "automotive", size: "global", founded: 1908,
    description: "Family-owned supplier of mechatronic systems for vehicle doors, seats, and electric drives.",
    website: "https://www.brose.com"
  },
  {
    name: "Mahle", city: "Stuttgart", state: "bw",
    lat: 48.807599, lng: 9.207922,
    sector: "automotive", size: "global", founded: 1920,
    description: "Automotive supplier of powertrain, thermal management, and e-mobility components.",
    website: "https://www.mahle.com"
  },
  {
    name: "Webasto", city: "Stockdorf", state: "bavaria",
    lat: 48.091693, lng: 11.411027,
    address: "Kraillinger Straße 8, 82131, Gauting",
    sector: "automotive", size: "global", founded: 1901,
    description: "Supplier of roof systems, thermal solutions, and EV charging and battery systems.",
    website: "https://www.webasto-group.com"
  },
  {
    name: "HELLA", city: "Lippstadt", state: "nrw",
    lat: 51.673173, lng: 8.360754,
    address: "Lüningstraße 12, 59557, Lippstadt",
    sector: "automotive", size: "global", founded: 1899,
    description: "Lighting and electronics specialist for the automotive industry (part of FORVIA).",
    website: "https://www.hella.com"
  },
  {
    name: "Knorr-Bremse", city: "Munich", state: "bavaria",
    lat: 48.187772, lng: 11.548468,
    address: "Moosacher Straße 80, 80809, München",
    sector: "automotive", size: "global", founded: 1905,
    description: "World market leader in braking systems for rail and commercial vehicles.",
    website: "https://www.knorr-bremse.com"
  },
  {
    name: "MAN Truck & Bus", city: "Munich", state: "bavaria",
    lat: 48.215032, lng: 11.471347,
    sector: "automotive", size: "global", founded: 1758,
    description: "Manufacturer of trucks, buses, and transport solutions (TRATON / Volkswagen).",
    website: "https://www.man.eu"
  },

  // ── INDUSTRIAL ────────────────────────────────────────────────────────────
  {
    name: "Siemens", city: "Munich", state: "bavaria",
    lat: 48.190522, lng: 11.471076,
    sector: "industrial", size: "global", founded: 1847,
    description: "Global leader in industrial automation, digital twins, and smart infrastructure.",
    website: "https://www.siemens.com"
  },
  {
    name: "Dürr", city: "Bietigheim-Bissingen", state: "bw",
    lat: 48.941299, lng: 9.125128,
    address: "Zeppelinstraße 40, 74321, Bietigheim-Bissingen",
    sector: "industrial", size: "global", founded: 1896,
    description: "Plant engineering specialist for automotive production and environmental technology.",
    website: "https://www.durr.com"
  },
  {
    name: "Phoenix Contact", city: "Blomberg", state: "nrw",
    lat: 51.934899, lng: 9.100467,
    address: "Königswinkel 10, 32825, Blomberg",
    sector: "industrial", size: "global", founded: 1923,
    description: "Global market leader in electrical connection technology for industrial automation.",
    website: "https://www.phoenixcontact.com"
  },
  {
    name: "TRUMPF", city: "Ditzingen", state: "bw",
    lat: 48.820071, lng: 9.065905,
    address: "Dornierstraße 33, 71254, Ditzingen",
    sector: "industrial", size: "global", founded: 1923,
    description: "World leader in machine tools and industrial lasers, pioneering smart-factory connectivity.",
    website: "https://www.trumpf.com"
  },
  {
    name: "SICK AG", city: "Waldkirch", state: "bw",
    lat: 48.087353, lng: 7.949214,
    sector: "industrial", size: "global", founded: 1946,
    description: "Sensor-intelligence company whose LiDAR, vision, and safety sensors underpin factory automation.",
    website: "https://www.sick.com"
  },
  {
    name: "SEW-EURODRIVE", city: "Bruchsal", state: "bw",
    lat: 49.121679, lng: 8.57863,
    address: "Ernst-Blickle-Straße 42, 76646, Bruchsal",
    sector: "industrial", size: "global", founded: 1931,
    description: "Global manufacturer of drive technology — motors, gearmotors, and automation for conveyors.",
    website: "https://www.sew-eurodrive.de"
  },
  {
    name: "KION Group", city: "Frankfurt", state: "hesse",
    lat: 50.055813, lng: 8.588516,
    address: "Thea-Rasche-Straße 8, 60549, Frankfurt am Main",
    sector: "industrial", size: "global", founded: 2006,
    description: "Intralogistics leader in forklifts and warehouse automation (Linde, STILL, Dematic).",
    website: "https://www.kiongroup.com"
  },
  {
    name: "Jungheinrich", city: "Hamburg", state: "hamburg",
    lat: 53.589185, lng: 10.096462,
    address: "Friedrich-Ebert-Damm 129, 22047, Hamburg",
    sector: "industrial", size: "global", founded: 1953,
    description: "Intralogistics group for forklifts, automated warehouses, and material handling.",
    website: "https://www.jungheinrich.com"
  },
  {
    name: "Krones", city: "Neutraubling", state: "bavaria",
    lat: 48.987747, lng: 12.191025,
    sector: "industrial", size: "global", founded: 1951,
    description: "Lines and machines for filling and packaging beverages and liquid foods.",
    website: "https://www.krones.com"
  },
  {
    name: "Endress+Hauser", city: "Weil am Rhein", state: "bw",
    lat: 47.591325, lng: 7.594036,
    address: "Colmarer Straße, 79576, Weil am Rhein",
    sector: "industrial", size: "global", founded: 1953,
    description: "Process-automation instrumentation for measurement, analytics, and monitoring.",
    website: "https://www.endress.com"
  },
  {
    name: "Kärcher", city: "Winnenden", state: "bw",
    lat: 48.879443, lng: 9.396571,
    address: "Friedrichstraße 21, 71364, Winnenden",
    sector: "industrial", size: "global", founded: 1935,
    description: "Cleaning-equipment leader expanding into autonomous cleaning robots.",
    website: "https://www.kaercher.com"
  },

  // ── SOFTWARE & TECH ───────────────────────────────────────────────────────
  {
    name: "SAP", city: "Walldorf", state: "bw",
    lat: 49.293866, lng: 8.640555,
    address: "Hasso-Plattner-Ring 7, 69190, Walldorf",
    sector: "software", size: "global", founded: 1972,
    description: "World's largest enterprise software company — ERP, supply chain, and AI business applications.",
    website: "https://www.sap.com"
  },
  {
    name: "Software AG", city: "Darmstadt", state: "hesse",
    lat: 49.815125, lng: 8.634684,
    address: "Uhlandstraße 9, 64297, Darmstadt",
    sector: "software", size: "global", founded: 1969,
    description: "Enterprise IoT platform, API management, and business process automation software.",
    website: "https://www.softwareag.com"
  },
  {
    name: "Nemetschek", city: "Munich", state: "bavaria",
    lat: 48.136456, lng: 11.688131,
    address: "Konrad-Zuse-Platz 1, 81829, München",
    sector: "software", size: "global", founded: 1963,
    description: "Software group for architecture, engineering, construction, and media (AEC/CAD).",
    website: "https://www.nemetschek.com"
  },
  {
    name: "IONOS", city: "Montabaur", state: "rhineland_palatinate",
    lat: 50.435606, lng: 7.812251,
    address: "Elgendorfer Straße 57, 56410, Montabaur",
    sector: "software", size: "global", founded: 1988,
    description: "One of Europe's largest web-hosting and cloud providers for SMEs.",
    website: "https://www.ionos.com"
  },

  // ── AEROSPACE & DEFENSE ───────────────────────────────────────────────────
  {
    name: "Airbus", city: "Hamburg", state: "hamburg",
    lat: 53.618726, lng: 9.995376,
    sector: "defense", size: "global", founded: 1970,
    description: "Europe's largest aerospace manufacturer with major Hamburg production lines and avionics R&D.",
    website: "https://www.airbus.com"
  },
  {
    name: "Rheinmetall", city: "Düsseldorf", state: "nrw",
    lat: 51.251699, lng: 6.783494,
    address: "Rheinmetall-Allee, 40476, Düsseldorf",
    sector: "defense", size: "global", founded: 1889,
    description: "Germany's largest defense company, expanding into autonomous systems and drone technology.",
    website: "https://www.rheinmetall.com"
  },
  {
    name: "MTU Aero Engines", city: "Munich", state: "bavaria",
    lat: 48.213045, lng: 11.477786,
    sector: "defense", size: "global", founded: 1934,
    description: "Germany's leading aircraft engine manufacturer for civil and military aviation.",
    website: "https://www.mtu.de"
  },
  {
    name: "HENSOLDT", city: "Taufkirchen", state: "bavaria",
    lat: 48.047329, lng: 11.657264,
    address: "Willy-Messerschmitt-Straße 3, 82024, Taufkirchen",
    sector: "defense", size: "global", founded: 2017,
    description: "Sensor-solutions house for defense and security — radar, optronics, and electronic warfare.",
    website: "https://www.hensoldt.net"
  },

  // ── AGRICULTURE ───────────────────────────────────────────────────────────
  {
    name: "CLAAS", city: "Harsewinkel", state: "nrw",
    lat: 51.98719, lng: 8.19371,
    address: "Tecklenburger Weg, 33428, Harsewinkel",
    sector: "agriculture", size: "global", founded: 1913,
    description: "Europe's leading harvesting machinery manufacturer — combines, forage harvesters, precision farming.",
    website: "https://www.claas.com"
  },
  {
    name: "Fendt", city: "Marktoberdorf", state: "bavaria",
    lat: 47.783732, lng: 10.610512,
    sector: "agriculture", size: "global", founded: 1930,
    description: "Premium tractor brand (AGCO) developing autonomous field robots and electric drivetrains.",
    website: "https://www.fendt.com"
  },
  {
    name: "STIHL", city: "Waiblingen", state: "bw",
    lat: 48.855714, lng: 9.334291,
    address: "Schärisweg, 71336, Waiblingen",
    sector: "agriculture", size: "global", founded: 1926,
    description: "Outdoor power equipment and robotic mowers for forestry, farming, and gardens.",
    website: "https://www.stihl.com"
  },
  {
    name: "BayWa", city: "Munich", state: "bavaria",
    lat: 48.136065, lng: 11.660277,
    address: "Martin-Kollar-Straße 8, 81829, München",
    sector: "agriculture", size: "global", founded: 1923,
    description: "Agricultural trade, machinery, and digital farming services group.",
    website: "https://www.baywa.com"
  },

  // ── AUTOMOTIVE (added 2026-06) ─────────────────────────────────────────────
  {
    name: "MANN+HUMMEL", city: "Ludwigsburg", state: "bw",
    lat: 48.893277, lng: 9.165125,
    address: "Groenerstraße 50, 71636, Ludwigsburg",
    sector: "automotive", size: "global", founded: 1941,
    description: "Global filtration specialist making air, oil, and fuel filters plus clean-air and water-filtration systems.",
    website: "https://www.mann-hummel.com"
  },
  {
    name: "Eberspächer", city: "Esslingen", state: "bw",
    lat: 48.730322, lng: 9.32322,
    address: "Eberspächerstraße, 73730, Esslingen am Neckar",
    sector: "automotive", size: "global", founded: 1865,
    description: "Supplier of vehicle thermal-management, exhaust-after-treatment, and electric-heating systems.",
    website: "https://www.eberspaecher.com"
  },
  {
    name: "DRÄXLMAIER Group", city: "Vilsbiburg", state: "bavaria",
    lat: 48.454752, lng: 12.338863,
    sector: "automotive", size: "global", founded: 1958,
    description: "Maker of wiring harnesses, electrical systems, interiors, and high-voltage EV battery systems for premium cars.",
    website: "https://www.draexlmaier.com"
  },
  {
    name: "KOSTAL Group", city: "Lüdenscheid", state: "nrw",
    lat: 51.233121, lng: 7.664706,
    address: "An der Bellmerei 10, 58513, Lüdenscheid",
    sector: "automotive", size: "global", founded: 1912,
    description: "Family supplier of automotive electronics, connectors, and power electronics for electric vehicles.",
    website: "https://www.kostal.com"
  },
  {
    name: "EDAG Engineering", city: "Wiesbaden", state: "hesse",
    lat: 50.053479, lng: 8.28982,
    address: "Kreuzberger Ring 40, 65205, Wiesbaden",
    sector: "automotive", size: "global", founded: 1969,
    description: "Independent engineering services provider designing vehicles, factories, and production lines for carmakers.",
    website: "https://www.edag.com"
  },
  // ── INDUSTRIAL (added 2026-06) ─────────────────────────────────────────────
  {
    name: "ZEISS", city: "Oberkochen", state: "bw",
    lat: 48.781858, lng: 10.099533,
    sector: "industrial", size: "global", founded: 1846,
    description: "Optics group making industrial metrology, microscopy, medical, and semiconductor-lithography systems.",
    website: "https://www.zeiss.com"
  },
  {
    name: "Sartorius", city: "Göttingen", state: "lower_saxony",
    lat: 51.55214, lng: 9.887149,
    sector: "industrial", size: "global", founded: 1870,
    description: "Supplier of laboratory and bioprocess equipment for pharmaceutical and biotech research and production.",
    website: "https://www.sartorius.com"
  },
  {
    name: "GEA Group", city: "Düsseldorf", state: "nrw",
    lat: 51.275465, lng: 6.770903,
    address: "Peter-Müller-Straße 12, 40468, Düsseldorf",
    sector: "industrial", size: "global", founded: 1881,
    description: "Process-engineering group building machinery and plants for food, beverage, and pharmaceutical production.",
    website: "https://www.gea.com"
  },
  {
    name: "Pepperl+Fuchs", city: "Mannheim", state: "bw",
    lat: 49.545276, lng: 8.4669,
    sector: "industrial", size: "global", founded: 1945,
    description: "Manufacturer of industrial sensors and explosion-protection technology for factory and process automation.",
    website: "https://www.pepperl-fuchs.com"
  },
  {
    name: "ifm electronic", city: "Essen", state: "nrw",
    lat: 51.476321, lng: 6.993726,
    address: "Bamlerstraße 55, 45141, Essen",
    sector: "industrial", size: "global", founded: 1969,
    description: "Family maker of sensors and controls for automation, with a focus on Industry 4.0 and IO-Link.",
    website: "https://www.ifm.com"
  },
  // ── SOFTWARE (added 2026-06) ───────────────────────────────────────────────
  {
    name: "DATEV", city: "Nuremberg", state: "bavaria",
    lat: 49.453249, lng: 11.04621,
    address: "Fürther Straße 111, 90429, Nürnberg",
    sector: "software", size: "global", founded: 1966,
    description: "Cooperative software house for tax, accounting, and ERP used by most German tax advisors.",
    website: "https://www.datev.com"
  },
  {
    name: "CompuGroup Medical", city: "Koblenz", state: "rhineland_palatinate",
    lat: 50.388325, lng: 7.577063,
    sector: "software", size: "global", founded: 1987,
    description: "Health information systems for doctors, pharmacies, hospitals, and laboratories.",
    website: "https://www.cgm.com"
  },
  {
    name: "GFT Technologies", city: "Stuttgart", state: "bw",
    lat: 48.707936, lng: 9.169384,
    address: "Schelmenwasenstraße 34, 70567, Stuttgart",
    sector: "software", size: "global", founded: 1987,
    description: "IT and software engineering services for banking, insurance, and industry.",
    website: "https://www.gft.com"
  },
  {
    name: "Deutsche Telekom", city: "Bonn", state: "nrw",
    lat: 50.708112, lng: 7.1249,
    address: "Nahum-Goldmann-Allee, 53113, Bonn",
    sector: "software", size: "global", founded: 1995,
    description: "Europe's largest telecoms group and a major provider of IT, cloud, and connectivity services through T-Systems.",
    website: "https://www.telekom.com"
  },
  {
    name: "msg systems", city: "Ismaning", state: "bavaria",
    lat: 48.228665, lng: 11.685965,
    address: "Robert-Bürkle-Straße 1, 85737, Ismaning",
    sector: "software", size: "global", founded: 1980,
    description: "IT consultancy and industry software group serving insurance, banking, automotive, and the public sector.",
    website: "https://www.msg.group"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "ThyssenKrupp Marine Systems", city: "Kiel", state: "schleswig_holstein",
    lat: 54.320804, lng: 10.150042,
    address: "Werftstraße 112-114, 24143, Kiel",
    sector: "defense", size: "global", founded: 2005,
    description: "Builder of conventional submarines and naval surface ships; a leading exporter of non-nuclear submarines.",
    website: "https://www.tkmsgroup.com"
  },
  // ── AGRICULTURE (added 2026-06) ────────────────────────────────────────────
  {
    name: "AGRAVIS Raiffeisen", city: "Münster", state: "nrw",
    lat: 51.939665, lng: 7.634577,
    address: "Industrieweg 110, 48155, Münster",
    sector: "agriculture", size: "global", founded: 2004,
    description: "Agribusiness cooperative trading animal feed, fertiliser, grain, and farm machinery across northern Germany.",
    website: "https://www.agravis.de"
  },

  // ── REGIONAL COVERAGE (added 2026-09) ──────────────────────────────────────
  {
    name: "Drägerwerk", city: "Lübeck", state: "schleswig_holstein",
    lat: 53.857953, lng: 10.670942,
    address: "Moislinger Allee 53-55, 23558, Lübeck",
    sector: "industrial", size: "global", founded: 1889,
    description: "Builds ventilators, anaesthesia machines, and gas-detection and firefighting equipment for hospitals and industry.",
    website: "https://www.draeger.com"
  },
  {
    name: "Schott", city: "Mainz", state: "rhineland_palatinate",
    lat: 50.016296, lng: 8.246865,
    address: "Hattenbergstraße 10, 55122, Mainz",
    sector: "industrial", size: "global", founded: 1884,
    description: "Specialty-glass maker supplying optics, semiconductor, pharmaceutical-packaging, and display industries.",
    website: "https://www.schott.com"
  },
];
