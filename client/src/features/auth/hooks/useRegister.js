"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setError, clearError } from "@/features/auth/state";
import { register as registerUser } from "@/features/auth/api";
import {
  hasMinLength,
  hasNumberOrSymbol,
  hasUpperAndLowerCase,
} from "@/features/auth/utils/passwordValidation";

// ── Validation rules ─────────────────────────────────────────────────────────
// The password validate functions reference the shared utility so the
// hint indicators and the RHF submission gate always use the same logic.

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
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  async function onSubmit(data) {
    dispatch(clearError());
    try {
      const result = await registerUser(data);
      dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
      router.push("/dashboard");
    } catch (err) {
      dispatch(setError(err.message));
      setFieldError("email", { message: err.message });
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    errors,
    isSubmitting,
  };
}
