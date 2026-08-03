import type { IconType } from "react-icons";
import { FaStar } from "react-icons/fa6";
import { MdSignalCellularAlt } from "react-icons/md";
import { TbDeviceMobile, TbWorld } from "react-icons/tb";

import { cn } from "@/lib/cn";

type TrustPoint = {
  icon: IconType;
  label: string;
  /** Trustpilot's star keeps its brand green; the rest follow the tone */
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

export function TrustBar({
  /** `dark` sits on the hero video, `light` on the plain page background */
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const onVideo = tone === "dark";

  return (
    <ul
      className={cn(
        "mx-auto grid w-full max-w-xl grid-cols-2",
        // four across only once the row fits without wrapping mid-label
        "lg:flex lg:max-w-none lg:justify-center",
        // the light bar owns a full section, so it can breathe; the hero's is
        // one element in a stack and stays tight
        onVideo
          ? "gap-x-6 gap-y-4 lg:gap-x-10"
          : "gap-x-8 gap-y-8 lg:gap-x-16",
        className,
      )}
    >
      {trustPoints.map(({ icon: Icon, label, iconClassName }) => (
        <li key={label} className="flex items-center gap-3 text-left">
          <span
            className={cn(
              "flex h-10 shrink-0 items-center justify-center rounded-full px-5",
              onVideo
                ? "border border-white/25 bg-white/10 backdrop-blur-sm"
                : "border border-hairline bg-surface-soft",
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                "h-5 w-5",
                onVideo ? "text-white" : "text-ink",
                iconClassName,
              )}
            />
          </span>

          <span
            className={cn(
              "text-base font-semibold",
              onVideo ? "text-white" : "text-ink",
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
