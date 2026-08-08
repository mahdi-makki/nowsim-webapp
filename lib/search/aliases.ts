// What people type when they do not type the catalog's name. ISO codes are not
// listed here — those arrive from the API on every plan and are matched
// directly. This table only covers what codes cannot: nicknames, former names,
// constituent countries and the abbreviations travellers actually use.
//
// Every value must be a destination name as Yesim spells it, or the alias
// resolves to nothing. `docs/hero-names/countries.txt` is the current list.
export const aliases: Record<string, string> = {
  // United States
  usa: "United States",
  "u s a": "United States",
  america: "United States",
  "united states of america": "United States",
  states: "United States",

  // United Kingdom
  uk: "United Kingdom",
  "u k": "United Kingdom",
  britain: "United Kingdom",
  "great britain": "United Kingdom",
  gb: "United Kingdom",
  england: "United Kingdom",
  scotland: "United Kingdom",
  wales: "United Kingdom",
  "northern ireland": "United Kingdom",

  // Gulf
  ksa: "Saudi Arabia",
  "saudi arabia ksa": "Saudi Arabia",
  saudi: "Saudi Arabia",
  uae: "United Arab Emirates",
  emirates: "United Arab Emirates",
  dubai: "United Arab Emirates",
  "abu dhabi": "United Arab Emirates",

  // Commonly shortened or renamed
  korea: "South Korea",
  "republic of korea": "South Korea",
  seoul: "South Korea",
  holland: "Netherlands",
  czechia: "Czech Republic",
  czech: "Czech Republic",
  russia: "Russian Federation",
  "north macedonia": "Macedonia",
  bosnia: "Bosnia and Herzegovina",
  herzegovina: "Bosnia and Herzegovina",
  palestine: "Palestinian Territory",
  "west bank": "Palestinian Territory",
  gaza: "Palestinian Territory",
  drc: "Congo Dem. Rep",
  "democratic republic of the congo": "Congo Dem. Rep",
  "cabo verde": "Cape Verde",
  "hong kong sar": "Hong Kong",
  hk: "Hong Kong",
  macau: "Macao China",
  macao: "Macao China",
  "puerto rico usa": "Puerto Rico",
  "st kitts": "Saint Kitts and Nevis",
  "st lucia": "Saint Lucia",
  "st vincent": "Saint Vincent and Grenadines",
  "turks and caicos": "Turks and Caicos Islands",
  bvi: "British Virgin Islands",
  "sri lanka ceylon": "Sri Lanka",
  ceylon: "Sri Lanka",
  burma: "Myanmar",
  swiss: "Switzerland",
  deutschland: "Germany",
  espana: "Spain",
  italia: "Italy",
  nippon: "Japan",
  japon: "Japan",
  nz: "New Zealand",
  aus: "Australia",
  oz: "Australia",
  "south africa rsa": "South Africa",
  rsa: "South Africa",
  "ivory coast": "Cote d'Ivoire",
  reunion: "Reunion",
};
