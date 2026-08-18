"use client";

import { useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";

import { HelpCard } from "@/components/sections/help/HelpCard";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";
import { helpArticles, helpTopics, type HelpTopicId } from "@/lib/help";
import { normalize } from "@/lib/search/match";

type Filter = HelpTopicId | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All topics" },
  ...helpTopics,
];

const haystacks = new Map(
  helpArticles.map((article) => [
    article.id,
    normalize([article.title, article.blurb, ...article.keywords].join(" ")),
  ]),
);

export function HelpCenter({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Filter>("all");

  const results = useMemo(() => {
    const terms = normalize(query).split(" ").filter(Boolean);

    return helpArticles.filter((article) => {
      if (topic !== "all" && article.topic !== topic) return false;

      if (!terms.length) return true;

      const haystack = haystacks.get(article.id) ?? "";

      return terms.every((term) => haystack.includes(term));
    });
  }, [query, topic]);

  return (
    <div className={className}>
      <h1 className="font-display text-h1 font-extrabold uppercase tracking-[-0.045em]">
        {title}
      </h1>

      <div
        className={cn(
          "mt-6 grid items-start gap-x-8 gap-y-6 md:gap-x-16",
          "md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]",
        )}
      >
        <div className="group relative md:col-start-2 md:row-start-1">
          <MdSearch
            aria-hidden
            className={cn(
              "pointer-events-none absolute right-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2",
              "text-ink/40 transition-colors duration-300 ease-hover",
              "group-focus-within:text-ink",
              "motion-reduce:transition-none",
            )}
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search help articles"
            className={cn(
              "relative w-full rounded-full border border-hairline bg-surface py-4 pl-6 pr-13",
              "text-base font-medium text-ink placeholder:text-ink/40",
              "transition-[border-color,box-shadow] duration-300 ease-hover",
              "hover:border-ink/25",
              "focus-visible:border-ink/45 focus-visible:outline-none",
              "focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-ink)_10%,transparent)]",
              "motion-reduce:transition-none",
            )}
          />
        </div>

        <nav
          aria-label="Help topics"
          className={cn(
            "md:col-start-1 md:row-start-2",
            "md:sticky md:top-[calc(var(--header-height)+1.5rem)]",
            "md:rounded-card md:bg-surface-soft md:p-6",
          )}
        >
          <h2 className="hidden font-display text-h3 font-extrabold uppercase tracking-[-0.045em] md:block">
            Topics
          </h2>

          <ul
            className={cn(
              "-mx-6 flex gap-2 overflow-x-auto px-6 scroll-none",
              "md:mx-0 md:mt-4 md:flex-col md:gap-1 md:overflow-visible md:px-0",
            )}
          >
            {filters.map((filter) => {
              const selected = filter.id === topic;

              return (
                <li key={filter.id} className="shrink-0 md:shrink">
                  <Pressable
                    aria-pressed={selected}
                    onClick={() => setTopic(filter.id)}
                    className={cn(
                      "w-full justify-start rounded-full px-5 py-2.5 text-base font-medium",
                      "md:py-3",
                      selected
                        ? "bg-brand/12 text-brand"
                        : "text-muted hover:bg-brand/6 hover:text-ink active:bg-brand/10",
                    )}
                  >
                    {filter.label}
                  </Pressable>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="md:col-start-2 md:row-start-2">
          <p aria-live="polite" className="sr-only">
            {results.length} help articles
          </p>

          {results.length ? (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
              {results.map((article) => (
                <li key={article.id}>
                  <HelpCard article={article} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-card bg-surface-soft px-6 py-12 text-center text-lg text-muted">
              Nothing here matches &ldquo;{query.trim()}&rdquo;. Try
              &ldquo;install&rdquo;, &ldquo;refund&rdquo;, or
              &ldquo;device&rdquo;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
