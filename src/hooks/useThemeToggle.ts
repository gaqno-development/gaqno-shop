import { useCallback } from "react";
import { useUIStore } from "@gaqno-development/frontcore/store";

export type Theme = "light" | "dark" | "system";

export interface UseThemeToggleResult {
  theme: Theme;
  setTheme: (next: Theme) => void;
}

export function useThemeToggle(): UseThemeToggleResult {
  const theme = useUIStore((state) => state.theme);
  const storeSetTheme = useUIStore((state) => state.setTheme);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        storeSetTheme(next);
      } catch {
        useUIStore.setState({ theme: next });
      }
    },
    [storeSetTheme],
  );

  return { theme, setTheme };
}
