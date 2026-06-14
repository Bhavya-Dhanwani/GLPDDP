import styles from "../css/MatchHero.module.css";
import Image from "next/image";
import player from "@/assets/images/player.png";

export default function MatchHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <span className={styles.badge}>MATCHES</span>

        <h1>Matches Center</h1>

        <p>
          Real-time scores, ball-by-ball updates and
          everything cricket.
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.liveCard}>
          <span className={styles.liveDot}></span>

          <div>
            <h3>14</h3>
            <p>Live Matches</p>
          </div>
        </div>

        <div className={styles.circle}></div>

        <Image
          src={player}
          alt="player"
          className={styles.player}
        />
      </div>
    </section>
  );
}