"use client";

/**
 * PasswordField — InputField pre-configured for password inputs.
 * Owns the show/hide toggle state so hooks and forms don't have to.
 */

import { useState } from "react";
import InputField from "./InputField";
import styles from "../css/InputField.module.css";

function EyeOpen() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={styles.eyeIcon} aria-hidden="true">
      <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" stroke="#b0b8c1" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.5" stroke="#b0b8c1" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={styles.eyeIcon} aria-hidden="true">
      <path d="M2 2l16 16" stroke="#b0b8c1" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M6.71 6.71A7.94 7.94 0 002 10s3.5 6 8 6a7.94 7.94 0 004.29-1.29M9.53 4.1A7.94 7.94 0 0118 10s-1.4 2.38-3.71 4.29"
        stroke="#b0b8c1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PasswordField({
  label,
  name,
  placeholder,
  icon,
  error,
  register,
  disabled = false,
  required = false,
  autoComplete = "current-password",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <InputField
      label={label}
      name={name}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      icon={icon}
      error={error}
      register={register}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
    >
      <button
        type="button"
        className={styles.eyeBtn}
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOff /> : <EyeOpen />}
      </button>
    </InputField>
  );
}
