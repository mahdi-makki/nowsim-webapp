import type { DeviceGroup } from "@/lib/types";

/** Normalizes a raw search box value into what the filters below expect. */
export function deviceQuery(value: string): string {
  return value.trim().toLowerCase();
}

/** `query` must already be normalized by `deviceQuery`. */
function filterDevices(devices: string[], query: string): string[] {
  if (!query) return devices;

  return devices.filter((device) => device.toLowerCase().includes(query));
}

/** Same filter, applied per group, with the groups that empty out dropped. */
export function filterDeviceGroups(
  groups: DeviceGroup[],
  query: string,
): DeviceGroup[] {
  if (!query) return groups;

  return groups
    .map((group) => ({
      ...group,
      devices: filterDevices(group.devices, query),
    }))
    .filter((group) => group.devices.length > 0);
}
