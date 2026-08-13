import Image from "next/image";

import { NowsimLogo } from "@/components/ui/NowsimLogo";
import { cn } from "@/lib/cn";

export function EveryMoment() {
  return (
    <section
      aria-labelledby="every-moment-heading"
      className="px-3 py-20 md:px-4 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="every-moment-heading"
          className={cn(
            "mx-auto max-w-[14ch] text-center uppercase",
            "font-display text-h1 font-extrabold tracking-[-0.045em]",
          )}
        >
          Built for every moment
        </h2>

        <div
          className={cn(
            "mt-10 grid gap-6 rounded-sheet bg-volt p-7 text-ink md:mt-16",
            "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-12 md:p-12",
          )}
        >
          <div className="relative aspect-[5/3] overflow-hidden rounded-card bg-ink/10">
            <Image
              src="/images/main/fisheye.jpg"
              alt="Traveller photographed from above on a grassy path, phone in hand"
              fill
              quality={90}
              sizes="(min-width: 1280px) 480px, (min-width: 768px) 38vw, 100vw"
              className="object-cover object-center"
            />
          </div>

          <div className="md:pr-4">
            <p
              className={cn(
                "max-w-[32ch] font-semibold tracking-[-0.015em]",
                "text-[clamp(1.4rem,1.2rem+0.95vw,1.875rem)]/[1.2]",
              )}
            >
              This is what travelling connected should feel like. Check your
              data, top up, and switch destinations without a kiosk or a queue.
              Every plan in one place, so you can focus on the trip.
            </p>

            <NowsimLogo className="mt-8 h-4 w-auto text-ink md:mt-10 md:h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
