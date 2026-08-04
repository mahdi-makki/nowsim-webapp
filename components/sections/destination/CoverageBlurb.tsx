"use client";

import { useState } from "react";

import { CoverageDialog } from "@/components/ui/CoverageDialog";
import { Pressable } from "@/components/ui/Pressable";
import type { Blurb } from "@/lib/destinations";
import { cn } from "@/lib/cn";

export function CoverageBlurb({
  blurb: { lead, coverage, tail },
  destinationName,
  countries,
  className,
}: {
  blurb: Blurb;
  destinationName: string;
  countries: string[] | undefined;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!coverage || !countries?.length) {
    return (
      <p className={className}>
        {lead}
        {tail}
      </p>
    );
  }

  return (
    <>
      <p className={className}>
        {lead}
        <Pressable
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`View all ${coverage}`}
          onClick={() => setOpen(true)}
          press={false}
          className={cn(
            "inline text-left font-bold text-ink",
            "underline decoration-dotted decoration-ink/20 underline-offset-4",
            "hover:decoration-ink",
            "transition-colors duration-300 ease-hover motion-reduce:transition-none",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
          )}
        >
          {coverage}
        </Pressable>
        {tail}
      </p>

      <CoverageDialog
        open={open}
        onClose={() => setOpen(false)}
        destinationName={destinationName}
        countries={countries}
      />
    </>
  );
}
