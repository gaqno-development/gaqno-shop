import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCheckoutForm } from "./useCheckoutForm";

describe("useCheckoutForm", () => {
  it("seeds initial state for customer, shipping and billing", () => {
    const { result } = renderHook(() => useCheckoutForm());
    expect(result.current.customer.email).toBe("");
    expect(result.current.shippingAddress.country).toBe("BR");
    expect(result.current.billingAddress.country).toBe("BR");
    expect(result.current.sameAsShipping).toBe(true);
    expect(result.current.notes).toBe("");
  });

  it("patches customer without overwriting unrelated fields", () => {
    const { result } = renderHook(() => useCheckoutForm());
    act(() => result.current.patchCustomer({ email: "a@b.com" }));
    act(() => result.current.patchCustomer({ firstName: "John" }));
    expect(result.current.customer.email).toBe("a@b.com");
    expect(result.current.customer.firstName).toBe("John");
  });

  it("patches shipping and billing independently", () => {
    const { result } = renderHook(() => useCheckoutForm());
    act(() => result.current.patchShippingAddress({ city: "São Paulo" }));
    act(() => result.current.patchBillingAddress({ city: "Rio" }));
    expect(result.current.shippingAddress.city).toBe("São Paulo");
    expect(result.current.billingAddress.city).toBe("Rio");
  });

  it("toggles sameAsShipping and updates notes", () => {
    const { result } = renderHook(() => useCheckoutForm());
    act(() => result.current.setSameAsShipping(false));
    act(() => result.current.setNotes("Deixar com porteiro"));
    expect(result.current.sameAsShipping).toBe(false);
    expect(result.current.notes).toBe("Deixar com porteiro");
  });
});
