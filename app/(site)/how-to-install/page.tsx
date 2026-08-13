import type { Metadata } from "next";

import { PlatformCards } from "@/components/sections/install/PlatformCards";
import { getInstallGuides } from "@/lib/install";

export const metadata: Metadata = {
  title: "How to install your eSIM | nowsim",
  description:
    "Step-by-step nowsim eSIM installation for iOS and Android. By QR code or by entering the SM-DP+ address and activation code manually.",
};

export default function HowToInstallPage() {
  const guides = getInstallGuides();

  return (
    <section className="px-6 pb-20 pt-28 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="font-display text-h1 font-extrabold uppercase tracking-[-0.045em] md:text-nowrap">
          How to install your eSIM
        </h1>

        <p className="mx-auto mt-5 max-w-[62ch] text-lg text-muted md:text-xl">
          Installing takes about two minutes, and you only need to do it once.
          Pick the device you&rsquo;re installing on and follow the steps. Scan
          a QR code, or type the details in by hand.
        </p>

        <PlatformCards guides={guides} className="mt-12 md:mt-14" />
      </div>
    </section>
  );
}
