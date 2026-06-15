"use client";

import Link from "next/link";
import DashboardShell from "./DashboardShell";
import { usePlayers } from "@/features/cricket/hooks/useCricketQueries";
import { useDeletePlayer } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminPlayersPage = () => {
    const { data = [], isLoading } = usePlayers();
    const deleteMutation = useDeletePlayer();

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>Players</h1>
                    <p className={styles.muted}>View, edit and delete player profiles.</p>
                </div>
                <Link className={`${styles.button} ${styles.primary}`} href="/dashboard/players/add">
                    Add Player
                </Link>
            </div>
            <section className={styles.card}>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Country</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => {
                                const id = item.id || item._id;
                                const roles = (item.role || []).join(", ");

                                return (
                                    <tr key={id}>
                                        <td>
                                            <span className={styles.truncateCell} title={item.name}>
                                                {item.name}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.truncateCell} title={item.country}>
                                                {item.country}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.truncateCell} title={roles}>
                                                {roles}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <Link className={styles.button} href={`/dashboard/players/add?edit=${id}`}>Edit</Link>
                                                <button className={`${styles.button} ${styles.danger}`} onClick={() => deleteMutation.mutate(id)} type="button">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {isLoading && <div className={styles.empty}>Loading players...</div>}
                {!isLoading && !data.length && <div className={styles.empty}>No players yet.</div>}
            </section>
        </DashboardShell>
    );
};

export default AdminPlayersPage;
