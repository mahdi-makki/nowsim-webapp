import "server-only";

import type { z } from "zod";
import { z as zod } from "zod";

import { env } from "@/lib/env";

const TIMEOUT_MS = 10_000;
const ATTEMPTS = 2;

export function redactToken(value: string): string {
  return value.replace(/((?:token|api_key)=)[^&\s"']+/gi, "$1[redacted]");
}

function urlFor(path: string, params?: Record<string, string>): URL {
  const url = new URL(path.replace(/^\/+/, ""), `${env.YESIM_API_BASE}/`);

  url.searchParams.set("token", env.YESIM_API_TOKEN);

  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  return url;
}

async function request(
  url: URL,
  path: string,
  method: "GET" | "POST" = "GET",
): Promise<Response> {
  let last = "no attempt was made";

  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        method,
        headers: { accept: "application/json" },
        ...(method === "POST" ? { cache: "no-store" as const } : {}),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (response.status < 500) return response;

      last = `upstream returned ${response.status}`;
    } catch (cause) {
      last = redactToken(String(cause));
    }
  }

  throw new Error(`Yesim ${path} failed after ${ATTEMPTS} attempts: ${last}`);
}

async function parse<T>(
  response: Response,
  path: string,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!response.ok) {
    throw new Error(`Yesim ${path} returned ${response.status}`);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch (cause) {
    throw new Error(
      `Yesim ${path} returned invalid JSON: ${redactToken(String(cause))}`,
    );
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(
      `Yesim ${path} did not match the expected shape:\n${zod.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}

export async function fetchYesim<T>(
  path: string,
  schema: z.ZodType<T>,
  params?: Record<string, string>,
): Promise<T> {
  return parse(await request(urlFor(path, params), path), path, schema);
}

export async function postYesim<T>(
  path: string,
  schema: z.ZodType<T>,
  params?: Record<string, string>,
): Promise<T> {
  return parse(await request(urlFor(path, params), path, "POST"), path, schema);
}
