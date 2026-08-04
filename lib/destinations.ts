import { coverageFor } from "@/lib/coverage";
import { buildPlans, type Plan } from "@/lib/plans";
import { slugify } from "@/lib/slugify";

export type DestinationKind = "country" | "region" | "global";

export type DestinationFilter = "all" | DestinationKind;

const filters: DestinationFilter[] = ["all", "country", "region", "global"];

export function isDestinationFilter(
  value: string | undefined,
): value is DestinationFilter {
  return value !== undefined && filters.includes(value as DestinationFilter);
}

export const kindLabels: Record<DestinationKind, string> = {
  country: "Country eSIMs",
  region: "Regional eSIMs",
  global: "Global eSIMs",
};

export type Blurb = {
  lead: string;
  coverage?: string;
  tail: string;
};

export function blurbText({ lead, coverage, tail }: Blurb): string {
  return `${lead}${coverage ?? ""}${tail}`;
}

type DestinationSeed = {
  name: string;
  kind: DestinationKind;
  art: string;
  from: string;
  covers?: number;
  coversList?: string[];
  hero?: string;
  blurb?: string;
  slug?: string;
  plans?: Plan[];
};

export type Destination = Omit<
  DestinationSeed,
  "slug" | "blurb" | "plans" | "hero"
> & {
  hero: string;
  slug: string;
  blurb: Blurb;
  plans: Plan[];
};

export const globeArt = "/images/home/globe.png";

export const heroPlaceholder = "/images/home/los-angeles.jpg";

const flag = (code: string) => `/images/flags/${code}.svg`;

const countries: DestinationSeed[] = [
  { name: "Argentina", kind: "country", art: flag("ar"), from: "$5.29" },
  { name: "Australia", kind: "country", art: flag("au"), from: "$4.99" },
  { name: "Austria", kind: "country", art: flag("at"), from: "$3.99" },
  { name: "Belgium", kind: "country", art: flag("be"), from: "$3.99" },
  { name: "Brazil", kind: "country", art: flag("br"), from: "$5.99" },
  { name: "Canada", kind: "country", art: flag("ca"), from: "$4.49" },
  { name: "China", kind: "country", art: flag("cn"), from: "$6.49" },
  { name: "Croatia", kind: "country", art: flag("hr"), from: "$4.29" },
  { name: "Czechia", kind: "country", art: flag("cz"), from: "$3.99" },
  { name: "Denmark", kind: "country", art: flag("dk"), from: "$3.99" },
  { name: "Egypt", kind: "country", art: flag("eg"), from: "$6.99" },
  { name: "Finland", kind: "country", art: flag("fi"), from: "$4.29" },
  { name: "France", kind: "country", art: flag("fr"), from: "$3.99" },
  { name: "Germany", kind: "country", art: flag("de"), from: "$4.49" },
  { name: "Greece", kind: "country", art: flag("gr"), from: "$4.49" },
  { name: "Hungary", kind: "country", art: flag("hu"), from: "$3.99" },
  { name: "Iceland", kind: "country", art: flag("is"), from: "$5.49" },
  { name: "India", kind: "country", art: flag("in"), from: "$4.99" },
  { name: "Indonesia", kind: "country", art: flag("id"), from: "$5.49" },
  { name: "Ireland", kind: "country", art: flag("ie"), from: "$3.99" },
  { name: "Israel", kind: "country", art: flag("il"), from: "$6.49" },
  { name: "Italy", kind: "country", art: flag("it"), from: "$3.99" },
  { name: "Japan", kind: "country", art: flag("jp"), from: "$4.49" },
  { name: "Malaysia", kind: "country", art: flag("my"), from: "$4.99" },
  { name: "Mexico", kind: "country", art: flag("mx"), from: "$5.49" },
  { name: "Morocco", kind: "country", art: flag("ma"), from: "$6.99" },
  { name: "Netherlands", kind: "country", art: flag("nl"), from: "$3.99" },
  { name: "New Zealand", kind: "country", art: flag("nz"), from: "$5.29" },
  { name: "Norway", kind: "country", art: flag("no"), from: "$4.49" },
  { name: "Philippines", kind: "country", art: flag("ph"), from: "$5.49" },
  { name: "Poland", kind: "country", art: flag("pl"), from: "$3.99" },
  { name: "Portugal", kind: "country", art: flag("pt"), from: "$3.99" },
  { name: "Qatar", kind: "country", art: flag("qa"), from: "$7.49" },
  { name: "Romania", kind: "country", art: flag("ro"), from: "$3.99" },
  { name: "Saudi Arabia", kind: "country", art: flag("sa"), from: "$7.99" },
  { name: "Serbia", kind: "country", art: flag("rs"), from: "$4.29" },
  { name: "Singapore", kind: "country", art: flag("sg"), from: "$4.99" },
  { name: "South Africa", kind: "country", art: flag("za"), from: "$6.99" },
  { name: "South Korea", kind: "country", art: flag("kr"), from: "$4.49" },
  { name: "Spain", kind: "country", art: flag("es"), from: "$3.99" },
  { name: "Sweden", kind: "country", art: flag("se"), from: "$4.29" },
  { name: "Switzerland", kind: "country", art: flag("ch"), from: "$4.99" },
  { name: "Thailand", kind: "country", art: flag("th"), from: "$4.99" },
  { name: "Turkey", kind: "country", art: flag("tr"), from: "$3.99" },
  {
    name: "United Arab Emirates",
    kind: "country",
    art: flag("ae"),
    from: "$7.49",
  },
  { name: "United Kingdom", kind: "country", art: flag("gb"), from: "$4.49" },
  { name: "United States", kind: "country", art: flag("us"), from: "$4.49" },
  { name: "Vietnam", kind: "country", art: flag("vn"), from: "$4.99" },
];

const regions: DestinationSeed[] = [
  { name: "Africa", kind: "region", art: globeArt, from: "$12.99" },
  { name: "Asia and Oceania", kind: "region", art: globeArt, from: "$9.99" },
  { name: "Caribbean", kind: "region", art: globeArt, from: "$11.49" },
  { name: "Europe", kind: "region", art: globeArt, from: "$8.99" },
  { name: "Latin America", kind: "region", art: globeArt, from: "$11.99" },
  { name: "Middle East", kind: "region", art: globeArt, from: "$10.99" },
  { name: "North America", kind: "region", art: globeArt, from: "$9.49" },
];

const global: DestinationSeed[] = [
  { name: "Global 60", kind: "global", art: globeArt, from: "$19.99" },
  { name: "Global 120", kind: "global", art: globeArt, from: "$29.99" },
  { name: "Global Unlimited", kind: "global", art: globeArt, from: "$49.99" },
];

function blurbFor({ name, kind, covers }: DestinationSeed): Blurb {
  if (kind === "country") {
    return {
      lead: `Get a travel eSIM for ${name} and enjoy reliable, affordable internet the moment you land.`,
      tail: "",
    };
  }

  if (kind === "region") {
    return {
      lead: "One eSIM for ",
      coverage: `${covers} countries`,
      tail: ` across ${name}. Hop borders on the same plan, with no roaming bill waiting for you.`,
    };
  }

  return {
    lead: "A travel eSIM that follows you across ",
    coverage: `${covers} destinations`,
    tail: ". One plan, one account, wherever the trip goes.",
  };
}

function build(seeds: DestinationSeed[]): Destination[] {
  return seeds.map((seed) => {
    const coversList = seed.coversList ?? coverageFor(seed.name);
    const resolved = {
      ...seed,
      coversList,
      covers: coversList?.length ?? seed.covers,
    };

    return {
      ...resolved,
      slug: seed.slug ?? slugify(seed.name),
      hero: seed.hero ?? heroPlaceholder,
      blurb:
        seed.blurb === undefined
          ? blurbFor(resolved)
          : { lead: seed.blurb, tail: "" },
      plans:
        seed.plans ??
        buildPlans(seed.from, seed.kind === "country" ? "country" : "bundle"),
    };
  });
}

export const destinations: Destination[] = build([
  ...countries,
  ...regions,
  ...global,
]).sort((a, b) => a.name.localeCompare(b.name));

const bySlug = new Map(
  destinations.map((destination) => [destination.slug, destination]),
);

const flags = new Map(
  destinations
    .filter((destination) => destination.kind === "country")
    .map((destination) => [destination.name, destination.art]),
);

export function flagFor(country: string): string | undefined {
  return flags.get(country);
}

export function getDestination(slug: string): Destination | undefined {
  return bySlug.get(slug);
}

export const destinationSlugs: string[] = destinations.map(
  (destination) => destination.slug,
);

export function destinationsByKind(kind: DestinationKind): Destination[] {
  return destinations.filter((destination) => destination.kind === kind);
}
