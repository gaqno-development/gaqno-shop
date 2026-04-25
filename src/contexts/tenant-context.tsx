"use client";

import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { resolveTenant, setShopTenantSlug } from "@/lib/api";
import { parseShopFeatureFlags } from "@/lib/shop-feature-flags";
import type {
  ShopFeatureFlags,
  ShopTenant,
  ShopTenantResolveSnapshot,
} from "@/types/shop-tenant";

interface TenantContextType {
  tenant: ShopTenant | null;
  featureFlags: ShopFeatureFlags | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  featureFlags: null,
  isLoading: true,
  error: null,
});

export function TenantProvider({
  children,
  initialResolve,
}: {
  readonly children: React.ReactNode;
  readonly initialResolve?: ShopTenantResolveSnapshot | null;
}) {
  const [tenant, setTenant] = useState<ShopTenant | null>(
    initialResolve?.tenant ?? null,
  );
  const [featureFlags, setFeatureFlags] = useState<ShopFeatureFlags | null>(
    initialResolve?.tenant
      ? parseShopFeatureFlags(initialResolve.featureFlags)
      : null,
  );
  const [isLoading, setIsLoading] = useState(!initialResolve?.tenant);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const t = initialResolve?.tenant;
    if (t?.slug) {
      setShopTenantSlug(t.slug);
    }
  }, [initialResolve?.tenant?.slug]);

  useEffect(() => {
    async function loadTenant() {
      try {
        const domain = window.location.host;
        const data = await resolveTenant(domain);

        if (data.tenant) {
          setShopTenantSlug(data.tenant.slug);
          setTenant(data.tenant as ShopTenant);
          setFeatureFlags(parseShopFeatureFlags(data.featureFlags));
          setError(null);
        } else {
          setShopTenantSlug(null);
          setError("Tenant not found");
        }
      } catch {
        setShopTenantSlug(null);
        setError("Failed to load tenant");
      } finally {
        setIsLoading(false);
      }
    }

    void loadTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, featureFlags, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
