// Companies sized "global" (5000+ employees). One slice of the size-split company dataset; the
// per-size files are merged back into the COMPANIES array by data/companies/index.js,
// which also documents the shared schema. To add one: copy an entry below.

const COMPANIES_GLOBAL = [

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

  // ── INDUSTRIAL ────────────────────────────────────────────────────────────
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
  {
    name: "HENSOLDT", city: "Taufkirchen", state: "bavaria",
    lat: 48.0400, lng: 11.6100,
    sector: "defense", size: "global", founded: 2017,
    description: "Sensor-solutions house for defense and security — radar, optronics, and electronic warfare.",
    website: "https://www.hensoldt.net"
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
    name: "Fendt", city: "Marktoberdorf", state: "bavaria",
    lat: 47.7800, lng: 10.6200,
    sector: "agriculture", size: "global", founded: 1930,
    description: "Premium tractor brand (AGCO) developing autonomous field robots and electric drivetrains.",
    website: "https://www.fendt.com"
  },
  {
    name: "STIHL", city: "Waiblingen", state: "bw",
    lat: 48.8300, lng: 9.3200,
    sector: "agriculture", size: "global", founded: 1926,
    description: "Outdoor power equipment and robotic mowers for forestry, farming, and gardens.",
    website: "https://www.stihl.com"
  },
  {
    name: "BayWa", city: "Munich", state: "bavaria",
    lat: 48.1500, lng: 11.5900,
    sector: "agriculture", size: "global", founded: 1923,
    description: "Agricultural trade, machinery, and digital farming services group.",
    website: "https://www.baywa.com"
  },

  // ── AUTOMOTIVE (added 2026-06) ─────────────────────────────────────────────
  {
    name: "MANN+HUMMEL", city: "Ludwigsburg", state: "bw",
    lat: 48.897, lng: 9.192,
    sector: "automotive", size: "global", founded: 1941,
    description: "Global filtration specialist making air, oil, and fuel filters plus clean-air and water-filtration systems.",
    website: "https://www.mann-hummel.com"
  },
  {
    name: "Eberspächer", city: "Esslingen", state: "bw",
    lat: 48.735, lng: 9.3,
    sector: "automotive", size: "global", founded: 1865,
    description: "Supplier of vehicle thermal-management, exhaust-after-treatment, and electric-heating systems.",
    website: "https://www.eberspaecher.com"
  },
  {
    name: "DRÄXLMAIER Group", city: "Vilsbiburg", state: "bavaria",
    lat: 48.45, lng: 12.35,
    sector: "automotive", size: "global", founded: 1958,
    description: "Maker of wiring harnesses, electrical systems, interiors, and high-voltage EV battery systems for premium cars.",
    website: "https://www.draexlmaier.com"
  },
  {
    name: "KOSTAL Group", city: "Lüdenscheid", state: "nrw",
    lat: 51.22, lng: 7.63,
    sector: "automotive", size: "global", founded: 1912,
    description: "Family supplier of automotive electronics, connectors, and power electronics for electric vehicles.",
    website: "https://www.kostal.com"
  },
  {
    name: "EDAG Engineering", city: "Wiesbaden", state: "hesse",
    lat: 50.083, lng: 8.24,
    sector: "automotive", size: "global", founded: 1969,
    description: "Independent engineering services provider designing vehicles, factories, and production lines for carmakers.",
    website: "https://www.edag.com"
  },
  // ── INDUSTRIAL (added 2026-06) ─────────────────────────────────────────────
  {
    name: "ZEISS", city: "Oberkochen", state: "bw",
    lat: 48.78, lng: 10.1,
    sector: "industrial", size: "global", founded: 1846,
    description: "Optics group making industrial metrology, microscopy, medical, and semiconductor-lithography systems.",
    website: "https://www.zeiss.com"
  },
  {
    name: "Sartorius", city: "Göttingen", state: "lower_saxony",
    lat: 51.56, lng: 9.94,
    sector: "industrial", size: "global", founded: 1870,
    description: "Supplier of laboratory and bioprocess equipment for pharmaceutical and biotech research and production.",
    website: "https://www.sartorius.com"
  },
  {
    name: "GEA Group", city: "Düsseldorf", state: "nrw",
    lat: 51.228, lng: 6.78,
    sector: "industrial", size: "global", founded: 1881,
    description: "Process-engineering group building machinery and plants for food, beverage, and pharmaceutical production.",
    website: "https://www.gea.com"
  },
  {
    name: "Pepperl+Fuchs", city: "Mannheim", state: "bw",
    lat: 49.487, lng: 8.466,
    sector: "industrial", size: "global", founded: 1945,
    description: "Manufacturer of industrial sensors and explosion-protection technology for factory and process automation.",
    website: "https://www.pepperl-fuchs.com"
  },
  {
    name: "ifm electronic", city: "Essen", state: "nrw",
    lat: 51.456, lng: 7.012,
    sector: "industrial", size: "global", founded: 1969,
    description: "Family maker of sensors and controls for automation, with a focus on Industry 4.0 and IO-Link.",
    website: "https://www.ifm.com"
  },
  // ── SOFTWARE (added 2026-06) ───────────────────────────────────────────────
  {
    name: "DATEV", city: "Nuremberg", state: "bavaria",
    lat: 49.447, lng: 11.062,
    sector: "software", size: "global", founded: 1966,
    description: "Cooperative software house for tax, accounting, and ERP used by most German tax advisors.",
    website: "https://www.datev.com"
  },
  {
    name: "CompuGroup Medical", city: "Koblenz", state: "rhineland_palatinate",
    lat: 50.353, lng: 7.581,
    sector: "software", size: "global", founded: 1987,
    description: "Health information systems for doctors, pharmacies, hospitals, and laboratories.",
    website: "https://www.cgm.com"
  },
  {
    name: "GFT Technologies", city: "Stuttgart", state: "bw",
    lat: 48.745, lng: 9.166,
    sector: "software", size: "global", founded: 1987,
    description: "IT and software engineering services for banking, insurance, and industry.",
    website: "https://www.gft.com"
  },
  {
    name: "Deutsche Telekom", city: "Bonn", state: "nrw",
    lat: 50.717, lng: 7.125,
    sector: "software", size: "global", founded: 1995,
    description: "Europe's largest telecoms group and a major provider of IT, cloud, and connectivity services through T-Systems.",
    website: "https://www.telekom.com"
  },
  {
    name: "msg systems", city: "Ismaning", state: "bavaria",
    lat: 48.225, lng: 11.675,
    sector: "software", size: "global", founded: 1980,
    description: "IT consultancy and industry software group serving insurance, banking, automotive, and the public sector.",
    website: "https://www.msg.group"
  },
  // ── DEFENSE (added 2026-06) ────────────────────────────────────────────────
  {
    name: "ThyssenKrupp Marine Systems", city: "Kiel", state: "schleswig_holstein",
    lat: 54.334, lng: 10.16,
    sector: "defense", size: "global", founded: 2005,
    description: "Builder of conventional submarines and naval surface ships; a leading exporter of non-nuclear submarines.",
    website: "https://www.tkmsgroup.com"
  },
  // ── AGRICULTURE (added 2026-06) ────────────────────────────────────────────
  {
    name: "AGRAVIS Raiffeisen", city: "Münster", state: "nrw",
    lat: 51.961, lng: 7.626,
    sector: "agriculture", size: "global", founded: 2004,
    description: "Agribusiness cooperative trading animal feed, fertiliser, grain, and farm machinery across northern Germany.",
    website: "https://www.agravis.de"
  },
];
