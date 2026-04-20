import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import type { ProductSummary } from "@/types/catalog";
import { PRODUCTS_LIMIT, type PriceRange, type SortValue } from "../constants";

interface Input {
  readonly category: string;
  readonly search: string;
  readonly priceRange: PriceRange;
  readonly sortBy: SortValue;
}

function buildParams(input: Input): Record<string, string> {
  const params: Record<string, string> = { limit: PRODUCTS_LIMIT };
  if (input.category) params.category = input.category;
  if (input.search) params.search = input.search;
  if (input.priceRange.min) params.minPrice = input.priceRange.min;
  if (input.priceRange.max) params.maxPrice = input.priceRange.max;
  if (input.sortBy) params.sort = input.sortBy;
  return params;
}

export function useProductsQuery(input: Input) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await getProducts(buildParams(input));
        if (!cancelled) setProducts(data?.items ?? []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [input.category, input.search, input.priceRange, input.sortBy]);

  return { products, isLoading };
}
