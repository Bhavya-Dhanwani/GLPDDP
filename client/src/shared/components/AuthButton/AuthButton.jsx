"use client";

import styles from "./AuthButton.module.css";

/**
 * AuthButton — full-width primary submit button.
 *
 * Props:
 *   children    {ReactNode}  — button label
 *   disabled    {boolean}
 *   type        {string}     — default "submit"
 */
export default function AuthButton({ children, disabled = false, type = "submit" }) {
  return (
    <button type={type} className={styles.btn} disabled={disabled}>
      {children}
    </button>
  );
}
