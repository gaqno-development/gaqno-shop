import type { PriceRange, SortValue } from "./constants";

export interface ProductFiltersState {
  readonly selectedCategory: string;
  readonly priceRange: PriceRange;
  readonly searchQuery: string;
}

export function hasActiveProductFilters(state: ProductFiltersState): boolean {
  return Boolean(
    state.selectedCategory ||
      state.priceRange.min ||
      state.priceRange.max ||
      state.searchQuery,
  );
}

export function resolveSortValue(value: string | null): SortValue {
  const allowed: readonly SortValue[] = [
    "name",
    "price_asc",
    "price_desc",
    "newest",
  ];
  return allowed.includes(value as SortValue) ? (value as SortValue) : "name";
}
