"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { MdCheck, MdContentCopy, MdPerson } from "react-icons/md";

import { signOut } from "@/app/actions/auth";
import { SignInDialog } from "@/components/layout/SignInDialog";
import { useAccount, useSetAccount } from "@/components/layout/SessionProvider";
import { Dialog } from "@/components/ui/Dialog";
import { Pressable } from "@/components/ui/Pressable";
import { providerNames } from "@/lib/auth/providers";
import { cn } from "@/lib/cn";

const trigger = cn(
  "rounded-full bg-volt px-4 py-2.5 text-base font-medium text-ink md:px-5",
  "hover:bg-ink-deep hover:text-volt active:bg-ink-deep active:text-volt",
);

export function AccountActionFallback() {
  return (
    <span aria-hidden className={cn(trigger, "inline-flex opacity-70")}>
      Sign in
    </span>
  );
}

const row = "w-full rounded-control bg-white/10 px-4 py-3.5 text-base";

function CopyId({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Pressable
      onClick={copy}
      className={cn(row, "gap-3 hover:bg-white/20 active:bg-white/20")}
    >
      <span className="shrink-0 font-semibold">Yesim User ID</span>

      <span className="min-w-0 flex-1 truncate text-right text-white/70">
        {userId}
      </span>

      {copied ? (
        <MdCheck aria-hidden className="h-5 w-5 shrink-0" />
      ) : (
        <MdContentCopy aria-hidden className="h-5 w-5 shrink-0 text-white/70" />
      )}

      <span className="sr-only">
        {copied ? "Account ID copied" : "Copy account ID"}
      </span>
    </Pressable>
  );
}

export function AccountAction() {
  const account = useAccount();
  const setAccount = useSetAccount();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [leaving, startLeaving] = useTransition();

  const close = useCallback(() => setOpen(false), []);

  function leave() {
    startLeaving(async () => {
      await signOut();

      setAccount(null);
      router.refresh();
      close();
    });
  }

  if (!account) {
    return (
      <>
        <Pressable
          hit
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={trigger}
        >
          Sign in
        </Pressable>

        <SignInDialog open={open} onClose={close} />
      </>
    );
  }

  return (
    <>
      <Pressable
        hit
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "h-10 w-10 rounded-full bg-volt text-ink",
          "hover:bg-ink-deep hover:text-volt active:bg-ink-deep active:text-volt",
        )}
      >
        <MdPerson aria-hidden className="h-5 w-5" />
        <span className="sr-only">Your account</span>
      </Pressable>

      <Dialog open={open} onClose={close} title="Your account">
        <div className={cn(row, "mt-6 flex items-center gap-3")}>
          <MdPerson aria-hidden className="h-5 w-5 shrink-0 text-white/55" />
          <p className="min-w-0 flex-1 truncate">{account.email}</p>
        </div>

        <p className="mt-2 text-sm text-white/55">
          Signed in via {providerNames[account.provider]}. Your eSIM, QR code and
          receipt go to this address.
        </p>

        <div className="mt-4">
          <CopyId userId={account.userId} />
        </div>

        <div className="mt-6 flex gap-3">
          <Pressable
            onClick={leave}
            disabled={leaving}
            className={cn(
              "flex-1 rounded-control px-5 py-3.5 text-base font-bold",
              "bg-white text-ink hover:bg-white/85 active:bg-white/85",
            )}
          >
            {leaving ? "Signing out…" : "Sign out"}
          </Pressable>

          <Pressable
            disabled={leaving}
            className={cn(
              "flex-1 rounded-control px-5 py-3.5 text-base font-bold",
              "bg-danger/20 text-danger hover:bg-danger/30 active:bg-danger/30",
            )}
          >
            Delete account
          </Pressable>
        </div>
      </Dialog>
    </>
  );
}
