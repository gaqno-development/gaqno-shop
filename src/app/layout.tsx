import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import {
  buildShopMetadataFromResolve,
  getShopTenantResolveForRequest,
} from "@/lib/shop-tenant-request.server";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const FONT_VARIABLES = [geist.variable, fraunces.variable, jetbrainsMono.variable].join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const snapshot = await getShopTenantResolveForRequest();
  return buildShopMetadataFromResolve(snapshot);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenantResolve = await getShopTenantResolveForRequest();
  return (
    <html lang="pt-BR" className={`dark ${FONT_VARIABLES}`}>
      <body className="font-sans antialiased">
        <Providers initialTenantResolve={tenantResolve}>{children}</Providers>
      </body>
    </html>
  );
}
