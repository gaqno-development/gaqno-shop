"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { resolveTenant, setShopTenantSlug } from "@/lib/api";

interface FeatureFlags {
  featureShipping: boolean;
  featureDecorations: boolean;
  featureCoupons: boolean;
  featureRecipes: boolean;
  featureInventory: boolean;
  featureCheckoutPro: boolean;
  featurePix: boolean;
  featureDropshipping: boolean;
  featureBakery?: boolean;
}

interface Tenant {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  description: string | null;
  primaryColor: string;
  bgColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  isActive: boolean;
  isDropshipping: boolean;
  orderPrefix: string;
  settings?: Record<string, unknown> | null;
}

interface TenantContextType {
  tenant: Tenant | null;
  featureFlags: FeatureFlags | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  featureFlags: null,
  isLoading: true,
  error: null,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTenant() {
      try {
        const domain = window.location.host;
        const data = await resolveTenant(domain);
        
        if (data.tenant) {
          setShopTenantSlug(data.tenant.slug);
          setTenant(data.tenant);
          setFeatureFlags(data.featureFlags);
        } else {
          setShopTenantSlug(null);
          setError("Tenant not found");
        }
      } catch (err) {
        setShopTenantSlug(null);
        setError("Failed to load tenant");
      } finally {
        setIsLoading(false);
      }
    }

    loadTenant();
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
