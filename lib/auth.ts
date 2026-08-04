import type { IconType } from "react-icons";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMail } from "react-icons/md";

export type ProviderId = "apple" | "google" | "email";

export type AuthProvider = {
  id: ProviderId;
  label: string;
  Icon: IconType;
};

export const authProviders: AuthProvider[] = [
  { id: "apple", label: "Continue with Apple", Icon: FaApple },
  { id: "google", label: "Continue with Google", Icon: FcGoogle },
  { id: "email", label: "Continue with Email", Icon: MdOutlineMail },
];

export const providerNames: Record<ProviderId, string> = {
  apple: "Apple",
  google: "Google",
  email: "Email",
};

export const legalLinks = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Storage of the Cardholder's Credential", href: "#" },
];
