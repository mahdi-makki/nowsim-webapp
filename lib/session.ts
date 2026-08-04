"use client";

import { useSyncExternalStore } from "react";

import type { ProviderId } from "@/lib/auth";

export type Account = {
  name: string;
  email: string;
  provider: ProviderId;
};

const KEY = "nowsim.account";

const listeners = new Set<() => void>();

let snapshot: Account | null = null;
let loaded = false;

function read(): Account | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

function getSnapshot(): Account | null {
  if (!loaded) {
    snapshot = read();
    loaded = true;
  }

  return snapshot;
}

function getServerSnapshot(): Account | null {
  return null;
}

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== KEY) return;

  loaded = false;
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function write(account: Account | null) {
  snapshot = account;
  loaded = true;

  try {
    if (account) {
      window.localStorage.setItem(KEY, JSON.stringify(account));
    } else {
      window.localStorage.removeItem(KEY);
    }
  } catch {
  }

  emit();
}

export function signIn(account: Account) {
  write(account);
}

export function signOut() {
  write(null);
}

export function useAccount(): Account | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";

  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ") || "Traveller"
  );
}
