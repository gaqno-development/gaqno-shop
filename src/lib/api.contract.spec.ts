import { beforeEach, describe, expect, it, vi } from "vitest";
import { processPayment, getOrder, getPaymentStatus, resolveAssetUrl } from "./api";

describe("api contract helpers", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );
  });

  it("sends payment processing to POST /payments with orderNumber", async () => {
    await processPayment("ORD-1", { paymentMethod: "pix", cardToken: "token-1" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/payments"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ orderNumber: "ORD-1", paymentMethod: "pix", cardToken: "token-1" }),
      }),
    );
  });

  it("loads payment status from /payments/status/:orderNumber", async () => {
    await getPaymentStatus("ORD-1");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/payments/status/ORD-1"),
      expect.any(Object),
    );
  });

  it("resolves order tracking through /orders/:orderNumber with email query", async () => {
    await getOrder("ORD-ABC", "foo@example.com");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/orders/ORD-ABC?email=foo%40example.com"),
      expect.any(Object),
    );
  });

  it("keeps absolute asset URLs unchanged", () => {
    expect(resolveAssetUrl("https://cdn.example.com/a/b.png")).toBe(
      "https://cdn.example.com/a/b.png",
    );
  });

  it("normalizes relative asset paths", () => {
    expect(resolveAssetUrl("/products/item.png")).toBeTruthy();
    const resolved = resolveAssetUrl("/products/item.png")!;
    expect(resolved.endsWith("/products/item.png")).toBe(true);
    expect(resolved.includes("//products/")).toBe(false);
  });

  it("returns null for empty asset path", () => {
    expect(resolveAssetUrl("")).toBeNull();
    expect(resolveAssetUrl(undefined)).toBeNull();
  });
});
