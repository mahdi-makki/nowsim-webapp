import Image from "next/image";

import { ChevronRight } from "@/components/ui/ChevronRight";
import { Pressable } from "@/components/ui/Pressable";
import type { Destination } from "@/lib/destinations";
import { cn } from "@/lib/cn";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Pressable
      href={`/destinations/${destination.slug}`}
      className={cn(
        "group w-full justify-start gap-4 rounded-card px-5 py-5 text-left md:py-6",
        "bg-surface-soft hover:bg-ink/[0.07] active:bg-ink/[0.07]",
      )}
    >
      {/* Decorative — the name right next to it carries the label */}
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink/8">
        <Image
          src={destination.art}
          alt=""
          fill
          sizes="48px"
          // SVG flags stay untouched; the optimizer rejects them unless
          // dangerouslyAllowSVG is on
          unoptimized={destination.art.endsWith(".svg")}
          className="object-cover"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg font-bold tracking-[-0.02em]">
          {destination.name}
        </span>
        <span className="block text-sm font-medium text-muted">
          From {destination.from}
          {destination.covers ? ` • ${destination.covers} countries` : ""}
        </span>
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 text-ink/30 transition-[color,translate] duration-300 ease-hover group-hover:translate-x-0.5 group-hover:text-ink/60 motion-reduce:transition-none" />
    </Pressable>
  );
}
