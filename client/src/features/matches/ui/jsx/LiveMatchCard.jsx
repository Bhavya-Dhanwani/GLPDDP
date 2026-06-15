import styles from "../css/MatchListsSection.module.css";

export default function LiveMatchCard({ match }) {
  return (
    <article className={styles.liveCard}>
      <div className={styles.cardTop}>
        <div>
          <span className={styles.liveBadge}>LIVE</span>
          <span className={styles.typeBadge}>{match.type}</span>
        </div>

        <span className={styles.arrow}>›</span>
      </div>

      <p className={styles.seriesName}>{match.series}</p>

      <div className={styles.scoreRow}>
        <div>
          <span className={styles.flag}>{match.flagA}</span>
          <h3>{match.teamA}</h3>
          <h2>{match.scoreA}</h2>
          <p>{match.oversA}</p>
        </div>

        <span className={styles.vs}>VS</span>

        <div>
          <span className={styles.flag}>{match.flagB}</span>
          <h3>{match.teamB}</h3>
          <h2>{match.scoreB}</h2>
          <p>{match.oversB}</p>
        </div>
      </div>

      <p className={styles.result}>{match.result}</p>

      <div className={styles.stats}>
        <span>
          CRR <b>{match.crr}</b>
        </span>

        <span>
          RRR <b>{match.rrr}</b>
        </span>
      </div>
    </article>
  );
}