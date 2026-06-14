import styles from "../css/MatchListsSection.module.css";

export const liveMatches = [
  {
    type: "ODI",
    series: "India vs Australia Series",
    teamA: "IND",
    teamB: "AUS",
    flagA: "🇮🇳",
    flagB: "🇦🇺",
    scoreA: "278/6",
    scoreB: "234/10",
    oversA: "(45.2 Overs)",
    oversB: "(49.3 Overs)",
    result: "India need 45 runs in 28 balls",
    crr: "6.13",
    rrr: "9.64",
  },
    {
    type: "T20I",
    series: "England vs New Zealand Series",
    teamA: "ENG",
    teamB: "NZ",
    flagA: "🏴",
    flagB: "🇳🇿",
    scoreA: "156/4",
    scoreB: "142/8",
    oversA: "(20 Overs)",
    oversB: "(20 Overs)",
    result: "England need 15 runs in 12 balls",
    crr: "7.8",
    rrr: "12.5",
  },
  { 
    type: "Test",
    series: "South Africa vs Pakistan Series",
    teamA: "SA",
    teamB: "PAK",
    flagA: "🇿🇦",
    flagB: "🇵🇰",
    scoreA: "350/9d",
    scoreB: "280/10",
    oversA: "(90 Overs)",
    oversB: "(85 Overs)",
    result: "South Africa lead by 70 runs",
    crr: "3.89",
    rrr: "4.12",
  }
];

function LiveCard({ match }) {
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
        <span>CRR <b>{match.crr}</b></span>
        <span>RRR <b>{match.rrr}</b></span>
      </div>
    </article>
  );
}

export default function LiveMatches() {
  return (
    <div className={styles.cardGrid}>
      {liveMatches.map((match, index) => (
        <LiveCard key={index} match={match} />
      ))}
    </div>
  );
}