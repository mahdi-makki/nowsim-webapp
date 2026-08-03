"use client";

import { useEffect, useId, useState } from "react";

import { NowsimEmblem } from "@/components/ui/NowsimEmblem";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

import type { NavLink } from "./nav-links";
import { SignInButton } from "./SignInButton";

const glass =
  "bg-white/60 backdrop-blur-xl backdrop-saturate-150 border border-white/50 shadow-lg shadow-ink/10";

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={cn(
        "h-5 w-5 transition-transform duration-200 ease-ios",
        "motion-reduce:transition-none",
        open && "rotate-45",
      )}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MobileNav({
  links,
  /** The panel unfolds away from the pill, so it follows the pill's position */
  openUp = true,
}: {
  links: NavLink[];
  openUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav aria-label="Main" className="pointer-events-auto relative md:hidden">
      <div
        id={panelId}
        className={cn(
          "absolute inset-x-0",
          openUp
            ? "bottom-full origin-bottom pb-2"
            : "top-full origin-top pt-2",
          // the fade runs at half the scale's duration — a panel still at 40%
          // opacity reads as "not there yet", so matching both to 300ms makes
          // the menu feel like it lags the tap
          "transition-[transform,opacity,visibility]",
          "[transition-duration:300ms,150ms,300ms]",
          open
            ? "visible scale-100 opacity-100 ease-pop"
            : "invisible scale-95 opacity-0 ease-ios",
          "motion-reduce:scale-100",
        )}
      >
        <div className={cn(glass, "rounded-sheet p-2")}>
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <Pressable
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="w-full justify-start rounded-full px-5 py-3 text-base text-ink hover:bg-ink/5 active:bg-ink/10"
                >
                  {link.label}
                </Pressable>
              </li>
            ))}
          </ul>

          <SignInButton
            onOpen={() => setOpen(false)}
            className={cn(
              "mt-1 w-full rounded-full bg-volt px-5 py-3 text-base text-ink",
              "hover:bg-ink-deep hover:text-volt active:bg-ink-deep active:text-volt",
            )}
          />
        </div>
      </div>

      <Pressable
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(glass, "w-full rounded-full px-6 py-4 text-ink")}
      >
        <span className="flex w-full items-center justify-between">
          <NowsimEmblem id="nowsim-emblem-mobile" className="h-6 w-6" />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <ToggleIcon open={open} />
        </span>
      </Pressable>
    </nav>
  );
}