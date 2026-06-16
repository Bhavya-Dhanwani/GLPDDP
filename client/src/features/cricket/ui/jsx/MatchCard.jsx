import Link from "next/link";
import styles from "../css/Cricket.module.css";

const idOf = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (value.$oid) return String(value.$oid);
    if (value.id) return idOf(value.id);
    if (value._id) return idOf(value._id);
    return "";
};

const TeamBlock = ({ team }) => {
    const label = team?.shortName || "TBA";
    const fallback = label.slice(0, 3).toUpperCase();

    return (
        <div className={styles.matchupTeam}>
            <div className={styles.matchupLogo}>
                {team?.logo ? <img src={team.logo} alt={team.name || label} /> : <span>{fallback}</span>}
            </div>
            <strong className={styles.truncate} title={label}>
                {label}
            </strong>
        </div>
    );
};

const getStatusLabel = (status) => {
    if (status === "LIVE" || status === "COMPLETED" || status === "UPCOMING") return status;
    if (status === "INNINGS_BREAK") return "LIVE";
    if (status === "TOSS_COMPLETED" || status === "PLAYING_XI_SELECTED") return "UPCOMING";
    return status || "UPCOMING";
};

const MatchCard = ({ match }) => {
    const status = getStatusLabel(match.liveSnapshot?.match?.status || match.status);

    return (
        <article className={`${styles.card} ${styles.matchCard} ${styles.simpleMatchCard}`}>
            <span className={`${styles.matchStatusTag} ${styles[`matchStatus${status}`] || ""}`}>{status}</span>
            <div className={styles.matchupRow}>
                <TeamBlock team={match.team1} />
                <div className={styles.matchupVs}>vs</div>
                <TeamBlock team={match.team2} />
            </div>
            <Link href={`/matches/${idOf(match)}`} className={styles.button}>
                View Match
            </Link>
        </article>
    );
};

export default MatchCard;
