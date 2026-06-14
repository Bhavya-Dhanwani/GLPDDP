import { FaBell } from "react-icons/fa6";
import styles from "../css/MatchListsSection.module.css";

export const upcomingMatches = [
  {
    type: "T20I",
    title: "India vs England T20I",
    teamA: "IND",
    teamB: "ENG",
    flagA: "🇮🇳",
    flagB: "🏴",
    time: "Tomorrow, 7:30 PM",
    venue: "Edgbaston, Birmingham",
  },
  {
    type: "ODI",
    title: "Australia vs New Zealand ODI",
    teamA: "AUS",
    teamB: "NZ",
    flagA: "🇦🇺",
    flagB: "🇳🇿",
    time: "Next Day, 3:00 PM",
    venue: "MCG, Melbourne",
  },
  {
    type: "Test",
    title: "South Africa vs Pakistan Test",
    teamA: "SA",
    teamB: "PAK",
    flagA: "🇿🇦",
    flagB: "🇵🇰",
    time: "Next Week, 10:00 AM",
    venue: "Newlands, Cape Town",
  }
];

function UpcomingCard({ match }) {
  return (
    <article className={styles.upcomingCard}>
      <div>
        <span className={styles.upcomingBadge}>UPCOMING</span>
        <span className={styles.typeBadge}>{match.type}</span>
      </div>

      <p className={styles.seriesName}>{match.title}</p>

      <div className={styles.upcomingTeams}>
        <div>
          <span>{match.flagA}</span>
          <h3>{match.teamA}</h3>
        </div>

        <span className={styles.vs}>VS</span>

        <div>
          <span>{match.flagB}</span>
          <h3>{match.teamB}</h3>
        </div>
      </div>

      <p className={styles.time}>{match.time}</p>
      <p className={styles.venue}>{match.venue}</p>

      <button className={styles.notify}>
        <FaBell /> Notify Me
      </button>
    </article>
  );
}

export default function UpcomingMatches() {
  return (
    <div className={styles.cardGrid}>
      {upcomingMatches.map((match, index) => (
        <UpcomingCard key={index} match={match} />
      ))}
    </div>
  );
}