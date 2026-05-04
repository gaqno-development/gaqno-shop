import { describe, it, expect } from "vitest";
import { resolveBakerySizeLabels } from "./resolve-bakery-size-labels";
import { TENANT_SETTINGS_BAKERY_SIZE_LABELS_KEY } from "@/constants/bakery-size-labels";
import type { ShopTenant } from "@/types/shop-tenant";

const baseTenant: ShopTenant = {
  id: "t1",
  slug: "loja",
  name: "Loja",
  domain: null,
  description: null,
  primaryColor: "#000",
  bgColor: "#fff",
  secondaryColor: "#999",
  logoUrl: null,
  faviconUrl: null,
  isActive: true,
  isDropshipping: false,
  orderPrefix: "A",
  settings: null,
};

describe("resolveBakerySizeLabels", () => {
  it("returns P M G when tenant is null", () => {
    expect(resolveBakerySizeLabels(null)).toEqual(["P", "M", "G"]);
  });

  it("returns P M G when settings missing", () => {
    expect(resolveBakerySizeLabels(baseTenant)).toEqual(["P", "M", "G"]);
  });

  it("uses tenant bakerySizeLabels when valid", () => {
    const tenant: ShopTenant = {
      ...baseTenant,
      settings: {
        [TENANT_SETTINGS_BAKERY_SIZE_LABELS_KEY]: ["1 kg", "3 kg", "5 kg"],
      },
    };
    expect(resolveBakerySizeLabels(tenant)).toEqual(["1 kg", "3 kg", "5 kg"]);
  });

  it("trims, drops empty, dedupes, and caps length", () => {
    const long = Array.from({ length: 20 }, (_, i) => `S${i}`);
    const tenant: ShopTenant = {
      ...baseTenant,
      settings: {
        [TENANT_SETTINGS_BAKERY_SIZE_LABELS_KEY]: [
          "  a  ",
          "",
          "a",
          "b",
          ...long,
        ],
      },
    };
    const out = resolveBakerySizeLabels(tenant);
    expect(out[0]).toBe("a");
    expect(out[1]).toBe("b");
    expect(out).toHaveLength(12);
  });

  it("ignores non-array or invalid entries", () => {
    const tenant: ShopTenant = {
      ...baseTenant,
      settings: {
        [TENANT_SETTINGS_BAKERY_SIZE_LABELS_KEY]: "P,M,G" as unknown as string[],
      },
    };
    expect(resolveBakerySizeLabels(tenant)).toEqual(["P", "M", "G"]);
  });
});
