import { describe, expect, it } from "vitest";
import type { ProductSummary } from "@/types/catalog";
import { derivePricing } from "./pricing";

function makeProduct(overrides: Partial<ProductSummary> = {}): ProductSummary {
  return {
    id: "p-1",
    name: "Test",
    slug: "test",
    description: null,
    shortDescription: null,
    price: "100.00",
    compareAtPrice: null,
    images: [],
    ...overrides,
  };
}

describe("derivePricing", () => {
  it("returns no discount when compareAtPrice is null", () => {
    const result = derivePricing(makeProduct());
    expect(result).toEqual({
      price: 100,
      compareAtPrice: null,
      hasDiscount: false,
      discountPercentage: 0,
    });
  });

  it("calculates discount percentage when compareAtPrice is higher than price", () => {
    const result = derivePricing(
      makeProduct({ price: "80.00", compareAtPrice: "100.00" }),
    );
    expect(result.hasDiscount).toBe(true);
    expect(result.discountPercentage).toBe(20);
    expect(result.compareAtPrice).toBe(100);
  });

  it("does not mark discount when compareAtPrice equals price", () => {
    const result = derivePricing(
      makeProduct({ price: "50.00", compareAtPrice: "50.00" }),
    );
    expect(result.hasDiscount).toBe(false);
    expect(result.discountPercentage).toBe(0);
  });

  it("does not mark discount when compareAtPrice is lower than price", () => {
    const result = derivePricing(
      makeProduct({ price: "100.00", compareAtPrice: "80.00" }),
    );
    expect(result.hasDiscount).toBe(false);
  });

  it("rounds discount percentage", () => {
    const result = derivePricing(
      makeProduct({ price: "67.00", compareAtPrice: "99.00" }),
    );
    expect(result.discountPercentage).toBe(32);
  });
});
