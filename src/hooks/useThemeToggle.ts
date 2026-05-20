import { useUIStore } from "@gaqno-development/frontcore/store";

export function useThemeToggle() {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  return { theme, setTheme };
}
