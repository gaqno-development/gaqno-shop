import { describe, expect, it } from "vitest";
import {
  canIncrementQuantity,
  clampQuantityDecrement,
  clampQuantityIncrement,
} from "./quantity-utils";

describe("clampQuantityIncrement", () => {
  it("increments without bound when max is undefined", () => {
    expect(clampQuantityIncrement(1)).toBe(2);
    expect(clampQuantityIncrement(99)).toBe(100);
  });

  it("clamps at max when provided", () => {
    expect(clampQuantityIncrement(5, 5)).toBe(5);
    expect(clampQuantityIncrement(4, 5)).toBe(5);
  });
});

describe("clampQuantityDecrement", () => {
  it("decrements toward 1 as lower bound", () => {
    expect(clampQuantityDecrement(3)).toBe(2);
    expect(clampQuantityDecrement(1)).toBe(1);
    expect(clampQuantityDecrement(0)).toBe(1);
  });
});

describe("canIncrementQuantity", () => {
  it("is true when max is undefined", () => {
    expect(canIncrementQuantity(1000)).toBe(true);
  });

  it("is true when below max and false when at max", () => {
    expect(canIncrementQuantity(2, 5)).toBe(true);
    expect(canIncrementQuantity(5, 5)).toBe(false);
    expect(canIncrementQuantity(6, 5)).toBe(false);
  });
});
