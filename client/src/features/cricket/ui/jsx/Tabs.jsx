import styles from "../css/Cricket.module.css";

const Tabs = ({ items, active, onChange }) => (
    <div className={styles.tabs}>
        {items.map((item) => (
            <button
                key={item.value}
                className={`${styles.tab} ${active === item.value ? styles.tabActive : ""}`}
                onClick={() => onChange(item.value)}
                type="button"
            >
                {item.label}
            </button>
        ))}
    </div>
);

export default Tabs;
