import type { IconType } from "react-icons";
import { FaStar } from "react-icons/fa6";
import { MdSignalCellularAlt } from "react-icons/md";
import { TbDeviceMobile, TbWorld } from "react-icons/tb";

import { DestinationSearch } from "@/components/ui/DestinationSearch";
import { cn } from "@/lib/cn";

type TrustPoint = {
  icon: IconType;
  label: string;
  /** Trustpilot's star keeps its brand green; the rest inherit white */
  iconClassName?: string;
};

const trustPoints: TrustPoint[] = [
  {
    icon: FaStar,
    label: "Trustpilot score 4.8 out of 5!",
    iconClassName: "text-[#00b67a]",
  },
  { icon: TbWorld, label: "One price, everywhere" },
  { icon: MdSignalCellularAlt, label: "Highest available speed" },
  { icon: TbDeviceMobile, label: "Pause the plan any time" },
];

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
          <h1 className="max-w-4xl text-display font-black tracking-[0.02em] text-white">
            STAY <span className="text-volt">CONNECTED</span>{" "}
            {"WHENEVER’S NEXT"}
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-invert md:text-2xl">
            One connection. Every destination.
          </p>

          <DestinationSearch className="mt-8" />

          <ul
            className={cn(
              "mt-14 grid w-full max-w-xl grid-cols-2 gap-x-6 gap-y-4",
              // four across only once the row fits without wrapping mid-label
              "lg:flex lg:max-w-none lg:justify-center lg:gap-x-10",
            )}
          >
            {trustPoints.map(({ icon: Icon, label, iconClassName }) => (
              <li key={label} className="flex items-center gap-3 text-left">
                <span
                  className={cn(
                    "flex h-10 shrink-0 items-center justify-center rounded-full px-5",
                    "border border-white/25 bg-white/10 backdrop-blur-sm",
                  )}
                >
                  <Icon
                    aria-hidden
                    className={cn("h-5 w-5 text-white", iconClassName)}
                  />
                </span>

                <span className="text-base font-semibold text-white">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
