"use client";

import { AccountStep } from "@/components/sections/checkout/AccountStep";
import { PaymentStep } from "@/components/sections/checkout/PaymentStep";
import { useAccount } from "@/lib/session";

export function CheckoutFlow({ total }: { total: string }) {
  const account = useAccount();

  return (
    <div className="flex flex-col gap-4">
      <AccountStep account={account} />
      <PaymentStep total={total} locked={account === null} />
    </div>
  );
}
