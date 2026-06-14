"use client";

import { useForm } from "react-hook-form";
import {
  hasMinLength,
  hasNumberOrSymbol,
  hasUpperAndLowerCase,
} from "@/shared/validation/passwordValidation";

// ── Validation rules ──────────────────────────────────────────────────────────
// The password validate functions reference the shared utility so the
// PasswordRequirements indicators and the RHF submission gate always use
// the same logic.

export const REGISTER_RULES = {
  fullName: {
    required: "Full name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    maxLength: { value: 60, message: "Name must be 60 characters or fewer" },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message: "Name can only contain letters, spaces, hyphens and apostrophes",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
  },
  password: {
    required: "Password is required",
    validate: {
      minLength: (v) =>
        hasMinLength(v) || "Password must be at least 8 characters",
      numberOrSymbol: (v) =>
        hasNumberOrSymbol(v) || "Must include a number or symbol",
      upperAndLower: (v) =>
        hasUpperAndLowerCase(v) || "Must include uppercase and lowercase letters",
    },
  },
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useRegister() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  function onSubmit(data) {
    // API integration goes here in a future phase.
    console.log("Register submit:", data);
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    errors,
    isSubmitting,
  };
}
