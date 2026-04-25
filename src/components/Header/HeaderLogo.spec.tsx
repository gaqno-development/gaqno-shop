import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeaderLogo } from "./HeaderLogo";

describe("HeaderLogo", () => {
  it("renders pulse skeleton when brand is loading without name or logo", () => {
    render(
      <HeaderLogo isBrandLoading name={null} logoUrl={null} compact={false} />,
    );
    expect(screen.getByRole("link", { name: /carregando identidade da loja/i })).toBeTruthy();
    expect(screen.getByRole("link").querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renders tenant name when not loading", () => {
    render(<HeaderLogo name="Fifia Doces" logoUrl={null} isBrandLoading={false} />);
    expect(screen.getByText("Fifia Doces")).toBeTruthy();
  });
});
