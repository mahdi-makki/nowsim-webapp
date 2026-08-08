import Image from "next/image";
import { cacheLife } from "next/cache";
import type { IconType } from "react-icons";
import {
  FaCcAmex,
  FaCcApplePay,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcJcb,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { NowsimLogo } from "@/components/ui/NowsimLogo";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

type LinkGroup = {
  title: string;
  links: { label: string; href: string }[];
};

const groups: LinkGroup[] = [
  {
    title: "Plans",
    links: [
      { label: "Countries", href: "#" },
      { label: "Regions", href: "#" },
      { label: "Global", href: "#" },
      { label: "Top up", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Business", href: "#" },
      { label: "Use cases", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "#" },
      { label: "Device compatibility", href: "#" },
      { label: "Install guide", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
];

type PaymentMethod = {
  label: string;
  Icon: IconType;
};

const payments: PaymentMethod[] = [
  { label: "Visa", Icon: FaCcVisa },
  { label: "Mastercard", Icon: FaCcMastercard },
  { label: "American Express", Icon: FaCcAmex },
  { label: "Discover", Icon: FaCcDiscover },
  { label: "Diners Club", Icon: FaCcDinersClub },
  { label: "JCB", Icon: FaCcJcb },
  { label: "PayPal", Icon: FaCcPaypal },
  { label: "Apple Pay", Icon: FaCcApplePay },
];

type SocialLink = {
  label: string;
  href: string;
  Icon: IconType;
};

const socials: SocialLink[] = [
  { label: "nowsim on X", href: "#", Icon: FaXTwitter },
  { label: "nowsim on Instagram", href: "#", Icon: FaInstagram },
  { label: "nowsim on LinkedIn", href: "#", Icon: FaLinkedinIn },
];

const badgeSize = { width: 120, height: 40 };

const storeBadges = [
  {
    label: "Download on the App Store",
    href: "#",
    src: "/buttons/app-store.svg",
  },
  {
    label: "Get it on Google Play",
    href: "#",
    src: "/buttons/google-play.svg",
  },
];

const bottomPadding =
  "pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+2.5rem))]";

async function currentYear(): Promise<number> {
  "use cache";

  cacheLife("days");

  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();

  return (
    <footer>
      <div
        className={cn(
          "overflow-hidden rounded-t-screen bg-ink text-white md:rounded-t-screen-lg",
          "px-6 pt-14 md:px-12 md:pt-20",
          bottomPadding,
        )}
      >
        <div className="mx-auto max-w-7xl">
          <div
            className={cn(
              "flex flex-col gap-8 border-b border-white/10 pb-12",
              "md:flex-row md:items-center md:justify-between md:gap-12 md:pb-14",
            )}
          >
            <div>
              <h2 className="text-h3">Download nowsim for your next journey</h2>

              <p className="mt-3 max-w-[52ch] text-base text-muted-invert">
                Buy a plan, install the eSIM, and land connected. Free on iOS
                and Android.
              </p>
            </div>

            <ul className="flex flex-wrap items-center gap-3 md:shrink-0">
              {storeBadges.map((badge) => (
                <li key={badge.label}>
                  <Pressable href={badge.href} className="rounded-lg">
                    <Image
                      src={badge.src}
                      alt={badge.label}
                      width={badgeSize.width}
                      height={badgeSize.height}
                      unoptimized
                      className="h-[3.25rem] w-auto"
                    />
                  </Pressable>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-12 pt-14 pb-14 md:flex-row md:items-start md:justify-between md:gap-16 md:pt-16 md:pb-16">
            <div>
              <NowsimLogo
                id="nowsim-logo-footer"
                className="h-7 w-auto text-white"
              />

              <p className="mt-5 max-w-[34ch] text-base text-muted-invert">
                One eSIM, one account, 200+ destinations. Stay connected
                wherever&rsquo;s next.
              </p>

              <ul className="mt-7 flex items-center gap-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <Pressable
                      href={social.href}
                      hit
                      className={cn(
                        "h-11 w-11 rounded-full border border-white/15 text-white",
                        "hover:bg-white/10 active:bg-white/10",
                      )}
                    >
                      <social.Icon aria-hidden className="h-4.5 w-4.5" />
                      <span className="sr-only">{social.label}</span>
                    </Pressable>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-8 md:shrink-0">
              {groups.map((group) => (
                <div key={group.title} className="min-w-36">
                  <h3 className="text-eyebrow uppercase text-white/45">
                    {group.title}
                  </h3>

                  <ul className="mt-4 flex flex-col">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Pressable
                          href={link.href}
                          className={cn(
                            "-mx-1 px-1 py-1.5",
                            "text-base font-medium text-muted-invert hover:text-volt",
                          )}
                        >
                          {link.label}
                        </Pressable>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <p>&copy; {year} nowsim. All rights reserved.</p>

            <ul
              aria-label="Accepted payment methods"
              className="flex flex-wrap items-center gap-x-4 gap-y-3 text-white/70"
            >
              {payments.map((payment) => (
                <li key={payment.label}>
                  <payment.Icon aria-hidden className="h-7 w-auto" />
                  <span className="sr-only">{payment.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
