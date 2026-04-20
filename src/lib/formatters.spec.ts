import { describe, expect, it } from "vitest";
import { formatBRL, formatFreightOrFree } from "./formatters";

describe("formatBRL", () => {
  it("formats with two decimals and BR comma", () => {
    expect(formatBRL(10)).toBe("R$ 10,00");
    expect(formatBRL(1234.5)).toBe("R$ 1234,50");
  });

  it("handles zero", () => {
    expect(formatBRL(0)).toBe("R$ 0,00");
  });
});

describe("formatFreightOrFree", () => {
  it("returns 'Grátis' when value is zero", () => {
    expect(formatFreightOrFree(0)).toBe("Grátis");
  });

  it("formats non-zero values", () => {
    expect(formatFreightOrFree(19.9)).toBe("R$ 19,90");
  });
});
