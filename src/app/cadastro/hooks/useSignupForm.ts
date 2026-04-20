import { useCallback, useState } from "react";
import {
  INITIAL_SIGNUP_DATA,
  type SignupFormData,
  type SignupFormErrors,
} from "../types";
import { validateSignupForm } from "../signup-utils";

export function useSignupForm() {
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_SIGNUP_DATA);
  const [formErrors, setFormErrors] = useState<SignupFormErrors>({});

  const patch = useCallback(
    (partial: Partial<SignupFormData>) =>
      setFormData((prev) => ({ ...prev, ...partial })),
    [],
  );

  const validate = useCallback((): boolean => {
    const errors = validateSignupForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  return { formData, patch, formErrors, validate };
}
