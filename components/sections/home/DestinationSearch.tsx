"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { MdSearch } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

export function DestinationSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputId = useId();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = query.trim();
    router.push(
      trimmed
        ? `/destinations?q=${encodeURIComponent(trimmed)}`
        : "/destinations",
    );
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn("w-full max-w-xl", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Search destinations
      </label>

      <div
        className={cn(
          "flex items-center gap-2 rounded-full bg-white p-1.5 pl-6",
          "shadow-xl shadow-ink/20",
          "transition-transform duration-[120ms] ease-ios active:scale-[0.985]",
          "motion-reduce:transition-none motion-reduce:active:scale-100",
        )}
      >
        <input
          id={inputId}
          name="q"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a country or region"
          className={cn(
            "min-w-0 flex-1 bg-transparent py-3 text-base text-ink",
            "placeholder:text-muted focus-visible:outline-none",
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />

        <Pressable
          type="submit"
          press={false}
          className={cn(
            "h-12 w-12 shrink-0 rounded-full bg-ink text-volt",
            "transition-colors duration-300 ease-hover motion-reduce:transition-none",
            "hover:bg-ink-soft active:bg-ink-soft",
          )}
        >
          <MdSearch aria-hidden className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Pressable>
      </div>
    </form>
  );
}
