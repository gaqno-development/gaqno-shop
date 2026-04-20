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

export default function Home() {
  const { isLoading: tenantLoading, error } = useTenant();
  const { products, featuredProducts, categories, isLoading } =
    useHomeData(!tenantLoading);

  if (tenantLoading || isLoading) {
    return <HomeLoadingScreen />;
  }

  if (error) {
    return <HomeErrorScreen message={error} />;
  }

  return (
    <div className="min-h-screen">
      <HomeHero />
      <HomeFeatures />
      <HomeCategoriesSection categories={categories} />
      <HomeProductSection
        title="Produtos em Destaque"
        products={featuredProducts}
        backgroundClassName="bg-gray-50"
        hideWhenEmpty
      />
      <HomeProductSection title="Todos os Produtos" products={products} />
      <HomeNewsletter />
    </div>
  );
}
