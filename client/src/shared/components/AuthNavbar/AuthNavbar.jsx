"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import styles from "./AuthNavbar.module.css";

/**
 * AuthNavbar — logo-only navbar shared by Login and Register pages.
 */
export default function AuthNavbar() {
  return (
    <nav className={styles.navbar} aria-label="Site navigation">
      <Image
        src={logo}
        alt="GLPDDP Logo"
        width={140}
        height={50}
        className={styles.logoImage}
        priority
      />
    </nav>
  );
}
