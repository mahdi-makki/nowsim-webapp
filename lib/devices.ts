export const ALL_DEVICES = "all";

export type DeviceGroup = {
  id: string;
  label: string;
  devices: string[];
};

export type DevicePlatform = {
  id: string;
  label: string;
  groups: DeviceGroup[];
};

const platforms: DevicePlatform[] = [
  {
    id: "apple",
    label: "Apple",
    groups: [
      {
        id: "phones",
        label: "Phones",
        devices: [
          "iPhone XR",
          "iPhone XS",
          "iPhone XS Max",
          "iPhone 11",
          "iPhone 11 Pro",
          "iPhone 11 Pro Max",
          "iPhone SE (2020 and newer)",
          "iPhone 12",
          "iPhone 12 mini",
          "iPhone 12 Pro",
          "iPhone 12 Pro Max",
          "iPhone 13",
          "iPhone 13 mini",
          "iPhone 13 Pro",
          "iPhone 13 Pro Max",
          "iPhone 14",
          "iPhone 14 Plus",
          "iPhone 14 Pro",
          "iPhone 14 Pro Max",
          "iPhone 15",
          "iPhone 15 Plus",
          "iPhone 15 Pro",
          "iPhone 15 Pro Max",
          "iPhone 16",
          "iPhone 16e",
          "iPhone 16 Plus",
          "iPhone 16 Pro",
          "iPhone 16 Pro Max",
        ],
      },
      {
        id: "tablets",
        label: "Tablets",
        devices: [
          "iPad Pro 11-inch (Wi-Fi + Cellular)",
          "iPad Pro 12.9-inch (Wi-Fi + Cellular)",
          "iPad Air (3rd gen and newer, Wi-Fi + Cellular)",
          "iPad (7th gen and newer, Wi-Fi + Cellular)",
          "iPad mini (5th gen and newer, Wi-Fi + Cellular)",
        ],
      },
      {
        id: "watches",
        label: "Smart watches",
        devices: [
          "Apple Watch Series 3 (Cellular)",
          "Apple Watch Series 4 (Cellular)",
          "Apple Watch Series 5 (Cellular)",
          "Apple Watch SE (Cellular)",
          "Apple Watch Series 6 (Cellular)",
          "Apple Watch Series 7 (Cellular)",
          "Apple Watch Series 8 (Cellular)",
          "Apple Watch Ultra",
          "Apple Watch Series 9 (Cellular)",
          "Apple Watch Ultra 2",
          "Apple Watch Series 10 (Cellular)",
        ],
      },
    ],
  },
  {
    id: "android",
    label: "Android",
    groups: [
      {
        id: "phones",
        label: "Phones",
        devices: [
          "Google Pixel 3 / 3 XL",
          "Google Pixel 3a / 3a XL",
          "Google Pixel 4 / 4a / 4 XL",
          "Google Pixel 5 / 5a",
          "Google Pixel 6 / 6a / 6 Pro",
          "Google Pixel 7 / 7a / 7 Pro",
          "Google Pixel 8 / 8a / 8 Pro",
          "Google Pixel 9 / 9 Pro / 9 Pro XL",
          "Samsung Galaxy S20 / S20+ / S20 Ultra",
          "Samsung Galaxy S21 / S21+ / S21 Ultra",
          "Samsung Galaxy S22 / S22+ / S22 Ultra",
          "Samsung Galaxy S23 / S23+ / S23 Ultra",
          "Samsung Galaxy S24 / S24+ / S24 Ultra",
          "Samsung Galaxy S25 / S25+ / S25 Ultra",
          "Samsung Galaxy Z Flip (all generations)",
          "Samsung Galaxy Z Fold (all generations)",
          "Samsung Galaxy Note 20 / Note 20 Ultra",
          "Samsung Galaxy A54 / A55",
        ],
      },
      {
        id: "tablets",
        label: "Tablets",
        devices: [
          "Samsung Galaxy Tab S6 (LTE)",
          "Samsung Galaxy Tab S7 / S7+ (5G)",
          "Samsung Galaxy Tab S8 / S8+ / S8 Ultra (5G)",
          "Samsung Galaxy Tab S9 / S9+ / S9 Ultra (5G)",
          "Google Pixel Tablet (Wi-Fi + Cellular)",
        ],
      },
      {
        id: "watches",
        label: "Smart watches",
        devices: [
          "Samsung Galaxy Watch (LTE)",
          "Samsung Galaxy Watch 4 / 5 / 6 / 7 (LTE)",
          "Samsung Galaxy Watch Ultra",
          "Google Pixel Watch (LTE)",
          "Google Pixel Watch 2 / 3 (LTE)",
        ],
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    groups: [
      {
        id: "phones",
        label: "Phones",
        devices: [
          "Motorola Razr (2019 and newer)",
          "Motorola Edge 40 / 50 Pro",
          "Huawei P40 / P40 Pro",
          "Huawei Mate 40 Pro",
          "Oppo Find X3 / X5 / X8 Pro",
          "Oppo Reno 5A / 6 Pro / 11",
          "OnePlus 11 / 12 / 13",
          "Sony Xperia 1 IV / 1 V / 10 IV",
          "Nokia XR21 / G60",
          "Honor Magic 4 Pro / Magic 5 Pro",
          "Xiaomi 12T Pro / 13 / 14",
          "Rakuten Mini / Big / Hand",
          "Fairphone 4 / 5",
        ],
      },
      {
        id: "tablets",
        label: "Tablets",
        devices: [
          "Microsoft Surface Pro X",
          "Microsoft Surface Pro 9 (5G)",
          "Microsoft Surface Duo / Duo 2",
          "Huawei MatePad Pro (5G)",
          "Lenovo Tab P11 5G",
        ],
      },
      {
        id: "laptops",
        label: "Laptops",
        devices: [
          "Acer Swift 7 / Swift 3 (LTE)",
          "ASUS Mini Transformer T103HAF",
          "Dell Latitude 7000 / 9000 series (LTE)",
          "HP Spectre Folio 13 / Elitebook G5 (LTE)",
          "Lenovo ThinkPad X1 (LTE)",
          "Samsung Galaxy Book 2 / Book 4 (5G)",
        ],
      },
    ],
  },
];

const allGroups: DeviceGroup[] = platforms.reduce<DeviceGroup[]>(
  (groups, platform) => {
    for (const group of platform.groups) {
      const merged = groups.find((entry) => entry.id === group.id);

      if (merged) merged.devices.push(...group.devices);
      else groups.push({ ...group, devices: [...group.devices] });
    }

    return groups;
  },
  [],
);

export const deviceTabs: DevicePlatform[] = [
  { id: ALL_DEVICES, label: "All", groups: allGroups },
  ...platforms,
];
