import type { IWhiteLabelConfig } from "@gaqno-development/frontcore/types/whitelabel";
import type { ShopTenant } from "@/types/shop-tenant";

const STAMP = "1970-01-01T00:00:00.000Z";

function fromTenant(tenant: ShopTenant): IWhiteLabelConfig {
  return {
    tenantId: tenant.id,
    primaryColor: tenant.primaryColor,
    secondaryColor: tenant.secondaryColor,
    companyName: tenant.name,
    appName: tenant.name,
    logoUrl: tenant.logoUrl ?? undefined,
    faviconUrl: tenant.faviconUrl ?? undefined,
    createdAt: STAMP,
    updatedAt: STAMP,
  };
}

export function mergeShopWhiteLabel(
  api: IWhiteLabelConfig | null | undefined,
  tenant: ShopTenant | null,
): IWhiteLabelConfig | null {
  if (api && tenant) {
    return { ...fromTenant(tenant), ...api };
  }
  if (api) {
    return api;
  }
  if (tenant) {
    return fromTenant(tenant);
  }
  return null;
}
