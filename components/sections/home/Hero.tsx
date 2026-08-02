import { DestinationSearch } from "@/components/ui/DestinationSearch";
import { cn } from "@/lib/cn";

export function Hero() {
  return (
    <section className="h-[100dvh] p-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:p-4">
      <div className="relative h-full w-full overflow-hidden rounded-screen bg-ink md:rounded-screen-lg">
        <video
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full rounded-screen object-cover md:rounded-screen-lg"
          src="/videos/hero.mp4"
        />

        <div aria-hidden className="absolute inset-0 bg-ink/70" />

        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center px-6 text-center",
            // reserve exactly the nav pill's height + offset, so the block centers
            // between the top of the viewport and the top of the pill
            "pb-[calc(3.5rem+max(1.75rem,env(safe-area-inset-bottom)+0.75rem))]",
          )}
        >
          <h1 className="max-w-4xl text-display tracking-[0.02em] text-white subpixel-antialiased [-webkit-text-stroke:0.04em_currentColor]">
            STAY <span className="text-volt">CONNECTED</span>{" "}
            {"WHENEVER’S NEXT"}
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-invert md:text-2xl">
            One connection. Every destination.
          </p>

          <DestinationSearch className="mt-8" />
        </div>
      </div>
    </section>
  );
}
