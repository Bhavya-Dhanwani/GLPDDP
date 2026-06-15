import styles from "../css/Cricket.module.css";

const StatusBadge = ({ status }) => {
    const value = status || "DRAFT";
    const className =
        value === "UPCOMING"
            ? styles.badgeWarning
            : value === "COMPLETED" || value === "DRAFT"
              ? styles.badgeMuted
              : "";

    return (
        <span className={`${styles.badge} ${className}`}>
            {value.replaceAll("_", " ")}
        </span>
    );
};

export default StatusBadge;
