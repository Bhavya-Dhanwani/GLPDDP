"use client";

import styles from "./AuthHeading.module.css";

/**
 * AuthHeading — title + subtitle block at the top of the auth card.
 *
 * Props:
 *   title     {string}
 *   subtitle  {string}
 */
export default function AuthHeading({ title, subtitle }) {
  return (
    <div className={styles.heading}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
