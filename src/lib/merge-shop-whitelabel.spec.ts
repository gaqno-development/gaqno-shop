import { describe, it, expect } from "vitest";
import { mergeShopWhiteLabel } from "./merge-shop-whitelabel";
import type { IWhiteLabelConfig } from "@gaqno-development/frontcore/types/whitelabel";
import type { ShopTenant } from "@/types/shop-tenant";

const baseTenant: ShopTenant = {
  id: "t-1",
  slug: "acme",
  name: "Acme",
  domain: "acme.test",
  description: null,
  primaryColor: "#111111",
  bgColor: "#ffffff",
  secondaryColor: "#222222",
  logoUrl: null,
  faviconUrl: null,
  isActive: true,
  isDropshipping: false,
  orderPrefix: "ACM",
  settings: null,
};

const baseApi: IWhiteLabelConfig = {
  tenantId: "sso-1",
  primaryColor: "#7008d9",
  secondaryColor: "#d91226",
  companyName: "API Co",
  appName: "API App",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

describe("mergeShopWhiteLabel", () => {
  it("returns null when both sources are null", () => {
    expect(mergeShopWhiteLabel(null, null)).toBeNull();
  });

  it("builds config from tenant when API is absent", () => {
    const m = mergeShopWhiteLabel(null, baseTenant);
    expect(m).not.toBeNull();
    expect(m?.primaryColor).toBe("#111111");
    expect(m?.companyName).toBe("Acme");
    expect(m?.tenantId).toBe("t-1");
  });

  it("returns API config when tenant is absent", () => {
    const m = mergeShopWhiteLabel(baseApi, null);
    expect(m?.primaryColor).toBe("#7008d9");
    expect(m?.tenantId).toBe("sso-1");
  });

  it("merges API over tenant defaults when both exist", () => {
    const m = mergeShopWhiteLabel(baseApi, baseTenant);
    expect(m?.primaryColor).toBe("#7008d9");
    expect(m?.companyName).toBe("API Co");
    expect(m?.tenantId).toBe("sso-1");
  });
});
