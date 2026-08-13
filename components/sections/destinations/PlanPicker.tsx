"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useId, useRef, useState } from "react";
import { MdStar, MdVerifiedUser } from "react-icons/md";

import { ActivationNote } from "@/components/sections/destinations/ActivationNote";
import { DeviceDialog } from "@/components/sections/destinations/DeviceDialog";
import { Pressable } from "@/components/ui/Pressable";
import { formatMoney, scaleMoney } from "@/lib/money";
import { MAX_ESIMS, checkoutHref } from "@/lib/checkout";
import type { DestinationKind, DeviceGroup, Plan } from "@/lib/types";
import { cn } from "@/lib/cn";

const stepper =
  "h-10 w-10 rounded-full border border-hairline text-xl leading-none";

const stepperAdd = cn(
  stepper,
  "enabled:border-ink enabled:bg-ink enabled:text-white",
  "enabled:hover:border-ink-soft enabled:hover:bg-ink-soft",
);

const card = cn(
  "relative flex flex-col rounded-card border px-5 py-4",
  "press",
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
);

const cardIdle = cn(
  "border-hairline bg-surface",
  "hover:border-ink/25 hover:shadow-lg hover:shadow-ink/8",
);

const cardPicked = "border-brand bg-brand/5";

const tab = "rounded-full px-5 py-2 text-sm font-medium";

const tabActive = cn(tab, "bg-ink text-white");

const tabIdle = cn(tab, "text-muted hover:bg-surface-soft hover:text-ink");

const tabs = [
  { id: "fixed", label: "Prepaid plans" },
  { id: "unlimited", label: "Unlimited plans" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function PlanPicker({
  plans,
  destinationName,
  destinationKind,
  destinationSlug,
  deviceGroups,
}: {
  plans: Plan[];
  destinationName: string;
  destinationKind: DestinationKind;
  destinationSlug: string;
  deviceGroups: DeviceGroup[];
}) {
  const groupId = useId();

  const groups: Record<TabId, Plan[]> = {
    fixed: plans.filter((plan) => !plan.unlimited),
    unlimited: plans.filter((plan) => plan.unlimited),
  };

  const tabbed = groups.fixed.length > 0 && groups.unlimited.length > 0;

  const [activeTab, setActiveTab] = useState<TabId>(() =>
    groups.fixed.length > 0 ? "fixed" : "unlimited",
  );

  const shownPlans = tabbed ? groups[activeTab] : plans;

  const [selectedId, setSelectedId] = useState(() => shownPlans[0].id);

  const [quantity, setQuantity] = useState(1);

  const [deviceOpen, setDeviceOpen] = useState(false);
  const closeDevices = useCallback(() => setDeviceOpen(false), []);

  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  const pickTab = (id: TabId) => {
    setActiveTab(id);
    setSelectedId(groups[id][0].id);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (step === 0) return;

    event.preventDefault();

    const current = tabs.findIndex(({ id }) => id === activeTab);
    const next = tabs[(current + step + tabs.length) % tabs.length];

    pickTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const selectedPlan =
    shownPlans.find((plan) => plan.id === selectedId) ?? shownPlans[0];

  const total = formatMoney(scaleMoney(selectedPlan.price, quantity));

  return (
    <>
      {tabbed && (
        <div
          role="tablist"
          aria-label={`Plan type for ${destinationName}`}
          className="mt-6 inline-flex items-center gap-1 rounded-full border border-hairline p-1"
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
                onClick={() => pickTab(id)}
                onKeyDown={onTabKeyDown}
                className={active ? tabActive : tabIdle}
              >
                {label}
              </Pressable>
            );
          })}
        </div>
      )}

      <fieldset
        id={tabbed ? `${groupId}-panel` : undefined}
        role={tabbed ? "tabpanel" : undefined}
        aria-labelledby={tabbed ? `${groupId}-tab-${activeTab}` : undefined}
        className={tabbed ? "mt-4" : "mt-6"}
      >
        <legend className="sr-only">
          Choose a data plan for {destinationName}
        </legend>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shownPlans.map((plan) => {
            const inputId = `${groupId}-${plan.id}`;
            const picked = plan.id === selectedId;

            return (
              <li
                key={plan.id}
                className={cn(card, picked ? cardPicked : cardIdle)}
              >
                <input
                  type="radio"
                  id={inputId}
                  name={groupId}
                  value={plan.id}
                  checked={picked}
                  onChange={() => setSelectedId(plan.id)}
                  className="sr-only"
                />

                <div className="flex items-start justify-between gap-3">
                  <label
                    htmlFor={inputId}
                    className="cursor-pointer text-xl font-bold tracking-[-0.02em] after:absolute after:inset-0 after:content-['']"
                  >
                    {plan.data}
                    <span className="sr-only">, {plan.days} days</span>
                  </label>

                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 h-5 w-5 shrink-0 rounded-full border",
                      "transition-[border-width,border-color] duration-300 ease-hover",
                      "motion-reduce:transition-none",
                      picked ? "border-[6px] border-brand" : "border-ink/25",
                    )}
                  />
                </div>

                <p
                  aria-hidden
                  className={cn(
                    "mt-2 w-fit rounded-full border border-hairline px-2.5 py-0.5",
                    "text-[0.8125rem]/[1.125rem] font-medium text-muted",
                  )}
                >
                  {plan.days} days
                </p>

                <p className="mt-auto pt-2 text-right text-lg font-bold tracking-[-0.02em]">
                  {formatMoney(plan.price)}
                </p>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <ActivationNote />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold tracking-[-0.02em]">
            Choose number of eSIMs
          </p>
          <p className="text-sm text-muted">How many travellers?</p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-hairline p-1.5">
          <Pressable
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="Remove one eSIM"
            className={cn(stepper, "hover:bg-surface-soft")}
          >
            &minus;
          </Pressable>

          <span
            aria-live="polite"
            className="min-w-[4.75rem] text-center text-base font-bold"
          >
            {quantity} eSIM{quantity > 1 ? "s" : ""}
          </span>

          <Pressable
            onClick={() =>
              setQuantity((current) => Math.min(MAX_ESIMS, current + 1))
            }
            disabled={quantity >= MAX_ESIMS}
            aria-label="Add one eSIM"
            className={stepperAdd}
          >
            +
          </Pressable>
        </div>
      </div>

      <Pressable
        href={checkoutHref(
          destinationKind,
          destinationSlug,
          selectedPlan.id,
          quantity,
        )}
        className="mt-8 w-full rounded-full bg-volt px-8 py-4 text-base font-bold text-ink hover:bg-volt/85"
      >
        Go to checkout - {total}
      </Pressable>

      <Pressable
        aria-haspopup="dialog"
        aria-expanded={deviceOpen}
        onClick={() => setDeviceOpen(true)}
        className={cn(
          "mt-3 w-full rounded-full border border-ink px-8 py-4",
          "text-base font-bold text-ink",
          "hover:bg-surface-soft",
        )}
      >
        Device compatibility
      </Pressable>

      <DeviceDialog
        open={deviceOpen}
        onClose={closeDevices}
        deviceGroups={deviceGroups}
      />

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <li className="flex items-center gap-2 text-base font-medium text-ink">
          <MdStar aria-hidden className="h-4 w-4" />
          4.7 (97,400+ reviews)
        </li>

        <li className="flex items-center gap-2 text-base font-medium text-ink">
          <MdVerifiedUser aria-hidden className="h-5 w-5 text-success" />
          Secure payment guaranteed
        </li>
      </ul>
    </>
  );
}
