"use client";

import Link from "next/link";
import DashboardShell from "./DashboardShell";
import { useSeries } from "@/features/cricket/hooks/useCricketQueries";
import { useDeleteSeries } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminSeriesPage = () => {
    const { data = [], isLoading } = useSeries();
    const deleteMutation = useDeleteSeries();

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>Series</h1>
                    <p className={styles.muted}>View, edit and delete cricket series.</p>
                </div>
                <Link className={`${styles.button} ${styles.primary}`} href="/dashboard/series/add">
                    Add Series
                </Link>
            </div>
            <section className={styles.card}>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Season</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => {
                                const id = item.id || item._id;

                                return (
                                    <tr key={id}>
                                        <td>
                                            <span className={styles.truncateCell} title={item.name}>
                                                {item.name}
                                            </span>
                                        </td>
                                        <td>{item.season}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <Link className={styles.button} href={`/dashboard/series/add?edit=${id}`}>Edit</Link>
                                                <button className={`${styles.button} ${styles.danger}`} onClick={() => deleteMutation.mutate(id)} type="button">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {isLoading && <div className={styles.empty}>Loading series...</div>}
                {!isLoading && !data.length && <div className={styles.empty}>No series yet.</div>}
            </section>
        </DashboardShell>
    );
};

export default AdminSeriesPage;
