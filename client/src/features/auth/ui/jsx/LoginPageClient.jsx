"use client";

import dynamic from "next/dynamic";
import styles from "../css/LoginLayout.module.css";

import LoginNavbar from "./LoginNavbar";

const LoginHero = dynamic(() => import("./LoginHero"), {
  ssr: false,
  loading: () => <div className={styles.heroSkeleton} aria-hidden="true" />,
});

// LoginForm — lazy chunk (interactive, loads after paint)
const LoginForm = dynamic(() => import("./LoginForm"), {
  ssr: false,
  loading: () => <div className={styles.formSkeleton} aria-hidden="true" />,
});

export default function LoginPageClient() {
  return (
    <div className={styles.page}>
      <LoginNavbar />

      <div className={styles.body}>
        <div className={styles.inner}>
          {/*
            Hero column: overflow visible so the helmet can bleed
            below the column boundary without being clipped.
          */}
          <div className={styles.heroCol}>
            <LoginHero />
          </div>

          <div className={styles.formCol}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
