import styles from "../css/MatchListsSection.module.css";
import UpcomingMatchCard from "./UpcomingMatchCard";

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
  },
];

export default function UpcomingMatches() {
  return (
    <div className={styles.cardGrid}>
      {upcomingMatches.map((match, index) => (
        <UpcomingMatchCard
          key={index}
          match={match}
        />
      ))}
    </div>
  );
}