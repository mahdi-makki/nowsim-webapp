import Image from "next/image";

import { MdChevronRight } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { formatMoney } from "@/lib/money";
import { destinationHref, type DestinationSummary } from "@/lib/types";
import { cn } from "@/lib/cn";

export function DestinationCard({
  destination,
}: {
  destination: DestinationSummary;
}) {
  return (
    <Pressable
      href={destinationHref(destination.kind, destination.slug)}
      className={cn(
        "group w-full justify-start gap-4 rounded-card px-5 py-5 text-left md:py-6",
        "bg-surface-soft hover:bg-ink/[0.07] active:bg-ink/[0.07]",
      )}
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink/8">
        <Image
          src={destination.art}
          alt=""
          fill
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
      </span>

      <MdChevronRight
        aria-hidden
        className="h-4 w-4 shrink-0 text-ink/30 transition-[color,translate] duration-300 ease-hover group-hover:translate-x-0.5 group-hover:text-ink/60 motion-reduce:transition-none"
      />
    </Pressable>
  );
}
