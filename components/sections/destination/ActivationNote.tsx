"use client";

import { useSyncExternalStore } from "react";

const ACTIVATION_WINDOW_DAYS = 30;

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.5v.5" />
    </svg>
  );
}

const subscribe = () => () => {};

function deadlineFromToday() {
  const date = new Date();
  date.setDate(date.getDate() + ACTIVATION_WINDOW_DAYS);

  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function ActivationNote() {
  const onClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const deadline = onClient ? deadlineFromToday() : null;

  return (
    <div className="mt-8 flex items-center gap-4 rounded-card bg-surface-soft px-5 py-5">
      <InfoIcon className="h-5 w-5 shrink-0 text-ink/40" />

      <div className="text-sm text-muted">
        <p className="font-bold text-ink">Can I activate my plan later?</p>

        <p className="mt-1">
          Every plan has a {ACTIVATION_WINDOW_DAYS}-day activation window.
          {deadline
            ? ` Leave it untouched and it activates itself on ${deadline}.`
            : " Leave it untouched and it activates itself at the end of it."}
        </p>
      </div>
    </div>
  );
}
