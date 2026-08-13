import Image from "next/image";

import { MdChevronRight } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { formatMoney } from "@/lib/money";
import { destinationHref, type DestinationSummary } from "@/lib/types";
import { cn } from "@/lib/cn";

export function DestinationCard({
  destination,
  note,
}: {
  destination: DestinationSummary;
  note?: string;
}) {
  return (
    <Pressable
      href={destinationHref(destination.kind, destination.slug)}
      className={cn(
        "group w-full justify-start gap-4 rounded-card px-5 text-left",
        note ? "py-4 md:py-4" : "py-5 md:py-6",
        "bg-surface-soft hover:bg-ink/[0.07] active:bg-ink/[0.07]",
      )}
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink/8">
        <Image
          src={destination.art}
          alt=""
          fill
          quality={90}
          sizes="48px"
          unoptimized={destination.art.endsWith(".svg")}
          className="object-cover"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg font-bold tracking-[-0.02em]">
          {destination.name}
        </span>
        <span className="block text-sm font-medium text-muted">
          From {formatMoney(destination.from)}
          {destination.covers ? ` • ${destination.covers} countries` : ""}
        </span>

        {note ? (
          <span
            className={cn(
              "mt-2 inline-block max-w-full truncate rounded-full bg-brand/10 px-2.5 py-1",
              "text-xs font-bold text-brand",
            )}
          >
            {note}
          </span>
        ) : null}
      </span>

      <MdChevronRight
        aria-hidden
        className="h-4 w-4 shrink-0 text-ink/30 transition-[color,translate] duration-300 ease-hover group-hover:translate-x-0.5 group-hover:text-ink/60 motion-reduce:transition-none"
      />
    </Pressable>
  );
}
