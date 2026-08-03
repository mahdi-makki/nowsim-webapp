import { buildPlans, type Plan } from "@/lib/plans";
import { slugify } from "@/lib/slugify";

export type DestinationKind = "country" | "region" | "global";

/**
 * Authored shape. Slug, blurb and plans are derived in `build` below so the
 * rows stay one-liners — set any of them on a row to override the derivation.
 */
type DestinationSeed = {
  name: string;
  kind: DestinationKind;
  /** Flag for countries; the globe render stands in for regions and global */
  art: string;
  from: string;
  /** How many countries a region or global plan covers */
  covers?: number;
  /** Which countries, for the detail page's coverage list */
  coversList?: string[];
  /** Detail-page photo. Falls back to `heroPlaceholder` until the real one lands */
  hero?: string;
  blurb?: string;
  slug?: string;
  /** Only when the generated ladder doesn't fit this destination's real pricing */
  plans?: Plan[];
};

export type Destination = Omit<
  DestinationSeed,
  "slug" | "blurb" | "plans" | "hero"
> & {
  /** Always set — the placeholder stands in until a real photo is authored */
  hero: string;
  /**
   * URL segment for /destinations/[slug]. Derived from the name, but carried
   * as real data so a later copy edit to the name can't silently move a URL
   * that is already indexed
   */
  slug: string;
  blurb: string;
  plans: Plan[];
};

/** Regions and global plans share the globe render until bespoke art lands */
export const globeArt = "/images/home/globe.png";

/**
 * Stand-in detail-page photo. Every destination points here until its own
 * photo is shot — set `hero` on a row to swap one over
 */
export const heroPlaceholder = "/images/home/los-angeles.jpg";

const flag = (code: string) => `/images/flags/${code}.svg`;

const countries: DestinationSeed[] = [
  { name: "Argentina", kind: "country", art: flag("ar"), from: "US$5.29" },
  { name: "Australia", kind: "country", art: flag("au"), from: "US$4.99" },
  { name: "Austria", kind: "country", art: flag("at"), from: "US$3.99" },
  { name: "Belgium", kind: "country", art: flag("be"), from: "US$3.99" },
  { name: "Brazil", kind: "country", art: flag("br"), from: "US$5.99" },
  { name: "Canada", kind: "country", art: flag("ca"), from: "US$4.49" },
  { name: "China", kind: "country", art: flag("cn"), from: "US$6.49" },
  { name: "Croatia", kind: "country", art: flag("hr"), from: "US$4.29" },
  { name: "Czechia", kind: "country", art: flag("cz"), from: "US$3.99" },
  { name: "Denmark", kind: "country", art: flag("dk"), from: "US$3.99" },
  { name: "Egypt", kind: "country", art: flag("eg"), from: "US$6.99" },
  { name: "Finland", kind: "country", art: flag("fi"), from: "US$4.29" },
  { name: "France", kind: "country", art: flag("fr"), from: "US$3.99" },
  { name: "Germany", kind: "country", art: flag("de"), from: "US$4.49" },
  { name: "Greece", kind: "country", art: flag("gr"), from: "US$4.49" },
  { name: "Hungary", kind: "country", art: flag("hu"), from: "US$3.99" },
  { name: "Iceland", kind: "country", art: flag("is"), from: "US$5.49" },
  { name: "India", kind: "country", art: flag("in"), from: "US$4.99" },
  { name: "Indonesia", kind: "country", art: flag("id"), from: "US$5.49" },
  { name: "Ireland", kind: "country", art: flag("ie"), from: "US$3.99" },
  { name: "Israel", kind: "country", art: flag("il"), from: "US$6.49" },
  { name: "Italy", kind: "country", art: flag("it"), from: "US$3.99" },
  { name: "Japan", kind: "country", art: flag("jp"), from: "US$4.49" },
  { name: "Malaysia", kind: "country", art: flag("my"), from: "US$4.99" },
  { name: "Mexico", kind: "country", art: flag("mx"), from: "US$5.49" },
  { name: "Morocco", kind: "country", art: flag("ma"), from: "US$6.99" },
  { name: "Netherlands", kind: "country", art: flag("nl"), from: "US$3.99" },
  { name: "New Zealand", kind: "country", art: flag("nz"), from: "US$5.29" },
  { name: "Norway", kind: "country", art: flag("no"), from: "US$4.49" },
  { name: "Philippines", kind: "country", art: flag("ph"), from: "US$5.49" },
  { name: "Poland", kind: "country", art: flag("pl"), from: "US$3.99" },
  { name: "Portugal", kind: "country", art: flag("pt"), from: "US$3.99" },
  { name: "Qatar", kind: "country", art: flag("qa"), from: "US$7.49" },
  { name: "Romania", kind: "country", art: flag("ro"), from: "US$3.99" },
  { name: "Saudi Arabia", kind: "country", art: flag("sa"), from: "US$7.99" },
  { name: "Serbia", kind: "country", art: flag("rs"), from: "US$4.29" },
  { name: "Singapore", kind: "country", art: flag("sg"), from: "US$4.99" },
  { name: "South Africa", kind: "country", art: flag("za"), from: "US$6.99" },
  { name: "South Korea", kind: "country", art: flag("kr"), from: "US$4.49" },
  { name: "Spain", kind: "country", art: flag("es"), from: "US$3.99" },
  { name: "Sweden", kind: "country", art: flag("se"), from: "US$4.29" },
  { name: "Switzerland", kind: "country", art: flag("ch"), from: "US$4.99" },
  { name: "Thailand", kind: "country", art: flag("th"), from: "US$4.99" },
  { name: "Turkey", kind: "country", art: flag("tr"), from: "US$3.99" },
  {
    name: "United Arab Emirates",
    kind: "country",
    art: flag("ae"),
    from: "US$7.49",
  },
  { name: "United Kingdom", kind: "country", art: flag("gb"), from: "US$4.49" },
  { name: "United States", kind: "country", art: flag("us"), from: "US$4.49" },
  { name: "Vietnam", kind: "country", art: flag("vn"), from: "US$4.99" },
];

const regions: DestinationSeed[] = [
  {
    name: "Africa",
    kind: "region",
    art: globeArt,
    from: "US$12.99",
    covers: 35,
  },
  {
    name: "Asia and Oceania",
    kind: "region",
    art: globeArt,
    from: "US$9.99",
    covers: 22,
  },
  {
    name: "Caribbean",
    kind: "region",
    art: globeArt,
    from: "US$11.49",
    covers: 18,
  },
  {
    name: "Europe",
    kind: "region",
    art: globeArt,
    from: "US$8.99",
    covers: 39,
  },
  {
    name: "Latin America",
    kind: "region",
    art: globeArt,
    from: "US$11.99",
    covers: 20,
  },
  {
    name: "Middle East",
    kind: "region",
    art: globeArt,
    from: "US$10.99",
    covers: 14,
  },
  {
    name: "North America",
    kind: "region",
    art: globeArt,
    from: "US$9.49",
    covers: 3,
  },
];

const global: DestinationSeed[] = [
  {
    name: "Global 60",
    kind: "global",
    art: globeArt,
    from: "US$19.99",
    covers: 120,
  },
  {
    name: "Global 120",
    kind: "global",
    art: globeArt,
    from: "US$29.99",
    covers: 160,
  },
  {
    name: "Global Unlimited",
    kind: "global",
    art: globeArt,
    from: "US$49.99",
    covers: 200,
  },
];

function blurbFor({ name, kind, covers }: DestinationSeed): string {
  if (kind === "country") {
    return `Get a travel eSIM for ${name} and enjoy reliable, affordable internet the moment you land.`;
  }

  if (kind === "region") {
    return `One eSIM for ${covers} countries across ${name}. Hop borders on the same plan, with no roaming bill waiting for you.`;
  }

  return `A travel eSIM that follows you across ${covers} destinations. One plan, one account, wherever the trip goes.`;
}

function build(seeds: DestinationSeed[]): Destination[] {
  return seeds.map((seed) => ({
    ...seed,
    slug: seed.slug ?? slugify(seed.name),
    hero: seed.hero ?? heroPlaceholder,
    blurb: seed.blurb ?? blurbFor(seed),
    plans:
      seed.plans ??
      buildPlans(seed.from, seed.kind === "country" ? "country" : "bundle"),
  }));
}

/** Sorted the way the listing renders it — alphabetical across every kind */
export const destinations: Destination[] = build([
  ...countries,
  ...regions,
  ...global,
]).sort((a, b) => a.name.localeCompare(b.name));

const bySlug = new Map(
  destinations.map((destination) => [destination.slug, destination]),
);

export function getDestination(slug: string): Destination | undefined {
  return bySlug.get(slug);
}

/** Feeds generateStaticParams for /destinations/[slug] */
export const destinationSlugs: string[] = destinations.map(
  (destination) => destination.slug,
);

export function destinationsByKind(kind: DestinationKind): Destination[] {
  return destinations.filter((destination) => destination.kind === kind);
}
