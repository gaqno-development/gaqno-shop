import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("resolveAssetUrl", () => {
  it("returns null when path is empty", async () => {
    const { resolveAssetUrl } = await import("./api");
    expect(resolveAssetUrl(null)).toBeNull();
    expect(resolveAssetUrl(undefined)).toBeNull();
    expect(resolveAssetUrl("")).toBeNull();
  });

  it("keeps absolute URLs untouched", async () => {
    const { resolveAssetUrl } = await import("./api");
    expect(resolveAssetUrl("https://cdn.gaqno.com.br/a.jpg")).toBe(
      "https://cdn.gaqno.com.br/a.jpg",
    );
    expect(resolveAssetUrl("http://localhost:4017/uploads/a.jpg")).toBe(
      "http://localhost:4017/uploads/a.jpg",
    );
  });

  it("uses NEXT_PUBLIC_R2_PUBLIC_URL for relative paths", async () => {
    vi.stubEnv("NEXT_PUBLIC_R2_PUBLIC_URL", "https://cdn.gaqno.com.br/base/");
    const { resolveAssetUrl } = await import("./api");
    expect(resolveAssetUrl("fifia-doces/product/a.jpg")).toBe(
      "https://cdn.gaqno.com.br/base/fifia-doces/product/a.jpg",
    );
    expect(resolveAssetUrl("/fifia-doces/product/b.jpg")).toBe(
      "https://cdn.gaqno.com.br/base/fifia-doces/product/b.jpg",
    );
  });

  it("falls back to root relative URL when R2 base is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_R2_PUBLIC_URL", "");
    const { resolveAssetUrl } = await import("./api");
    expect(resolveAssetUrl("fifia-doces/product/a.jpg")).toBe(
      "/fifia-doces/product/a.jpg",
    );
  });
});
