"use client";

import { usePathname } from "next/navigation";

import { NowsimEmblem } from "@/components/ui/NowsimEmblem";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

import { MobileNav } from "./MobileNav";
import { SignInButton } from "./SignInButton";
import { navLinks } from "./nav-links";

const glass =
  "bg-white/60 backdrop-blur-xl backdrop-saturate-150 border border-white/50 shadow-lg shadow-ink/10";

const label = "text-base font-medium";

export function Header() {
  // The home hero is built around a pill floating over the video, so only that
  // route keeps it at the bottom — every other page gets a conventional top bar
  const atBottom = usePathname() === "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 px-5 md:px-3",
        atBottom
          ? "bottom-[max(1.75rem,calc(env(safe-area-inset-bottom)+0.75rem))]"
          : "top-[max(1.75rem,calc(env(safe-area-inset-top)+0.75rem))]",
        "pointer-events-none",
      )}
    >
      <MobileNav links={navLinks} openUp={atBottom} />

      <nav
        aria-label="Main"
        className={cn(
          glass,
          "pointer-events-auto mx-auto hidden w-fit items-center gap-1 rounded-full p-1.5 md:flex",
        )}
      >
        <Pressable href="/" hit className="rounded-full p-2.5 text-ink">
          <NowsimEmblem id="nowsim-emblem-desktop" className="h-6 w-6" />
          <span className="sr-only">nowsim home</span>
        </Pressable>

        <ul className="flex items-center">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Pressable
                href={link.href}
                hit
                className={cn(
                  label,
                  "rounded-full px-4 py-2.5 text-ink hover:bg-ink/5 active:bg-ink/10",
                )}
              >
                {link.label}
              </Pressable>
            </li>
          ))}
        </ul>

        <SignInButton
          hit
          className={cn(
            label,
            "rounded-full bg-volt px-5 py-2.5 text-ink",
            "hover:bg-ink-deep hover:text-volt active:bg-ink-deep active:text-volt",
          )}
        />
      </nav>
    </header>
  );
}
