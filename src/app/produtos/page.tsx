"use client";

import { Suspense } from "react";
import { INITIAL_PRICE_RANGE } from "./constants";
import {
  ActiveFilterChips,
  ProductsFiltersSidebar,
  ProductsGrid,
  ProductsHeader,
  ProductsToolbar,
} from "./components";
import { useProductsPage } from "./hooks/useProductsPage";

function ProductsContent() {
  const page = useProductsPage();
  const { filters, categories, products, isLoading, showFilters, setShowFilters } =
    page;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductsHeader
        searchQuery={filters.searchQuery}
        isLoading={isLoading}
        productsCount={products.length}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <ProductsFiltersSidebar
          visible={showFilters}
          categories={categories}
          selectedCategory={filters.selectedCategory}
          onSelectCategory={filters.setSelectedCategory}
          priceRange={filters.priceRange}
          onPriceRangeChange={filters.setPriceRange}
          hasActiveFilters={filters.hasActiveFilters}
          onClear={filters.clearFilters}
        />

        <div className="flex-1">
          <ProductsToolbar
            sortBy={filters.sortBy}
            onSortChange={filters.setSortBy}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
          <ActiveFilterChips
            selectedCategory={filters.selectedCategory}
            categories={categories}
            priceRange={filters.priceRange}
            searchQuery={filters.searchQuery}
            onClearCategory={() => filters.setSelectedCategory("")}
            onClearPriceRange={() => filters.setPriceRange(INITIAL_PRICE_RANGE)}
            onClearSearch={() => filters.setSearchQuery("")}
            hasActiveFilters={filters.hasActiveFilters}
          />
          <ProductsGrid products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
