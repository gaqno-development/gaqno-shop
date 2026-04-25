export interface ShopTenant {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly domain: string | null;
  readonly description: string | null;
  readonly primaryColor: string;
  readonly bgColor: string;
  readonly secondaryColor: string;
  readonly logoUrl: string | null;
  readonly faviconUrl: string | null;
  readonly isActive: boolean;
  readonly isDropshipping: boolean;
  readonly orderPrefix: string;
  readonly settings?: Record<string, unknown> | null;
}

export interface ShopFeatureFlags {
  readonly featureShipping: boolean;
  readonly featureDecorations: boolean;
  readonly featureCoupons: boolean;
  readonly featureRecipes: boolean;
  readonly featureInventory: boolean;
  readonly featureCreditCard: boolean;
  readonly featureBoleto: boolean;
  readonly featurePix: boolean;
  readonly featureDropshipping: boolean;
  readonly featureBakery?: boolean;
}

export interface ShopTenantResolveSnapshot {
  readonly tenant: ShopTenant | null;
  readonly featureFlags: unknown;
}
