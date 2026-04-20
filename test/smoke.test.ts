import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("should run vitest with tsx", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have jsdom environment", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });
});
