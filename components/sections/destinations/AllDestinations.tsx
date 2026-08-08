"use client";

import { useMemo, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";

import { DestinationCard } from "@/components/common/DestinationCard";
import { Pressable } from "@/components/ui/Pressable";
import type { DestinationFilter, DestinationSummary } from "@/lib/types";
import { cn } from "@/lib/cn";

const tabs: { id: DestinationFilter; label: string; badge?: string }[] = [
  { id: "all", label: "All" },
  { id: "country", label: "Countries" },
  { id: "region", label: "Regions" },
  { id: "global", label: "Global", badge: "New" },
];

export function AllDestinations({
  destinations,
  initialQuery = "",
  initialKind = "all",
}: {
  destinations: DestinationSummary[];
  initialQuery?: string;
  initialKind?: DestinationFilter;
}) {
  const [active, setActive] = useState<DestinationFilter>(initialKind);
  const [query, setQuery] = useState(initialQuery);
  const [seed, setSeed] = useState({ query: initialQuery, kind: initialKind });
  const tablistRef = useRef<HTMLDivElement>(null);

  if (initialQuery !== seed.query || initialKind !== seed.kind) {
    setSeed({ query: initialQuery, kind: initialKind });
    setQuery(initialQuery);
    setActive(initialKind);
  }

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return destinations.filter((destination) => {
      if (active !== "all" && destination.kind !== active) return false;

      return !needle || destination.name.toLowerCase().includes(needle);
    });
  }, [active, destinations, query]);

  const onTablistKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();

    const index = tabs.findIndex((tab) => tab.id === active);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key === "ArrowLeft"
            ? (index - 1 + tabs.length) % tabs.length
            : (index + 1) % tabs.length;

    setActive(tabs[next].id);
    tablistRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  };

  return (
    <>
      <div className="mt-10 flex flex-col-reverse gap-4 md:mt-12 md:flex-row md:items-stretch md:gap-5">
        <div className="group relative min-w-0 flex-1">
          <MdSearch
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2",
              "text-ink/40 transition-colors duration-300 ease-hover",
              "group-focus-within:text-ink",
              "motion-reduce:transition-none",
            )}
          />

          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -inset-1 rounded-full bg-ink/15 blur-md",
              "scale-95 opacity-0 transition-[opacity,transform] duration-500 ease-hover",
              "group-focus-within:scale-100 group-focus-within:opacity-100",
              "motion-reduce:transition-none motion-reduce:scale-100",
            )}
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a destination"
            aria-label="Search for a destination"
            className={cn(
              "relative w-full rounded-full border border-hairline bg-surface py-4 pl-13 pr-5",
              "md:h-full md:py-0",
              "text-base font-medium text-ink placeholder:text-ink/40",
              "transition-[border-color,box-shadow] duration-300 ease-hover",
              "hover:border-ink/25",
              "focus-visible:border-ink/45 focus-visible:outline-none",
              "focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-ink)_10%,transparent)]",
              "motion-reduce:transition-none",
            )}
          />
        </div>

        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Destination type"
          onKeyDown={onTablistKeyDown}
          className="flex w-fit shrink-0 items-center gap-1 rounded-full border border-hairline bg-surface-soft p-1"
        >
          {tabs.map((tab) => {
            const selected = tab.id === active;

            return (
              <Pressable
                key={tab.id}
                role="tab"
                id={`all-destinations-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="all-destinations-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "gap-2 rounded-full px-5 py-2.5 text-sm font-medium md:px-6 md:py-3 md:text-base",
                  selected ? "bg-ink text-white" : "text-ink/60 hover:text-ink",
                )}
              >
                {tab.label}

                {tab.badge ? (
                  <span
                    className={cn(
                      "rounded-full bg-volt px-2 py-1 text-ink",
                      "text-[0.625rem] font-bold uppercase tracking-[0.08em]",
                    )}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </Pressable>
            );
          })}
        </div>
      </div>

      <div
        id="all-destinations-panel"
        role="tabpanel"
        aria-labelledby={`all-destinations-tab-${active}`}
        className="mt-8 md:mt-10"
      >
        <p aria-live="polite" className="sr-only">
          {results.length} destinations
        </p>

        {results.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {results.map((destination) => (
              <li key={`${destination.kind}/${destination.slug}`}>
                <DestinationCard destination={destination} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card bg-surface-soft px-6 py-12 text-center text-lg text-muted">
            Nothing matches &ldquo;{query.trim()}&rdquo; yet. Try a country,
            region, or global plan.
          </p>
        )}
      </div>
    </>
  );
}
