"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import PublicShell from "./PublicShell";
import MatchCard from "./MatchCard";
import StateBlock from "./StateBlock";
import StatusBadge from "./StatusBadge";
import { useSeriesDetail, useSeriesMatches } from "../../hooks/useCricketQueries";
import styles from "../css/Cricket.module.css";

const SeriesDetailPage = () => {
    const { id } = useParams();
    const seriesQuery = useSeriesDetail(id);
    const matchesQuery = useSeriesMatches(id);
    const series = seriesQuery.data;
    const matches = matchesQuery.data || [];

    return (
        <PublicShell>
            <Link href="/series" className={styles.back}>
                Back to Series
            </Link>
            {seriesQuery.isLoading && <StateBlock type="loading">Loading series...</StateBlock>}
            {seriesQuery.isError && <StateBlock>Unable to load this series.</StateBlock>}
            {series && (
                <div className={styles.detailGrid}>
                    <div className={styles.stack}>
                        <section className={`${styles.card} ${styles.heroCard}`}>
                            <div className={styles.banner}>
                                {series.logo ? (
                                    <img src={series.logo} alt={series.name} />
                                ) : (
                                    <span className={styles.lineClamp} title={series.shortName}>
                                        {series.shortName}
                                    </span>
                                )}
                            </div>
                            <div className={styles.stack}>
                                <StatusBadge status={series.status} />
                                <h1 className={styles.truncate} title={series.name}>{series.name}</h1>
                                <p className={styles.muted}>
                                    <CalendarDays size={16} /> Season {series.season}
                                    <span> - </span>
                                    <MapPin size={16} /> Global cricket
                                </p>
                                <p className={styles.muted}>
                                    Tournament fixtures, results and summary for {series.name}.
                                </p>
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <strong>{matches.length}</strong>
                                    <span className={styles.muted}>Matches</span>
                                </div>
                            </div>
                        </section>

                        <section className={`${styles.card} ${styles.sidePanel}`}>
                            <h2>Match Schedule</h2>
                            <div className={styles.stack}>
                                {matchesQuery.isLoading && (
                                    <StateBlock type="loading">Loading matches...</StateBlock>
                                )}
                                {!matchesQuery.isLoading &&
                                    matches.map((match) => (
                                        <MatchCard key={match.id || match._id} match={match} />
                                    ))}
                                {!matchesQuery.isLoading && !matches.length && (
                                    <StateBlock>No matches added for this series.</StateBlock>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className={`${styles.card} ${styles.sidePanel}`}>
                        <h2>Series Details</h2>
                        <div className={styles.metaList}>
                            <div className={styles.metaItem}>
                                <span>Format</span>
                                <strong className={styles.truncate} title={series.shortName}>{series.shortName}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>Season</span>
                                <strong>{series.season}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>Status</span>
                                <StatusBadge status={series.status} />
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <Trophy size={16} /> Tournament
                                </span>
                                <strong>Series</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <Users size={16} /> Teams
                                </span>
                                <strong>From matches</strong>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </PublicShell>
    );
};

export default SeriesDetailPage;
