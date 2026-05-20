import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

vi.mock("@gaqno-development/frontcore/store", () => ({
  useUIStore: vi.fn(),
}));

import { useUIStore } from "@gaqno-development/frontcore/store";
import { useThemeToggle } from "./useThemeToggle";

const mockedUseUIStore = vi.mocked(useUIStore);

describe("useThemeToggle", () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    setTheme.mockReset();
  });

  it("returns theme from the store", () => {
    mockedUseUIStore.mockImplementation((selector) =>
      selector({ theme: "dark", setTheme } as Parameters<typeof selector>[0]),
    );

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.theme).toBe("dark");
  });

  it("returns setTheme from the store", () => {
    mockedUseUIStore.mockImplementation((selector) =>
      selector({ theme: "light", setTheme } as Parameters<typeof selector>[0]),
    );

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.setTheme).toBe(setTheme);
  });

  it("reflects system theme correctly", () => {
    mockedUseUIStore.mockImplementation((selector) =>
      selector({ theme: "system", setTheme } as Parameters<typeof selector>[0]),
    );

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.theme).toBe("system");
  });
});
