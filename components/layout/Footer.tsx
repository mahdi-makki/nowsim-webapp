import type { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

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

const legal = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
];

type SocialLink = {
  label: string;
  href: string;
  Icon: IconType;
};

const socials: SocialLink[] = [
  { label: "NOWSIM on X", href: "#", Icon: FaXTwitter },
  { label: "NOWSIM on Instagram", href: "#", Icon: FaInstagram },
  { label: "NOWSIM on LinkedIn", href: "#", Icon: FaLinkedinIn },
];

/** Clears the fixed nav pill (≈3.5rem tall) sitting at the bottom of the viewport */
const navClearance =
  "pb-[calc(4.5rem+max(1.75rem,env(safe-area-inset-bottom)+0.75rem))]";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div
        className={cn(
          "overflow-hidden rounded-t-screen bg-ink text-white md:rounded-t-screen-lg",
          "px-6 pt-14 md:px-12 md:pt-20",
          navClearance,
        )}
      >
        <div className="mx-auto max-w-7xl">
          {/* Brand + link columns */}
          <div className="flex flex-col gap-12 pb-14 md:flex-row md:items-start md:justify-between md:gap-16 md:pb-16">
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
                            "-mx-1 w-full origin-left justify-start px-1 py-1.5",
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

          {/* Fine print */}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <p>&copy; {year} NOWSIM. All rights reserved.</p>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legal.map((item) => (
                <li key={item.label}>
                  <Pressable
                    href={item.href}
                    className="py-1 hover:text-white"
                  >
                    {item.label}
                  </Pressable>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
