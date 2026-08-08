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

function dataLabel(plan: ApiPlan): string {
  const raw = plan.data.trim();

  if (!raw || /^unlimited$/i.test(raw)) return "Unlimited";

  return `${raw} ${plan.data_unit}`.trim();
}

function toPlan(plan: ApiPlan): Plan {
  return {
    id: plan.id,
    data: dataLabel(plan),
    days: plan.days,
    price: planPrice(plan),
  };
}

function cheapest(plans: Plan[]): Money {
  return plans.reduce(
    (lowest, plan) => (plan.price.amount < lowest.amount ? plan.price : lowest),
    plans[0].price,
  );
}

function flagsByCountry(apiPlans: ApiPlan[]): Map<string, string> {
  const flags = new Map<string, string>();

  for (const plan of apiPlans) {
    if (plan.countries_included.length !== 1 || !plan.image) continue;

    flags.set(plan.countries_included[0].toLowerCase(), plan.image);
  }

  return flags;
}

function coverageOf(
  apiPlans: ApiPlan[],
  flags: Map<string, string>,
): CoveredCountry[] {
  const names = new Set<string>();

  for (const plan of apiPlans) {
    for (const country of plan.countries_included) names.add(country);
  }

  return [...names]
    .sort(collator.compare)
    .map(
      (name) =>
        ({ name, art: flags.get(name.toLowerCase()) }) satisfies CoveredCountry,
    );
}

function build(
  kind: DestinationKind,
  apiPlans: ApiPlan[],
  flags: Map<string, string>,
): Destination {
  const first = apiPlans[0];
  const name = displayName(first, kind);
  const slug = slugify(name);

  const plans = apiPlans
    .map(toPlan)
    .sort((a, b) => a.price.amount - b.price.amount || a.days - b.days);

  const coversList = coverageOf(apiPlans, flags);
  const covers = kind === "country" ? undefined : coversList.length;

  return {
    slug,
    name,
    kind,
    art: first.image,
    from: cheapest(plans),
    covers,
    hero: heroFor(kind, slug),
    blurb: blurbFor({ name, kind, covers }),
    coversList: kind === "country" ? undefined : coversList,
    plans,
    apn: first.apn,
  };
}

export function toDestinations(apiPlans: ApiPlan[]): Destination[] {
  const flags = flagsByCountry(apiPlans);

  const groups = new Map<string, { kind: DestinationKind; plans: ApiPlan[] }>();

  for (const plan of apiPlans) {
    const kind = kindOf(plan);
    const key = groupKey(plan, kind);

    const bucket = groups.get(key);

    if (bucket) bucket.plans.push(plan);
    else groups.set(key, { kind, plans: [plan] });
  }

  return [...groups.values()]
    .map(({ kind, plans }) => build(kind, plans, flags))
    .sort((a, b) => collator.compare(a.name, b.name));
}
