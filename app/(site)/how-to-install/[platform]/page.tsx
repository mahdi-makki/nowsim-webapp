import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getInstallGuide,
  installPlatforms,
  isInstallPlatform,
} from "@/lib/install";

type PageProps = {
  params: Promise<{ platform: string }>;
};

export function generateStaticParams() {
  return installPlatforms.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { platform } = await params;

  if (!isInstallPlatform(platform)) return {};

  const guide = getInstallGuide(platform);

  return {
    title: `How to install an eSIM on ${guide.label} | nowsim`,
    description: `Install your nowsim eSIM on ${guide.devices}, step by step.`,
  };
}

export default async function InstallGuidePage({ params }: PageProps) {
  const { platform } = await params;

  if (!isInstallPlatform(platform)) notFound();

  const guide = getInstallGuide(platform);

  return (
    <section className="px-6 pb-20 pt-28 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="font-display text-h1 font-extrabold uppercase tracking-[-0.045em]">
          Installation for {guide.label}
        </h1>
      </div>
    </section>
  );
}
