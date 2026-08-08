import type { IconType } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMail } from "react-icons/md";

export type ProviderId = "google" | "email";

export type AuthProvider = {
  id: ProviderId;
  label: string;
  Icon: IconType;
  ready: boolean;
};

export const authProviders: AuthProvider[] = [
  { id: "google", label: "Continue with Google", Icon: FcGoogle, ready: false },
  { id: "email", label: "Continue with Email", Icon: MdOutlineMail, ready: true },
];

export const providerNames: Record<ProviderId, string> = {
  google: "Google",
  email: "Email",
};

export const legalLinks = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Storage of the Cardholder's Credential", href: "#" },
];
