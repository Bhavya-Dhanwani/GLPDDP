import styles from "../css/Button.module.css";

const Button = ({
    children,
    variant = "primary",
    type = "button",
    icon,
    onClick,
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ""}`}
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