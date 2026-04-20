import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSignupForm } from "./useSignupForm";

describe("useSignupForm", () => {
  it("starts with initial data and empty errors", () => {
    const { result } = renderHook(() => useSignupForm());
    expect(result.current.formData.firstName).toBe("");
    expect(result.current.formErrors).toEqual({});
  });

  it("patches fields incrementally", () => {
    const { result } = renderHook(() => useSignupForm());
    act(() => result.current.patch({ firstName: "John" }));
    act(() => result.current.patch({ email: "john@example.com" }));
    expect(result.current.formData.firstName).toBe("John");
    expect(result.current.formData.email).toBe("john@example.com");
  });

  it("validate returns false and populates errors for invalid data", () => {
    const { result } = renderHook(() => useSignupForm());
    let ok: boolean | undefined;
    act(() => {
      ok = result.current.validate();
    });
    expect(ok).toBe(false);
    expect(Object.keys(result.current.formErrors).length).toBeGreaterThan(0);
  });

  it("validate returns true when all fields are valid", () => {
    const { result } = renderHook(() => useSignupForm());
    act(() =>
      result.current.patch({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password1",
        confirmPassword: "password1",
      }),
    );
    let ok: boolean | undefined;
    act(() => {
      ok = result.current.validate();
    });
    expect(ok).toBe(true);
    expect(result.current.formErrors).toEqual({});
  });
});
