"use client";

import { useForm } from "react-hook-form";

// ── Validation rules ──────────────────────────────────────────────────────────
// Kept alongside the hook so the UI stays declarative.

export const LOGIN_RULES = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
  },
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  function onSubmit(data) {
    // API integration goes here in a future phase.
    console.log("Login submit:", data);
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}
