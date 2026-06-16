"use client";

import Link from "next/link";
import DashboardShell from "./DashboardShell";
import { useMatches } from "@/features/cricket/hooks/useCricketQueries";
import {
    useDeleteMatch,
    usePublishMatch,
} from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminMatchesPage = () => {
    const matchesQuery = useMatches();
    const deleteMutation = useDeleteMatch();
    const publishMutation = usePublishMatch();

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>Matches</h1>
                    <p className={styles.muted}>View fixtures and manage match lifecycle.</p>
                </div>
                <Link className={`${styles.button} ${styles.primary}`} href="/dashboard/matches/add">
                    Add Match
                </Link>
            </div>
            <section className={styles.card}>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Match</th>
                                <th>Teams</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(matchesQuery.data || []).map((item) => {
                                const id = item.id || item._id;
                                const title = item.title || item.matchNumber || item.matchType;
                                const teams = `${item.team1?.shortName || "T1"} vs ${item.team2?.shortName || "T2"}`;

                                return (
                                    <tr key={id}>
                                        <td>
                                            <span className={styles.truncateCell} title={title}>
                                                {title}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.truncateCell} title={teams}>
                                                {teams}
                                            </span>
                                        </td>
                                        <td>{item.status}</td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <Link className={`${styles.button} ${styles.primary}`} href={`/dashboard/scoring/${id}`}>Score</Link>
                                                <Link className={styles.button} href={`/dashboard/matches/add?edit=${id}`}>Edit</Link>
                                                {item.status === "DRAFT" && (
                                                    <button className={styles.button} onClick={() => publishMutation.mutate(id)} type="button">Publish</button>
                                                )}
                                                <button className={`${styles.button} ${styles.danger}`} onClick={() => deleteMutation.mutate(id)} type="button">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {matchesQuery.isLoading && <div className={styles.empty}>Loading matches...</div>}
                {!matchesQuery.isLoading && !(matchesQuery.data || []).length && <div className={styles.empty}>No matches yet.</div>}
            </section>
        </DashboardShell>
    );
};

export default AdminMatchesPage;
