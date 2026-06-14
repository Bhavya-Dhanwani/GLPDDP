"use client";

import { FaCalendar, FaTrophy } from "react-icons/fa";
import { CardSimIcon, Heart, Trophy } from "lucide-react";
import styles from "../css/MatchListsSection.module.css";
import LiveMatches from "./LiveMatches";
import UpcomingMatches from "./UpcomingMatches";

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

        <LiveMatches />

        <div className={styles.sectionHeader}>
          <h2>
            <FaCalendar className={styles.calendarIcon} /> Upcoming Matches
          </h2>
          <button>View All Upcoming</button>
        </div>

        <UpcomingMatches />
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
                <Icon size={22} strokeWidth={2.4} color="#059669" />
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