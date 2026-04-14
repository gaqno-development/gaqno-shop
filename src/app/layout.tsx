import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TenantProvider } from "@/contexts/tenant-context";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gaqno Shop",
  description: "Multi-tenant e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <TenantProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
