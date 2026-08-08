import { SessionProvider } from "@/components/layout/SessionProvider";
import { WebNavbar } from "@/components/layout/WebNavbar";
import { Footer } from "@/components/layout/Footer";
import { getAccount } from "@/lib/auth/dal";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider account={getAccount()}>
      <WebNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
