import { useState } from "react";
import { useProductsFilters } from "./useProductsFilters";
import { useCategories } from "./useCategories";
import { useProductsQuery } from "./useProductsQuery";

export function useProductsPage() {
  const filters = useProductsFilters();
  const categories = useCategories();
  const { products, isLoading } = useProductsQuery({
    category: filters.selectedCategory,
    search: filters.searchQuery,
    priceRange: filters.priceRange,
    sortBy: filters.sortBy,
  });
  const [showFilters, setShowFilters] = useState(false);

  return {
    filters,
    categories,
    products,
    isLoading,
    showFilters,
    setShowFilters,
  };
}
