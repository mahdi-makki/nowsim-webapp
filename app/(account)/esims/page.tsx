import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EsimTabs } from "@/components/sections/esims/EsimTabs";
import { getEsims } from "@/lib/data/esims";

export const metadata: Metadata = {
  title: "My eSIMs | nowsim",
  description: "Your eSIMs, their data left, and how to install them.",
  robots: { index: false, follow: false },
};

export default async function EsimsPage() {
  const esims = await getEsims();

  // Signed out, the page has nothing to show and no sign-in route to send
  // anyone to — the dialog lives in the navbar.
  if (!esims) redirect("/");

  return (
    <section className="px-3 pb-20 pt-28 md:px-4 md:py-28">
      <div className="mx-auto max-w-3xl">
        <EsimTabs esims={esims} title="My eSIM’s" />
      </div>
    </section>
  );
}
