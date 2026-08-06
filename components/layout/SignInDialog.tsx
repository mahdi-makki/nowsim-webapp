"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Pressable } from "@/components/ui/Pressable";
import { authProviders, legalLinks, type ProviderId } from "@/lib/auth";
import { cn } from "@/lib/cn";

const tones: Record<ProviderId, string> = {
  apple: "bg-white text-ink hover:bg-white/85 active:bg-white/85",
  google: "bg-volt text-ink hover:bg-volt/85 active:bg-volt/85",
  email: "bg-white/10 text-white hover:bg-white/20 active:bg-white/20",
};

export function SignInDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Sign in to continue">
      <ul className="mt-6 flex flex-col gap-3">
        {authProviders.map((provider) => (
          <li key={provider.id}>
            <Pressable
              href="#"
              className={cn(
                "w-full gap-3 rounded-full px-5 py-3.5",
                "text-base font-bold tracking-[-0.01em]",
                tones[provider.id],
              )}
            >
              <provider.Icon aria-hidden className="h-5 w-5 shrink-0" />
              {provider.label}
            </Pressable>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs leading-relaxed text-white/45">
        By clicking &ldquo;Continue&rdquo;, you agree to our{" "}
        {legalLinks.map((item, index) => (
          <span key={item.label}>
            <Pressable
              href={item.href}
              press={false}
              className={cn(
                "inline font-bold text-white/70 underline underline-offset-2",
                "transition-colors duration-300 ease-hover hover:text-volt",
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
      </p>
    </Dialog>
  );
}
