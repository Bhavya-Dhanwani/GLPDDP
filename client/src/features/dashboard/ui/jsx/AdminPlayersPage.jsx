"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardShell from "./DashboardShell";
import { usePlayers } from "@/features/cricket/hooks/useCricketQueries";
import { useDeletePlayer } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminPlayersPage = () => {
    const { data = [], isLoading } = usePlayers();
    const deleteMutation = useDeletePlayer();
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("ALL");
    const filteredPlayers = data.filter((item) => {
        const roles = (item.role || []).join(", ");
        const matchesSearch =
            !search ||
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.country?.toLowerCase().includes(search.toLowerCase()) ||
            roles.toLowerCase().includes(search.toLowerCase());
        const matchesRole = role === "ALL" || (item.role || []).includes(role);
        return matchesSearch && matchesRole;
    });
    const roles = [...new Set(data.flatMap((item) => item.role || []))];

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
                <div className={styles.filterRow}>
                    <input
                        className={`${styles.input} ${styles.filterField}`}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, country, or role"
                        value={search}
                    />
                    <select
                        className={`${styles.select} ${styles.filterSelect}`}
                        onChange={(event) => setRole(event.target.value)}
                        value={role}
                    >
                        <option value="ALL">All roles</option>
                        {roles.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
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
                            {filteredPlayers.map((item) => {
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
                {!isLoading && !filteredPlayers.length && <div className={styles.empty}>No players found.</div>}
            </section>
        </DashboardShell>
    );
};

export default AdminPlayersPage;
