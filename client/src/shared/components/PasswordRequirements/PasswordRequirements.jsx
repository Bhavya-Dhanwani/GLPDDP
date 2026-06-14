"use client";

/**
 * PasswordRequirements — live password strength indicator.
 *
 * Props:
 *   hasMinLength         {boolean}  — password >= 8 chars
 *   hasNumberOrSymbol    {boolean}  — contains digit or symbol
 *   hasUpperAndLowerCase {boolean}  — contains both cases
 *
 * Behavior:
 *   - Initially all indicators are neutral (gray ring).
 *   - Each turns green with a checkmark once its rule is met.
 *   - Parent is responsible for computing booleans via watch() + utils.
 */

import styles from "./PasswordRequirements.module.css";

const HINTS = [
  { key: "minLength",         label: "At least 8 characters",         prop: "hasMinLength" },
  { key: "numberOrSymbol",    label: "Includes number or symbol",     prop: "hasNumberOrSymbol" },
  { key: "upperAndLowerCase", label: "Includes uppercase & lowercase", prop: "hasUpperAndLowerCase" },
];

function CheckIcon({ met }) {
  return met ? (
    <svg className={styles.hintIcon} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#2e7d32" />
      <path
        d="M5 8.5l2 2 4-4"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg className={styles.hintIcon} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function PasswordRequirements({
  hasMinLength = false,
  hasNumberOrSymbol = false,
  hasUpperAndLowerCase = false,
}) {
  const values = { hasMinLength, hasNumberOrSymbol, hasUpperAndLowerCase };

  return (
    <ul className={styles.hints} aria-label="Password requirements">
      {HINTS.map(({ key, label, prop }) => {
        const met = values[prop];
        return (
          <li
            key={key}
            className={[styles.hint, met ? styles.hintMet : ""].join(" ").trim()}
          >
            <CheckIcon met={met} />
            {label}
          </li>
        );
      })}
    </ul>
  );
}
