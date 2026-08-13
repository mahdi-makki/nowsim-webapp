"use client";

import type { KeyboardEvent } from "react";
import { useId, useRef, useState } from "react";
import { MdChevronRight, MdLightbulbOutline } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";
import type { InstallMethod, InstallMethodId, InstallStep } from "@/lib/install";

const tab = cn(
  "w-full rounded-full px-5 py-3.5 text-base font-bold",
  "transition-colors duration-300 ease-hover motion-reduce:transition-none",
);

const tabActive = cn(tab, "bg-ink text-white");

const tabIdle = cn(tab, "text-muted hover:bg-ink/5 active:bg-ink/10");

function PathChips({ path }: { path: string[] }) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-1.5">
      {path.map((crumb, index) => (
        <span key={`${index}-${crumb}`} className="flex items-center gap-1.5">
          {index > 0 && (
            <MdChevronRight aria-hidden className="h-4 w-4 text-ink/30" />
          )}

          <span className="rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-sm font-medium">
            {crumb}
          </span>
        </span>
      ))}
    </p>
  );
}

function StepCard({
  step,
  index,
  total,
}: {
  step: InstallStep;
  index: number;
  total: number;
}) {
  return (
    <li className="relative md:pl-24">
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-0 hidden h-14 w-14 items-center justify-center md:flex",
          "rounded-full bg-ink font-display text-xl font-extrabold text-white",
        )}
      >
        {index + 1}
      </span>

      {index + 1 < total && (
        <span
          aria-hidden
          className="absolute -bottom-10 left-7 top-16 hidden w-px bg-hairline md:block"
        />
      )}

      <article className="rounded-sheet border border-hairline bg-surface-soft p-6 md:p-8">
        <p className="text-eyebrow uppercase text-brand">
          Step {index + 1} of {total}
        </p>

        <h3 className="mt-3 max-w-[28ch] text-h3">{step.title}</h3>

        {step.path && <PathChips path={step.path} />}

        <p className="mt-4 max-w-[62ch] text-base text-muted md:text-lg">
          {step.body}
        </p>

        {step.tip && (
          <div className="mt-5 flex items-start gap-3 rounded-card bg-surface px-4 py-3.5">
            <MdLightbulbOutline
              aria-hidden
              className="mt-0.5 h-5 w-5 shrink-0 text-ink/40"
            />

            <p className="text-sm text-muted">{step.tip}</p>
          </div>
        )}
      </article>
    </li>
  );
}

export function InstallSteps({ methods }: { methods: InstallMethod[] }) {
  const groupId = useId();

  const [activeId, setActiveId] = useState<InstallMethodId>(methods[0].id);

  const tabRefs = useRef<
    Partial<Record<InstallMethodId, HTMLButtonElement | null>>
  >({});

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (step === 0) return;

    event.preventDefault();

    const current = methods.findIndex(({ id }) => id === activeId);
    const next = methods[(current + step + methods.length) % methods.length];

    setActiveId(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const active = methods.find(({ id }) => id === activeId) ?? methods[0];

  return (
    <>
      <div
        role="tablist"
        aria-label="Installation method"
        className="mt-10 grid grid-cols-2 gap-1 rounded-full border border-hairline p-1"
      >
        {methods.map((method) => {
          const selected = method.id === activeId;

          return (
            <Pressable
              key={method.id}
              ref={(node) => {
                tabRefs.current[method.id] = node;
              }}
              id={`${groupId}-tab-${method.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${groupId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(method.id)}
              onKeyDown={onTabKeyDown}
              className={selected ? tabActive : tabIdle}
            >
              {method.label}
            </Pressable>
          );
        })}
      </div>

      <div
        id={`${groupId}-panel`}
        role="tabpanel"
        aria-labelledby={`${groupId}-tab-${active.id}`}
      >
        <p className="mt-6 max-w-[62ch] text-base text-muted md:text-lg">
          {active.blurb}
        </p>

        <ol className="mt-10 flex flex-col gap-10">
          {active.steps.map((step, index) => (
            <StepCard
              key={step.title}
              step={step}
              index={index}
              total={active.steps.length}
            />
          ))}
        </ol>
      </div>
    </>
  );
}
