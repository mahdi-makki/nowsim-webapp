"use client";

import { useEffect, useState } from "react";

import { NowsimEmblem } from "@/components/ui/NowsimEmblem";
import { cn } from "@/lib/cn";

export function AppQrDock() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;

    function read() {
      frame = 0;
      // the hero fills the viewport, so one screen of scroll means it's behind us
      setShown(window.scrollY > window.innerHeight * 0.85);
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(read);
    }

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        // a QR pointing at the app store is dead weight on the device that
        // would scan it — desktop only
        "pointer-events-none fixed right-5 bottom-7 z-50 hidden md:block",
        "transition-[opacity,visibility] duration-300 ease-hover",
        shown ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-2 rounded-card bg-volt p-2.5 text-ink",
          "shadow-lg shadow-ink/15",
        )}
      >
        {/* QR itself lands later — placeholder keeps the footprint honest */}
        <span
          aria-hidden
          className="flex h-28 w-28 items-center justify-center rounded-[12px] bg-white/70"
        >
          <NowsimEmblem id="nowsim-emblem-qr" className="h-8 w-8 text-ink" />
        </span>

        <span className="text-sm font-bold">Download App</span>
      </div>
    </div>
  );
}
