import { describe, it, expect } from "vitest";
import type { BakeryDecoration } from "@/types/bakery";
import { filterBakeryDecorationsForProduct } from "./filter-bakery-decorations-for-product";

function decoration(id: string): BakeryDecoration {
  return {
    id,
    name: id,
    type: "flower",
    customizationTypeId: null,
    description: null,
    priceAdjustment: "0",
    imageUrl: null,
    isActive: true,
  };
}

describe("filterBakeryDecorationsForProduct", () => {
  const all = [decoration("d1"), decoration("d2"), decoration("d3")];

  it("returns all decorations when enabled ids are absent (legacy)", () => {
    expect(filterBakeryDecorationsForProduct(all, undefined)).toEqual(all);
    expect(filterBakeryDecorationsForProduct(all, null)).toEqual(all);
  });

  it("returns none when enabled list is empty", () => {
    expect(filterBakeryDecorationsForProduct(all, [])).toEqual([]);
  });

  it("returns only decorations whose id is listed", () => {
    expect(filterBakeryDecorationsForProduct(all, ["d1"])).toEqual([
      decoration("d1"),
    ]);
  });

  it("returns multiple decorations when multiple ids listed", () => {
    expect(filterBakeryDecorationsForProduct(all, ["d1", "d3"])).toEqual([
      decoration("d1"),
      decoration("d3"),
    ]);
  });
});
