"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

type TabId = "countries" | "regions" | "global";

type Plan = {
  name: string;
  /** Flag for countries; the globe render stands in for regions and global */
  art: string;
  from: string;
  href: string;
};

const globeArt = "/images/home/globe.png";

const tabs: { id: TabId; label: string; badge?: string }[] = [
  { id: "countries", label: "Countries" },
  { id: "regions", label: "Regions" },
  { id: "global", label: "Global", badge: "New" },
];

const catalog: Record<TabId, Plan[]> = {
  countries: [
    {
      name: "Spain",
      art: "/images/flags/es.svg",
      from: "US$3.99",
      href: "/destinations/spain",
    },
    {
      name: "Greece",
      art: "/images/flags/gr.svg",
      from: "US$4.49",
      href: "/destinations/greece",
    },
    {
      name: "Italy",
      art: "/images/flags/it.svg",
      from: "US$3.99",
      href: "/destinations/italy",
    },
    {
      name: "Turkey",
      art: "/images/flags/tr.svg",
      from: "US$3.99",
      href: "/destinations/turkey",
    },
    {
      name: "United Kingdom",
      art: "/images/flags/gb.svg",
      from: "US$4.49",
      href: "/destinations/united-kingdom",
    },
    {
      name: "Portugal",
      art: "/images/flags/pt.svg",
      from: "US$3.99",
      href: "/destinations/portugal",
    },
    {
      name: "France",
      art: "/images/flags/fr.svg",
      from: "US$3.99",
      href: "/destinations/france",
    },
    {
      name: "Germany",
      art: "/images/flags/de.svg",
      from: "US$4.49",
      href: "/destinations/germany",
    },
    {
      name: "Netherlands",
      art: "/images/flags/nl.svg",
      from: "US$3.99",
      href: "/destinations/netherlands",
    },
  ],
  regions: [
    { name: "Europe", art: globeArt, from: "US$8.99", href: "/regions/europe" },
    { name: "Asia", art: globeArt, from: "US$9.99", href: "/regions/asia" },
    {
      name: "North America",
      art: globeArt,
      from: "US$9.49",
      href: "/regions/north-america",
    },
    {
      name: "Latin America",
      art: globeArt,
      from: "US$11.99",
      href: "/regions/latin-america",
    },
    {
      name: "Middle East",
      art: globeArt,
      from: "US$10.99",
      href: "/regions/middle-east",
    },
    { name: "Africa", art: globeArt, from: "US$12.99", href: "/regions/africa" },
  ],
  global: [
    { name: "Global 60", art: globeArt, from: "US$19.99", href: "/global/60" },
    {
      name: "Global 120",
      art: globeArt,
      from: "US$29.99",
      href: "/global/120",
    },
    {
      name: "Global Unlimited",
      art: globeArt,
      from: "US$49.99",
      href: "/global/unlimited",
    },
  ],
};

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path
        d="m9 6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Destinations() {
  const [active, setActive] = useState<TabId>("countries");
  const tablistRef = useRef<HTMLDivElement>(null);

  // Roving focus across the tablist. Pressable doesn't forward refs, so the
  // tabs get looked up off the container instead of held individually.
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
              className="max-w-[15ch] text-h1 uppercase tracking-[-0.045em] subpixel-antialiased md:text-display [-webkit-text-stroke:0.022em_currentColor]"
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
        </div>

        <div
          role="tabpanel"
          id={`destinations-panel-${active}`}
          aria-labelledby={`destinations-tab-${active}`}
          className="mt-10 md:mt-14"
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {catalog[active].map((plan) => (
              <li key={plan.href}>
                <Pressable
                  href={plan.href}
                  className={cn(
                    "group w-full justify-start gap-4 rounded-card px-5 py-5 text-left md:py-6",
                    "bg-surface-soft hover:bg-ink/[0.07] active:bg-ink/[0.07]",
                  )}
                >
                  {/* Decorative — the plan name right next to it carries the label */}
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink/8">
                    <Image
                      src={plan.art}
                      alt=""
                      fill
                      sizes="48px"
                      // SVG flags stay untouched; the optimizer rejects them
                      // unless dangerouslyAllowSVG is on
                      unoptimized={plan.art.endsWith(".svg")}
                      className="object-cover"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-black tracking-[-0.02em]">
                      {plan.name}
                    </span>
                    <span className="block text-sm font-medium text-muted">
                      From {plan.from}
                    </span>
                  </span>

                  <ChevronRight className="h-4 w-4 shrink-0 text-ink/30 transition-transform duration-300 ease-hover group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </Pressable>
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
