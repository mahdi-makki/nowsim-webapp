import { z } from "zod";

export const currencySchema = z.enum(["EUR", "USD"]);

export type ApiCurrency = z.infer<typeof currencySchema>;

/** Every numeric field arrives as a string: `"days": "30"`, `"price": "7.60"`. */
const numeric = z.coerce.number();

/**
 * `countries_included`, `countryIso2`, `iso3`, `mcc` and `operators` are all
 * comma-separated strings rather than arrays.
 *
 * They are **not positionally aligned** — each list is sorted independently, so
 * `countries_included[3]` is not the country at `iso3[3]`. Treat each as a set,
 * never zip them together. See `lib/api/mappers.ts`.
 */
export const csv = z
  .string()
  .default("")
  .transform((value) =>
    value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

export const planSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  days: numeric,
  // Not always numeric — 257 of 1520 plans carry the literal string
  // "Unlimited". Coercing this to a number yields NaN and fails the whole
  // catalog, so it stays a string and `dataLabel()` interprets it.
  data: z.string().default(""),
  countries_included: csv,
  countryIso2: csv,
  iso3: csv,
  mcc: csv,
  operators: csv,
  image: z.string().default(""),
  apn: z.string().optional(),
  plan_type: z.enum(["country", "region"]),
  // `price` is the partner rate. `retail_price` is what the customer pays and is
  // the only field the app may charge from — see `planPrice()` in mappers.ts.
  // Required, not optional: a missing retail price must fail loudly rather than
  // fall back to the partner rate and undercharge.
  price: numeric,
  retail_price: numeric,
  currency: currencySchema,
  data_unit: z.string().default("GB"),
  // null on 1512 of 1520 plans, a string on the other 8.
  old_id: z.string().nullable().optional(),
});

export type ApiPlan = z.infer<typeof planSchema>;

export const plansResponseSchema = z.union([
  z.array(planSchema),
  z.object({ plans: z.array(planSchema) }).transform((body) => body.plans),
  z.object({ data: z.array(planSchema) }).transform((body) => body.data),
]);

/**
 * `/supported_devices` returns type → brand → model, three levels deep:
 *
 *   [{ type: "PHONE", brands: [{ brand: "Samsung", models: [{ model: "…" }] }] }]
 *
 * Types seen: PHONE, TABLET, CAR, SMARTWATCH, LAPTOP, WI-FI ROUTERS. 456 models
 * in total. `min(1)` on each level is deliberate — an earlier permissive schema
 * accepted this payload and silently produced an empty device list, so the
 * shape is now pinned tightly enough that a change fails loudly.
 */
export const deviceTypeSchema = z.object({
  type: z.string().min(1),
  brands: z.array(
    z.object({
      brand: z.string().min(1),
      models: z.array(z.object({ model: z.string().min(1) })),
    }),
  ),
});

export type ApiDeviceType = z.infer<typeof deviceTypeSchema>;

export const supportedDevicesResponseSchema = z.union([
  z.array(deviceTypeSchema),
  z
    .object({ devices: z.array(deviceTypeSchema) })
    .transform((body) => body.devices),
  z.object({ data: z.array(deviceTypeSchema) }).transform((body) => body.data),
]);

export type ApiSupportedDevices = z.infer<typeof supportedDevicesResponseSchema>;