// Validation utilities for Student Authentication

export interface PasswordCriteria {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export const checkPasswordStrength = (password: string): PasswordCriteria => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const isValid = minLength && hasUpper && hasLower && hasNumber && hasSpecial;

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid,
  };
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};
