import type { ShopFeatureFlags } from "@/types/shop-tenant";

export function parseShopFeatureFlags(raw: unknown): ShopFeatureFlags | null {
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
