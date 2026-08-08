import type { ApiPlan } from "@/lib/api/schemas";
import { blurbFor } from "@/lib/copy";
import { heroFor } from "@/lib/heroes";
import { money, type Money } from "@/lib/money";
import { slugify } from "@/lib/slugify";
import type {
  CoveredCountry,
  Destination,
  DestinationKind,
  Plan,
} from "@/lib/types";

const collator = new Intl.Collator("en");

export function destinationName(planName: string): string {
  const [beforeDigit] = planName.split(/\d/);

  const cleaned = (beforeDigit ?? "")
    .replace(/[_\-–—|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || planName.trim();
}

export function kindOf(plan: ApiPlan): DestinationKind {
  if (plan.plan_type === "country") return "country";

  return /global/i.test(plan.name) ? "global" : "region";
}

function groupKey(plan: ApiPlan, kind: DestinationKind): string {
  if (kind === "country") {
    return `country:${plan.countryIso2[0]?.toUpperCase() ?? destinationName(plan.name).toLowerCase()}`;
  }

  return `${kind}:${destinationName(plan.name).toLowerCase()}`;
}

function displayName(plan: ApiPlan, kind: DestinationKind): string {
  if (kind === "country" && plan.countries_included.length === 1) {
    return plan.countries_included[0];
  }

  return destinationName(plan.name);
}

function planPrice(plan: ApiPlan): Money {
  return money(Math.round(plan.retail_price * 100), plan.currency);
}

const UNLIMITED = "Unlimited";

function dataLabel(plan: ApiPlan): string {
  const raw = plan.data.trim();

  if (!raw || /^unlimited$/i.test(raw)) return UNLIMITED;

  return `${raw} ${plan.data_unit}`.trim();
}

function toPlan(plan: ApiPlan): Plan {
  const data = dataLabel(plan);

  return {
    id: plan.id,
    data,
    unlimited: data === UNLIMITED,
    days: plan.days,
    price: planPrice(plan),
  };
}

// Two ascending price runs, not one: every fixed-data plan first, then the
// unlimited ones, so a cheap unlimited plan cannot break up the GB ladder.
function byGroupThenPrice(a: Plan, b: Plan): number {
  return (
    Number(a.unlimited) - Number(b.unlimited) ||
    a.price.amount - b.price.amount ||
    a.days - b.days
  );
}

function cheapest(plans: Plan[]): Money {
  return plans.reduce(
    (lowest, plan) => (plan.price.amount < lowest.amount ? plan.price : lowest),
    plans[0].price,
  );
}

type CountryFacts = { art?: string; codes?: string[] };

// Single-country plans are the only place the API pairs a country name with its
// flag and ISO codes, so they seed what the regional and global plans display.
function factsByCountry(apiPlans: ApiPlan[]): Map<string, CountryFacts> {
  const facts = new Map<string, CountryFacts>();

  for (const plan of apiPlans) {
    if (plan.countries_included.length !== 1) continue;

    const key = plan.countries_included[0].toLowerCase();
    const codes = [...plan.countryIso2, ...plan.iso3]
      .filter(Boolean)
      .map((code) => code.toLowerCase());

    const existing = facts.get(key) ?? {};

    facts.set(key, {
      art: plan.image || existing.art,
      codes: codes.length ? codes : existing.codes,
    });
  }

  return facts;
}

function coverageOf(
  apiPlans: ApiPlan[],
  facts: Map<string, CountryFacts>,
): CoveredCountry[] {
  const names = new Set<string>();

  for (const plan of apiPlans) {
    for (const country of plan.countries_included) names.add(country);
  }

  return [...names].sort(collator.compare).map((name) => {
    const known = facts.get(name.toLowerCase());

    return { name, art: known?.art, codes: known?.codes } satisfies CoveredCountry;
  });
}

// ISO codes are what make "USA", "KSA" and "KR" searchable — they cost nothing
// because Yesim already sends them on every plan.
function codesOf(apiPlans: ApiPlan[]): string[] {
  const codes = new Set<string>();

  for (const plan of apiPlans) {
    for (const code of [...plan.countryIso2, ...plan.iso3]) {
      if (code) codes.add(code.toLowerCase());
    }
  }

  return [...codes];
}

function build(
  kind: DestinationKind,
  apiPlans: ApiPlan[],
  facts: Map<string, CountryFacts>,
): Destination {
  const first = apiPlans[0];
  const name = displayName(first, kind);
  const slug = slugify(name);

  const plans = apiPlans.map(toPlan).sort(byGroupThenPrice);

  const coversList = coverageOf(apiPlans, facts);
  const covers = kind === "country" ? undefined : coversList.length;

  return {
    slug,
    name,
    kind,
    art: first.image,
    from: cheapest(plans),
    covers,
    codes: kind === "country" ? codesOf(apiPlans) : undefined,
    coverage:
      kind === "country" ? undefined : coversList.map((entry) => entry.name),
    hero: heroFor(kind, slug),
    blurb: blurbFor({ name, kind, covers }),
    coversList: kind === "country" ? undefined : coversList,
    plans,
    apn: first.apn,
  };
}

export function toDestinations(apiPlans: ApiPlan[]): Destination[] {
  const facts = factsByCountry(apiPlans);

  const groups = new Map<string, { kind: DestinationKind; plans: ApiPlan[] }>();

  for (const plan of apiPlans) {
    const kind = kindOf(plan);
    const key = groupKey(plan, kind);

    const bucket = groups.get(key);

    if (bucket) bucket.plans.push(plan);
    else groups.set(key, { kind, plans: [plan] });
  }

  return [...groups.values()]
    .map(({ kind, plans }) => build(kind, plans, facts))
    .sort((a, b) => collator.compare(a.name, b.name));
}
