import { Search } from "lucide-react";
import styles from "../css/Cricket.module.css";

const PageHeader = ({ title, subtitle, search, onSearch, placeholder }) => (
    <section className={styles.pageHead}>
        <div>
            <h1 className={styles.pageTitle}>{title}</h1>
            <p className={styles.muted}>{subtitle}</p>
        </div>
        {onSearch && (
            <div className={styles.toolbar}>
                <label className={styles.search}>
                    <Search size={20} />
                    <input
                        value={search}
                        onChange={(event) => onSearch(event.target.value)}
                        placeholder={placeholder}
                    />
                </label>
            </div>
        )}
    </section>
);

export default PageHeader;
