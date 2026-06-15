import { FaBell } from "react-icons/fa6";
import styles from "../css/MatchListsSection.module.css";

export default function UpcomingMatchCard({ match }) {
  return (
    <article className={styles.upcomingCard}>
      <div className={styles.cardTop}>
        <div>
          <span className={styles.upcomingBadge}>
            UPCOMING
          </span>

          <span className={styles.typeBadge}>
            {match.type}
          </span>
        </div>

        <span className={styles.arrow}>›</span>
      </div>

      <p className={styles.seriesName}>
        {match.title}
      </p>

      <div className={styles.upcomingTeams}>
        <div>
          <span className={styles.flag}>
            {match.flagA}
          </span>

          <h3>{match.teamA}</h3>
        </div>

        <span className={styles.vs}>VS</span>

        <div>
          <span className={styles.flag}>
            {match.flagB}
          </span>

          <h3>{match.teamB}</h3>
        </div>
      </div>

      <p className={styles.time}>
        {match.time}
      </p>

      <p className={styles.venue}>
        {match.venue}
      </p>

      <button className={styles.notify}>
        <FaBell />
        Notify Me
      </button>
    </article>
  );
}