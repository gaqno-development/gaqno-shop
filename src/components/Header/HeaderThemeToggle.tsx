"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@gaqno-development/frontcore/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@gaqno-development/frontcore/components/ui/dropdown-menu";
import { useThemeToggle, type Theme } from "@/hooks/useThemeToggle";

const THEME_ICON: Record<Theme, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
};

const THEME_LABEL: Record<Theme, string> = {
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
};

export function HeaderThemeToggle() {
  const { theme, setTheme } = useThemeToggle();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Tema atual: ${THEME_LABEL[theme]}. Clique para alterar.`}
        >
          {THEME_ICON[theme]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(v) => setTheme(v as Theme)}
        >
          <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">Sistema</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
