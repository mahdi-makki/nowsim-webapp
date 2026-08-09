import type { Metadata } from "next";
import localFont from "next/font/local";

import { SessionProvider } from "@/components/layout/SessionProvider";
import { getAccount } from "@/lib/auth/dal";

import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "nowsim: Stay connected, wherever's next",
  description:
    "Travel eSIMs for every destination. Pick a country, buy a data plan, and connect the moment you land.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* One provider for every route group: the site pages and checkout
            share a single instance, so a sign-in or sign-out on either side
            survives the client-side navigation between them. */}
        <SessionProvider account={getAccount()}>{children}</SessionProvider>
      </body>
    </html>
  );
}
