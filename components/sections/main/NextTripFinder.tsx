"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { MdClose, MdSearch } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { createSearchIndex, search } from "@/lib/search/match";
import { destinationHref, type DestinationSummary } from "@/lib/types";
import { cn } from "@/lib/cn";

const RESULTS = 12;

export function NextTripFinder({
  destinations,
  spotlight,
}: {
  destinations: DestinationSummary[];
  spotlight: DestinationSummary[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => createSearchIndex(destinations), [destinations]);

  const searching = query.trim().length > 0;

  const shown = useMemo(() => {
    if (!searching) return spotlight;

    return search(index, query)
      .slice(0, RESULTS)
      .map((hit) => hit.destination);
  }, [index, query, searching, spotlight]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const first = searching ? shown[0] : undefined;

    router.push(
      first
        ? destinationHref(first.kind, first.slug)
        : `/destinations?q=${encodeURIComponent(query.trim())}`,
    );
  }

  return (
    <>
      <form
        role="search"
        onSubmit={onSubmit}
        className="group mt-8 w-full max-w-md"
      >
        <label htmlFor={inputId} className="sr-only">
          Search destinations
        </label>

        <div
          className={cn(
            "relative flex items-center gap-2 rounded-full bg-white py-1.5 pl-6 pr-2",
            "shadow-lg shadow-ink/10",
            "ring-1 ring-hairline group-focus-within:ring-2 group-focus-within:ring-ink/20",
            "transition-shadow duration-300 ease-hover motion-reduce:transition-none",
          )}
        >
          <input
            id={inputId}
            ref={inputRef}
            name="q"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a country or region"
            className={cn(
              "min-w-0 flex-1 bg-transparent py-2.5 text-base text-ink",
              "placeholder:text-muted focus-visible:outline-none",
            )}
          />

          {searching ? (
            <Pressable
              type="button"
              press={false}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className={cn(
                "h-10 w-10 shrink-0 rounded-full text-muted",
                "transition-colors duration-300 ease-hover motion-reduce:transition-none",
                "hover:bg-ink/[0.07] hover:text-ink active:bg-ink/[0.07]",
              )}
            >
              <MdClose aria-hidden className="h-5 w-5" />
              <span className="sr-only">Clear search</span>
            </Pressable>
          ) : (
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center text-muted"
            >
              <MdSearch className="h-5 w-5" />
            </span>
          )}
        </div>
      </form>

      <div aria-live="polite" className="w-full">
        {shown.length ? (
          <ul
            className={cn(
              "mt-12 flex flex-wrap justify-center gap-x-2 gap-y-6",
              "md:mt-16 md:gap-x-4",
            )}
          >
            {shown.map((destination) => (
              <li key={`${destination.kind}/${destination.slug}`}>
                <Pressable
                  href={destinationHref(destination.kind, destination.slug)}
                  className={cn(
                    "w-24 flex-col gap-3 rounded-control px-2 py-3 align-top md:w-28",
                    "bg-transparent hover:bg-ink/[0.07] active:bg-ink/[0.07]",
                  )}
                >
                  <span
                    className={cn(
                      "relative h-12 w-12 overflow-hidden rounded-full bg-ink/8 md:h-14 md:w-14",
                      "ring-1 ring-hairline",
                    )}
                  >
                    <Image
                      src={destination.art}
                      alt=""
                      fill
                      quality={90}
                      sizes="56px"
                      unoptimized={destination.art.endsWith(".svg")}
                      className="object-cover"
                    />
                  </span>

                  <span className="block w-full text-center text-sm font-bold leading-tight text-ink">
                    {destination.name}
                  </span>
                </Pressable>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 text-center text-base text-muted md:mt-16">
            Nothing matches &ldquo;{query.trim()}&rdquo;.
          </p>
        )}
      </div>
    </>
  );
}
