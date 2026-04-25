export interface BakeryDecoration {
  readonly id: string;
  readonly name: string;
  readonly type: "topper" | "flower" | "custom";
  readonly customizationTypeId: string | null;
  readonly description: string | null;
  readonly priceAdjustment: string;
  readonly imageUrl: string | null;
  readonly isActive: boolean;
}

export interface BakerySiteSettings {
  readonly tenantId: string;
  readonly siteName: string | null;
  readonly tagline: string | null;
  readonly heroTitle: string | null;
  readonly heroSubtitle: string | null;
  readonly heroImageUrl: string | null;
  readonly introText: string | null;
  readonly whatsappNumber: string | null;
  readonly instagramHandle: string | null;
  readonly emailContact: string | null;
}

export interface TenantFeatureFlags {
  readonly featureLoyalty?: boolean;
  readonly featureAnalytics?: boolean;
  readonly featureShipping?: boolean;
  readonly featureBakery?: boolean;
}

export interface OrderItemBakeryMeta {
  readonly size?: string;
  readonly notes?: string;
  readonly referenceImageUrl?: string;
  readonly decorations?: readonly {
    readonly decorationId: string;
    readonly quantity: number;
    readonly priceAdjustment: string;
  }[];
}
