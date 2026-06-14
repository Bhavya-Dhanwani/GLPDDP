"use client";



import Link from "next/link";
import styles from "../css/AuthSwitcher.module.css";

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
