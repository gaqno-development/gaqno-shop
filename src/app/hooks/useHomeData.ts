import { useEffect, useState } from "react";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/api";
import type { Category, ProductSummary } from "@/types/catalog";

const HOME_FEATURED_LIMIT = 4;
const HOME_CATALOG_LIMIT = 8;
const HOME_CATEGORY_LIMIT = 4;

export function useHomeData(shouldLoad: boolean) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;

    async function loadData() {
      try {
        const [productsData, featuredData, categoriesData] = await Promise.all([
          getProducts({ limit: String(HOME_CATALOG_LIMIT) }),
          getFeaturedProducts(HOME_FEATURED_LIMIT),
          getCategories(),
        ]);
        if (cancelled) return;
        setProducts(productsData?.items ?? []);
        setFeaturedProducts(featuredData ?? []);
        setCategories((categoriesData ?? []).slice(0, HOME_CATEGORY_LIMIT));
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [shouldLoad]);

  return { products, featuredProducts, categories, isLoading };
}
