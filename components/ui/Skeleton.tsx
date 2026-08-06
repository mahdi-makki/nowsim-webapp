import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-card bg-ink/8 motion-reduce:animate-none",
        className,
      )}
    />
  );
}
