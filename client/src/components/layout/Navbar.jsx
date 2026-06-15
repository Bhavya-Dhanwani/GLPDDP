"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Navbar.module.css";
import Button from "@/features/shared/ui/jsx/Button";
import { useLogout } from "@/features/auth/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const logoutMutation = useLogout();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isScorer = user?.role === "SCORER";

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Image src={logo} alt="Logo" />
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
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/dashboard">
                  <Button variant="primary">Dashboard</Button>
                </Link>
              )}
              <Button
                variant="secondary"
                onClick={() => logoutMutation.mutate()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Link href="/dashboard">
                <Button variant="primary">Dashboard</Button>
              </Link>
            )}
            <Button
              variant="secondary"
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
