import Image from "next/image";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

export function GetApp() {
  return (
    <section
      aria-labelledby="get-app-heading"
      className="px-3 pt-16 pb-20 md:px-4 md:pt-24 md:pb-28"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        {/* Oval crop echoes the pill imagery in About */}
        <div className="relative aspect-[16/10] w-full max-w-2xl overflow-hidden rounded-full bg-surface-soft md:aspect-[16/8]">
          <Image
            src="/images/home/pose.jpg"
            alt="NOWSIM traveller holding their phone, plan already installed"
            fill
            quality={90}
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <h2
          id="get-app-heading"
          className={cn(
            "mt-12 max-w-[16ch] uppercase md:mt-16",
            "text-h1 tracking-[-0.045em] subpixel-antialiased",
            "[-webkit-text-stroke:0.022em_currentColor]",
          )}
        >
          Get the NOWSIM app
        </h2>

        <p className="mt-4 text-h3 font-medium text-ink-soft">
          Just one tap to install
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Pressable
            href="#"
            className={cn(
              "rounded-full bg-ink px-7 py-3.5",
              "text-base font-bold text-white",
              "hover:bg-ink-deep active:bg-ink-deep",
            )}
          >
            Download app
          </Pressable>

          <Pressable
            href="#"
            className={cn(
              "rounded-full border border-hairline px-7 py-3.5",
              "text-base font-medium text-ink",
              "hover:bg-surface-soft active:bg-surface-soft",
            )}
          >
            Explore plans
          </Pressable>
        </div>
      </div>
    </section>
  );
}
