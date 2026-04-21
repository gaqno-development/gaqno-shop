"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";

type ForgotStatus = "idle" | "loading" | "success";

interface ForgotPasswordApi {
  readonly email: string;
  readonly status: ForgotStatus;
  readonly error: string;
  readonly setEmail: (value: string) => void;
  readonly submit: () => Promise<void>;
}

const EMPTY_EMAIL_MESSAGE = "Informe seu email";

export function useForgotPassword(): ForgotPasswordApi {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ForgotStatus>("idle");
  const [error, setError] = useState("");

  async function submit(): Promise<void> {
    if (!email.trim()) {
      setError(EMPTY_EMAIL_MESSAGE);
      return;
    }

    setStatus("loading");
    setError("");
    try {
      await fetchApi("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Erro inesperado");
    }
  }

  return { email, status, error, setEmail, submit };
}
