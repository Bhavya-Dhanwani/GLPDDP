"use client";

/**
 * FormDivider — "OR" separator between primary and OAuth buttons.
 * Receives `styles` from the parent form's CSS module.
 */
export default function FormDivider({ styles }) {
  return <div className={styles.orDivider}>OR</div>;
}
