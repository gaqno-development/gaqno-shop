import { describe, expect, it } from "vitest";
import { shopMetadataFromTenantSnapshot } from "./shop-tenant-metadata";
import { DEFAULT_SHOP_METADATA_DESCRIPTION, DEFAULT_STORE_BRAND_LABEL } from "./brand-defaults";
import type { ShopTenant } from "@/types/shop-tenant";

function makeTenant(overrides: Partial<ShopTenant>): ShopTenant {
  return {
    id: "t1",
    slug: "fifia-doces",
    name: "Fifia Doces",
    domain: "fifiadoces.com.br",
    description: "Doces artesanais",
    primaryColor: "#111",
    bgColor: "#fff",
    secondaryColor: "#eee",
    logoUrl: "https://cdn.example/logo.png",
    faviconUrl: "https://cdn.example/favicon.ico",
    isActive: true,
    isDropshipping: false,
    orderPrefix: "FD",
    ...overrides,
  };
}

describe("shopMetadataFromTenantSnapshot", () => {
  it("uses tenant name, favicon, and logo in metadata", () => {
    const meta = shopMetadataFromTenantSnapshot(
      { tenant: makeTenant({}), featureFlags: {} },
      "https://fifiadoces.com.br",
    );
    expect(meta.title).toEqual({
      default: "Fifia Doces",
      template: "%s · Fifia Doces",
    });
    expect(meta.description).toBe("Doces artesanais");
    expect(meta.metadataBase?.toString()).toBe("https://fifiadoces.com.br/");
    expect(meta.icons?.icon?.[0]?.url).toBe("https://cdn.example/favicon.ico");
    expect(meta.openGraph?.images?.[0]).toEqual({
      url: "https://cdn.example/logo.png",
      alt: "Fifia Doces",
    });
    expect(meta.openGraph?.siteName).toBe("Fifia Doces");
  });

  it("falls back to default label when tenant missing", () => {
    const meta = shopMetadataFromTenantSnapshot(null, "https://example.com");
    expect(meta.title).toEqual({
      default: DEFAULT_STORE_BRAND_LABEL,
      template: `%s · ${DEFAULT_STORE_BRAND_LABEL}`,
    });
    expect(meta.description).toBe(DEFAULT_SHOP_METADATA_DESCRIPTION);
    expect(meta.icons).toBeUndefined();
  });

  it("sets noindex when tenant is inactive", () => {
    const meta = shopMetadataFromTenantSnapshot(
      { tenant: makeTenant({ isActive: false }), featureFlags: {} },
      undefined,
    );
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
