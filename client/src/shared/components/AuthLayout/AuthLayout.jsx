"use client";

import styles from "./AuthLayout.module.css";

/**
 * AuthLayout — two-column page body used by Login and Register.
 *
 * Props:
 *   leftContent   {ReactNode}  — hero column (image + text)
 *   rightContent  {ReactNode}  — form card column
 *   overflowLeft  {boolean}    — allows left column to overflow (login helmet)
 */
export default function AuthLayout({ leftContent, rightContent, overflowLeft = false }) {
  return (
    <div className={styles.body}>
      <div className={styles.inner}>
        <div
          className={[styles.heroCol, overflowLeft ? styles.heroColOverflow : ""]
            .join(" ")
            .trim()}
        >
          {leftContent}
        </div>
        <div className={styles.formCol}>{rightContent}</div>
      </div>
    </div>
  );
}
