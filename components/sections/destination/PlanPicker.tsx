"use client";

import { useCallback, useId, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { MdVerifiedUser } from "react-icons/md";

import { ActivationNote } from "@/components/sections/destination/ActivationNote";
import { DeviceDialog } from "@/components/ui/DeviceDialog";
import { Pressable } from "@/components/ui/Pressable";
import { formatTotal, parsePrice, type Plan } from "@/lib/plans";
import { cn } from "@/lib/cn";

/** One order can't run away with the cart */
const MAX_ESIMS = 10;

const stepper = cn(
  "h-10 w-10 rounded-full border border-hairline text-xl leading-none",
  "transition-colors duration-300 ease-hover motion-reduce:transition-none",
);

// Adding is the step we want people to take, so only the plus fills in. At the
// top of the range it drops back to the outline, which Pressable then dims
const stepperAdd = cn(
  stepper,
  "enabled:border-ink enabled:bg-ink enabled:text-white",
  "enabled:hover:border-ink-soft enabled:hover:bg-ink-soft",
);

export function PlanPicker({
  plans,
  destinationName,
}: {
  plans: Plan[];
  destinationName: string;
}) {
  const groupId = useId();

  // The highlighted tier is the one most people want, so it starts selected
  const [selectedId, setSelectedId] = useState(
    () => (plans.find((plan) => plan.best) ?? plans[0]).id,
  );

  // Only multi-duration plans need this, but keying every plan keeps a switch
  // back to a plan you already configured from losing your choice
  const [daysByPlan, setDaysByPlan] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      plans.map((plan) => [plan.id, plan.durations[0].days]),
    ),
  );

  const [quantity, setQuantity] = useState(1);

  const [deviceOpen, setDeviceOpen] = useState(false);
  const closeDevices = useCallback(() => setDeviceOpen(false), []);

  const selectedPlan = plans.find((plan) => plan.id === selectedId) ?? plans[0];
  const selectedDuration =
    selectedPlan.durations.find(
      (duration) => duration.days === daysByPlan[selectedPlan.id],
    ) ?? selectedPlan.durations[0];

  const total = formatTotal(parsePrice(selectedDuration.price) * quantity);

  return (
    <>
      <fieldset className="mt-6">
        <legend className="sr-only">
          Choose a data plan for {destinationName}
        </legend>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const inputId = `${groupId}-${plan.id}`;
            const days = daysByPlan[plan.id];
            const duration =
              plan.durations.find((entry) => entry.days === days) ??
              plan.durations[0];

            return (
              <li
                key={plan.id}
                className={cn(
                  "relative rounded-card border px-5 py-5",
                  "transition-colors duration-300 ease-hover motion-reduce:transition-none",
                  plan.best ? "border-ink" : "border-hairline",
                  "hover:border-ink/40",
                  "has-[:checked]:border-ink has-[:checked]:bg-surface-soft",
                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
                )}
              >
                {plan.best ? (
                  <span className="mb-3 inline-block rounded-full bg-volt px-2 py-1 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-ink">
                    Best choice
                  </span>
                ) : null}

                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id={inputId}
                    name={groupId}
                    value={plan.id}
                    checked={plan.id === selectedId}
                    onChange={() => setSelectedId(plan.id)}
                    className={cn(
                      "mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full",
                      "border border-ink/25 checked:border-[6px] checked:border-ink",
                      // The card owns the focus ring, so the input drops its own
                      "outline-none",
                    )}
                  />

                  {/* Stretched over the card so the whole tile is the hit area */}
                  <label
                    htmlFor={inputId}
                    className="cursor-pointer text-lg font-bold tracking-[-0.02em] after:absolute after:inset-0 after:content-['']"
                  >
                    {plan.data}
                  </label>
                </div>

                {plan.durations.length > 1 ? (
                  <select
                    value={days}
                    onChange={(event) =>
                      setDaysByPlan((current) => ({
                        ...current,
                        [plan.id]: Number(event.target.value),
                      }))
                    }
                    aria-label={`Duration for the ${plan.data} plan`}
                    // Above the stretched label, or the select can't be opened
                    className={cn(
                      "relative z-10 mt-3 w-full cursor-pointer rounded-full",
                      "border border-hairline bg-surface px-4 py-2",
                      "text-sm font-medium text-ink",
                    )}
                  >
                    {plan.durations.map((entry) => (
                      <option key={entry.days} value={entry.days}>
                        {entry.days} days
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-2 text-sm font-medium text-muted">
                    {duration.days} days
                  </p>
                )}

                <p className="mt-3 text-base font-bold">{duration.price}</p>
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

          {/* Announced on change so the count isn't a silent visual-only update */}
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

      {/* Checkout isn't wired up yet, so the button is live but inert */}
      <Pressable className="mt-8 w-full rounded-full bg-volt px-8 py-4 text-base font-bold text-ink hover:bg-volt/85">
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

      <DeviceDialog open={deviceOpen} onClose={closeDevices} />

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <li className="flex items-center gap-2 text-base font-medium text-ink">
          <FaStar aria-hidden className="h-4 w-4" />
          4.7 (97,400+ reviews)
        </li>

        <li className="flex items-center gap-2 text-base font-medium text-ink">
          <MdVerifiedUser aria-hidden className="h-5 w-5 text-[#12b76a]" />
          Secure payment guaranteed
        </li>
      </ul>
    </>
  );
}
