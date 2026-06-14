"use client";

/**
 * RegisterPageClient — client entry point for /register.
 *
 * Assembles the page from shared components:
 *   AuthNavbar → AuthLayout → AuthCard → [form content]
 *
 * Google button is kept inline per architecture spec.
 */

import dynamic from "next/dynamic";
import styles from "./Register.module.css";

import { useRegister, REGISTER_RULES } from "./useRegister";
import {
  hasMinLength,
  hasNumberOrSymbol,
  hasUpperAndLowerCase,
} from "@/shared/validation/passwordValidation";

import AuthNavbar from "@/shared/components/AuthNavbar/AuthNavbar";
import AuthLayout from "@/shared/components/AuthLayout/AuthLayout";
import AuthCard from "@/shared/components/AuthCard/AuthCard";
import AuthHeading from "@/shared/components/AuthHeading/AuthHeading";
import InputField from "@/shared/components/InputField/InputField";
import PasswordField from "@/shared/components/PasswordField/PasswordField";
import PasswordRequirements from "@/shared/components/PasswordRequirements/PasswordRequirements";
import AuthButton from "@/shared/components/AuthButton/AuthButton";
import Separator from "@/shared/components/Separator/Separator";
import AuthSwitcher from "@/shared/components/AuthSwitcher/AuthSwitcher";

// Icons
const PersonIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="15" height="15">
    <circle cx="10" cy="7" r="3.5" stroke="#b0b8c1" strokeWidth="1.5" />
    <path
      d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
      stroke="#b0b8c1"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const EmailIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="15" height="15">
    <rect x="2" y="5" width="16" height="11" rx="2" stroke="#b0b8c1" strokeWidth="1.5" />
    <path d="M2 7l8 5 8-5" stroke="#b0b8c1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LockIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="15" height="15">
    <rect x="4" y="9" width="12" height="8" rx="2" stroke="#b0b8c1" strokeWidth="1.5" />
    <path d="M7 9V7a3 3 0 016 0v2" stroke="#b0b8c1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Google "G" SVG logo
function GoogleG() {
  return (
    <svg
      className={styles.googleIcon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// RegisterHero — lazy chunk (has Next Image + player asset)
const RegisterHero = dynamic(
  () => import("@/features/auth/ui/jsx/RegisterHero"),
  {
    ssr: false,
    loading: () => <div className={styles.heroSkeleton} aria-hidden="true" />,
  }
);

function PrivacyNote() {
  return (
    <p className={styles.privacy}>
      <svg className={styles.privacyIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1.5L2 4v4.5c0 3.5 2.5 6.8 6 7.5 3.5-.7 6-4 6-7.5V4L8 1.5z"
          stroke="#b0b8c1"
          strokeWidth="1.2"
        />
      </svg>
      We respect your privacy. Your data is safe with us.
    </p>
  );
}

export default function RegisterPageClient() {
  const { register, handleSubmit, watch, errors, isSubmitting } = useRegister();

  // watch() re-renders only this component when "password" changes.
  // Default to "" so requirements are neutral before the user focuses the field.
  const passwordValue = watch("password") ?? "";

  return (
    <div className={styles.page}>
      <AuthNavbar />

      <AuthLayout
        leftContent={<RegisterHero />}
        rightContent={
          <AuthCard>
            <form onSubmit={handleSubmit} noValidate>
              <AuthHeading
                title="Create your account"
                subtitle="Fill in the details below to get started"
              />

              <InputField
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                icon={PersonIcon}
                autoComplete="name"
                error={errors.fullName?.message}
                register={register("fullName", REGISTER_RULES.fullName)}
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                icon={EmailIcon}
                autoComplete="email"
                error={errors.email?.message}
                register={register("email", REGISTER_RULES.email)}
              />

              <PasswordField
                label="Password"
                name="password"
                placeholder="Create a password"
                icon={LockIcon}
                autoComplete="new-password"
                error={errors.password?.message}
                register={register("password", REGISTER_RULES.password)}
              />

              {/* Live password strength indicators — boolean props computed here */}
              <PasswordRequirements
                hasMinLength={hasMinLength(passwordValue)}
                hasNumberOrSymbol={hasNumberOrSymbol(passwordValue)}
                hasUpperAndLowerCase={hasUpperAndLowerCase(passwordValue)}
              />

              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Creating account…" : "Create Account"}
              </AuthButton>
            </form>

            <Separator />

            <button type="button" className={styles.googleBtn}>
              <GoogleG />
              Sign up with Google
            </button>

            <AuthSwitcher
              questionText="Already have an account?"
              actionText="Sign in"
              href="/login"
            />

            <PrivacyNote />
          </AuthCard>
        }
      />
    </div>
  );
}
