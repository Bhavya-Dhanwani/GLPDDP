"use client";


import dynamic from "next/dynamic";

const GoogleG = dynamic(() => import("./GoogleG"), { ssr: false });

export default function GoogleButton({ styles, label = "Sign in with Google", onClick }) {
  return (
    <button type="button" className={styles.googleBtn} onClick={onClick}>
      <GoogleG className={styles.googleIcon} />
      {label}
    </button>
  );
}
