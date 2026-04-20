import { useCallback, useState } from "react";
import type { SignupFormData } from "../types";

const DEFAULT_TENANT_SLUG = "default";

async function postSignup(data: SignupFormData): Promise<Response> {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Slug":
        process.env.NEXT_PUBLIC_TENANT_SLUG ?? DEFAULT_TENANT_SLUG,
    },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
    }),
  });
}

export function useSignupSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await postSignup(data);
      const body = await response.json();
      if (!response.ok) {
        setError(body?.message ?? "Erro ao criar conta. Tente novamente.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, success, submit };
}
