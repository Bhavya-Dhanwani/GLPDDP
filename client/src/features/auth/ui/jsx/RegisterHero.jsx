"use client";

import Image from "next/image";
import playerImg from "@/assets/player.png";
import styles from "../css/RegisterHero.module.css";

export default function RegisterHero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.heading}>
        Create
        <br />
        Account
      </h1>
      <div className={styles.divider} />
      <p className={styles.tagline}>
        Join <strong>GLPDDP</strong> and be part of a smarter way to manage,
        analyze and grow.
      </p>

      {/*
        Wrapping the image in a flex:1 div lets us use a regular <img> via
        Next Image's style prop — avoids the fixed-dimension requirement
        while still getting optimisation benefits.
      */}
      <div className={styles.imageWrap}>
        <Image
          src={playerImg}
          alt="Cricket player batting"
          fill
          sizes="290px"
          className={styles.playerImage}
          priority
        />
      </div>
    </div>
  );
}
