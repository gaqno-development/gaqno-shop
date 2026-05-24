"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gaqno-development/frontcore/components/ui/dropdown-menu";
import { useThemeToggle } from "@/hooks/useThemeToggle";

const THEME_ICON: Record<"light" | "dark" | "system", React.ReactNode> = {
  light: <Sun className="size-4" />,
  dark: <Moon className="size-4" />,
  system: <Monitor className="size-4" />,
};

const THEME_OPTIONS: Array<{
  value: "light" | "dark" | "system";
  label: string;
}> = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];

export function HeaderThemeToggle() {
  const { theme, setTheme } = useThemeToggle();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Alternar tema"
        className="flex items-center justify-center rounded-md p-2 text-[var(--ink)] hover:bg-[var(--glass-border)] transition-colors"
      >
        {THEME_ICON[theme]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map(({ value, label }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
