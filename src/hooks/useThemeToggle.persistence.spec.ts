import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@gaqno-development/frontcore/store", () => {
  const setTheme = vi.fn();
  const useUIStore = vi.fn((selector: (s: { theme: string; setTheme: typeof setTheme }) => unknown) =>
    selector({ theme: "dark", setTheme }),
  );
  return { useUIStore };
});

import { useThemeToggle } from "./useThemeToggle";

describe("useThemeToggle localStorage resilience", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not throw when localStorage.setItem raises QuotaExceededError", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    const { result } = renderHook(() => useThemeToggle());

    expect(() => act(() => result.current.setTheme("light"))).not.toThrow();
  });

  it("proxies the theme value to the caller regardless of storage errors", () => {
    const { result } = renderHook(() => useThemeToggle());
    expect(result.current.theme).toBe("dark");
  });
});
