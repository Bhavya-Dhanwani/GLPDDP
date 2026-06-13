"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../css/LoginForm.module.css";

// Code-split the Google icon — not needed for initial paint
const GoogleG = dynamic(() => import("./GoogleG"), { ssr: false });

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Login to your account</h2>
      <p className={styles.subtitle}>Enter your details to access your account</p>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>
          Email Address
        </label>
        <div className={styles.inputWrapper}>
          {/* envelope icon */}
          <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="5" width="16" height="11" rx="2" stroke="#b0b8c1" strokeWidth="1.5" />
            <path d="M2 7l8 5 8-5" stroke="#b0b8c1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label htmlFor="login-password" className={styles.label}>
          Password
        </label>
        <div className={styles.inputWrapper}>
          {/* lock icon */}
          <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="4" y="9" width="12" height="8" rx="2" stroke="#b0b8c1" strokeWidth="1.5" />
            <path
              d="M7 9V7a3 3 0 016 0v2"
              stroke="#b0b8c1"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={styles.input}
            autoComplete="current-password"
          />
          {/* eye toggle */}
          <button
            type="button"
            className={styles.eyeBtn}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <svg viewBox="0 0 20 20" fill="none" className={styles.eyeIcon} aria-hidden="true">
                <path d="M2 2l16 16" stroke="#b0b8c1" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M6.71 6.71A7.94 7.94 0 002 10s3.5 6 8 6a7.94 7.94 0 004.29-1.29M9.53 4.1A7.94 7.94 0 0118 10s-1.4 2.38-3.71 4.29"
                  stroke="#b0b8c1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none" className={styles.eyeIcon} aria-hidden="true">
                <path
                  d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
                  stroke="#b0b8c1"
                  strokeWidth="1.5"
                />
                <circle cx="10" cy="10" r="2.5" stroke="#b0b8c1" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Forgot password — right-aligned */}
        <div className={styles.forgotRow}>
          <a href="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </a>
        </div>
      </div>

      {/* Sign In */}
      <button type="submit" className={styles.submitBtn}>
        Sign In
      </button>

      {/* OR divider */}
      <div className={styles.orDivider}>OR</div>

      {/* Google sign-in — lazily loaded */}
      <button type="button" className={styles.googleBtn}>
        <GoogleG />
        Sign in with Google
      </button>

      {/* Privacy note */}
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
    </div>
  );
}
