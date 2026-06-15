import styles from "../css/Dashboard.module.css";

const FormField = ({ label, children, full = false }) => (
    <label className={`${styles.field} ${full ? styles.full : ""}`}>
        <span className={styles.label}>{label}</span>
        {children}
    </label>
);

export default FormField;
