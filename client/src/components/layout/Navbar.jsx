"use client";

import { useState } from "react";
import styles from "./Navbar.module.css";
import Button from "@/features/shared/ui/jsx/Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="GLPDDP Logo" />
      </div>

      <button
        className={`${styles.menuButton} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </button>

      <nav className={`${styles.links} ${isOpen ? styles.showMenu : ""}`}>
        <a>Home</a>
        <a>Matches</a>
        <a>Series</a>
        <a>Teams</a>
        <a>Players</a>

        <div className={styles.mobileActions}>
           <Button variant="secondary">Sign In</Button>
           <Button variant="primary">Get Started </Button>
        </div>
      </nav>

      <div className={styles.actions}>
       <Button variant="secondary">Sign In</Button>
         <Button variant="primary">Get Started </Button>
      </div>
    </header>
  );
}