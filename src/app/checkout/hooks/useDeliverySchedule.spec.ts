import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDeliverySchedule } from "./useDeliverySchedule";
import type { CartItem } from "@/contexts/cart-context";

function buildItem(leadDays: number | undefined): CartItem {
  return {
    productId: "p",
    name: "Bolo",
    quantity: 1,
    price: 10,
    total: 10,
    ...(leadDays !== undefined ? { leadDays } : {}),
  } as CartItem & { leadDays?: number };
}

describe("useDeliverySchedule", () => {
  it("derives minimum lead days from cart items", () => {
    const items = [buildItem(2), buildItem(5), buildItem(undefined)];
    const { result } = renderHook(() => useDeliverySchedule(items));
    expect(result.current.minLeadDays).toBe(5);
  });

  it("returns error when date is before minimum", () => {
    const items = [buildItem(3)];
    const { result } = renderHook(() => useDeliverySchedule(items));

    act(() => {
      result.current.setDeliveryDate("2020-01-01");
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.isValid).toBe(false);
  });

  it("is valid once date >= min", () => {
    const items = [buildItem(1)];
    const { result } = renderHook(() => useDeliverySchedule(items));
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const iso = futureDate.toISOString().slice(0, 10);

    act(() => {
      result.current.setDeliveryDate(iso);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isValid).toBe(true);
  });
});
