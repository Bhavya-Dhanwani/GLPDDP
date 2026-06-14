"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import styles from "../css/RegisterNavbar.module.css";

export default function RegisterNavbar() {
  return (
    <nav className={styles.navbar}>
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
