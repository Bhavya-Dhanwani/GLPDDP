"use client";

import Image from "next/image";
import helmetImg from "@/assets/stadium-helmet.png";
import styles from "../css/LoginHero.module.css";

const FEATURES = [
  {
    title: "Secure & Reliable",
    desc: "Your data is encrypted and safe with us.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="8" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 8V6a3 3 0 016 0v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="13" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Google Sign-In",
    desc: "One click access with your Google account.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 6v4l3 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Seamless Experience",
    desc: "Access your dashboard from any device, anytime.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 9h2a2 2 0 012 2v1a2 2 0 01-2 2h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="9.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function LoginHero() {
  return (
    <div className={styles.hero}>
      {/* Text content */}
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Welcome
          <br />
          Back
        </h1>
        <div className={styles.divider} />
        <p className={styles.tagline}>
          Login to continue your journey
          <br />
          with <strong>GLPDDP</strong>.
        </p>

        {/* Feature list */}
        <ul className={styles.features} aria-label="Key features">
          {FEATURES.map(({ title, desc, icon }) => (
            <li key={title} className={styles.feature}>
              <span className={styles.featureIcon}>{icon}</span>
              <span className={styles.featureText}>
                <span className={styles.featureTitle}>{title}</span>
                <span className={styles.featureDesc}>{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/*
        Helmet image — positioned absolute at the bottom-left of the hero,
        allowed to overflow the column boundary downward.
        No clip, no overflow:hidden on the hero — fully "freed".
      */}
      <div className={styles.helmetWrap} aria-hidden="true">
        <Image
          src={helmetImg}
          alt=""
          fill
          sizes="(max-width: 768px) 280px, 340px"
          className={styles.helmetImage}
          priority
        />
      </div>
    </div>
  );
}
