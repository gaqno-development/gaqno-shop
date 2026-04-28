"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/components/query-provider";
import { useWhiteLabel } from "@gaqno-development/frontcore/hooks/useWhiteLabel";
import { applyWhiteLabelStyles } from "@gaqno-development/frontcore/utils";
import { TenantProvider, useTenant } from "@/contexts/tenant-context";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/footer";
import { ShopAnalytics } from "@/components/ShopAnalytics";
import type { ShopTenantResolveSnapshot } from "@/types/shop-tenant";

function TenantShell({ children }: { readonly children: React.ReactNode }) {
  const { tenant } = useTenant();
  const { config, fetchWhiteLabelConfig } = useWhiteLabel();

  useEffect(() => {
    if (config) {
      applyWhiteLabelStyles(config);
    } else {
      fetchWhiteLabelConfig();
    }
  }, [config, fetchWhiteLabelConfig]);

  const primaryColor = config?.primaryColor ?? tenant?.primaryColor;
  const secondaryColor = config?.secondaryColor ?? tenant?.secondaryColor;
  const bgColor = tenant?.bgColor;

  return (
    <div
      data-tenant-hue
      style={{
        "--tenant-primary-hex": primaryColor || undefined,
        "--tenant-primary": primaryColor || undefined,
        "--tenant-secondary-hex": secondaryColor || undefined,
        "--tenant-secondary": secondaryColor || undefined,
        ...(bgColor ? { "--tenant-bg": bgColor } : {}),
      } as React.CSSProperties}
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
      <QueryProvider>
        <TenantProvider initialResolve={initialTenantResolve ?? null}>
          <CartProvider>
            <TenantShell>{children}</TenantShell>
          </CartProvider>
        </TenantProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
