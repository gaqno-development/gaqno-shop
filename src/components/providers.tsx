"use client";

import type { CSSProperties } from "react";
import { SessionProvider } from "next-auth/react";
import { TenantProvider, useTenant } from "@/contexts/tenant-context";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/footer";
import { ShopAnalytics } from "@/components/ShopAnalytics";
import type { ShopTenantResolveSnapshot } from "@/types/shop-tenant";

const DEFAULT_PRIMARY = "#b91c1c";
const DEFAULT_SECONDARY = "#1a0a0a";

interface TenantStyle extends CSSProperties {
  "--tenant-primary"?: string;
  "--tenant-secondary"?: string;
  "--tenant-bg"?: string;
  "--glass-border"?: string;
  "--glass-surface"?: string;
  "--glass-highlight"?: string;
  "--glass-glow"?: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildTenantStyle(
  primary?: string | null,
  secondary?: string | null,
  bg?: string | null,
): TenantStyle {
  const primaryColor = primary ?? DEFAULT_PRIMARY;
  const secondaryColor = secondary ?? DEFAULT_SECONDARY;
  return {
    "--tenant-primary": primaryColor,
    "--tenant-secondary": secondaryColor,
    "--tenant-bg": bg ?? "var(--paper)",
    "--glass-border": hexToRgba(primaryColor, 0.15),
    "--glass-surface": hexToRgba(primaryColor, 0.06),
    "--glass-highlight": hexToRgba(primaryColor, 0.1),
    "--glass-glow": hexToRgba(primaryColor, 0.25),
  };
}

function TenantShell({ children }: { readonly children: React.ReactNode }) {
  const { tenant } = useTenant();
  const style = buildTenantStyle(
    tenant?.primaryColor,
    tenant?.secondaryColor,
    tenant?.bgColor,
  );

  return (
    <div
      data-tenant-hue
      style={style}
      className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]"
    >
      <ShopAnalytics />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function Providers({
  children,
  initialTenantResolve,
}: {
  readonly children: React.ReactNode;
  readonly initialTenantResolve?: ShopTenantResolveSnapshot | null;
}) {
  return (
    <SessionProvider>
      <TenantProvider initialResolve={initialTenantResolve ?? null}>
        <CartProvider>
          <TenantShell>{children}</TenantShell>
        </CartProvider>
      </TenantProvider>
    </SessionProvider>
  );
}
