import { describe, expect, it } from "vitest";
import { INITIAL_PRICE_RANGE } from "./constants";
import {
  hasActiveProductFilters,
  resolveSortValue,
} from "./filters-utils";

describe("hasActiveProductFilters", () => {
  it("returns false when every filter is empty", () => {
    expect(
      hasActiveProductFilters({
        selectedCategory: "",
        priceRange: INITIAL_PRICE_RANGE,
        searchQuery: "",
      }),
    ).toBe(false);
  });

  it("returns true when category is set", () => {
    expect(
      hasActiveProductFilters({
        selectedCategory: "cat-1",
        priceRange: INITIAL_PRICE_RANGE,
        searchQuery: "",
      }),
    ).toBe(true);
  });

  it("returns true when any price range side is set", () => {
    expect(
      hasActiveProductFilters({
        selectedCategory: "",
        priceRange: { min: "10", max: "" },
        searchQuery: "",
      }),
    ).toBe(true);
    expect(
      hasActiveProductFilters({
        selectedCategory: "",
        priceRange: { min: "", max: "50" },
        searchQuery: "",
      }),
    ).toBe(true);
  });

  it("returns true when a search query is set", () => {
    expect(
      hasActiveProductFilters({
        selectedCategory: "",
        priceRange: INITIAL_PRICE_RANGE,
        searchQuery: "banana",
      }),
    ).toBe(true);
  });
});

describe("resolveSortValue", () => {
  it("falls back to 'name' for null or invalid values", () => {
    expect(resolveSortValue(null)).toBe("name");
    expect(resolveSortValue("bogus")).toBe("name");
  });

  it("preserves any known sort value", () => {
    expect(resolveSortValue("price_asc")).toBe("price_asc");
    expect(resolveSortValue("price_desc")).toBe("price_desc");
    expect(resolveSortValue("newest")).toBe("newest");
    expect(resolveSortValue("name")).toBe("name");
  });
});
