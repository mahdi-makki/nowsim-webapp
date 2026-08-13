
export type InstallPlatformId = "ios" | "android";

export type InstallMethodId = "manual" | "qr";

export type InstallStep = {
  title: string;
  path?: string[];
  body: string;
  tip?: string;
};

export type InstallMethod = {
  id: InstallMethodId;
  label: string;
  blurb: string;
  steps: InstallStep[];
};

export type InstallGuide = {
  id: InstallPlatformId;
  label: string;
  devices: string;
  versions: string;
  methods: InstallMethod[];
};

export const installPlatforms: InstallPlatformId[] = ["ios", "android"];

export function isInstallPlatform(value: string): value is InstallPlatformId {
  return installPlatforms.includes(value as InstallPlatformId);
}

export function installHref(platform: InstallPlatformId): string {
  return `/how-to-install/${platform}`;
}

const guides: Record<InstallPlatformId, InstallGuide> = {
  ios: {
    id: "ios",
    label: "iOS",
    devices: "iPhone and iPad",
    versions: "iOS 17 and later, including iOS 26",
    methods: [],
  },
  android: {
    id: "android",
    label: "Android",
    devices: "Pixel, Samsung, and most flagship Androids",
    versions: "Android 11 and later",
    methods: [],
  },
};

export function getInstallGuide(platform: InstallPlatformId): InstallGuide {
  return guides[platform];
}

export function getInstallGuides(): InstallGuide[] {
  return installPlatforms.map(getInstallGuide);
}
