"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMail } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

type Provider = {
  label: string;
  href: string;
  Icon: IconType;
  className: string;
};

const providers: Provider[] = [
  {
    label: "Continue with Apple",
    href: "/login/apple",
    Icon: FaApple,
    className: "bg-white text-ink hover:bg-white/85 active:bg-white/85",
  },
  {
    label: "Continue with Google",
    href: "/login/google",
    Icon: FcGoogle,
    className: "bg-volt text-ink hover:bg-volt/85 active:bg-volt/85",
  },
  {
    label: "Continue with Email",
    href: "/login/email",
    Icon: MdOutlineMail,
    className: "bg-white/10 text-white hover:bg-white/20 active:bg-white/20",
  },
];

const legal = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Storage of the Cardholder's Credential", href: "#" },
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className="h-5 w-5">
      <path
        d="m6 6 12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const focusable =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* hydration-safe "are we on the client yet" — the portal needs a real
   document.body, which only exists after hydration */
const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function SignInDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const mounted = useSyncExternalStore(subscribe, onClient, onServer);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    // restore focus to whatever opened the dialog once it closes
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLElement>(focusable)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const items = panelRef.current?.querySelectorAll<HTMLElement>(focusable);
      if (!items || items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      // keeps the closed dialog out of the tab order while it stays mounted
      // for the exit transition
      inert={!open}
      className={cn(
        // visibility only — the backdrop and the panel each time their own fade,
        // and the longest of them (the panel, 300ms) sets the unmount delay
        "fixed inset-0 z-[60] flex items-center justify-center px-5",
        "transition-[visibility] duration-300",
        open ? "visible" : "invisible",
        "motion-reduce:transition-none",
      )}
    >
      {/* backdrop — click-to-dismiss lives here so the panel keeps its own clicks.
          Fades faster than the panel: a half-faded blur reads as no blur at all,
          so matching the panel's 300ms makes the dim look like it lags the tap. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-default",
          "bg-ink/45 backdrop-blur-md backdrop-saturate-150",
          "transition-opacity duration-150 ease-out",
          open ? "opacity-100" : "opacity-0",
          "motion-reduce:transition-none",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative w-full max-w-[27rem]",
          "transition-[transform,opacity] duration-300",
          open ? "scale-100 opacity-100 ease-pop" : "scale-95 opacity-0 ease-ios",
          "motion-reduce:scale-100 motion-reduce:transition-none",
        )}
      >
        <div className="relative rounded-sheet bg-ink p-7 text-white shadow-2xl shadow-ink/30 md:p-8">
          <Pressable
            onClick={onClose}
            className={cn(
              "absolute right-4 top-4 h-9 w-9 rounded-full",
              // Pressable's `hit` prop can't be used here — it brings a
              // `relative` that outranks this `absolute` in Tailwind's output.
              // Same 44px target, minus the positioning.
              "after:absolute after:left-1/2 after:top-1/2 after:content-['']",
              "after:h-11 after:w-11 after:-translate-x-1/2 after:-translate-y-1/2",
              // a solid ink chip would vanish against the card — tint instead
              "bg-white/10 text-white/70",
              "hover:bg-white/20 hover:text-white active:bg-white/20",
            )}
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </Pressable>

          {/* pr-12 clears the close chip; text-h3 and the base h2 rule both
              carry 900, so the bold override has to be explicit */}
          <h2 id={titleId} className="pr-12 text-h3 font-bold">
            Sign in to continue
          </h2>

          <ul className="mt-6 flex flex-col gap-3">
            {providers.map((provider) => (
              <li key={provider.label}>
                <Pressable
                  href={provider.href}
                  className={cn(
                    "w-full gap-3 rounded-full px-5 py-3.5",
                    "text-base font-bold tracking-[-0.01em]",
                    provider.className,
                  )}
                >
                  <provider.Icon aria-hidden className="h-5 w-5 shrink-0" />
                  {provider.label}
                </Pressable>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-center text-xs leading-relaxed text-white/45">
            By clicking &ldquo;Continue&rdquo;, you agree to our{" "}
            {legal.map((item, index) => (
              <span key={item.label}>
                <Pressable
                  href={item.href}
                  press={false}
                  className={cn(
                    "inline font-bold text-white/70 underline underline-offset-2",
                    // `press={false}` drops the `press` utility, and with it the
                    // colour transition — so hover has to be eased by hand
                    "transition-colors duration-300 ease-hover hover:text-volt",
                    "motion-reduce:transition-none",
                  )}
                >
                  {item.label}
                </Pressable>
                {index === legal.length - 2
                  ? " and "
                  : index < legal.length - 1
                    ? ", "
                    : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
