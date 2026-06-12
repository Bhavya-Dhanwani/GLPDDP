import styles from "../css/Hero.module.css";
import {
  Route,
  BarChart3,
  Trophy,
  Users,
} from "lucide-react";
import Button from "@/features/shared/ui/jsx/Button";


export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <p className={styles.badge}>● LIVE CRICKET. REAL TIME.</p>

        <h1>
          Live Cricket <br />
          Scores. <br />
          <span>Real Time.</span>
        </h1>

        <p className={styles.description}>
          Your ultimate destination for live scores, ball-by-ball commentary,
          match stats and everything cricket.
        </p>

        <div className={styles.buttons}>
          <Button variant="primary">Explore Live Matches </Button>
          <Button variant="secondary">View Series</Button>
        </div>

        <div className={styles.features}>
          <div>{<Route size={32} />}<p>Real-time<br />Updates</p></div>
          <div>{<BarChart3 size={32} />}<p>Ball-by-ball<br />Commentary</p></div>
          <div>{<Trophy size={32} />}<p>Series & Stats<br />Insights</p></div>
          <div>{<Users size={32} />}<p>Teams & Players<br />Info</p></div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.circle}></div>

        <div className={`${styles.floatCard} ${styles.wicket}`}>
          <strong>WICKET!</strong>
          <p>M. Starc b Bumrah</p>
          <small>23 (19)</small>
        </div>

        <div className={`${styles.floatCard} ${styles.four}`}>
          <strong>FOUR!</strong>
          <p>Beautiful shot</p>
        </div>

        <div className={styles.scoreCard}>
          <div className={styles.cardTop}>
            <span>LIVE • 2nd ODI</span>
            <b>LIVE</b>
          </div>

          <div className={styles.score}>
            <span>🇮🇳 IND</span>
            <h2>278/6</h2>
            <span>AUS 🇦🇺</span>
          </div>

          <p className={styles.overs}>(45.2 Overs)</p>
          <p className={styles.need}>India need 45 runs in 28 balls</p>

          <div className={styles.rateBox}>
            <div>
              <small>CRR</small>
              <strong>6.13</strong>
            </div>
            <div>
              <small>RRR</small>
              <strong>9.64</strong>
            </div>
          </div>

          <p className={styles.lastOver}>Last Over</p>
          <div className={styles.balls}>
            <span>1</span>
            <span>4</span>
            <span>0</span>
            <span className={styles.six}>6</span>
            <span>1</span>
            <span>2</span>
          </div>
        </div>

        <div className={`${styles.floatCard} ${styles.sixCard}`}>
          <strong>SIX!</strong>
          <p>That's out of the ground!</p>
        </div>

        <div className={styles.ball}><img src="/heroimage.png" alt="" /></div>
      </div>
    </section>
  );
}