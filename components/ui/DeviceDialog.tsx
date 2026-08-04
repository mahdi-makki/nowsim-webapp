"use client";

import { useId, useMemo, useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { Pressable } from "@/components/ui/Pressable";
import { ALL_DEVICES, deviceTabs, type DeviceGroup } from "@/lib/devices";
import { cn } from "@/lib/cn";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className}>
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="m16.5 16.5 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className}>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className}>
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function matches(device: string, query: string) {
  return device.toLowerCase().includes(query);
}

function filterGroups(groups: DeviceGroup[], query: string): DeviceGroup[] {
  if (!query) return groups;

  return groups
    .map((group) => ({
      ...group,
      devices: group.devices.filter((device) => matches(device, query)),
    }))
    .filter((group) => group.devices.length > 0);
}

export function DeviceDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const baseId = useId();
  const [platformId, setPlatformId] = useState(ALL_DEVICES);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const search = query.trim().toLowerCase();
  const platform =
    deviceTabs.find((entry) => entry.id === platformId) ?? deviceTabs[0];

  const groups = useMemo(
    () => filterGroups(platform.groups, search),
    [platform, search],
  );

  const elsewhere = useMemo(() => {
    if (!search || groups.length > 0) return [];

    return deviceTabs
      .filter(
        (entry) =>
          entry.id !== platform.id &&
          entry.id !== ALL_DEVICES &&
          filterGroups(entry.groups, search).length > 0,
      )
      .map((entry) => entry.label);
  }, [search, groups, platform]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Check device compatibility"
      className="max-w-[29rem]"
    >
      <p className="mt-2 pr-12 text-sm font-medium text-white/70">
        If your device isn&rsquo;t <span className="text-volt">listed</span>, it
        likely doesn&rsquo;t support eSIM
      </p>

      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for devices"
          aria-label="Search for devices"
          className={cn(
            "w-full rounded-control bg-white/10 py-3.5 pl-11 pr-4",
            "text-base text-white placeholder:text-white/45",
            "outline-none transition-colors duration-300 ease-hover",
            "hover:bg-white/[0.14] focus:bg-white/[0.14]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt",
            "motion-reduce:transition-none",
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />
      </div>

      <div
        role="group"
        aria-label="Filter devices by brand"
        className="mt-4 flex flex-wrap gap-2"
      >
        {deviceTabs.map((entry) => {
          const active = entry.id === platform.id;

          return (
            <Pressable
              key={entry.id}
              aria-pressed={active}
              onClick={() => {
                setPlatformId(entry.id);
                setExpanded(null);
              }}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold",
                active
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              {entry.label}
            </Pressable>
          );
        })}
      </div>

      <div
        className={cn(
          "-mx-2 mt-4 min-h-0 flex-1 px-2",
          "scroll-subtle overflow-y-auto overscroll-contain",
        )}
      >
        {groups.length === 0 ? (
          <p className="py-6 text-sm text-white/60">
            No device matches &ldquo;{query.trim()}&rdquo;
            {platform.id === ALL_DEVICES ? "" : ` under ${platform.label}`}.
            {elsewhere.length > 0
              ? ` Try the ${elsewhere.join(" or ")} tab.`
              : " Check the spelling, or search for the model number."}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {groups.map((group) => {
              const isOpen = search !== "" || expanded === group.id;
              const panelId = `${baseId}-${group.id}-panel`;
              const triggerId = `${baseId}-${group.id}-trigger`;

              return (
                <li key={group.id} className="rounded-control bg-white/10">
                  <Pressable
                    press={false}
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setExpanded((current) =>
                        current === group.id ? null : group.id,
                      )
                    }
                    className={cn(
                      "w-full gap-4 rounded-control px-4 py-3.5 text-left",
                      "text-base font-bold text-white",
                      "transition-colors duration-300 ease-hover hover:bg-white/10",
                      "motion-reduce:transition-none",
                    )}
                  >
                    <span className="flex-1">{group.label}</span>

                    <span className="text-sm font-medium text-white/45">
                      {group.devices.length}
                    </span>

                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-white/45",
                        "transition-transform duration-300 ease-ios",
                        isOpen && "-rotate-180",
                        "motion-reduce:transition-none",
                      )}
                    />
                  </Pressable>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={cn(
                      "grid duration-300 ease-ios",
                      "transition-[grid-template-rows,opacity,visibility]",
                      isOpen
                        ? "visible grid-rows-[1fr] opacity-100"
                        : "invisible grid-rows-[0fr] opacity-0",
                      "motion-reduce:transition-none",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col gap-1.5 px-4 pb-4 pt-1">
                        {group.devices.map((device) => (
                          <li
                            key={device}
                            className="flex items-start gap-2.5 text-sm text-white/70"
                          >
                            <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-volt" />
                            {device}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
