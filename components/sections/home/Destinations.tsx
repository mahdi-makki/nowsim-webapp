"use client";

import { useRef, useState } from "react";

import { ChevronRight } from "@/components/ui/ChevronRight";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { Pressable } from "@/components/ui/Pressable";
import { destinationsByKind, type DestinationKind } from "@/lib/destinations";
import { cn } from "@/lib/cn";

const tabs: { id: DestinationKind; label: string; badge?: string }[] = [
  { id: "country", label: "Countries" },
  { id: "region", label: "Regions" },
  { id: "global", label: "Global", badge: "New" },
];

const preview: Record<DestinationKind, number> = {
  country: 9,
  region: 6,
  global: 3,
};

export function Destinations() {
  const [active, setActive] = useState<DestinationKind>("country");
  const tablistRef = useRef<HTMLDivElement>(null);

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
    <section
      aria-labelledby="destinations-heading"
      className="px-3 py-20 md:px-4 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <h2
              id="destinations-heading"
              className="max-w-[15ch] text-h1 font-extrabold uppercase tracking-[-0.03em] md:text-display"
            >
              Every network worth using
            </h2>

            <p className="mt-5 max-w-[46ch] text-lg text-muted md:text-xl">
              200+ destinations on one account. Pick a country, a whole region,
              or go global. Activation is instant, and the plan starts when you
              land.
            </p>
          </div>

          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Destination type"
            onKeyDown={onTablistKeyDown}
            className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-hairline bg-surface-soft p-1 md:self-auto"
          >
            {tabs.map((tab) => {
              const selected = tab.id === active;

              return (
                <Pressable
                  key={tab.id}
                  role="tab"
                  id={`destinations-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`destinations-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "gap-2 rounded-full px-5 py-2.5 text-sm font-medium md:px-6 md:py-3 md:text-base",
                    selected
                      ? "bg-ink text-white"
                      : "text-ink/60 hover:text-ink",
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
          role="tabpanel"
          id={`destinations-panel-${active}`}
          aria-labelledby={`destinations-tab-${active}`}
          className="mt-10 md:mt-14"
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {destinationsByKind(active)
              .slice(0, preview[active])
              .map((destination) => (
                <li key={destination.name}>
                  <DestinationCard destination={destination} />
                </li>
              ))}
          </ul>
        </div>

        <div className="mt-10 flex justify-end border-t border-hairline pt-8">
          <Pressable
            href="/destinations"
            className={cn(
              "gap-2 rounded-full bg-ink px-6 py-3.5 text-base font-medium text-white",
              "hover:bg-ink-soft active:bg-ink-soft",
            )}
          >
            Browse all destinations
            <ChevronRight className="h-4 w-4" />
          </Pressable>
        </div>
      </div>
    </section>
  );
}
