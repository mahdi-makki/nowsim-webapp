"use client";

import { useCallback, useState } from "react";

import { Pressable } from "@/components/ui/Pressable";
import { SignInDialog } from "@/components/ui/SignInDialog";

export function SignInButton({
  className,
  hit = false,
  onOpen,
}: {
  className?: string;
  hit?: boolean;
  /** lets the mobile nav collapse itself when the dialog takes over */
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Pressable
        hit={hit}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen(true);
          onOpen?.();
        }}
        className={className}
      >
        Sign in
      </Pressable>

      <SignInDialog open={open} onClose={close} />
    </>
  );
}
