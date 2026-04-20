import {
  EMAIL_PATTERN,
  MIN_PASSWORD_LENGTH,
  type SignupFormData,
  type SignupFormErrors,
} from "./types";

export function validateSignupForm(data: SignupFormData): SignupFormErrors {
  const errors: SignupFormErrors = {};
  if (!data.firstName.trim()) errors.firstName = "Nome é obrigatório";
  if (!data.lastName.trim()) errors.lastName = "Sobrenome é obrigatório";
  if (!EMAIL_PATTERN.test(data.email)) errors.email = "Email inválido";
  if (data.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "As senhas não conferem";
  }
  return errors;
}
