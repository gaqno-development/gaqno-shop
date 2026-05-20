import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@gaqno-development/frontcore/store", () => {
  const setTheme = vi.fn();
  const getState = vi.fn(() => ({ setTheme }));
  const useUIStore = vi.fn(() => ({ theme: "system", setTheme }));
  (useUIStore as unknown as { getState: typeof getState }).getState = getState;
  return { useUIStore };
});

vi.mock("@gaqno-development/frontcore/components/providers", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { useUIStore } from "@gaqno-development/frontcore/store";

const mockedGetState = vi.mocked(
  (useUIStore as unknown as { getState: () => { setTheme: ReturnType<typeof vi.fn> } }).getState,
);

function useDarkDefaultHook() {
  const { useEffect } = require("react");
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("theme") === null) {
      useUIStore.getState().setTheme("dark");
    }
  }, []);
}

describe("dark default seeding", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedGetState.mockClear();
    mockedGetState().setTheme.mockClear();
  });

  it("calls setTheme('dark') when localStorage has no theme", () => {
    renderHook(() => useDarkDefaultHook());
    expect(mockedGetState().setTheme).toHaveBeenCalledWith("dark");
  });

  it("does not override an existing stored theme", () => {
    localStorage.setItem("theme", "light");
    renderHook(() => useDarkDefaultHook());
    expect(mockedGetState().setTheme).not.toHaveBeenCalled();
  });
});
