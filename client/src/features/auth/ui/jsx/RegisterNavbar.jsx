"use client";

import styles from "../css/RegisterNavbar.module.css";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function RegisterNavbar() {
  return (
    <nav className={styles.navbar}>
      <Image
        src={logo}
        alt="GLPDDP Logo"
        width={120}
        height={40}
        className={styles.logoImage}
      />

      <div className={styles.signinBadge}>
        {/* shield-check icon via SVG for crispness */}
        <svg
          className={styles.badgeIcon}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 2L3 5v5c0 4.418 3.134 8.56 7 9.5C16.866 18.56 20 14.418 20 10V5l-7-3z"
            stroke="#2e7d32"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M7 10l2 2 4-4"
            stroke="#2e7d32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Already have an account?</span>
        <span className={styles.signinLink}>Sign in</span>
      </div>
    </nav>
  );
}
