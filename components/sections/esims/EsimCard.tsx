"use client";

import { useState } from "react";
import { MdQrCode2, MdSimCard } from "react-icons/md";

import { InstallDialog } from "@/components/sections/esims/InstallDialog";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";
import { esimStateLabels, type Esim, type EsimState } from "@/lib/types";
import { formatData, formatDay } from "@/lib/units";

const pill = cn(
  "shrink-0 rounded-full px-3 py-1",
  "text-[0.8125rem]/[1.125rem] font-bold",
);

const pillTone: Record<EsimState, string> = {
  active: "bg-success/12 text-success",
  ready: "bg-brand/10 text-brand",
  expired: "bg-ink/8 text-muted",
  removed: "bg-ink/8 text-muted",
};

const action = cn(
  "rounded-full px-5 py-2.5 text-sm font-bold",
  "border border-hairline text-ink",
  "hover:border-ink/25 hover:bg-surface-soft active:bg-surface-soft",
);

const factLabel = "text-[0.8125rem]/[1.125rem] text-muted";

const factValue = "mt-0.5 text-base font-bold tracking-[-0.01em]";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={factLabel}>{label}</dt>
      <dd className={factValue}>{value}</dd>
    </div>
  );
}

export function EsimCard({ esim }: { esim: Esim }) {
  const [installing, setInstalling] = useState(false);

  const { plan, usage, state } = esim;

  const spent = usage ? Math.round((usage.usedMb / usage.totalMb) * 100) : 0;

  const live = state === "active" || state === "ready";

  return (
    <li className="rounded-sheet border border-hairline bg-surface p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2.5 text-h3">
            <MdSimCard aria-hidden className="h-5 w-5 shrink-0 text-brand" />
            <span className="truncate">
              {plan ? `${plan.destination} eSIM` : "eSIM"}
            </span>
          </h3>

          <p className="mt-1.5 text-sm text-muted">
            {plan ? `${plan.data} · ${plan.days} days · ` : ""}
            ICCID {esim.iccid}
          </p>
        </div>

        <span className={cn(pill, pillTone[state])}>
          {esimStateLabels[state]}
        </span>
      </div>

      {usage && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-base font-bold tracking-[-0.01em]">
              {formatData(usage.leftMb)} left
            </p>

            <p className="text-sm text-muted">
              {formatData(usage.usedMb)} of {formatData(usage.totalMb)} used
            </p>
          </div>

          <div
            role="progressbar"
            aria-label="Data used"
            aria-valuenow={spent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-2 overflow-hidden rounded-full bg-ink/8"
          >
            <div
              className={cn(
                "h-full rounded-full",
                live ? "bg-brand" : "bg-ink/25",
              )}
              style={{ width: `${Math.min(Math.max(spent, 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {(esim.activatedAt || esim.expiresAt || esim.network) && (
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
          {esim.activatedAt && (
            <Fact label="Activated" value={formatDay(esim.activatedAt)} />
          )}

          {esim.expiresAt && (
            <Fact
              label={state === "active" ? "Expires" : "Expired"}
              value={
                esim.daysLeft === undefined
                  ? formatDay(esim.expiresAt)
                  : `${formatDay(esim.expiresAt)} · ${esim.daysLeft} day${esim.daysLeft === 1 ? "" : "s"} left`
              }
            />
          )}

          {esim.network && <Fact label="Last network" value={esim.network} />}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {esim.qrImage || esim.activationCode ? (
          <Pressable
            aria-haspopup="dialog"
            aria-expanded={installing}
            onClick={() => setInstalling(true)}
            className={cn(action, "gap-2")}
          >
            <MdQrCode2 aria-hidden className="h-4 w-4" />
            Install details
          </Pressable>
        ) : null}

        {plan && (
          <Pressable href={plan.href} className={action}>
            Top up {plan.destination}
          </Pressable>
        )}
      </div>

      <InstallDialog
        esim={esim}
        open={installing}
        onClose={() => setInstalling(false)}
      />
    </li>
  );
}
