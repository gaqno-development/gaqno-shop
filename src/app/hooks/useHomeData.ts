import { useEffect, useState } from "react";
import {
  getCategories,
  getFeaturedProducts,
  getProducts,
  resolveAssetUrl,
} from "@/lib/api";
import type { Category, ProductSummary } from "@/types/catalog";

const HOME_FEATURED_LIMIT = 4;
const HOME_CATALOG_LIMIT = 8;
const HOME_CATEGORY_LIMIT = 4;

interface ProductCategoryPayload {
  readonly id?: string;
  readonly slug?: string;
  readonly imageUrl?: string | null;
}

interface ProductWithCategory extends ProductSummary {
  readonly category?: ProductCategoryPayload | null;
}

function pickCategoryImageFromProducts(
  products: readonly ProductWithCategory[],
): Map<string, string> {
  const imageByCategorySlug = new Map<string, string>();
  for (const product of products) {
    const categorySlug = product.category?.slug?.trim();
    if (!categorySlug || imageByCategorySlug.has(categorySlug)) {
      continue;
    }
    const categoryImage = resolveAssetUrl(product.category?.imageUrl ?? null);
    const productImage = resolveAssetUrl(product.images?.[0] ?? null);
    const chosenImage = categoryImage ?? productImage;
    if (chosenImage) {
      imageByCategorySlug.set(categorySlug, chosenImage);
    }
  }
  return imageByCategorySlug;
}

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
        const products = (productsData?.items ?? []) as ProductWithCategory[];
        const featuredProducts = (featuredData ?? []) as ProductWithCategory[];
        const categoryImageBySlug = pickCategoryImageFromProducts([
          ...featuredProducts,
          ...products,
        ]);
        setProducts(products);
        setFeaturedProducts(featuredProducts);
        const categories = (categoriesData ?? []) as Category[];
        setCategories(
          categories
            .slice(0, HOME_CATEGORY_LIMIT)
            .map((category) => ({
              ...category,
              imageUrl:
                resolveAssetUrl(category.imageUrl ?? null) ??
                categoryImageBySlug.get(category.slug) ??
                null,
            })),
        );
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
