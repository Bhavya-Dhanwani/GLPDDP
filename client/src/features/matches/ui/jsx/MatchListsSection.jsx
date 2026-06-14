"use client";

import { FaCalendar, FaTrophy } from "react-icons/fa";
import styles from "../css/MatchListsSection.module.css";
import { Bell, CardSimIcon, Heart, Trophy } from "lucide-react";
import { FaBell } from "react-icons/fa6";

const liveMatches = [
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
    series: "West Indies vs England T20I",
    teamA: "WI",
    teamB: "ENG",
    flagA: "🇻🇨",
    flagB: "🏴",
    scoreA: "162/4",
    scoreB: "168/7",
    oversA: "(18.3 Overs)",
    oversB: "(20 Overs)",
    result: "England won by 6 runs",
    crr: "8.76",
    rrr: "7.20",
  },
  {
    type: "Test",
    series: "Sri Lanka vs New Zealand Test",
    teamA: "SL",
    teamB: "NZ",
    flagA: "🇱🇰",
    flagB: "🇳🇿",
    scoreA: "305/8d",
    scoreB: "402/9",
    oversA: "(88.0 Overs)",
    oversB: "(115.0 Overs)",
    result: "New Zealand lead by 97 runs",
    crr: "3.46",
    rrr: "3.49",
  },
];

const upcomingMatches = [
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
    title: "South Africa vs Pakistan ODI",
    teamA: "SA",
    teamB: "PAK",
    flagA: "🇿🇦",
    flagB: "🇵🇰",
    time: "May 25, 2025 • 3:30 PM",
    venue: "Centurion, South Africa",
  },
  {
    type: "Test",
    title: "Australia vs West Indies Test",
    teamA: "AUS",
    teamB: "WI",
    flagA: "🇦🇺",
    flagB: "🇻🇨",
    time: "May 29, 2025 • 10:00 AM",
    venue: "Perth Stadium, Australia",
  },
];

const popularSeries = [
  {
    icon: Trophy,
    title: "ICC Champions Trophy 2025",
    matches: "5 Matches",
  },
  {
    icon: Heart,
    title: "Indian Premier League 2025",
    matches: "74 Matches",
  },
  {
    icon: CardSimIcon,
    title: "India Tour of England 2025",
    matches: "5 Matches • 3 ODIs • 5 T20Is",
  },
  {
    icon: FaTrophy,
    title: "Asia Cup 2025",
    matches: "13 Matches",
  },
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

      <button className={styles.notify}><FaBell /> Notify Me</button>
    </article>
  );
}

export default function MatchListsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.main}>
        <div className={styles.sectionHeader}>
          <h2>
            <span></span> Live Matches
          </h2>
          <button>View All Live →</button>
        </div>

        <div className={styles.cardGrid}>
          {liveMatches.map((match, index) => (
            <LiveCard key={index} match={match} />
          ))}
        </div>

        <div className={styles.sectionHeader}>
          <h2><FaCalendar className={styles.calendarIcon} /> Upcoming Matches</h2>
          <button>View All Upcoming</button>
        </div>

        <div className={styles.cardGrid}>
          {upcomingMatches.map((match, index) => (
            <UpcomingCard key={index} match={match} />
          ))}
        </div>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <h3>Popular Series</h3>
          <button>View All</button>
        </div>

        {popularSeries.map((series, index) => {
          const Icon = series.icon;

          return (
            <div className={styles.seriesItem} key={index}>
              <span className={styles.seriesIcon}>
                {typeof Icon === "string" ? (
                  Icon
                ) : (
                  <Icon size={22} strokeWidth={2.4} color="#059669" />
                )}
              </span>

              <div>
                <h4>{series.title}</h4>
                <p>{series.matches}</p>
              </div>
            </div>
          );
        })}
      </aside>
    </section>
  );
}