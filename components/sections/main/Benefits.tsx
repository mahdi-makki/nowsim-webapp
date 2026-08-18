import type { IconType } from "react-icons";
import {
  MdCall,
  MdCheckCircleOutline,
  MdClose,
  MdPerson,
  MdSignalCellularAlt,
} from "react-icons/md";

import { cn } from "@/lib/cn";

type Benefit = {
  title: string;
  body: string;
  icon: IconType;
};

const primary: Benefit[] = [
  {
    title: "Local number",
    body: "A real local phone number for everyday use",
    icon: MdCall,
  },
  {
    title: "Unlimited",
    body: "Unlimited calling, SMS, and text included",
    icon: MdSignalCellularAlt,
  },
];

const secondary: Benefit[] = [
  {
    title: "No roaming fees",
    body: "International roaming included, so you stay connected abroad",
    icon: MdCheckCircleOutline,
  },
  {
    title: "No network drops",
    body: "If one network drops, we connect you to another network",
    icon: MdClose,
  },
  {
    title: "Simple plan",
    body: "Data, calling, and SMS in one clear monthly plan without surprises",
    icon: MdPerson,
  },
];

function Card({
  benefit,
  className,
}: {
  benefit: Benefit;
  className?: string;
}) {
  const Icon = benefit.icon;

  return (
    <li
      className={cn(
        "flex flex-col rounded-sheet bg-surface-soft p-6 md:p-8",
        "transition-colors duration-300 ease-hover hover:bg-brand/10",
        "motion-reduce:transition-none",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-control md:h-18 md:w-18",
          "border-2 border-dashed border-ink/25 text-ink",
        )}
      >
        <Icon className="h-8 w-8 md:h-9 md:w-9" />
      </span>

      <h3 className="mt-6 text-h3 font-bold tracking-[-0.02em] md:mt-8">
        {benefit.title}
      </h3>

      <p className="mt-2 max-w-[34ch] text-lg/tight text-muted">{benefit.body}</p>
    </li>
  );
}

export function Benefits() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="px-3 py-20 md:px-4 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="benefits-heading"
          className={cn(
            "mx-auto mt-24 max-w-[16ch] text-center uppercase md:mt-32",
            "font-display text-h1 font-extrabold tracking-[-0.045em]",
          )}
        >
          What you get
        </h2>

        <div className="mt-10 flex flex-col gap-4 md:mt-16 md:gap-5">
          <ul className="grid gap-4 md:grid-cols-12 md:gap-5">
            {primary.map((benefit, index) => (
              <Card
                key={benefit.title}
                benefit={benefit}
                className={index === 0 ? "md:col-span-5" : "md:col-span-7"}
              />
            ))}
          </ul>

          <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
            {secondary.map((benefit) => (
              <Card key={benefit.title} benefit={benefit} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
