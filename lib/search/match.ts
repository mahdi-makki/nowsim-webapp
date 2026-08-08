import { aliases } from "@/lib/search/aliases";
import type { DestinationSummary } from "@/lib/types";

// Fold accents and punctuation away so "Côte d'Ivoire" answers to "cote d
// ivoire" and "U.S.A." to "u s a".
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type Doc = {
  destination: DestinationSummary;
  name: string;
  codes: Set<string>;
  coverage: { normalized: string; display: string }[];
};

export type SearchIndex = {
  docs: Doc[];
  /** Normalized ISO code or alias → normalized destination name. */
  synonyms: Map<string, string>;
};

export function createSearchIndex(
  destinations: DestinationSummary[],
): SearchIndex {
  const docs: Doc[] = destinations.map((destination) => ({
    destination,
    name: normalize(destination.name),
    codes: new Set((destination.codes ?? []).map(normalize)),
    coverage: (destination.coverage ?? []).map((display) => ({
      display,
      normalized: normalize(display),
    })),
  }));

  const synonyms = new Map<string, string>();

  // Codes come from the catalog itself, so they stay correct as it changes.
  for (const doc of docs) {
    for (const code of doc.codes) synonyms.set(code, doc.name);
  }

  // Hand-written aliases win over codes: "uk" is a country to a traveller even
  // though it is not the ISO code for one.
  for (const [alias, target] of Object.entries(aliases)) {
    synonyms.set(normalize(alias), normalize(target));
  }

  return { docs, synonyms };
}

const KIND_BIAS = { country: 6, region: 3, global: 0 } as const;

// Every extra term a destination satisfies is worth more than the tier it
// matched at, so "usa, uk, japan" floats the one plan covering all three above
// the three separate countries.
const MULTI_TERM_BONUS = 40;

export type SearchResult = {
  destination: DestinationSummary;
  score: number;
  /** Countries that made a region or global plan match. */
  coverageHits: string[];
};

function splitTerms(query: string): string[] {
  return query
    .split(/[,/|+&]+/)
    .map(normalize)
    .filter(Boolean);
}

type TermScore = { score: number; coverage?: string };

function scoreTerm(doc: Doc, term: string, index: SearchIndex): TermScore {
  const target = index.synonyms.get(term);

  if (doc.name === term) return { score: 100 };

  // An alias or ISO code is a deliberate name for one place, so it has to beat
  // a prefix match — otherwise "uk" answers Ukraine before United Kingdom.
  if (target && doc.name === target) return { score: 90 };
  if (doc.codes.has(term)) return { score: 90 };

  if (doc.name.startsWith(term)) return { score: 80 };

  // Two letters are too blunt to match inside a word — "in" would hit every
  // name containing it. Codes and exact names above already cover short input.
  if (term.length > 2 && doc.name.includes(term)) return { score: 50 };

  let prefix: string | undefined;

  for (const country of doc.coverage) {
    if (country.normalized === term || (target && country.normalized === target)) {
      return { score: 30, coverage: country.display };
    }

    if (!prefix && term.length > 2 && country.normalized.startsWith(term)) {
      prefix = country.display;
    }
  }

  if (prefix) return { score: 25, coverage: prefix };

  return { score: 0 };
}

function run(index: SearchIndex, terms: string[]): SearchResult[] {
  const results: SearchResult[] = [];

  for (const doc of index.docs) {
    let total = 0;
    let matched = 0;
    const coverageHits: string[] = [];

    for (const term of terms) {
      const { score, coverage } = scoreTerm(doc, term, index);

      if (!score) continue;

      total += score;
      matched += 1;

      if (coverage && !coverageHits.includes(coverage)) {
        coverageHits.push(coverage);
      }
    }

    if (!matched) continue;

    results.push({
      destination: doc.destination,
      score:
        total +
        (matched - 1) * MULTI_TERM_BONUS +
        KIND_BIAS[doc.destination.kind],
      coverageHits,
    });
  }

  return results.sort(
    (a, b) =>
      b.score - a.score ||
      a.destination.name.localeCompare(b.destination.name, "en"),
  );
}

/**
 * The same normalizing, aliasing and multi-term reading as the destination
 * search, applied to a plain list of country names — a coverage list. Order is
 * left alone: an alphabetical list should stay alphabetical.
 */
export function filterCountries<T extends { name: string; codes?: string[] }>(
  countries: T[],
  query: string,
): T[] {
  const trimmed = normalize(query);

  if (!trimmed) return countries;

  const split = splitTerms(query);
  const terms = split.length ? split : [trimmed];

  const matches = (list: string[]) =>
    countries.filter((country) => {
      const name = normalize(country.name);
      const codes = (country.codes ?? []).map(normalize);

      return list.some((term) => {
        const target = normalize(aliases[term] ?? "");

        if (target && name === target) return true;
        if (codes.includes(term)) return true;
        if (term.length > 2) return name.includes(term);

        // One or two letters are too blunt to match inside a word — "in" would
        // hit every name containing it. A prefix still narrows the list the way
        // typing expects, so "a" opens on Albania and "sa" on San Marino.
        return name.split(" ").some((word) => word.startsWith(term));
      });
    });

  const hits = matches(terms);

  if (hits.length) return hits;

  const words = trimmed.split(" ").filter(Boolean);

  return words.length > 1 ? matches(words) : [];
}

export function search(index: SearchIndex, query: string): SearchResult[] {
  const trimmed = normalize(query);

  if (!trimmed) return [];

  const terms = splitTerms(query);
  const results = run(index, terms.length ? terms : [trimmed]);

  if (results.length) return results;

  // "usa uk" is two destinations, "south korea" is one. Treating the phrase as
  // a whole first and only splitting on spaces when that finds nothing keeps
  // both readings working without a separator.
  const words = trimmed.split(" ").filter(Boolean);

  return words.length > 1 ? run(index, words) : [];
}
