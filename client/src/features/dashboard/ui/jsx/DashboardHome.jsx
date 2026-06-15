"use client";

import Link from "next/link";
import DashboardShell from "./DashboardShell";
import { useMatches, usePlayers, useSeries } from "@/features/cricket/hooks/useCricketQueries";
import styles from "../css/Dashboard.module.css";

const DashboardHome = () => {
    const seriesQuery = useSeries();
    const matchesQuery = useMatches();
    const playersQuery = usePlayers();

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>Dashboard</h1>
                    <p className={styles.muted}>Manage cricket content and fixtures.</p>
                </div>
            </div>
            <div className={styles.grid}>
                <Link href="/dashboard/series" className={`${styles.card} ${styles.statCard}`}>
                    <span className={styles.muted}>Series</span>
                    <strong>{seriesQuery.data?.length || 0}</strong>
                </Link>
                <Link href="/dashboard/matches" className={`${styles.card} ${styles.statCard}`}>
                    <span className={styles.muted}>Matches</span>
                    <strong>{matchesQuery.data?.length || 0}</strong>
                </Link>
                <Link href="/dashboard/players" className={`${styles.card} ${styles.statCard}`}>
                    <span className={styles.muted}>Players</span>
                    <strong>{playersQuery.data?.length || 0}</strong>
                </Link>
            </div>
        </DashboardShell>
    );
};

export default DashboardHome;
