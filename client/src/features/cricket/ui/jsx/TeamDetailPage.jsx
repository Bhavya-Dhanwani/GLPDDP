"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Shield, Shirt, Users } from "lucide-react";
import PublicShell from "./PublicShell";
import StateBlock from "./StateBlock";
import StatusBadge from "./StatusBadge";
import { useTeamDetail } from "../../hooks/useCricketQueries";
import styles from "../css/Cricket.module.css";

const getRoles = (player) => (player?.role || []).join(", ") || "Player";

const TeamDetailPage = () => {
    const { id } = useParams();
    const { data: team, isLoading, isError } = useTeamDetail(id);
    const squad = team?.squadPlayers || [];

    return (
        <PublicShell>
            <Link href="/teams" className={styles.back}>
                Back to Teams
            </Link>
            {isLoading && <StateBlock type="loading">Loading team...</StateBlock>}
            {isError && <StateBlock>Unable to load this team.</StateBlock>}
            {team && (
                <div className={styles.detailGrid}>
                    <div className={styles.stack}>
                        <section className={`${styles.card} ${styles.heroCard}`}>
                            <div
                                className={`${styles.teamLogo} ${styles.teamLogoLarge}`}
                                style={{ backgroundColor: team.primaryColor || undefined }}
                            >
                                {team.logo ? <img src={team.logo} alt={team.name} /> : <span>{team.shortName}</span>}
                            </div>
                            <div className={styles.stack}>
                                <StatusBadge status={team.shortName} />
                                <h1 className={styles.wrapText}>{team.name}</h1>
                                <p className={`${styles.muted} ${styles.wrapText}`}>
                                    Team profile, squad and player roles for {team.name}.
                                </p>
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <strong>{squad.length}</strong>
                                    <span className={styles.muted}>Players</span>
                                </div>
                            </div>
                        </section>

                        <section className={`${styles.card} ${styles.sidePanel}`}>
                            <h2>Squad</h2>
                            {squad.length ? (
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Player</th>
                                                <th>Role</th>
                                                <th>Batting</th>
                                                <th>Bowling</th>
                                                <th>Profile</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {squad.map((player) => {
                                                const playerId = player._id || player.id;
                                                const roles = getRoles(player);

                                                return (
                                                    <tr key={playerId}>
                                                        <td>
                                                            <div className={styles.tablePlayer}>
                                                                <span className={styles.tableAvatar}>
                                                                    {player.image ? <img src={player.image} alt={player.name} /> : player.name?.charAt(0)}
                                                                </span>
                                                                <strong className={styles.truncateCell} title={player.name}>{player.name}</strong>
                                                            </div>
                                                        </td>
                                                        <td>{roles}</td>
                                                        <td>{player.battingStyle || "N/A"}</td>
                                                        <td>{player.bowlingStyle || "N/A"}</td>
                                                        <td>
                                                            <Link className={styles.button} href={`/players/${playerId}`}>
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <StateBlock>No squad players added yet.</StateBlock>
                            )}
                        </section>
                    </div>

                    <aside className={`${styles.card} ${styles.sidePanel}`}>
                        <h2>Team Details</h2>
                        <div className={styles.metaList}>
                            <div className={styles.metaItem}>
                                <span>
                                    <Shield size={16} /> Name
                                </span>
                                <strong className={styles.wrapText}>{team.name}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <Shirt size={16} /> Short Name
                                </span>
                                <strong>{team.shortName}</strong>
                            </div>
                            <div className={styles.metaItem}>
                                <span>
                                    <Users size={16} /> Squad
                                </span>
                                <strong>{squad.length} player{squad.length === 1 ? "" : "s"}</strong>
                            </div>
                            {team.primaryColor && (
                                <div className={styles.metaItem}>
                                    <span>Primary Color</span>
                                    <strong className={styles.colorValue}>
                                        <i style={{ backgroundColor: team.primaryColor }} />
                                        {team.primaryColor}
                                    </strong>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            )}
        </PublicShell>
    );
};

export default TeamDetailPage;
