"use client";

/**
 * ForgotPassword — "Forgot password?" link row.
 * Only used on the Login page.
 */

import styles from "./ForgotPassword.module.css";

export default function ForgotPassword() {
  return (
    <div className={styles.forgotRow}>
      <a href="/forgot-password" className={styles.forgotLink}>
        Forgot password?
      </a>
    </div>
  );
}
