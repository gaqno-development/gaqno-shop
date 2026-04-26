import { describe, expect, it } from "vitest";
import { resolveStorefrontHomeCopy } from "./storefront-copy";
import type { ShopTenant } from "@/types/shop-tenant";

describe("resolveStorefrontHomeCopy", () => {
  it("returns default copy when tenant is null", () => {
    const result = resolveStorefrontHomeCopy(null);
    expect(result.hero.eyebrow).toContain("Colecao");
    expect(result.categories.sectionTitle).toBe("Por categoria");
    expect(result.categories.ctaLabel).toBe("Explorar");
  });

  it("returns default copy when tenant is undefined", () => {
    const result = resolveStorefrontHomeCopy(undefined);
    expect(result.hero.line1).toBe("Tudo comeca");
    expect(result.categories.eyebrow).toContain("Colecoes");
  });

  it("returns default copy when settings is missing", () => {
    const tenant = {} as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.newsletter.body).toContain("bastidores");
    expect(result.categories.sectionTitle).toBe("Por categoria");
  });

  it("returns default copy when storefrontCopy is missing", () => {
    const tenant = { settings: {} } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.hero.welcomeLead).toContain("Curadoria");
    expect(result.categories.ctaLabel).toBe("Explorar");
  });

  it("returns default copy when home is missing", () => {
    const tenant = { settings: { storefrontCopy: {} } } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.sections.catalogTitle).toBe("Todos os produtos");
    expect(result.categories.eyebrow).toContain("Colecoes");
  });

  it("returns default copy when categories is missing", () => {
    const tenant = {
      settings: {
        storefrontCopy: {
          home: {},
        },
      },
    } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.categories.sectionTitle).toBe("Por categoria");
    expect(result.categories.ctaLabel).toBe("Explorar");
    expect(result.categories.eyebrow).toContain("Colecoes");
  });

  it("overrides categories from tenant settings", () => {
    const tenant = {
      settings: {
        storefrontCopy: {
          home: {
            categories: {
              eyebrow: "Minhas colecoes",
              sectionTitle: "Categorias da loja",
              ctaLabel: "Ver tudo",
            },
          },
        },
      },
    } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.categories.eyebrow).toBe("Minhas colecoes");
    expect(result.categories.sectionTitle).toBe("Categorias da loja");
    expect(result.categories.ctaLabel).toBe("Ver tudo");
  });

  it("overrides hero from tenant settings", () => {
    const tenant = {
      settings: {
        storefrontCopy: {
          home: {
            hero: {
              line1: "Titulo personalizado",
              welcomeLead: "Descricao da loja",
            },
          },
        },
      },
    } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.hero.line1).toBe("Titulo personalizado");
    expect(result.hero.welcomeLead).toBe("Descricao da loja");
  });

  it("uses description as welcomeLead fallback when hero.welcomeLead is missing", () => {
    const tenant = {
      description: "Minha descricao personalizada",
      settings: {
        storefrontCopy: {
          home: {
            hero: {
              line1: "Titulo",
            },
          },
        },
      },
    } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.hero.welcomeLead).toBe("Minha descricao personalizada");
  });

  it("ignores empty string values in categories", () => {
    const tenant = {
      settings: {
        storefrontCopy: {
          home: {
            categories: {
              eyebrow: "",
              sectionTitle: "   ",
              ctaLabel: "",
            },
          },
        },
      },
    } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.categories.eyebrow).toContain("Colecoes");
    expect(result.categories.sectionTitle).toBe("Por categoria");
    expect(result.categories.ctaLabel).toBe("Explorar");
  });

  it("preserves other fields when overriding categories", () => {
    const tenant = {
      settings: {
        storefrontCopy: {
          home: {
            categories: {
              sectionTitle: "Nova categoria",
            },
          },
        },
      },
    } as ShopTenant;
    const result = resolveStorefrontHomeCopy(tenant);
    expect(result.hero.line1).toBe("Tudo comeca");
    expect(result.categories.sectionTitle).toBe("Nova categoria");
    expect(result.categories.eyebrow).toContain("Colecoes");
    expect(result.categories.ctaLabel).toBe("Explorar");
  });
});