import type { IconType } from "react-icons";
import { FaAndroid, FaApple } from "react-icons/fa6";
import { MdArrowForward } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";
import { installHref, type InstallGuide, type InstallPlatformId } from "@/lib/install";

type Skin = {
  Icon: IconType;
  surface: string;
  chrome: string;
  copy: string;
};

const skins: Record<InstallPlatformId, Skin> = {
  ios: {
    Icon: FaApple,
    surface: "bg-ink text-white",
    chrome: "border-white/20 bg-white/10",
    copy: "text-muted-invert",
  },
  android: {
    Icon: FaAndroid,
    surface: "bg-volt text-ink",
    chrome: "border-ink/15 bg-ink/5",
    copy: "text-ink/70",
  },
};

export function PlatformCards({
  guides,
  className,
}: {
  guides: InstallGuide[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-4 md:grid-cols-2 md:gap-5", className)}>
      {guides.map((guide) => {
        const skin = skins[guide.id];

        return (
          <li key={guide.id}>
            <Pressable
              href={installHref(guide.id)}
              className={cn(
                "h-full w-full flex-col items-center rounded-sheet p-7 text-center md:p-9",
                skin.surface,
              )}
            >
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-card border",
                  skin.chrome,
                )}
              >
                <skin.Icon aria-hidden className="h-7 w-7" />
              </span>

              <span className="mt-6 font-display text-h2 font-extrabold uppercase tracking-[-0.045em]">
                Installation for {guide.label}
              </span>

              <span className={cn("mt-3 text-base md:text-lg", skin.copy)}>
                {guide.devices}
              </span>

              <span className={cn("mt-1 text-sm", skin.copy)}>
                {guide.versions}
              </span>

              <span className="mt-8 inline-flex items-center gap-2 text-base font-bold">
                See the steps
                <MdArrowForward aria-hidden className="h-4 w-4" />
              </span>
            </Pressable>
          </li>
        );
      })}
    </ul>
  );
}
