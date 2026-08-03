"use client";

import type { IconType } from "react-icons";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMail } from "react-icons/md";

import { Dialog } from "@/components/ui/Dialog";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

type Provider = {
  label: string;
  href: string;
  Icon: IconType;
  className: string;
};

const providers: Provider[] = [
  {
    label: "Continue with Apple",
    href: "#",
    Icon: FaApple,
    className: "bg-white text-ink hover:bg-white/85 active:bg-white/85",
  },
  {
    label: "Continue with Google",
    href: "#",
    Icon: FcGoogle,
    className: "bg-volt text-ink hover:bg-volt/85 active:bg-volt/85",
  },
  {
    label: "Continue with Email",
    href: "#",
    Icon: MdOutlineMail,
    className: "bg-white/10 text-white hover:bg-white/20 active:bg-white/20",
  },
];

const legal = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Storage of the Cardholder's Credential", href: "#" },
];

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
        {providers.map((provider) => (
          <li key={provider.label}>
            <Pressable
              href={provider.href}
              className={cn(
                "w-full gap-3 rounded-full px-5 py-3.5",
                "text-base font-bold tracking-[-0.01em]",
                provider.className,
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
        {legal.map((item, index) => (
          <span key={item.label}>
            <Pressable
              href={item.href}
              press={false}
              className={cn(
                "inline font-bold text-white/70 underline underline-offset-2",
                // `press={false}` drops the `press` utility, and with it the
                // colour transition — so hover has to be eased by hand
                "transition-colors duration-300 ease-hover hover:text-volt",
                "motion-reduce:transition-none",
              )}
            >
              {item.label}
            </Pressable>
            {index === legal.length - 2
              ? " and "
              : index < legal.length - 1
                ? ", "
                : ""}
          </span>
        ))}
      </p>
    </Dialog>
  );
}
