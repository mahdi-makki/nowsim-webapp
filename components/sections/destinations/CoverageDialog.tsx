"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";

import { Dialog } from "@/components/ui/Dialog";
import { filterCountries } from "@/lib/search/match";
import type { CoveredCountry } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CoverageDialog({
  open,
  onClose,
  destinationName,
  countries,
}: {
  open: boolean;
  onClose: () => void;
  destinationName: string;
  countries: CoveredCountry[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => filterCountries(countries, query),
    [countries, query],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Coverage"
      className="max-w-[29rem]"
    >
      <p className="mt-2 pr-12 text-sm font-medium text-white/70">
        {destinationName} connects in{" "}
        <span className="text-volt">{countries.length} countries</span> on one
        plan
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
          placeholder="Where do you need internet?"
          aria-label="Search covered countries"
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
          {results.length} countries
        </p>

        {results.length === 0 ? (
          <p className="py-6 text-sm text-white/60">
            {`${query.trim()} isn’t on this plan. Try another spelling, or look for a country plan instead.`}
          </p>
        ) : (
          <ul className="flex flex-col">
            {results.map((country) => {
              const flag = country.art;

              return (
                <li
                  key={country.name}
                  className="flex items-center gap-3 py-2.5 text-base font-bold text-white"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "relative h-8 w-8 shrink-0 overflow-hidden rounded-full",
                      "flex items-center justify-center",
                      "bg-white/10 text-xs font-bold text-white/60",
                    )}
                  >
                    {flag ? (
                      <Image
                        src={flag}
                        alt=""
                        fill
                        quality={90}
                        sizes="32px"
                        unoptimized={flag.endsWith(".svg")}
                        className="object-cover"
                      />
                    ) : (
                      country.name.slice(0, 1)
                    )}
                  </span>

                  {country.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
