"use client";


export default function PrivacyNote({ styles }) {
  return (
    <p className={styles.privacy}>
      <svg className={styles.privacyIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1.5L2 4v4.5c0 3.5 2.5 6.8 6 7.5 3.5-.7 6-4 6-7.5V4L8 1.5z"
          stroke="#b0b8c1"
          strokeWidth="1.2"
        />
      </svg>
      We respect your privacy. Your data is safe with us.
    </p>
  );
}
