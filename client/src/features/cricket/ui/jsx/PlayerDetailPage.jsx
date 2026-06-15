"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck, Flag, Shield, User } from "lucide-react";
import PublicShell from "./PublicShell";
import StateBlock from "./StateBlock";
import StatusBadge from "./StatusBadge";
import styles from "../css/Cricket.module.css";
import { usePlayerDetail } from "../../hooks/useCricketQueries";

const PlayerDetailPage = () => {
    const { id } = useParams();
    const { data: player, isLoading, isError } = usePlayerDetail(id);
    const roles = (player?.role || []).join(", ");

    return (
        <PublicShell>
            <Link href="/players" className={styles.back}>
                Back to Players
            </Link>
            {isLoading && <StateBlock type="loading">Loading player...</StateBlock>}
            {isError && <StateBlock>Unable to load this player.</StateBlock>}
            {player && (
                <div className={styles.detailGrid}>
                    <div className={styles.stack}>
                        <section className={`${styles.card} ${styles.heroCard}`}>
                            <div className={styles.avatar}>
                                {player.image ? (
                                    <img src={player.image} alt={player.name} />
                                ) : (
                                    player.name?.charAt(0)
                                )}
                            </div>
                            <div className={styles.stack}>
                                <h1 className={styles.wrapText}>
                                    {player.name} <BadgeCheck size={22} color="#00843d" />
                                </h1>
                                <p className={`${styles.muted} ${styles.wrapText}`}>
                                    {player.country} - {roles}
                                </p>
                                <div className={styles.toolbar}>
                                    {(player.role || []).map((role) => (
                                        <StatusBadge key={role} status={role} />
                                    ))}
                                </div>
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <strong className={styles.wrapText}>
                                        {player.battingStyle}
                                    </strong>
                                    <span className={styles.muted}>Batting</span>
                                </div>
                            </div>
                        </section>

                        <section className={`${styles.card} ${styles.sidePanel}`}>
                            <h2>Career Details</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Attribute</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Country</td>
                                            <td>{player.country}</td>
                                        </tr>
                                        <tr>
                                            <td>Role</td>
                                            <td>{roles}</td>
                                        </tr>
                                        <tr>
                                            <td>Batting Style</td>
                                            <td>{player.battingStyle}</td>
                                        </tr>
                                        <tr>
                                            <td>Bowling Style</td>
                                            <td>{player.bowlingStyle}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <aside className={`${styles.card} ${styles.sidePanel}`}>
                        <h2>Personal Information</h2>
                        <div className={styles.metaList}>
                            <div className={styles.metaItem}>
                                <span>
                                    <User size={16} /> Full Name
                                </span>
                                <strong className={styles.wrapText}>{player.name}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <Flag size={16} /> Nationality
                                </span>
                                <strong className={styles.wrapText}>{player.country}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <Shield size={16} /> Role
                                </span>
                                <strong className={styles.wrapText}>{roles}</strong>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </PublicShell>
    );
};

export default PlayerDetailPage;
