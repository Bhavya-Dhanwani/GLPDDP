"use client";



import { useRegister, REGISTER_RULES } from "@/features/auth/hooks";
import {
  hasMinLength,
  hasNumberOrSymbol,
  hasUpperAndLowerCase,
} from "@/features/auth/utils/passwordValidation";
import styles from "../css/RegisterForm.module.css";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import FormDivider from "./FormDivider";
import GoogleButton from "./GoogleButton";
import AuthSwitcher from "./AuthSwitcher";
import PrivacyNote from "./PrivacyNote";
import { EmailIcon, LockIcon, PersonIcon } from "./icons";

// ── Password hint definitions ─────────────────────────────────────────────
// Each entry maps a label to the shared utility function.
// The component stays declarative — no inline logic.

const HINTS = [
  { label: "At least 8 characters",        check: hasMinLength },
  { label: "Includes number or symbol",    check: hasNumberOrSymbol },
  { label: "Includes uppercase & lowercase", check: hasUpperAndLowerCase },
];

// ── PasswordHints ─────────────────────────────────────────────────────────
// `password`  — current value from watch()
// `touched`   — true once the user has typed at least one character
//               (keeps all hints neutral on initial load)

function CheckIcon({ met }) {
  // Green filled circle with checkmark when met, plain gray ring when not
  return met ? (
    <svg className={styles.hintIcon} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#2e7d32" />
      <path
        d="M5 8.5l2 2 4-4"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg className={styles.hintIcon} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function PasswordHints({ password }) {
  // Show neutral state until the user starts typing
  const touched = password.length > 0;

  return (
    <ul className={styles.hints} aria-label="Password requirements">
      {HINTS.map(({ label, check }) => {
        const met = touched && check(password);
        return (
          <li
            key={label}
            className={[styles.hint, met ? styles.hintMet : ""].join(" ").trim()}
          >
            <CheckIcon met={met} />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

// ── RegisterForm ──────────────────────────────────────────────────────────

export default function RegisterForm() {
  const { register, handleSubmit, watch, errors, isSubmitting } = useRegister();

  // watch() re-renders only this component when "password" changes.
  // Default to "" so hints are neutral before the user focuses the field.
  const passwordValue = watch("password") ?? "";

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Create your account</h2>
      <p className={styles.subtitle}>Fill in the details below to get started</p>

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

      {/* Live password strength indicators */}
      <PasswordHints password={passwordValue} />

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>

      <FormDivider styles={styles} />
      <GoogleButton styles={styles} label="Sign up with Google" />
      <AuthSwitcher
        questionText="Already have an account?"
        actionText="Sign in"
        href="/login"
      />
      <PrivacyNote styles={styles} />
    </form>
  );
}
