"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, Clock, MapPin, Trophy } from "lucide-react";
import PublicShell from "./PublicShell";
import StateBlock from "./StateBlock";
import StatusBadge from "./StatusBadge";
import styles from "../css/Cricket.module.css";
import { useMatchDetail } from "../../hooks/useCricketQueries";

const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
          }).format(new Date(value))
        : "TBA";

const TeamSummary = ({ team }) => (
    <div className={styles.team}>
        <div className={styles.teamLogo}>
            {team?.logo ? <img src={team.logo} alt={team.name} /> : team?.shortName || "T"}
        </div>
        <div>
            <h2 className={styles.wrapText}>
                {team?.name || "Team TBA"}
            </h2>
            <p className={`${styles.muted} ${styles.wrapText}`}>
                {team?.shortName || "TBA"}
            </p>
        </div>
    </div>
);

const MatchDetailPage = () => {
    const { id } = useParams();
    const { data: match, isLoading, isError } = useMatchDetail(id);

    return (
        <PublicShell>
            <Link href="/matches" className={styles.back}>
                Back to Matches
            </Link>
            {isLoading && <StateBlock type="loading">Loading match...</StateBlock>}
            {isError && <StateBlock>Unable to load this match.</StateBlock>}
            {match && (
                <div className={styles.detailGrid}>
                    <div className={styles.stack}>
                        <section className={`${styles.card} ${styles.heroCard} ${styles.matchHero}`}>
                            <TeamSummary team={match.team1} />
                            <div className={styles.centerScore}>
                                <StatusBadge status={match.status} />
                                <h1 className={styles.truncate} title={match.title || match.matchNumber || match.matchType}>
                                    {match.title || match.matchNumber || match.matchType}
                                </h1>
                                <p className={`${styles.muted} ${styles.wrapText}`}>
                                    {match.series?.name}
                                </p>
                                <strong>vs</strong>
                            </div>
                            <TeamSummary team={match.team2} />
                        </section>

                        <section className={`${styles.card} ${styles.sidePanel}`}>
                            <h2>Match Summary</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <tbody>
                                        <tr>
                                            <th>Match Type</th>
                                            <td>{match.matchType}</td>
                                        </tr>
                                        <tr>
                                            <th>Overs Per Innings</th>
                                            <td>{match.oversPerInnings}</td>
                                        </tr>
                                        <tr>
                                            <th>Current Innings</th>
                                            <td>{match.currentInnings}</td>
                                        </tr>
                                        <tr>
                                            <th>Toss</th>
                                            <td>
                                                {match.tossWinner?.name
                                                    ? `${match.tossWinner.name} chose ${match.tossDecision}`
                                                    : "Not available"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Result</th>
                                            <td>{match.result || "Not declared"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <aside className={`${styles.card} ${styles.sidePanel}`}>
                        <h2>Match Info</h2>
                        <div className={styles.metaList}>
                            <div className={styles.metaItem}>
                                <span>
                                    <Trophy size={16} /> Series
                                </span>
                                <strong className={styles.wrapText}>
                                    {match.series?.name || "TBA"}
                                </strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <CalendarDays size={16} /> Date
                                </span>
                                <strong>{formatDate(match.startTime)}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <Clock size={16} /> End
                                </span>
                                <strong>{formatDate(match.endTime)}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <MapPin size={16} /> Venue
                                </span>
                                <strong className={styles.wrapText}>
                                    {match.venue}
                                    {match.city ? `, ${match.city}` : ""}
                                </strong>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </PublicShell>
    );
};

export default MatchDetailPage;
