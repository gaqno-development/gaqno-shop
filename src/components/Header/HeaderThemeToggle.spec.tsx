import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useThemeToggle", () => ({
  useThemeToggle: vi.fn(),
}));

import { useThemeToggle } from "@/hooks/useThemeToggle";
import { HeaderThemeToggle } from "./HeaderThemeToggle";

const mockedUseThemeToggle = vi.mocked(useThemeToggle);

describe("HeaderThemeToggle", () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    setTheme.mockReset();
  });

  it("renders a trigger button", () => {
    mockedUseThemeToggle.mockReturnValue({ theme: "dark", setTheme });

    render(<HeaderThemeToggle />);

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("calls setTheme with light when Claro is clicked", async () => {
    mockedUseThemeToggle.mockReturnValue({ theme: "dark", setTheme });

    render(<HeaderThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /claro/i }));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with dark when Escuro is clicked", async () => {
    mockedUseThemeToggle.mockReturnValue({ theme: "light", setTheme });

    render(<HeaderThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /escuro/i }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with system when Sistema is clicked", async () => {
    mockedUseThemeToggle.mockReturnValue({ theme: "dark", setTheme });

    render(<HeaderThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /sistema/i }));

    expect(setTheme).toHaveBeenCalledWith("system");
  });

  it("trigger aria-label reflects the current theme", () => {
    mockedUseThemeToggle.mockReturnValue({ theme: "dark", setTheme });

    render(<HeaderThemeToggle />);

    expect(screen.getByRole("button").getAttribute("aria-label")).toMatch(/escuro/i);
  });

  it("active theme item has aria-checked true", async () => {
    mockedUseThemeToggle.mockReturnValue({ theme: "dark", setTheme });

    render(<HeaderThemeToggle />);
    await userEvent.click(screen.getByRole("button"));

    const escuroItem = screen.getByRole("menuitemradio", { name: /escuro/i });
    expect(escuroItem.getAttribute("aria-checked")).toBe("true");
  });
});
