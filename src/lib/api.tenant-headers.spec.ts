import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setShopTenantSlug, shopApiTenantHeaders } from "./api";

describe("shopApiTenantHeaders", () => {
  beforeEach(() => {
    setShopTenantSlug(null);
    vi.unstubAllEnvs();
    vi.stubGlobal(
      "window",
      { location: { host: "fifiadoces.com.br" } } as Window & typeof globalThis,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setShopTenantSlug(null);
    vi.unstubAllEnvs();
  });

  it("sends X-Tenant-Domain from the browser host", () => {
    expect(shopApiTenantHeaders()).toEqual({
      "X-Tenant-Domain": "fifiadoces.com.br",
    });
  });

  it("prefers resolved slug from setShopTenantSlug over env", () => {
    vi.stubEnv("NEXT_PUBLIC_TENANT_SLUG", "env-tenant");
    setShopTenantSlug("fifia-doces");
    expect(shopApiTenantHeaders()).toEqual({
      "X-Tenant-Slug": "fifia-doces",
      "X-Tenant-Domain": "fifiadoces.com.br",
    });
  });

  it("uses NEXT_PUBLIC_TENANT_SLUG when resolved slug is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_TENANT_SLUG", "local-tenant");
    expect(shopApiTenantHeaders()).toEqual({
      "X-Tenant-Slug": "local-tenant",
      "X-Tenant-Domain": "fifiadoces.com.br",
    });
  });
});
