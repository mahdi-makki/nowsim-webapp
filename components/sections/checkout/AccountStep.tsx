"use client";

import { useId, useState, type FormEvent } from "react";

import { Step } from "@/components/sections/checkout/Step";
import { Pressable } from "@/components/ui/Pressable";
import { authProviders, legalLinks, providerNames, type ProviderId } from "@/lib/auth";
import { nameFromEmail, signIn, signOut, type Account } from "@/lib/session";
import { cn } from "@/lib/cn";

const tones: Record<ProviderId, string> = {
  apple: "bg-ink text-white hover:bg-ink-soft active:bg-ink-soft",
  google:
    "border border-hairline hover:border-ink/25 hover:bg-surface-soft active:bg-surface-soft",
  email:
    "border border-hairline hover:border-ink/25 hover:bg-surface-soft active:bg-surface-soft",
};

const providerButton = cn(
  "w-full gap-3 rounded-full px-5 py-3.5",
  "text-base font-bold tracking-[-0.01em]",
);

const sampleAccounts: Record<"apple" | "google", Omit<Account, "provider">> = {
  apple: { name: "Alex Rivera", email: "alex.rivera@icloud.com" },
  google: { name: "Alex Rivera", email: "alex.rivera@gmail.com" },
};

function Legal() {
  return (
    <p className="mt-5 text-xs leading-relaxed text-muted">
      By continuing, you agree to our{" "}
      {legalLinks.map((item, index) => (
        <span key={item.label}>
          <Pressable
            href={item.href}
            press={false}
            className={cn(
              "inline font-bold text-ink underline underline-offset-2",
              "transition-colors duration-300 ease-hover hover:text-brand",
              "motion-reduce:transition-none",
            )}
          >
            {item.label}
          </Pressable>
          {index === legalLinks.length - 2
            ? " and "
            : index < legalLinks.length - 1
              ? ", "
              : ""}
        </span>
      ))}
      .
    </p>
  );
}

function SignedIn({ account }: { account: Account }) {
  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-card border border-hairline bg-surface-soft p-4">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-volt text-lg font-bold text-ink"
        >
          {account.name.slice(0, 1).toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold tracking-[-0.01em]">
            {account.name}
          </p>
          <p className="truncate text-sm text-muted">{account.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-muted sm:inline">
            via {providerNames[account.provider]}
          </span>

          <Pressable
            onClick={signOut}
            className={cn(
              "rounded-full border border-hairline px-4 py-2",
              "text-sm font-bold",
              "hover:border-ink/25 hover:bg-surface active:bg-surface",
            )}
          >
            Sign out
          </Pressable>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        Your eSIM, QR code and receipt go to this address the moment payment
        clears.
      </p>
    </>
  );
}

function SignedOut() {
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const emailId = useId();

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const address = email.trim();
    if (!address) return;

    signIn({ name: nameFromEmail(address), email: address, provider: "email" });
  }

  return (
    <>
      <p className="mt-4 max-w-[46ch] text-base text-muted">
        Your eSIM and receipts live in your nowsim account. Sign in, or create
        one as you go — either takes a tap.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {authProviders.map((provider) => (
          <li key={provider.id}>
            {provider.id === "email" && emailOpen ? (
              <form onSubmit={submitEmail} className="flex flex-col gap-3">
                <label htmlFor={emailId} className="text-sm font-bold">
                  Email address
                </label>

                <input
                  id={emailId}
                  type="email"
                  name="email"
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={cn(
                    "w-full rounded-control border border-hairline bg-surface px-4 py-3",
                    "text-base font-medium placeholder:text-muted",
                    "focus:border-ink focus:outline-none",
                    "transition-colors duration-300 ease-hover motion-reduce:transition-none",
                  )}
                />

                <Pressable
                  type="submit"
                  className={cn(
                    providerButton,
                    "bg-ink text-white hover:bg-ink-soft active:bg-ink-soft",
                  )}
                >
                  Continue
                </Pressable>
              </form>
            ) : (
              <Pressable
                onClick={() => {
                  if (provider.id === "email") {
                    setEmailOpen(true);
                    return;
                  }

                  signIn({
                    ...sampleAccounts[provider.id],
                    provider: provider.id,
                  });
                }}
                className={cn(providerButton, tones[provider.id])}
              >
                <provider.Icon aria-hidden className="h-5 w-5 shrink-0" />
                {provider.label}
              </Pressable>
            )}
          </li>
        ))}
      </ul>

      <Legal />
    </>
  );
}

export function AccountStep({ account }: { account: Account | null }) {
  return (
    <Step index={1} title="Your account" done={account !== null}>
      {account ? <SignedIn account={account} /> : <SignedOut />}
    </Step>
  );
}
