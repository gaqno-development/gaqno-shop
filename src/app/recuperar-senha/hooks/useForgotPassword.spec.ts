import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

vi.mock("@/lib/api", () => ({
  fetchApi: vi.fn(),
}));

import { fetchApi } from "@/lib/api";
import { useForgotPassword } from "./useForgotPassword";

const mockedFetchApi = vi.mocked(fetchApi);

describe("useForgotPassword", () => {
  beforeEach(() => {
    mockedFetchApi.mockReset();
  });

  it("starts with idle state and empty email", () => {
    const { result } = renderHook(() => useForgotPassword());

    expect(result.current.email).toBe("");
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBe("");
  });

  it("updates email via setEmail", () => {
    const { result } = renderHook(() => useForgotPassword());

    act(() => result.current.setEmail("user@example.com"));

    expect(result.current.email).toBe("user@example.com");
  });

  it("transitions to success after submit resolves", async () => {
    mockedFetchApi.mockResolvedValueOnce({ ok: true });
    const { result } = renderHook(() => useForgotPassword());

    act(() => result.current.setEmail("user@example.com"));
    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(mockedFetchApi).toHaveBeenCalledWith("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
    });
  });

  it("sets error and returns to idle when submit fails", async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useForgotPassword());

    act(() => result.current.setEmail("user@example.com"));
    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => expect(result.current.status).toBe("idle"));
    expect(result.current.error).toBe("offline");
  });

  it("does not submit when email is empty", async () => {
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.submit();
    });

    expect(mockedFetchApi).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Informe seu email");
  });
});
