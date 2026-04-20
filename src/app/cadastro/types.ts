export interface SignupFormData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly phone: string;
}

export interface SignupFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const INITIAL_SIGNUP_DATA: SignupFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
};

export const MIN_PASSWORD_LENGTH = 8;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
