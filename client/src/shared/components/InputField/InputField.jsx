"use client";

import styles from "./InputField.module.css";

/**
 * InputField — reusable labelled input for all auth forms.
 *
 * Props:
 *   label        {string}     — visible label text
 *   name         {string}     — field name → used for id + aria
 *   type         {string}     — input type (default: "text")
 *   placeholder  {string}
 *   icon         {ReactNode}  — leading SVG icon
 *   error        {string}     — RHF error message
 *   register     {object}     — RHF register() return value
 *   disabled     {boolean}
 *   required     {boolean}
 *   autoComplete {string}
 *   children     {ReactNode}  — trailing slot (eye-toggle, etc.)
 */
export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  error,
  register,
  disabled = false,
  required = false,
  autoComplete,
  children,
}) {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      <div
        className={[styles.inputWrapper, error ? styles.inputWrapperError : ""]
          .join(" ")
          .trim()}
      >
        {icon && (
          <span className={styles.inputIcon} aria-hidden="true">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={styles.input}
          {...register}
        />

        {children}
      </div>

      {error && (
        <span id={errorId} className={styles.errorMsg} role="alert">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5.5" stroke="var(--color-error)" />
            <path
              d="M6 3.5v3M6 8.5v.5"
              stroke="var(--color-error)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
