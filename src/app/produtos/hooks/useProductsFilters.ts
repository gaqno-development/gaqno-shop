import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { INITIAL_PRICE_RANGE, type PriceRange, type SortValue } from "../constants";
import {
  hasActiveProductFilters,
  resolveSortValue,
} from "../filters-utils";

export function useProductsFilters() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>(INITIAL_PRICE_RANGE);
  const [sortBy, setSortBy] = useState<SortValue>("name");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") ?? "");
    setSearchQuery(searchParams.get("search") ?? "");
    setSortBy(resolveSortValue(searchParams.get("sort")));
  }, [searchParams]);

  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setPriceRange(INITIAL_PRICE_RANGE);
    setSearchQuery("");
  }, []);

  const hasActiveFilters = hasActiveProductFilters({
    selectedCategory,
    priceRange,
    searchQuery,
  });

  return {
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    clearFilters,
    hasActiveFilters,
  };
}
