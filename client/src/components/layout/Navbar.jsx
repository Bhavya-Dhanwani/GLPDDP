"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import logo from "../../assets/images/logo.png";

import styles from "./Navbar.module.css";

import Button from "@/features/shared/ui/jsx/Button";

import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const pathname = usePathname();

  return (
    <>
      <header className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <Image src={logo} alt="GLPDDP Logo" />
        </Link>

        <nav className={`${styles.links} ${isOpen ? styles.showMenu : ""}`}>
          <Link
            href="/"
            className={pathname === "/" ? styles.active : ""}
          >
            Home
          </Link>

          <Link
            href="/matches"
            className={pathname === "/matches" ? styles.active : ""}
          >
            Matches
          </Link>

          <Link
            href="/series"
            className={pathname === "/series" ? styles.active : ""}
          >
            Series
          </Link>

          <Link
            href="/teams"
            className={pathname === "/teams" ? styles.active : ""}
          >
            Teams
          </Link>

          <Link
            href="/players"
            className={pathname === "/players" ? styles.active : ""}
          >
            Players
          </Link>

          <Link
            href="/news"
            className={pathname === "/news" ? styles.active : ""}
          >
            News
          </Link>

          <div className={styles.mobileActions}>
            <Button variant="secondary">Sign In</Button>
            <Button variant="primary">Get Started</Button>
          </div>
        </nav>

        <div className={styles.searchBox}>
          <span>
            <FaSearch />
          </span>

          <input
            type="text"
            placeholder="Search matches, teams..."
          />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary">Sign In</Button>
          <Button variant="primary">Get Started</Button>
        </div>

        <div className={styles.mobileIcons}>
          <button
            className={styles.searchButton}
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Toggle Search"
          >
            <FaSearch color="#111827"/>
          </button>

          <button
            className={`${styles.menuButton} ${
              isOpen ? styles.open : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
          </button>
        </div>
      </header>

      {showSearch && (
        <div className={styles.mobileSearch}>
          <input
            type="text"
            placeholder="Search matches, teams..."
          />
        </div>
      )}
    </>
  );
}