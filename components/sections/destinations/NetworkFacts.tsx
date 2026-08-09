import { MdCheckCircle } from "react-icons/md";

import { NetworkLink } from "@/components/sections/destinations/NetworkLink";
import type { DestinationKind } from "@/lib/types";
import { cn } from "@/lib/cn";

const heading = "text-base font-bold tracking-[-0.02em]";

const pill = cn(
  "rounded-full border border-hairline px-2.5 py-0.5",
  "text-[0.8125rem]/[1.125rem] font-medium text-muted",
);

const fact = "text-sm text-muted";

const value = "font-bold text-ink";

export function NetworkFacts({
  kind,
  operators,
  className,
}: {
  kind: DestinationKind;
  operators: string[];
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      {operators.length > 0 && (
        <div>
          <h2 className={heading}>Available networks</h2>

          {/* A region or global plan roams on hundreds of carriers — too many
              to lay out as pills, so they move into a searchable dialog. */}
          {kind === "country" ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {operators.map((operator) => (
                <li key={operator} className={pill}>
                  {operator}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2">
              <NetworkLink operators={operators} />
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className={heading}>Technical details</h2>

        <dl className="mt-2 flex flex-col gap-1">
          <div className={cn(fact, "flex items-center gap-1.5")}>
            <dt>Hotspot / Tethering:</dt>
            <dd className={cn(value, "flex items-center gap-1.5")}>
              Unlimited
              <MdCheckCircle aria-hidden className="h-4 w-4 text-brand" />
            </dd>
          </div>

          <div className={cn(fact, "flex items-center gap-1.5")}>
            <dt>Speed limit:</dt>
            <dd className={value}>Never</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
