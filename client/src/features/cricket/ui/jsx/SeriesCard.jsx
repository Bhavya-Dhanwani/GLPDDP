import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "../css/Cricket.module.css";

const SeriesCard = ({ series }) => (
    <article className={`${styles.card} ${styles.seriesCard}`}>
        <div className={styles.banner}>
            {series.logo ? (
                <img src={series.logo} alt={series.name} />
            ) : (
                <span className={styles.lineClamp} title={series.shortName || series.name}>
                    {series.shortName || series.name}
                </span>
            )}
        </div>
        <div className={styles.stack}>
            <StatusBadge status={series.status} />
            <h2 className={styles.truncate} title={series.name}>{series.name}</h2>
            <p className={styles.muted}>
                <CalendarDays size={16} /> Season {series.season}
                <span> - </span>
                <MapPin size={16} /> Cricket series
            </p>
            <p className={styles.muted}>
                Follow fixtures, results, squads and tournament details.
            </p>
        </div>
        <div className={styles.stats}>
            <div className={styles.stat}>
                <strong className={styles.truncate} title={series.shortName || "TBD"}>
                    {series.shortName || "TBD"}
                </strong>
                <span className={styles.muted}>Short name</span>
            </div>
            <Link href={`/series/${series.id || series._id}`} className={styles.button}>
                View Series
            </Link>
        </div>
    </article>
);

export default SeriesCard;
