"use client";

import { useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";

import { Dialog } from "@/components/ui/Dialog";
import { filterCountries } from "@/lib/search/match";
import { cn } from "@/lib/cn";

export function NetworkDialog({
  open,
  onClose,
  operators,
}: {
  open: boolean;
  onClose: () => void;
  operators: string[];
}) {
  const [query, setQuery] = useState("");

  // `filterCountries` is the coverage matcher: operator names carry the country
  // they serve, so its aliases make "uk" find "EE UK" and "Three UK".
  const entries = useMemo(
    () => operators.map((name) => ({ name })),
    [operators],
  );

  const results = useMemo(
    () => filterCountries(entries, query),
    [entries, query],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Available networks"
      className="max-w-[29rem]"
    >
      <p className="mt-2 pr-12 text-sm font-medium text-white/70">
        This plan roams on{" "}
        <span className="text-volt">{operators.length} networks</span>
      </p>

      <div className="relative mt-6">
        <MdSearch
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45"
        />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a network or country"
          aria-label="Search available networks"
          className={cn(
            "w-full rounded-control bg-white/10 py-3.5 pl-11 pr-4",
            "text-base text-white placeholder:text-white/45",
            "outline-none transition-colors duration-300 ease-hover",
            "hover:bg-white/[0.14] focus:bg-white/[0.14]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt",
            "motion-reduce:transition-none",
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />
      </div>

      <div
        className={cn(
          "-mx-2 mt-4 min-h-0 flex-1 px-2",
          "scroll-subtle overflow-y-auto overscroll-contain",
        )}
      >
        <p aria-live="polite" className="sr-only">
          {results.length} networks
        </p>

        {results.length === 0 ? (
          <p className="py-6 text-sm text-white/60">
            {`No network matches “${query.trim()}”. Try the carrier name, or the country it serves.`}
          </p>
        ) : (
          <ul className="flex flex-col">
            {results.map((operator) => (
              <li
                key={operator.name}
                className="py-2.5 text-base font-medium text-white/85"
              >
                {operator.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
