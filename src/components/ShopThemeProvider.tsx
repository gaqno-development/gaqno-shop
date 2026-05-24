"use client";

import { useEffect } from "react";
import { useUIStore } from "@gaqno-development/frontcore/store";

const THEME_STORAGE_KEY = "theme";

type ThemeMode = "light" | "dark" | "system";

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyShopTheme = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;

  const effectiveTheme = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
};

export function ShopThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    applyShopTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyShopTheme("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return <>{children}</>;
}
