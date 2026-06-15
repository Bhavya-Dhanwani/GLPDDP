import styles from "../css/Cricket.module.css";

const StateBlock = ({ type = "empty", children }) => (
    <div className={type === "loading" ? styles.loader : styles.empty}>
        {children}
    </div>
);

export default StateBlock;
