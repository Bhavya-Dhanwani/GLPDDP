import styles from "../css/Button.module.css";

const Button = ({
    children,
    variant = "primary",
    type = "button",
    icon,
    onClick
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${styles[variant]}`}
        >
            {icon && (
                <span className={styles.icon}>
                    {icon}
                </span>
            )}

            {children}
        </button>
    );
};

export default Button;