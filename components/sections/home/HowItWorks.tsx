import Image from "next/image";

import { cn } from "@/lib/cn";

type Step = {
  /** Short label shown in the header strip that stays visible once stacked */
  label: string;
  title: string;
  body: string;
  image: { src: string; alt: string };
  surface: string;
  /** Header rule + number ring, tuned per surface */
  chrome: string;
  copy: string;
  heading?: string;
};

const steps: Step[] = [
  {
    label: "Pick a destination",
    title: "200+ countries, one account",
    body: "Search where you're going and choose a country, a region, or a global plan. Prices are the same wherever you activate — no local surcharge, no dynamic pricing.",
    image: {
      src: "/images/home/img-1.jpg",
      alt: "Traveller checking her phone on a stone wall above a hillside town",
    },
    surface: "bg-brand text-white",
    chrome: "border-white/35",
    copy: "text-muted-invert",
    heading: "text-white",
  },
  {
    label: "Install in seconds",
    title: "No SIM tray, no kiosk",
    body: "The eSIM installs straight from the app. Scan once, and the plan sits alongside your normal SIM — your own number keeps ringing while data moves to the local network.",
    image: {
      src: "/images/home/img-3.jpg",
      alt: "Two travellers taking a selfie on a sunny street",
    },
    surface: "bg-volt text-ink",
    chrome: "border-ink/30",
    copy: "text-ink/70",
  },
  {
    label: "Land connected",
    title: "Highest speed, no commitment",
    body: "We connect to the top networks in each country, so you land on the fastest connection on offer. Run out? Top up in seconds — no new eSIM, no reinstall, no contract.",
    image: {
      src: "/images/home/img-2.jpg",
      alt: "Traveller using her phone above a city skyline at sunset",
    },
    surface: "bg-ink text-white",
    chrome: "border-white/30",
    copy: "text-muted-invert",
    heading: "text-volt",
  },
];

/** Header strip height in rem — also the offset each card gains as it pins,
 *  so a stacked card shows exactly its strip and nothing else */
const stackStep = 6;

/** A sticky card releases when its containing block's bottom reaches
 *  `top + height`. Staircasing `top` therefore staggers the releases, and the
 *  stack comes apart from the bottom up. Instead every card shares one `top`
 *  and the staircase is *painted* with translateY: transforms don't touch the
 *  layout box, so all three hit their limit on the same pixel and exit locked
 *  together. The negative margin takes the painted offset back out of the
 *  flow, keeping the cards adjacent on the way in. */
const stackOffset = (index: number) => ({
  transform: `translateY(${index * stackStep}rem)`,
  marginTop: index === 0 ? undefined : `-${stackStep}rem`,
});

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="px-3 py-20 md:px-4 md:py-28"
    >
      {/* narrower than the 7xl sections around it — the stack reads better
          as a column than as a full-bleed slab */}
      <div className="mx-auto max-w-5xl">
        <h2
          id="how-it-works-heading"
          className={cn(
            "mx-auto max-w-[16ch] text-center uppercase",
            "text-h1 tracking-[-0.045em] subpixel-antialiased",
            "[-webkit-text-stroke:0.022em_currentColor]",
          )}
        >
          How NOWSIM works
        </h2>

        {/* Each card sticks a little lower than the one before, so the strips
            pile up while the bodies scroll away underneath */}
        <ol className="mt-10 md:mt-16">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="sticky top-4 mb-4 md:mb-5"
              style={stackOffset(index)}
            >
              <article
                className={cn(
                  "overflow-hidden rounded-sheet shadow-lg shadow-ink/10",
                  step.surface,
                )}
              >
                <div className="flex h-24 items-center gap-4 px-6 md:px-10">
                  <span
                    className={cn(
                      "flex h-9 shrink-0 items-center justify-center rounded-full border px-5",
                      // leading-none drops the ascender slack that leaves the
                      // digit riding high in the ring
                      "text-sm font-black italic leading-none",
                      step.chrome,
                    )}
                  >
                    {index + 1}
                  </span>

                  <span className="text-lg font-semibold tracking-[-0.01em]">
                    {step.label}
                  </span>
                </div>

                <div
                  className={cn(
                    "grid gap-8 px-6 pb-10 md:px-10",
                    "md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:items-center md:gap-12",
                  )}
                >
                  <div>
                    <h3
                      className={cn(
                        "max-w-[16ch] text-h2 uppercase subpixel-antialiased",
                        "[-webkit-text-stroke:0.02em_currentColor]",
                        step.heading,
                      )}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={cn(
                        "mt-5 max-w-[46ch] text-lg font-medium",
                        step.copy,
                      )}
                    >
                      {step.body}
                    </p>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-black/10 md:aspect-[5/4]">
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 420px, (min-width: 768px) 42vw, 100vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </article>
            </li>
          ))}

          {/* A sticky card only holds while its containing block is still
              scrolling past, and the last card has no sibling beneath it to
              supply that runway — without this it would unpin the instant it
              pinned. Doubles as the assembled stack's dwell. The floor keeps
              it clear of the 12rem the bottom card is translated by, so that
              card never paints over the section below. */}
          <li aria-hidden className="h-[45vh] min-h-56" />
        </ol>
      </div>
    </section>
  );
}
