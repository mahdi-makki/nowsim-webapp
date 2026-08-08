import { CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { getAccount } from "@/lib/auth/dal";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider account={getAccount()}>
      <CheckoutHeader />

      <main className="flex-1 pt-[calc(var(--header-height)+env(safe-area-inset-top))]">
        {children}
      </main>
    </SessionProvider>
  );
}
