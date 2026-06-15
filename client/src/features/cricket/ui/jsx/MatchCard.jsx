import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "../css/Cricket.module.css";

const TeamBlock = ({ team }) => (
    <div className={styles.team}>
        <div className={styles.teamLogo}>
            {team?.logo ? <img src={team.logo} alt={team.name} /> : team?.shortName || "T"}
        </div>
        <div>
            <h3 className={styles.truncate} title={team?.name || "Team TBA"}>
                {team?.name || "Team TBA"}
            </h3>
            <p className={`${styles.muted} ${styles.truncate}`} title={team?.shortName || "TBA"}>
                {team?.shortName || "TBA"}
            </p>
        </div>
    </div>
);

const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
          }).format(new Date(value))
        : "Schedule TBA";

const MatchCard = ({ match }) => (
    <article className={`${styles.card} ${styles.matchCard}`}>
        <TeamBlock team={match.team1} />
        <div className={styles.centerScore}>
            <StatusBadge status={match.status} />
            <h3 className={styles.lineClamp} title={match.title || match.matchNumber || match.matchType}>
                {match.title || match.matchNumber || match.matchType}
            </h3>
            <p className={`${styles.muted} ${styles.truncate}`} title={match.series?.name || match.seriesId?.name}>
                {match.series?.name || match.seriesId?.name}
            </p>
            <strong>vs</strong>
        </div>
        <TeamBlock team={match.team2} />
        <div className={styles.stack}>
            <p className={styles.muted}>
                <CalendarDays size={16} /> {formatDate(match.startTime)}
            </p>
            <p className={`${styles.muted} ${styles.truncate}`} title={`${match.venue || ""}${match.city ? `, ${match.city}` : ""}`}>
                <MapPin size={16} /> {match.venue}
                {match.city ? `, ${match.city}` : ""}
            </p>
            <Link href={`/matches/${match.id || match._id}`} className={styles.button}>
                View Match
            </Link>
        </div>
    </article>
);

export default MatchCard;
