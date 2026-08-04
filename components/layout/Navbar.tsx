"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";

import { NowsimLogo } from "@/components/ui/NowsimLogo";
import { Pressable } from "@/components/ui/Pressable";
import { SignInDialog } from "@/components/ui/SignInDialog";
import { cn } from "@/lib/cn";

import { MenuPanel, MenuToggle } from "./MobileNavbar";

const HOME = "/";

const HIDE_AFTER = 96;

const DIRECTION_DELTA = 6;

const navLinks = [
  { label: "Personal", href: "#" },
  { label: "Business", href: "#" },
  { label: "Use Cases", href: "#" },
  { label: "About", href: "#" },
];

function useScrollState(pathname: string) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = Math.max(window.scrollY, 0);
    let frame = 0;

    function measure() {
      frame = 0;
      const y = Math.max(window.scrollY, 0);
      setScrolled(y > 8);

      const delta = y - last;
      if (Math.abs(delta) < DIRECTION_DELTA) return;

      if (Math.abs(delta) > window.innerHeight) {
        last = y;
        return;
      }

      last = y;
      setHidden(delta > 0 && y > HIDE_AFTER);
    }

    function resync() {
      frame = 0;
      last = Math.max(window.scrollY, 0);
      setScrolled(last > 8);
      setHidden(false);
    }

    function schedule(read: () => void) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    function onPageShow() {
      schedule(resync);
    }

    schedule(resync);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [pathname]);

  return { scrolled, hidden };
}

export function Navbar() {
  const pathname = usePathname();
  const { scrolled, hidden } = useScrollState(pathname);
  const [open, setOpen] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const panelId = useId();
  const [seenPath, setSeenPath] = useState(pathname);

  const close = useCallback(() => setOpen(false), []);
  const closeSignIn = useCallback(() => setSignIn(false), []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-ink">
        <div
          className={cn(
            "pt-[env(safe-area-inset-top)]",
            "transition-transform duration-300 ease-ios motion-reduce:transition-none",
            hidden && !open && "-translate-y-full",
          )}
        >
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 border-b border-hairline",
              "bg-white/70 backdrop-blur-xl backdrop-saturate-150",
              "transition-opacity duration-300 ease-hover motion-reduce:transition-none",
              scrolled || pathname !== HOME ? "opacity-100" : "opacity-0",
            )}
          />

          <div className="relative mx-auto flex h-(--header-height) max-w-7xl items-center justify-between px-5 md:px-8">
            <Pressable
              href="/"
              hit
              aria-label="nowsim home"
              className="-m-2 shrink-0 rounded-full p-2"
            >
              <NowsimLogo
                id="nowsim-logo-header"
                className="h-6 w-auto md:h-7"
              />
            </Pressable>

            <nav
              aria-label="Main"
              className="absolute left-1/2 hidden -translate-x-1/2 md:block"
            >
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Pressable
                      href={link.href}
                      hit
                      className={cn(
                        "rounded-full px-4 py-2.5 text-base font-medium",
                        "hover:bg-ink/5 active:bg-ink/10",
                      )}
                    >
                      {link.label}
                    </Pressable>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3 md:gap-4">
              <Pressable
                hit
                aria-haspopup="dialog"
                aria-expanded={signIn}
                onClick={() => setSignIn(true)}
                className={cn(
                  "rounded-full bg-volt px-4 py-2.5 text-base font-medium text-ink md:px-5",
                  "hover:bg-ink-deep hover:text-volt active:bg-ink-deep active:text-volt",
                )}
              >
                Sign in
              </Pressable>

              <MenuToggle
                open={open}
                onToggle={() => setOpen((value) => !value)}
                panelId={panelId}
              />
            </div>
          </div>
        </div>
      </header>

      <MenuPanel
        links={navLinks}
        open={open}
        onClose={close}
        panelId={panelId}
      />

      <SignInDialog open={signIn} onClose={closeSignIn} />
    </>
  );
}
