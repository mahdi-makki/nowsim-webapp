import type { ApiPlan } from "@/lib/api/schemas";
import { heroPlaceholder } from "@/lib/assets";
import { blurbFor } from "@/lib/copy";
import { money, type Money } from "@/lib/money";
import { slugify } from "@/lib/slugify";
import type {
  CoveredCountry,
  Destination,
  DestinationKind,
  Plan,
} from "@/lib/types";

const collator = new Intl.Collator("en");

/**
 * Plan names carry the destination, the size and a build date all in one
 * string:
 *
 *   "Uzbekistan 20GB_20250318"    -> "Uzbekistan"
 *   "Europe 0.49GB_20250318"      -> "Europe"
 *   "North America 3GB_20250318"  -> "North America"
 *   "Global Package 20GB"         -> "Global Package"
 *
 * Everything before the first digit is the destination, which keeps
 * multi-word names intact where taking the first word alone would not.
 */
export function destinationName(planName: string): string {
  const [beforeDigit] = planName.split(/\d/);

  const cleaned = (beforeDigit ?? "")
    .replace(/[_\-–—|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || planName.trim();
}

/**
 * `plan_type` only distinguishes country from region — global plans are also
 * typed `region`, so the name is the only signal that separates them.
 */
export function kindOf(plan: ApiPlan): DestinationKind {
  if (plan.plan_type === "country") return "country";

  return /global/i.test(plan.name) ? "global" : "region";
}

/**
 * Country plans group by `countryIso2`, not by the name.
 *
 * Every country plan carries exactly one ISO2 code, and each code maps to
 * exactly one `countries_included` value — but the plan *name* does not.
 * `UNLIM_UAE_7D` extracts to "UNLIM UAE" and `St. Kitts and Nevis 15GB` to
 * "St. Kitts", each splitting off a phantom destination from the real one.
 * Grouping on the code collapses 151 name-derived country destinations to the
 * correct 148.
 *
 * Region and global plans have no usable code — `countryIso2` is the whole
 * coverage list — so those still group on the extracted name.
 */
function groupKey(plan: ApiPlan, kind: DestinationKind): string {
  if (kind === "country") {
    return `country:${plan.countryIso2[0]?.toUpperCase() ?? destinationName(plan.name).toLowerCase()}`;
  }

  return `${kind}:${destinationName(plan.name).toLowerCase()}`;
}

/**
 * For a country the canonical name is `countries_included`, which is clean even
 * when the plan name is not. Region and global fall back to the extracted name.
 */
function displayName(plan: ApiPlan, kind: DestinationKind): string {
  if (kind === "country" && plan.countries_included.length === 1) {
    return plan.countries_included[0];
  }

  return destinationName(plan.name);
}

/**
 * Always `retail_price`, never `price`. `price` is the partner rate we are
 * billed; `retail_price` is what the customer pays. They are equal across all
 * 1520 plans today, so charging `price` would look correct right up until the
 * day it isn't. This is the single place a customer-facing price is built.
 */
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

/**
 * Country name -> flag URL, built from the country plans in the same payload.
 *
 * A region plan cannot supply its own flags: `countries_included`, `countryIso2`
 * and `iso3` are each sorted independently, so index 3 of one is not index 3 of
 * another (in the Europe plan, `countries_included[3]` is Croatia while
 * `iso3[3]` is CHE, Switzerland). Pairing a name with a flag by position would
 * show the wrong flag.
 *
 * A single-country plan has no such ambiguity — one name, one `image` — so its
 * flag is safe to reuse wherever a region lists that same name. That covers 120
 * of the 121 names regions mention (only Zambia has no country plan of its own);
 * the rest fall back to the first letter in `CoverageDialog`. Costs no extra
 * request: this is the `/plans` array the catalog already fetched.
 */
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

  const plans = apiPlans
    .map(toPlan)
    .sort((a, b) => a.days - b.days || a.price.amount - b.price.amount);

  const coversList = coverageOf(apiPlans, flags);
  const covers = kind === "country" ? undefined : coversList.length;

  return {
    slug: slugify(name),
    name,
    kind,
    art: first.image,
    from: cheapest(plans),
    covers,
    hero: heroPlaceholder,
    blurb: blurbFor({ name, kind, covers }),
    coversList: kind === "country" ? undefined : coversList,
    plans,
    apn: first.apn,
  };
}

/**
 * Slugs are unique per kind, not globally — routes are
 * `/destinations/<kind>/<slug>`, so the kind segment disambiguates.
 *
 * That matters because Yesim sells both a country "Japan" and a region "Japan"
 * (which is really Japan + South Korea). Both slugify to `japan`; they live at
 * `/destinations/country/japan` and `/destinations/region/japan`.
 *
 * Within a single kind there are no collisions: countries group by ISO2 and
 * each code maps to one name, while region and global group by that same name.
 */
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