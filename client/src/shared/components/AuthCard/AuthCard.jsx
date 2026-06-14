"use client";

import styles from "./AuthCard.module.css";

/**
 * AuthCard — white card container for auth forms.
 * Accepts any children.
 */
export default function AuthCard({ children }) {
  return <div className={styles.card}>{children}</div>;
}
