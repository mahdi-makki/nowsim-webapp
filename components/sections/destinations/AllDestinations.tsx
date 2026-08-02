"use client";

import { useMemo, useRef, useState } from "react";

import { DestinationCard } from "@/components/ui/DestinationCard";
import { Pressable } from "@/components/ui/Pressable";
import { destinations, type DestinationKind } from "@/lib/destinations";
import { cn } from "@/lib/cn";

type Filter = "all" | DestinationKind;

const tabs: { id: Filter; label: string; badge?: string }[] = [
  { id: "all", label: "All" },
  { id: "country", label: "Countries" },
  { id: "region", label: "Regions" },
  { id: "global", label: "Global", badge: "New" },
];

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function AllDestinations({
  initialQuery = "",
}: {
  /** Seeded from ?q= by the page, so hero searches land pre-filtered */
  initialQuery?: string;
}) {
  const [active, setActive] = useState<Filter>("all");
  const [query, setQuery] = useState(initialQuery);
  const [lastSeed, setLastSeed] = useState(initialQuery);
  const tablistRef = useRef<HTMLDivElement>(null);

  // A second hero search while this component is still mounted arrives as a
  // new prop, and has to overwrite whatever is in the box. All is the widest
  // tab, so a hero search always lands somewhere with results.
  if (initialQuery !== lastSeed) {
    setLastSeed(initialQuery);
    setQuery(initialQuery);
    setActive("all");
  }

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return destinations.filter((destination) => {
      if (active !== "all" && destination.kind !== active) return false;

      return !needle || destination.name.toLowerCase().includes(needle);
    });
  }, [active, query]);

  // Roving focus across the tablist, same handling as the home section
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
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Destination type"
        onKeyDown={onTablistKeyDown}
        className="mt-10 inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-soft p-1 md:mt-12"
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
                    "text-[0.625rem] font-black uppercase tracking-[0.08em]",
                  )}
                >
                  {tab.badge}
                </span>
              ) : null}
            </Pressable>
          );
        })}
      </div>

      <div className="relative mt-6 md:mt-8">
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a destination"
          aria-label="Search for a destination"
          className={cn(
            "w-full rounded-full border border-hairline bg-surface py-4 pl-13 pr-5",
            "text-base font-medium text-ink placeholder:text-ink/40",
            "transition-colors duration-300 ease-hover hover:border-ink/20",
            "motion-reduce:transition-none",
          )}
        />
      </div>

      <div
        id="all-destinations-panel"
        role="tabpanel"
        aria-labelledby={`all-destinations-tab-${active}`}
        className="mt-8 md:mt-10"
      >
        {/* aria-live so a screen reader hears the count change while typing */}
        <p aria-live="polite" className="sr-only">
          {results.length} destinations
        </p>

        {results.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {results.map((destination) => (
              <li key={destination.name}>
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
