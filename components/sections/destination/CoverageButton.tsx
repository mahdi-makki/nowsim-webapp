"use client";

import { useState } from "react";

import { CoverageDialog } from "@/components/ui/CoverageDialog";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

/**
 * The country list behind a region or global plan. A count on its own only
 * raises the question, so the page states it as the thing you can open.
 */
export function CoverageButton({
  destinationName,
  countries,
}: {
  destinationName: string;
  countries: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "mt-4 rounded-full border border-hairline px-6 py-3",
          "text-base font-medium text-ink",
          "hover:border-ink/25 hover:bg-surface-soft",
          "active:border-ink/25 active:bg-surface-soft",
        )}
      >
        View all {countries.length} countries
      </Pressable>

      <CoverageDialog
        open={open}
        onClose={() => setOpen(false)}
        destinationName={destinationName}
        countries={countries}
      />
    </>
  );
}
