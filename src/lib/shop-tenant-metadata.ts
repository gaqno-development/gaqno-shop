import type { Metadata } from "next";
import type { ShopTenantResolveSnapshot } from "@/types/shop-tenant";
import {
  DEFAULT_SHOP_METADATA_DESCRIPTION,
  DEFAULT_STORE_BRAND_LABEL,
} from "@/lib/brand-defaults";

export function shopMetadataFromTenantSnapshot(
  snapshot: ShopTenantResolveSnapshot | null,
  origin: string | undefined,
): Metadata {
  const tenant = snapshot?.tenant ?? null;
  const metadataBase = origin ? new URL(origin) : undefined;
  const titleBase = tenant?.name?.trim() || DEFAULT_STORE_BRAND_LABEL;
  const description =
    (tenant?.description && tenant.description.trim()) ||
    DEFAULT_SHOP_METADATA_DESCRIPTION;
  const icons =
    tenant?.faviconUrl && tenant.faviconUrl.trim()
      ? {
          icon: [{ url: tenant.faviconUrl }],
          apple: [{ url: tenant.faviconUrl }],
        }
      : undefined;
  const ogImages =
    tenant?.logoUrl && tenant.logoUrl.trim()
      ? [{ url: tenant.logoUrl, alt: titleBase }]
      : undefined;
  return {
    metadataBase,
    title: {
      default: titleBase,
      template: `%s · ${titleBase}`,
    },
    description,
    icons,
    openGraph: {
      type: "website",
      siteName: titleBase,
      title: titleBase,
      description,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titleBase,
      description,
    },
    robots: tenant?.isActive === false ? { index: false, follow: false } : undefined,
  };
}
