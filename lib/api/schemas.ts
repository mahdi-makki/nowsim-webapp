import { z } from "zod";

export const currencySchema = z.enum(["EUR", "USD"]);

const numeric = z.coerce.number();

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
  data: z.string().default(""),
  countries_included: csv,
  countryIso2: csv,
  iso3: csv,
  mcc: csv,
  operators: csv,
  image: z.string().default(""),
  apn: z.string().optional(),
  plan_type: z.enum(["country", "region"]),
  price: numeric,
  retail_price: numeric,
  currency: currencySchema,
  data_unit: z.string().default("GB"),
  old_id: z.string().nullable().optional(),
});

export type ApiPlan = z.infer<typeof planSchema>;

export const plansResponseSchema = z.union([
  z.array(planSchema),
  z.object({ plans: z.array(planSchema) }).transform((body) => body.plans),
  z.object({ data: z.array(planSchema) }).transform((body) => body.data),
]);

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

export const newUserResponseSchema = z.object({
  user_id: z.union([z.string(), z.number()]).transform(String),
  email: z.string().min(1),
  alreadyExist: numeric.optional(),
});

export const supportedDevicesResponseSchema = z.union([
  z.array(deviceTypeSchema),
  z
    .object({ devices: z.array(deviceTypeSchema) })
    .transform((body) => body.devices),
  z.object({ data: z.array(deviceTypeSchema) }).transform((body) => body.data),
]);
