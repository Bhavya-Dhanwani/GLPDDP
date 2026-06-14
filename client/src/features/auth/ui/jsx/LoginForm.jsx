"use client";


import { useLogin, LOGIN_RULES } from "@/features/auth/hooks";
import styles from "../css/LoginForm.module.css";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import FormDivider from "./FormDivider";
import GoogleButton from "./GoogleButton";
import AuthSwitcher from "./AuthSwitcher";
import PrivacyNote from "./PrivacyNote";
import { EmailIcon, LockIcon } from "./icons";

export default function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting } = useLogin();

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Login to your account</h2>
      <p className={styles.subtitle}>Enter your details to access your account</p>

      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        icon={EmailIcon}
        autoComplete="email"
        error={errors.email?.message}
        register={register("email", LOGIN_RULES.email)}
      />

      <PasswordField
        label="Password"
        name="password"
        placeholder="Enter your password"
        icon={LockIcon}
        autoComplete="current-password"
        error={errors.password?.message}
        register={register("password", LOGIN_RULES.password)}
      />

      <div className={styles.forgotRow}>
        <a href="/forgot-password" className={styles.forgotLink}>
          Forgot password?
        </a>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>

      <FormDivider styles={styles} />
      <GoogleButton styles={styles} label="Sign in with Google" />
      <AuthSwitcher
        questionText="New here?"
        actionText="Sign up"
        href="/register"
      />
      <PrivacyNote styles={styles} />
    </form>
  );
}
