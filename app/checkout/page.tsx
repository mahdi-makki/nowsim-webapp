import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CheckoutFlow } from "@/components/sections/checkout/CheckoutFlow";
import { OrderSummary } from "@/components/sections/checkout/OrderSummary";
import { NowsimLogo } from "@/components/ui/NowsimLogo";
import { resolveOrder } from "@/lib/order";

export const metadata: Metadata = {
  title: "Checkout | nowsim",
  description: "Review your eSIM order and pay securely.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const order = resolveOrder(await searchParams);

  if (!order) notFound();

  const { destination } = order;

  return (
    <section className="px-3 py-12 md:px-4 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="sr-only">Checkout — {destination.name} eSIM</h1>

        <NowsimLogo
          id="nowsim-logo-checkout"
          className="mb-10 h-6 w-auto text-ink md:h-7"
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-10">
          <div className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-16">
            <OrderSummary order={order} />
          </div>

          <div className="lg:col-start-1 lg:row-start-1">
            <CheckoutFlow total={order.total} />
          </div>
        </div>
      </div>
    </section>
  );
}
