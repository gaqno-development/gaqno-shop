import { useCallback, useEffect, useState } from "react";
import { getProduct, getProducts } from "@/lib/api";
import type { Product, ProductSummary } from "@/types/catalog";

export function useProductLoader(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRelated = useCallback(async (current: Product) => {
    if (!current.category) return;
    try {
      const related = await getProducts({
        category: current.category.slug,
        limit: "4",
      });
      const items: ProductSummary[] = related?.items ?? [];
      setRelatedProducts(items.filter((item) => item.id !== current.id));
    } catch (error) {
      console.error("Failed to load related products:", error);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function load() {
      try {
        const data = (await getProduct(slug)) as Product;
        if (cancelled) return;
        setProduct(data);
        await loadRelated(data);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, loadRelated]);

  return { product, relatedProducts, isLoading };
}
