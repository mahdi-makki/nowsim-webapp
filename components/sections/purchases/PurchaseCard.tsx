import Image from "next/image";
import { MdAddCircleOutline, MdReceiptLong } from "react-icons/md";

import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import type { Purchase } from "@/lib/types";
import { formatDay } from "@/lib/units";

const spec = cn(
  "shrink-0 rounded-full px-2.5 py-0.5",
  "text-[0.8125rem]/[1.125rem] font-medium text-muted",
  "border border-hairline bg-surface-soft",
);

const secondary = cn(
  "rounded-full px-5 py-2.5 text-sm font-bold",
  "border border-hairline text-ink",
  "hover:border-ink/25 hover:bg-surface-soft active:bg-surface-soft",
);

const factLabel = "text-[0.8125rem]/[1.125rem] text-muted";

const factValue = "mt-0.5 text-base font-bold tracking-[-0.01em]";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className={factLabel}>{label}</dt>
      <dd className={cn(factValue, "truncate")}>{value}</dd>
    </div>
  );
}

export function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const { plan, price } = purchase;

  return (
    <li className="rounded-sheet border border-hairline bg-surface p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          {plan?.art ? (
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-hairline bg-ink/8">
              <Image
                src={plan.art}
                alt=""
                fill
                quality={90}
                sizes="44px"
                unoptimized={plan.art.endsWith(".svg")}
                className="object-cover"
              />
            </span>
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10">
              <MdReceiptLong aria-hidden className="h-5 w-5 text-brand" />
            </span>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-h3">
              {plan ? `${plan.destination} eSIM` : "eSIM"}
            </h3>

            {plan && (
              <p className="mt-2 flex flex-wrap items-center gap-2">
                <span className={spec}>{plan.data}</span>
                <span className={spec}>
                  {plan.days} day{plan.days === 1 ? "" : "s"}
                </span>
              </p>
            )}
          </div>
        </div>

        {price && (
          <span className="shrink-0 text-base font-bold tracking-[-0.01em]">
            {formatMoney(price)}
          </span>
        )}
      </div>

      <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
        {purchase.boughtAt && (
          <Fact label="Bought" value={formatDay(purchase.boughtAt)} />
        )}

        {purchase.iccid && <Fact label="ICCID" value={purchase.iccid} />}

        {purchase.paymentId && (
          <Fact label="Payment" value={purchase.paymentId} />
        )}
      </dl>

      {plan && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Pressable href={plan.href} className={cn(secondary, "gap-2")}>
            <MdAddCircleOutline aria-hidden className="h-4 w-4" />
            Buy {plan.destination} again
          </Pressable>
        </div>
      )}
    </li>
  );
}
