import styles from "../css/LiveMatches.module.css";
import {
  Network,
  Calendar,
  Globe,
  Users,
} from "lucide-react";

export default function LiveMatches() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>LIVE MATCHES</p>
          <h2 className={styles.desc}>What&apos;s Happening Now</h2>
        </div>

        <button className={styles.viewButton}>View All Live →</button>
      </div>

      <div className={styles.matchCard}>
        <div className={styles.matchInfo}>
          <span className={styles.liveBadge}>● LIVE</span>
          <span>2nd ODI</span>
          <span>•</span>
          <span>Adelaide Oval</span>
        </div>

        <div className={styles.scoreRow}>
          <div className={styles.team}>
            <span className={styles.flag}>🇮🇳</span>
            <strong>IND</strong>
          </div>

          <div className={styles.score}>
            <h3>278/6</h3>
            <p>(45.2 Overs)</p>
          </div>

          <p className={styles.result}>
            India need 45 runs <br /> in 28 balls
          </p>

          <div className={styles.score}>
            <h3>234/10</h3>
            <p>(49.3 Overs)</p>
          </div>

          <div className={styles.team}>
            <strong>AUS</strong>
            <span className={styles.flag}>🇦🇺</span>
          </div>
        </div>
      </div>

      <div className={styles.statsBox}>
        <div className={styles.statItem}>
          <div className={styles.icon}>{<Users size={42} />}</div>
          <h3>50K+</h3>
          <p>Active Users</p>
        </div>

        <div className={styles.statItem}>
          <div className={styles.icon}>{<Network size={42} />}</div>
          <h3>99.9%</h3>
          <p>Real-time Updates</p>
        </div>

        <div className={styles.statItem}>
          <div className={styles.icon}>{<Calendar size={42} />}</div>
          <h3>10K+</h3>
          <p>Matches Covered</p>
        </div>

        <div className={styles.statItem}>
          <div className={styles.icon}>{<Globe size={42} />}</div>
          <h3>150+</h3>
          <p>Countries</p>
        </div>
      </div>
    </section>
  );
}