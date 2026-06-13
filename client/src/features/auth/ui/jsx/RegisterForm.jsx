"use client";

import dynamic from "next/dynamic";
import styles from "../css/RegisterForm.module.css";

// Code-split the Google icon — it's below the fold and not needed for initial paint
const GoogleG = dynamic(() => import("./GoogleG"), { ssr: false });

const PASSWORD_HINTS = [
  "At least 8 characters",
  "Includes number or symbol",
  "Mix of uppercase and lowercase",
];

export default function RegisterForm() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Create your account</h2>
      <p className={styles.subtitle}>Fill in the details below to get started</p>

      {/* Full Name */}
      <div className={styles.field}>
        <label htmlFor="reg-fullname" className={styles.label}>
          Full Name
        </label>
        <div className={styles.inputWrapper}>
          {/* person icon */}
          <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="7" r="3.5" stroke="#b0b8c1" strokeWidth="1.5" />
            <path
              d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
              stroke="#b0b8c1"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="reg-fullname"
            type="text"
            placeholder="Enter your full name"
            className={styles.input}
            autoComplete="name"
          />
        </div>
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="reg-email" className={styles.label}>
          Email Address
        </label>
        <div className={styles.inputWrapper}>
          {/* envelope icon */}
          <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="5" width="16" height="11" rx="2" stroke="#b0b8c1" strokeWidth="1.5" />
            <path d="M2 7l8 5 8-5" stroke="#b0b8c1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="reg-email"
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label htmlFor="reg-password" className={styles.label}>
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
            id="reg-password"
            type="password"
            placeholder="Create a password"
            className={styles.input}
            autoComplete="new-password"
          />
          {/* eye icon */}
          <button
            type="button"
            className={styles.eyeBtn}
            aria-label="Toggle password visibility"
          >
            <svg viewBox="0 0 20 20" fill="none" className={styles.eyeIcon} aria-hidden="true">
              <path
                d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
                stroke="#b0b8c1"
                strokeWidth="1.5"
              />
              <circle cx="10" cy="10" r="2.5" stroke="#b0b8c1" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Password hints */}
      <ul className={styles.hints} aria-label="Password requirements">
        {PASSWORD_HINTS.map((hint) => (
          <li key={hint} className={styles.hint}>
            {/* filled check circle */}
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
            {hint}
          </li>
        ))}
      </ul>

      {/* Submit */}
      <button type="submit" className={styles.submitBtn}>
        Create Account
      </button>

      {/* OR divider */}
      <div className={styles.orDivider}>OR</div>

      {/* Google sign-up — lazily loaded */}
      <button type="button" className={styles.googleBtn}>
        <GoogleG />
        Sign up with Google
      </button>

      {/* Privacy note */}
      <p className={styles.privacy}>
        {/* shield icon */}
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
