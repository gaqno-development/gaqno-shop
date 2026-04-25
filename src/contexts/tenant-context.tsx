"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { resolveTenant, setShopTenantSlug } from "@/lib/api";

interface FeatureFlags {
  featureShipping: boolean;
  featureDecorations: boolean;
  featureCoupons: boolean;
  featureRecipes: boolean;
  featureInventory: boolean;
  featureCreditCard: boolean;
  featureBoleto: boolean;
  featurePix: boolean;
  featureDropshipping: boolean;
  featureBakery?: boolean;
}

function toFeatureFlags(raw: unknown): FeatureFlags | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const legacy =
    typeof o.featureCheckoutPro === "boolean" ? o.featureCheckoutPro : true;
  return {
    featureShipping: Boolean(o.featureShipping ?? true),
    featureDecorations: Boolean(o.featureDecorations ?? true),
    featureCoupons: Boolean(o.featureCoupons ?? true),
    featureRecipes: Boolean(o.featureRecipes ?? false),
    featureInventory: Boolean(o.featureInventory ?? true),
    featureCreditCard:
      typeof o.featureCreditCard === "boolean" ? o.featureCreditCard : legacy,
    featureBoleto: typeof o.featureBoleto === "boolean" ? o.featureBoleto : legacy,
    featurePix: Boolean(o.featurePix ?? true),
    featureDropshipping: Boolean(o.featureDropshipping ?? false),
    featureBakery: Boolean(o.featureBakery ?? false),
  };
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
          setFeatureFlags(toFeatureFlags(data.featureFlags));
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
