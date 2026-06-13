import styles from "../css/Button.module.css";


export default function Button({
  children,
  variant = "primary",
  onClick,
}) {
  return (
    <button
      className={styles[variant]}
      onClick={onClick}
    >
      {children}
    </button>
  );
}