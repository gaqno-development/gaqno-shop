import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const searchParamsMock = {
  get: vi.fn<(key: string) => string | null>(),
};

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParamsMock,
}));

import { useProductsFilters } from "./useProductsFilters";

describe("useProductsFilters", () => {
  beforeEach(() => {
    searchParamsMock.get.mockReset();
    searchParamsMock.get.mockReturnValue(null);
  });

  it("defaults to empty filters and 'name' sort", () => {
    const { result } = renderHook(() => useProductsFilters());
    expect(result.current.selectedCategory).toBe("");
    expect(result.current.priceRange).toEqual({ min: "", max: "" });
    expect(result.current.sortBy).toBe("name");
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("hydrates from URL search params", () => {
    const values: Record<string, string | null> = {
      category: "cat-1",
      search: "banana",
      sort: "price_asc",
    };
    searchParamsMock.get.mockImplementation((key: string) => values[key] ?? null);

    const { result } = renderHook(() => useProductsFilters());
    expect(result.current.selectedCategory).toBe("cat-1");
    expect(result.current.searchQuery).toBe("banana");
    expect(result.current.sortBy).toBe("price_asc");
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("clearFilters resets category, price range and search but keeps sort", () => {
    const { result } = renderHook(() => useProductsFilters());
    act(() => result.current.setSelectedCategory("cat-2"));
    act(() => result.current.setPriceRange({ min: "10", max: "50" }));
    act(() => result.current.setSearchQuery("x"));
    act(() => result.current.setSortBy("price_desc"));

    act(() => result.current.clearFilters());

    expect(result.current.selectedCategory).toBe("");
    expect(result.current.priceRange).toEqual({ min: "", max: "" });
    expect(result.current.searchQuery).toBe("");
    expect(result.current.sortBy).toBe("price_desc");
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("hasActiveFilters reflects any set filter", () => {
    const { result } = renderHook(() => useProductsFilters());
    act(() => result.current.setPriceRange({ min: "10", max: "" }));
    expect(result.current.hasActiveFilters).toBe(true);
  });
});
