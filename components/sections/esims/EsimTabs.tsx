"use client";

import type { KeyboardEvent } from "react";
import { useId, useRef, useState } from "react";
import { MdSignalCellularAlt } from "react-icons/md";

import { EsimCard } from "@/components/sections/esims/EsimCard";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";
import { isArchivedEsim, type Esim } from "@/lib/types";

const tab = cn(
  "rounded-full px-5 py-2 text-sm font-medium",
  "transition-colors duration-300 ease-hover motion-reduce:transition-none",
);

const tabActive = cn(tab, "bg-ink text-white");

const tabIdle = cn(tab, "text-muted hover:bg-surface-soft hover:text-ink");

const tabs = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const empty: Record<TabId, { title: string; body: string }> = {
  active: {
    title: "You don’t have any active eSIMs yet",
    body: "Buy a new eSIM to stay connected while traveling",
  },
  archived: {
    title: "Nothing archived yet",
    body: "Expired and removed eSIMs are kept here",
  },
};

function Empty({ tabId }: { tabId: TabId }) {
  const { title, body } = empty[tabId];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-sheet",
        "border border-hairline bg-surface-soft px-6 py-24 text-center",
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-card bg-brand/10">
        <MdSignalCellularAlt aria-hidden className="h-7 w-7 text-brand" />
      </span>

      <h2 className="mt-5 text-lg font-bold tracking-[-0.02em]">{title}</h2>

      <p className="mt-1 text-base text-muted">{body}</p>
    </div>
  );
}

// The heading rides along so it can share a flex row with the tablist.
export function EsimTabs({ esims, title }: { esims: Esim[]; title: string }) {
  const groupId = useId();

  const groups: Record<TabId, Esim[]> = {
    active: esims.filter((esim) => !isArchivedEsim(esim)),
    archived: esims.filter(isArchivedEsim),
  };

  const [activeTab, setActiveTab] = useState<TabId>("active");

  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (step === 0) return;

    event.preventDefault();

    const current = tabs.findIndex(({ id }) => id === activeTab);
    const next = tabs[(current + step + tabs.length) % tabs.length];

    setActiveTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const shown = groups[activeTab];

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-h2 font-extrabold tracking-[-0.045em]">{title}</h1>

        <div
          role="tablist"
          aria-label="eSIM status"
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-hairline p-1"
        >
          {tabs.map(({ id, label }) => {
            const active = id === activeTab;

            return (
              <Pressable
                key={id}
                ref={(node) => {
                  tabRefs.current[id] = node;
                }}
                id={`${groupId}-tab-${id}`}
                role="tab"
                aria-selected={active}
                aria-controls={`${groupId}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveTab(id)}
                onKeyDown={onTabKeyDown}
                className={active ? tabActive : tabIdle}
              >
                {label}
                {groups[id].length > 0 && (
                  <span className={active ? "ml-1.5 text-white/70" : "ml-1.5"}>
                    {groups[id].length}
                  </span>
                )}
              </Pressable>
            );
          })}
        </div>
      </div>

      <div
        id={`${groupId}-panel`}
        role="tabpanel"
        aria-labelledby={`${groupId}-tab-${activeTab}`}
        className="mt-8"
      >
        {shown.length === 0 ? (
          <Empty tabId={activeTab} />
        ) : (
          <ul className="flex flex-col gap-4">
            {shown.map((esim) => (
              <EsimCard key={esim.id} esim={esim} />
            ))}
          </ul>
        )}
      </div>

      <Pressable
        href="/destinations"
        className={cn(
          "mt-8 w-full rounded-full bg-volt px-8 py-4",
          "text-base font-bold text-ink hover:bg-volt/85 active:bg-volt/85",
        )}
      >
        Buy new plan
      </Pressable>
    </>
  );
}
