"use client";

/**
 * AuthSwitcher — "Already have an account? Sign in" / "New here? Sign up"
 *
 * Props:
 *   questionText  {string}  — static label (e.g. "Already have an account?")
 *   actionText    {string}  — link label (e.g. "Sign in")
 *   href          {string}  — navigation target
 */

import Link from "next/link";
import styles from "./AuthSwitcher.module.css";

export default function AuthSwitcher({ questionText, actionText, href }) {
  return (
    <p className={styles.switcher}>
      <span className={styles.question}>{questionText}</span>
      <Link href={href} className={styles.action}>
        {actionText}
      </Link>
    </p>
  );
}
