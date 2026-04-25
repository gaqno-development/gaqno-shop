"use client";

import { useTenant } from "@/contexts/tenant-context";
import {
  HomeCategoriesSection,
  HomeErrorScreen,
  HomeFeatures,
  HomeHero,
  HomeLoadingScreen,
  HomeNewsletter,
  HomeProductSection,
} from "./components";
import { useHomeData } from "./hooks/useHomeData";
import { resolveStorefrontHomeCopy } from "@/lib/storefront-copy";

export default function Home() {
  const { tenant, isLoading: tenantLoading, error } = useTenant();
  const { products, featuredProducts, categories, isLoading } =
    useHomeData(!tenantLoading);
  const storefrontHomeCopy = resolveStorefrontHomeCopy(tenant);

  if (tenantLoading || isLoading) {
    return <HomeLoadingScreen />;
  }

  if (error) {
    return <HomeErrorScreen message={error} />;
  }

  return (
    <div className="min-h-screen">
      <HomeHero copy={storefrontHomeCopy} />
      <HomeFeatures features={storefrontHomeCopy.features} />
      <HomeCategoriesSection categories={categories} />
      <HomeProductSection
        title={storefrontHomeCopy.sections.featuredTitle}
        eyebrow={storefrontHomeCopy.sections.featuredEyebrow}
        products={featuredProducts}
        hideWhenEmpty
      />
      <HomeProductSection
        title={storefrontHomeCopy.sections.catalogTitle}
        eyebrow={storefrontHomeCopy.sections.catalogEyebrow}
        products={products}
        backgroundClassName="bg-[var(--mist)]/30"
      />
      <HomeNewsletter copy={storefrontHomeCopy.newsletter} />
    </div>
  );
}
