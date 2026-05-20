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

const FOUC_SCRIPT =
  "(function(){" +
  "try{" +
  "var t=localStorage.getItem('theme');" +
  "if(t==='light'){document.documentElement.classList.remove('dark');}" +
  "else if(t==='dark'){document.documentElement.classList.add('dark');}" +
  "else if(t==='system'){" +
  "if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}" +
  "else{document.documentElement.classList.remove('dark');}" +
  "}else{document.documentElement.classList.add('dark');}" +
  "}catch(e){document.documentElement.classList.add('dark');}" +
  "})();";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenantResolve = await getShopTenantResolveForRequest();
  return (
    <html lang="pt-BR" className={FONT_VARIABLES} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FOUC_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <Providers initialTenantResolve={tenantResolve}>{children}</Providers>
      </body>
    </html>
  );
}
