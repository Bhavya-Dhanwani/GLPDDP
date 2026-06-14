import styles from "../css/AuthHeading.module.css";

const AuthHeading = ({ children }) => {
    return (
        <h1 className={styles.heading}>
            {children}
        </h1>
    );
};

export default AuthHeading;