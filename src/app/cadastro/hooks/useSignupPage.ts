import { useCallback } from "react";
import { useSignupForm } from "./useSignupForm";
import { useSignupSubmit } from "./useSignupSubmit";

export function useSignupPage() {
  const form = useSignupForm();
  const { isLoading, error, success, submit } = useSignupSubmit();

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!form.validate()) return;
      await submit(form.formData);
    },
    [form, submit],
  );

  return {
    form,
    isLoading,
    error,
    success,
    handleSubmit,
  };
}
