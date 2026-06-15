import Link from "next/link";
import StatusBadge from "./StatusBadge";
import styles from "../css/Cricket.module.css";

const PlayerCard = ({ player }) => {
    const roles = (player.role || []).join(", ");
    const summary = `${roles} - ${player.country}`;

    return (
        <article className={`${styles.card} ${styles.playerCard}`}>
            <div className={styles.avatar}>
                {player.image ? <img src={player.image} alt={player.name} /> : player.name?.charAt(0)}
            </div>
            <div>
                <h2 className={styles.lineClamp} title={player.name}>{player.name}</h2>
                <p className={`${styles.muted} ${styles.wrapText}`}>
                    {summary}
                </p>
            </div>
            <div className={styles.playerStats}>
                <div>
                    <StatusBadge status={player.battingStyle} />
                    <p className={styles.muted}>Batting</p>
                </div>
                <div>
                    <StatusBadge status={player.bowlingStyle} />
                    <p className={styles.muted}>Bowling</p>
                </div>
                <div>
                    <StatusBadge status={(player.role || [])[0]} />
                    <p className={styles.muted}>Role</p>
                </div>
            </div>
            <Link href={`/players/${player._id || player.id}`} className={styles.button}>
                View Profile
            </Link>
        </article>
    );
};

export default PlayerCard;
