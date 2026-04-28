import { describe, it, expect } from "vitest";
import type { BakeryDecoration } from "@/types/bakery";
import { filterBakeryDecorationsForProduct } from "./filter-bakery-decorations-for-product";

function decoration(
  id: string,
  customizationTypeId: string | null,
): BakeryDecoration {
  return {
    id,
    name: id,
    type: "flower",
    customizationTypeId,
    description: null,
    priceAdjustment: "0",
    imageUrl: null,
    isActive: true,
  };
}

describe("filterBakeryDecorationsForProduct", () => {
  const all = [
    decoration("d1", "ct1"),
    decoration("d2", "ct2"),
    decoration("orphan", null),
  ];

  it("returns all decorations when enabled ids are absent (legacy)", () => {
    expect(filterBakeryDecorationsForProduct(all, undefined)).toEqual(all);
    expect(filterBakeryDecorationsForProduct(all, null)).toEqual(all);
  });

  it("returns none when enabled list is empty", () => {
    expect(filterBakeryDecorationsForProduct(all, [])).toEqual([]);
  });

  it("returns only decorations whose type id is listed", () => {
    expect(filterBakeryDecorationsForProduct(all, ["ct1"])).toEqual([
      decoration("d1", "ct1"),
    ]);
  });
});
