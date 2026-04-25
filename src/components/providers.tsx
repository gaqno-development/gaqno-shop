"use client";

import type { CSSProperties } from "react";
import { SessionProvider } from "next-auth/react";
import { TenantProvider, useTenant } from "@/contexts/tenant-context";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/footer";
import { ShopAnalytics } from "@/components/ShopAnalytics";
import type { ShopTenantResolveSnapshot } from "@/types/shop-tenant";

const DEFAULT_PRIMARY = "#111111";
const DEFAULT_SECONDARY = "#f3f4f6";

interface TenantStyle extends CSSProperties {
  "--tenant-primary"?: string;
  "--tenant-secondary"?: string;
  "--tenant-bg"?: string;
}

function buildTenantStyle(
  primary?: string | null,
  secondary?: string | null,
  bg?: string | null,
): TenantStyle {
  return {
    "--tenant-primary": primary ?? DEFAULT_PRIMARY,
    "--tenant-secondary": secondary ?? DEFAULT_SECONDARY,
    "--tenant-bg": bg ?? "var(--paper)",
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
