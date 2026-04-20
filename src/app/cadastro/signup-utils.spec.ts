import { describe, expect, it } from "vitest";
import { INITIAL_SIGNUP_DATA, type SignupFormData } from "./types";
import { validateSignupForm } from "./signup-utils";

function makeData(overrides: Partial<SignupFormData> = {}): SignupFormData {
  return {
    ...INITIAL_SIGNUP_DATA,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password1",
    confirmPassword: "password1",
    phone: "",
    ...overrides,
  };
}

describe("validateSignupForm", () => {
  it("returns no errors for a fully valid form", () => {
    expect(validateSignupForm(makeData())).toEqual({});
  });

  it("flags missing first and last names", () => {
    const errors = validateSignupForm(
      makeData({ firstName: "   ", lastName: "" }),
    );
    expect(errors.firstName).toBeDefined();
    expect(errors.lastName).toBeDefined();
  });

  it("flags invalid email", () => {
    const errors = validateSignupForm(makeData({ email: "not-an-email" }));
    expect(errors.email).toBe("Email inválido");
  });

  it("flags short passwords", () => {
    const errors = validateSignupForm(
      makeData({ password: "short", confirmPassword: "short" }),
    );
    expect(errors.password).toMatch(/mínimo 8/);
  });

  it("flags password mismatch", () => {
    const errors = validateSignupForm(
      makeData({ password: "password1", confirmPassword: "password2" }),
    );
    expect(errors.confirmPassword).toBe("As senhas não conferem");
  });
});
