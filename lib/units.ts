const GB = 1024;

const data = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

/** Yesim counts data in whole megabytes; people read it in GB past a gigabyte. */
export function formatData(megabytes: number): string {
  if (megabytes < GB) return `${data.format(Math.round(megabytes))} MB`;

  return `${data.format(Math.round((megabytes / GB) * 100) / 100)} GB`;
}

// UTC, so the server and the browser it hydrates always print the same day.
const day = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDay(iso: string): string {
  return day.format(new Date(iso));
}
