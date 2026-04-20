import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeaderDesktopNav } from "./HeaderDesktopNav";

const BASE_PROPS = {
  ordersHref: "/conta/pedidos",
  loginHref: "/login",
};

describe("HeaderDesktopNav", () => {
  it("always renders public nav items", () => {
    render(
      <HeaderDesktopNav
        {...BASE_PROPS}
        showOrdersLink={false}
        showLoginLink={false}
      />,
    );
    expect(screen.getByRole("link", { name: "Início" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Produtos" })).toBeTruthy();
  });

  it("shows Meus Pedidos when authenticated flag is true", () => {
    render(
      <HeaderDesktopNav
        {...BASE_PROPS}
        showOrdersLink={true}
        showLoginLink={false}
      />,
    );
    const link = screen.getByRole("link", { name: /meus pedidos/i });
    expect(link.getAttribute("href")).toBe("/conta/pedidos");
    expect(screen.queryByRole("link", { name: /entrar/i })).toBeNull();
  });

  it("shows Entrar when unauthenticated flag is true", () => {
    render(
      <HeaderDesktopNav
        {...BASE_PROPS}
        showOrdersLink={false}
        showLoginLink={true}
      />,
    );
    const link = screen.getByRole("link", { name: /entrar/i });
    expect(link.getAttribute("href")).toBe("/login");
    expect(screen.queryByRole("link", { name: /meus pedidos/i })).toBeNull();
  });

  it("hides both during loading (both flags false)", () => {
    render(
      <HeaderDesktopNav
        {...BASE_PROPS}
        showOrdersLink={false}
        showLoginLink={false}
      />,
    );
    expect(screen.queryByRole("link", { name: /meus pedidos/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /entrar/i })).toBeNull();
  });
});
