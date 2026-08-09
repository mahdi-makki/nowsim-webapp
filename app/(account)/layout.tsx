import { WebNavbar } from "@/components/layout/WebNavbar";

// Same chrome as the site group, minus the footer: these are logged-in screens
// people come to do one thing on, not places to go browsing from.
export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <WebNavbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
