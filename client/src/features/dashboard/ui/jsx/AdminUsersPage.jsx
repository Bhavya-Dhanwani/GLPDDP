"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import DashboardShell from "./DashboardShell";
import { getUsers } from "../../api/dashboard.api";
import { useMakeUserAdmin } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const formatDate = (value) => {
    if (!value) return "N/A";
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
};

const AdminUsersPage = () => {
    const router = useRouter();
    const { isInitialized, user } = useSelector((state) => state.auth);
    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const usersQuery = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        enabled: isSuperAdmin,
    });
    const makeAdminMutation = useMakeUserAdmin();
    const users = usersQuery.data || [];
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("ALL");
    const filteredUsers = users.filter((item) => {
        const matchesSearch =
            !search ||
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = role === "ALL" || item.role === role;
        return matchesSearch && matchesRole;
    });
    const roles = [...new Set(users.map((item) => item.role).filter(Boolean))];

    useEffect(() => {
        if (isInitialized && !isSuperAdmin) {
            router.replace("/dashboard");
        }
    }, [isInitialized, isSuperAdmin, router]);

    if (isInitialized && !isSuperAdmin) {
        return null;
    }

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>Users</h1>
                    <p className={styles.muted}>View platform users and promote scorers to admin.</p>
                </div>
            </div>
            <section className={styles.card}>
                <div className={styles.filterRow}>
                    <input
                        className={`${styles.input} ${styles.filterField}`}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name or email"
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
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Provider</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((item) => {
                                const id = item.id || item._id;
                                const canPromote = item.role !== "ADMIN" && item.role !== "SUPER_ADMIN";

                                return (
                                    <tr key={id}>
                                        <td>
                                            <span className={styles.truncateCell} title={item.name}>
                                                {item.name}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.truncateCell} title={item.email}>
                                                {item.email}
                                            </span>
                                        </td>
                                        <td>{item.role}</td>
                                        <td>{item.isVerified ? "Verified" : "Unverified"}</td>
                                        <td>{item.provider || "local"}</td>
                                        <td>{formatDate(item.createdAt)}</td>
                                        <td>
                                            <button
                                                className={styles.button}
                                                disabled={!canPromote || makeAdminMutation.isPending}
                                                onClick={() => makeAdminMutation.mutate(id)}
                                                type="button"
                                            >
                                                {canPromote ? "Make admin" : "Admin"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {usersQuery.isLoading && <div className={styles.empty}>Loading users...</div>}
                {!usersQuery.isLoading && !filteredUsers.length && <div className={styles.empty}>No users found.</div>}
            </section>
        </DashboardShell>
    );
};

export default AdminUsersPage;
