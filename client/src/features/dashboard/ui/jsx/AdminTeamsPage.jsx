"use client";

import Link from "next/link";
import DashboardShell from "./DashboardShell";
import { useTeams } from "@/features/cricket/hooks/useCricketQueries";
import { useDeleteTeam } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminTeamsPage = () => {
    const { data = [], isLoading } = useTeams();
    const deleteMutation = useDeleteTeam();

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>Teams</h1>
                    <p className={styles.muted}>View, edit and delete team profiles and squads.</p>
                </div>
                <Link className={`${styles.button} ${styles.primary}`} href="/dashboard/teams/add">
                    Add Team
                </Link>
            </div>
            <section className={styles.card}>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Short Name</th>
                                <th>Squad</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => {
                                const id = item.id || item._id;
                                const squadCount = item.squadPlayers?.length || 0;

                                return (
                                    <tr key={id}>
                                        <td>
                                            <span className={styles.truncateCell} title={item.name}>
                                                {item.name}
                                            </span>
                                        </td>
                                        <td>{item.shortName}</td>
                                        <td>{squadCount} players</td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <Link className={styles.button} href={`/dashboard/teams/add?edit=${id}`}>Edit</Link>
                                                <button className={`${styles.button} ${styles.danger}`} onClick={() => deleteMutation.mutate(id)} type="button">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {isLoading && <div className={styles.empty}>Loading teams...</div>}
                {!isLoading && !data.length && <div className={styles.empty}>No teams yet.</div>}
            </section>
        </DashboardShell>
    );
};

export default AdminTeamsPage;
