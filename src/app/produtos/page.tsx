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
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20">
      <ProductsHeader
        searchQuery={filters.searchQuery}
        isLoading={isLoading}
        productsCount={products.length}
      />

      <div className="flex flex-col lg:flex-row gap-14">
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
        <div className="mx-auto max-w-7xl px-6 py-24 text-center font-mono text-[0.72rem] uppercase tracking-[0.26em] text-[var(--muted)]">
          Carregando seleção<span className="ml-1 inline-flex">…</span>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
