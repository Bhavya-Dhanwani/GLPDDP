import styles from "../css/AuthSubHeading.module.css";

const AuthSubHeading = ({ children }) => {
    return (
        <p className={styles.subHeading}>
            {children}
        </p>
    );
};

export default AuthSubHeading;