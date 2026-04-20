import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

import { useSession } from "next-auth/react";
import { useAuthNav } from "./useAuthNav";

const mockedUseSession = vi.mocked(useSession);

describe("useAuthNav", () => {
  beforeEach(() => {
    mockedUseSession.mockReset();
  });

  it("exposes my-orders link when authenticated", () => {
    mockedUseSession.mockReturnValue({
      data: { user: { email: "a@b.com" } },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    const { result } = renderHook(() => useAuthNav());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.showOrdersLink).toBe(true);
    expect(result.current.ordersHref).toBe("/conta/pedidos");
    expect(result.current.showLoginLink).toBe(false);
  });

  it("exposes login link and hides orders when unauthenticated", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as unknown as ReturnType<typeof useSession>);

    const { result } = renderHook(() => useAuthNav());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.showOrdersLink).toBe(false);
    expect(result.current.showLoginLink).toBe(true);
    expect(result.current.loginHref).toBe("/login");
  });

  it("suppresses both links while session is loading", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "loading",
    } as unknown as ReturnType<typeof useSession>);

    const { result } = renderHook(() => useAuthNav());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.showOrdersLink).toBe(false);
    expect(result.current.showLoginLink).toBe(false);
  });

  it("is resilient when useSession returns null (no provider)", () => {
    mockedUseSession.mockReturnValue(
      null as unknown as ReturnType<typeof useSession>,
    );

    const { result } = renderHook(() => useAuthNav());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.showOrdersLink).toBe(false);
    expect(result.current.showLoginLink).toBe(false);
  });
});
