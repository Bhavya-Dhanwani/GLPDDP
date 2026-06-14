import styles from "../css/Seperator.module.css";

const Separator = ({
    text = "OR"
}) => {
    return (
        <div className={styles.separator}>
            <div className={styles.line} />

            <span>{text}</span>

            <div className={styles.line} />
        </div>
    );
};

export default Separator;