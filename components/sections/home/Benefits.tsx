import { cn } from "@/lib/cn";

type Benefit = {
  title: string;
  body: string;
  icon: (props: { className?: string }) => React.ReactElement;
};

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6.5 3.5h2l1.5 4-1.8 1.2a11 11 0 0 0 5.1 5.1l1.2-1.8 4 1.5v2a2.5 2.5 0 0 1-2.7 2.5A15.5 15.5 0 0 1 4 6.2 2.5 2.5 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

function SignalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <path d="M5 18v-3M10 18v-6M15 18v-9M20 18V6" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="currentColor"
      className={className}
    >
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0 .9.9 0 0 1-.9.9H5.4a.9.9 0 0 1-.9-.9Z" />
    </svg>
  );
}

/** Split into two rows so the card widths mirror the 5/7 + thirds rhythm. */
const primary: Benefit[] = [
  {
    title: "Local number",
    body: "A real local phone number for everyday use",
    icon: PhoneIcon,
  },
  {
    title: "Unlimited",
    body: "Unlimited calling, SMS, and text included",
    icon: SignalIcon,
  },
];

const secondary: Benefit[] = [
  {
    title: "No roaming fees",
    body: "International roaming included, so you stay connected abroad",
    icon: CheckCircleIcon,
  },
  {
    title: "No network drops",
    body: "If one network drops, we connect you to another network",
    icon: CrossIcon,
  },
  {
    title: "Simple plan",
    body: "Data, calling, and SMS in one clear monthly plan without surprises",
    icon: PersonIcon,
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
        "transition-colors duration-300 ease-hover hover:bg-ink/[0.07]",
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
            "text-h1 font-extrabold tracking-[-0.045em]",
          )}
        >
          What you get
        </h2>

        <div className="mt-10 flex flex-col gap-4 md:mt-16 md:gap-5">
          {/* Row 1 — two cards, 5/7 split */}
          <ul className="grid gap-4 md:grid-cols-12 md:gap-5">
            {primary.map((benefit, index) => (
              <Card
                key={benefit.title}
                benefit={benefit}
                className={index === 0 ? "md:col-span-5" : "md:col-span-7"}
              />
            ))}
          </ul>

          {/* Row 2 — three equal cards */}
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
