"use client";

import dynamic from "next/dynamic";
import styles from "../css/RegisterLayout.module.css";

// RegisterNavbar — eager, above the fold
import RegisterNavbar from "./RegisterNavbar";

// RegisterHero — lazy chunk (has Next Image + player asset)
const RegisterHero = dynamic(() => import("./RegisterHero"), {
  ssr: false,
  loading: () => <div className={styles.heroSkeleton} aria-hidden="true" />,
});

// RegisterForm — lazy chunk (interactive, loads after paint)
const RegisterForm = dynamic(() => import("./RegisterForm"), {
  ssr: false,
  loading: () => <div className={styles.formSkeleton} aria-hidden="true" />,
});

export default function RegisterPageClient() {
  return (
    <div className={styles.page}>
      <RegisterNavbar />

      <div className={styles.body}>
        {/* max-width inner wrapper keeps columns tight like the design */}
        <div className={styles.inner}>
          <div className={styles.heroCol}>
            <RegisterHero />
          </div>

          <div className={styles.formCol}>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
