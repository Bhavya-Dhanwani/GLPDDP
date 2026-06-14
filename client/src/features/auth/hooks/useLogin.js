"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setError, clearError } from "@/features/auth/state";
import { login } from "@/features/auth/api";

// Validation rules kept here so the UI stays declarative
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

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  async function onSubmit(data) {
    dispatch(clearError());
    try {
      const result = await login(data);
      dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
      router.push("/dashboard");
    } catch (err) {
      // Server errors that aren't tied to a specific field
      dispatch(setError(err.message));
      // Also mark the password field invalid so the user knows to retry
      setFieldError("password", { message: err.message });
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}
