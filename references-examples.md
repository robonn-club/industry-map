# company map references

* [25 Maps of Silicon Valley and Other Tech Hubs](https://www.davidrumsey.com/blog/2021/1/2/25-maps-of-silicon-valley-and-other-tech-hubs):
  the David Rumsey Map Collection's tour of illustrated tech-region maps from 1945 to 2021:
  bird's-eye views crowded with company buildings and adverts, Kirby Scudder's Steinberg-style
  panorama (1986), Boston's Route 128, Austin's "Silicon Hills". It is the history of the company
  map as illustration, and it carries a warning: publishers sold the placements, so some firms
  were left out and others over-emphasised.
* [The City from the Valley](https://stamen.com/work/the-city-from-the-valley/): Stamen's 2012
  subway-style diagram of the shuttle buses that Google, Apple, Facebook and others run through
  San Francisco, with line width showing the number of trips. It draws companies as a network of
  connections instead of as dots.
* [Web Trend Map](https://randomwire.com/web-trends-map-2007/): Information Architects put the
  most influential websites on the Tokyo Metro map (2007–2008), one line per category and station
  size for success. With lines as categories, an interchange becomes a way to show a company that
  sits in two sectors at once.
* [KI-Landkarte](https://www.plattform-lernende-systeme.de/ki-landkarte.html): Germany's AI map
  from Plattform Lernende Systeme, and the closest German precedent for ours. It has five layers
  (applications, research institutions, transfer centres, study programmes, public computing),
  each with a map/list switch, so every layer answers one question instead of putting all the
  dots in one pile. One research filter is *Robotik & autonome Systeme*, and new entries come
  through curated online forms.
* [Swiss Robotics ecosystem map](https://swiss-robotics.org/robotics-ecosystem-map/): 325 Swiss
  organisations (research groups, large companies, SMEs, funders and infrastructure), filtered by
  robotics field, canton and organisation type. These correspond to our sector, Bundesland and
  Type filters, which makes it the closest robotics precedent. It also lists the funders around
  the companies, a kind of entry we don't have yet.
* [The microelectronics value chain in Saxony](https://silicon-saxony.de/en/the-microelectronics-value-chain-in-saxony):
  Silicon Saxony's member map. Hovering a step of the value chain (materials, equipment, chip
  design, wafers, masks, front-end, back-end) colours the companies in that step, so you see how
  an industry fits together, not only where it sits. The same interaction would work for
  agriculture, energy and logistics chains.
* [KI.NRW KI-Landkarte](https://www.ki.nrw/ki-landkarte/): the AI map of North Rhine-Westphalia,
  our home state, covering companies and research projects, with an "Eintrag beisteuern" form.
  It shows that a regional map can sit alongside a national one, and it is a source for NRW
  entries we're missing.
* [MassRobotics Robotics Ecosystem Map](https://www.massrobotics.org/robotics-ecosystem-map/):
  500+ Massachusetts companies across 11 markets on one zoomable map, kept current through
  updates emailed to the cluster's team. It is the contrast case to our open, pull-request-based
  upkeep.
* [Startup Map Berlin](https://startup-map.berlin/):
  the city's official startup map, a Senate initiative powered by Dealroom ([Munich Startup](https://www.munich-startup.de/)
  is Munich's equivalent). Startups list themselves for free, which grows coverage fast. It also
  maps accelerators, incubators, investors and public funders, so a founder finds support as well
  as peers.
* [GERiT](https://www.gerit.org/): the DFG, HRK and DAAD directory of 34,500 German research
  institutions, which at launch could show its results as a list or on a map. It is the
  authoritative register for checking and extending our labs.
* [Cloud Native Landscape](https://landscape.cncf.io/): CNCF's open landscape of cloud projects.
  It is generated as a static site by [landscape2](https://github.com/cncf/landscape2) from YAML
  files that change by pull request, with filters, detail cards and URLs that keep the filter
  state. It is the closest match to how our map is built and maintained (data files, PRs, CI).
* [MAD Landscape 2025](https://firstmark.com/story/bubble-build-the-2025-mad-machine-learning-ai-data-landscape/):
  FirstMark's machine-learning, AI and data landscape. This edition cut 2,000+ logos down to about
  1,150 to give the big players room, and it reads as a flow from data to infrastructure to
  models to applications. One dataset feeds both a high-resolution poster PDF and a searchable
  [interactive version](https://mad.firstmark.com/).
* [German AI Startup Landscape 2025](https://www.appliedai-institute.de/en/hub/2025-ai-german-startup-landscape):
  appliedAI's logo map of 935 German AI startups in four clusters, with a full table, search and a
  poster PDF on the same page. Its inclusion rules are published (registered, headquartered in
  Germany, under ten years old, at least two full-time staff), much like our three-year rule for
  new startups.
* [Humanoid robots market map](https://www.cbinsights.com/research/humanoid-robots-market-map/):
  CB Insights groups 61 humanoid companies by the 8 use cases they serve, not by how they
  describe themselves. It is our "sectors are domains" decision applied to a market map.
* [LatAm Agrifoodtech Market Map](https://agfundernews.com/latam-agrifoodtech-market-map-from-seed-to-consumer):
  AgFunder's pick of 78 startups from over a thousand, laid out along the food chain from farm
  inputs to the consumer. It shows how to organise agriculture by step in the chain rather than
  by technology.
* [Weltmarktführer](https://web.archive.org/web/20251018080312/https://nationalatlas.de/wp-content/uploads/11_11_Weltmarktfuehrer.pdf):
  a 2011 sheet from the Nationalatlas (Leibniz-Institut für Länderkunde) mapping Germany's
  world-market leaders by region (archived copy; the original link is gone). It shows where to look for Mittelstand companies outside the
  few cities our entries cluster in.
* [Unternehmensregister maps](https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/Unternehmensregister/Karten.html):
  the statistical offices' interactive maps of business sites and employees per district (2024).
  Laid faintly behind our dots, they would show how much industry each district has, and so where
  our curated sample is thin.
* [Open Supply Hub](https://opensupplyhub.org/): an open map of over a million production
  facilities, with agriculture and food now its largest share. Each facility has a universal ID,
  so links survive a change of name. Our `?c=` links use names, so a rename breaks them.


### other creative maps

* [Isometric NYC](https://isometric.nyc/): all of New York as SimCity-2000-style pixel art,
  zoomable from the boroughs down to single buildings (2026). It was rendered from Google Maps 3D
  tiles and restyled tile by tile with an image model fine-tuned on about 40 examples
  ([write-up](https://cannoneyed.com/projects/isometric-nyc)). That puts an illustrated layer
  within reach of a small team. Reviewers noted that the city has no people in it.
* [Hand Drawn Map of London](https://www.evermade.com/product/hand-drawn-map-of-london): Jenni
  Sparks' isometric drawing of Tube zones 1–2 for Evermade (2012, now in a second edition),
  annotated with the markets, pubs and birthplaces that ordinary maps leave out. The annotations
  carry local knowledge that dots and labels can't.
* [Wimmelbilderbuch](https://en.wikipedia.org/wiki/Wimmelbilderbuch): the German "teeming
  picture book", from Ali Mitgutsch's *Rundherum in meiner Stadt* to hand-drawn city series that
  include Cologne and Bonn. Each is one dense drawing full of small stories to search through,
  which suits an event poster with field robots, wind-turbine inspectors and warehouse robots to
  find.
* [Stamen Watercolor and Toner](https://stadiamaps.com/news/stamen-design-and-stadia-maps/):
  Stamen's artistic basemaps, now hosted by Stadia Maps under CC BY 4.0. Watercolor paints the
  world in washes; Toner is stark black and white. They show that the basemap alone can set the
  mood of a map. They need a Stadia account, though, which breaks our keyless rule.
* [Map of Online Communities](https://xkcd.com/802/): xkcd's 2010 map (first version
  [2007](https://xkcd.com/256/)) showing online communities as continents and islands, where land
  area is daily activity, not membership. Deciding what area means, and saying so, is what keeps a
  map like this honest.
* [Map of the Internet](https://www.halcyonmaps.com/): Martin Vargic's antique-atlas map of
  thousands of websites as countries (2014 and 2021 editions). Territories are sized by traffic,
  borders take each site's logo colour, and sites are grouped into regions by type. Press coverage
  of the 2021 edition put it at over 1,000 hours of work, so the charm also warns of the cost.
* [Map of GitHub](https://anvaka.github.io/map-of-github/): Andrei Kashcha's map of 690,000
  repositories, placed by shared stargazers and grouped into about 1,500 named "countries". A
  language model generated the names, and they can be corrected by
  [pull request](https://github.com/anvaka/map-of-github). It produces a Vargic-style map from
  data. Once our entries have `tags` (BACKLOG #5), labs and companies could form regions such as
  SLAM or grasping.
* [Maps of science](https://openculture.com/2018/03/infographics-show-how-the-different-fields-of-biology-chemistry-mathematics-physics-computer-science.html):
  Dominic Walliman's illustrated maps (Domain of Science) of mathematics, physics, computer
  science, chemistry and biology, free for educational use. Each shows how the sub-fields connect.
  A map of robotics in the same style could place our labs on perception, manipulation or
  locomotion.
* [Places & Spaces: Mapping Science](https://cns.iu.edu/exhibit.html): a travelling exhibition of
  100 maps of science curated at Indiana University, with zoomable versions at
  [scimaps.org](https://scimaps.org/). A reference shelf for drawing a field of research as a
  landscape.
* [Gesellschaft und Wirtschaft](https://monoskop.org/log/?p=10828): Otto Neurath and Gerd Arntz's
  1930 atlas of 100 picture-statistics charts, where Isotype began: pictograms that read without
  words, combined by fixed rules (see the [Gerd Arntz Web Archive](https://gerdarntz.org/)). It
  offers a grammar for our seven sector glyphs: one simple sign per sector, repeated to show
  quantity rather than enlarged.
* [Diercke Weltatlas industry maps](https://www.diercke.com/s/industry): the school-atlas economic
  maps of Germany most German students grew up with, drawn with industry symbols (an 1896 Diercke
  already had an *Industriekarte*). They are the familiar visual language for industry on a map of
  Germany, to follow or to break on purpose.
* [Route der Industriekultur](https://route-industriekultur.ruhr/): the Ruhr's industrial heritage
  as a network of 27 anchor points, 17 panoramas and 13 settlements. Each anchor point is marked on
  site by a yellow signal object, and visitors collect stamps in an *Entdeckerpass*. It turns a map
  into a route people actually visit, a model for club excursions in Year 2.
* [Deutschlandkarte](https://mapdesign.icaci.org/2014/06/mapcarte-168365-deutschlandkarte-by-matthias-stolz-2009-2012/):
  ZEITmagazin's weekly map of Germany answering one everyday question, from hairdressers' names to
  divorce rates. Matthias Stolz collected the maps in books; the studio 1kilo designed the later
  run, until the series ended in 2021. One question per map ("where are the
  agricultural-robotics labs?") would give the club's channels a ready-made series.
* [Germany as hexagons](https://de.wikipedia.org/wiki/Datei:Germany_population_states_hexagonal.svg):
  a cartogram of the 16 states with one hexagon for about 250,000 inhabitants. [This post](https://www.thedataschool.co.uk/heinrich-preuss/how-does-the-hexmap-work-for-germany)
  compares layouts that give each state one hex. Our Sector Grid could become such a tile map,
  showing Bremen and Saarland as clearly as Bavaria.
* [Human Terrain](https://pudding.cool/2018/10/city_3d/): The Pudding's 2018 3D map of world
  population as mountains, with snapshots for 1975, 1990 and 2015 and the change between them.
  Using height instead of overlap would solve our pile-up problem (BACKLOG #4): Munich's 38
  entries become one tall column instead of 38 stacked dots.
* [Spike maps](https://www.statsmapsnpix.com/): Alasdair Rae's population maps, one thin spike
  per square kilometre and no borders at all. They inspired Human Terrain. A flat 2D spike per
  city gives the same reading without a 3D camera.
* [Population Lines](https://mapdesign.icaci.org/2014/01/mapcarte-7365-population-lines-by-james-cheshire-2013/):
  James Cheshire's 2013 print of world population as horizontal lines that rise with density, in
  the manner of Joy Division's *Unknown Pleasures*, with no coastlines and cities picked out in
  gold. The same treatment would make a poster in Robonn's palette, using the gold we already use
  for new startups.
* [Chronotrains](https://www.chronotrains.com/): hover over any European station to see how far
  five hours of train travel gets you, in one-hour colour bands. Travel-time zones replace the
  radius circle.
* [direkt.bahn.guru](https://direkt.bahn.guru/): every station you can reach from a given station
  without changing trains, coloured by travel time, with a switch for regional trains only. Our
  distance filter asks "how many km from Bonn?". A student asks "can I get there on my semester
  ticket?", and the regional-trains switch answers that.
* [shipmap.org](https://www.shipmap.org/): Kiln and the UCL Energy Institute's map of a year
  (2012) of the world's merchant fleet: 250 million ship positions, filterable by five ship types,
  with a timeline, narration and a CO₂ counter. There is no basemap. Coastlines and canals emerge
  from the ship tracks, so the data draws the map.
* [Open Infrastructure Map](https://openinframap.org/): power lines, substations, power plants,
  telecoms, oil, gas and water from OpenStreetMap, with lines under construction drawn
  differently. It would work as an energy context layer, shown faintly under our energy entries.
* [Global Wind Power Tracker](https://globalenergymonitor.org/projects/global-wind-power-tracker/):
  Global Energy Monitor's map of every wind-farm phase of 10 MW or more, in every status from
  announced to retired, with a dataset and a wiki page per farm. It treats status as a dimension,
  the way our gold ring does for new startups.
* [Energy-Charts](https://www.energy-charts.info/): Fraunhofer ISE's electricity data for Germany,
  including a map of power plants, transmission-operator areas and current weather from DWD
  stations. An open German source for an energy layer.
* [OpenRailwayMap](https://www.openrailwaymap.org/): the world's railways from OpenStreetMap,
  online since 2013, now with a vector version built on MapLibre. Rail context for our logistics
  entries, from open data we could reuse.
* [Funkenschlag / Power Grid](https://en.wikipedia.org/wiki/Power_Grid): Friedemann Friese's 2004
  board game about running power companies. One side of the board is Germany: six regions, with
  cities joined by connections of different costs. A stylised Germany of cities and links that
  reads at a glance, in one of our own domains.
* [Zug um Zug: Deutschland](https://en.wikipedia.org/wiki/Ticket_to_Ride_%28board_game%29): Days of
  Wonder's Ticket to Ride map of late-19th-century Germany as routes between cities (German-only
  from 2012, then an international edition). A simplified city network reads instantly, even
  without borders.
* [Map Genie](https://mapgenie.io/): interactive video-game maps with dozens of categories and
  counts, quick search, personal notes and a tracker for marking places as found. The tracker is a
  model for a private shortlist: a student marks the labs they've written to, stored only in their
  own browser.
