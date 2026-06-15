import AuthNav from "./AuthNav";

import styles from "../css/VerifyEmailStructure.module.css";

const VerifyEmailStructure = ({
    children
}) => {
    return (
        <main className={styles.wrapper}>
            <AuthNav />

            <div
                className={
                    styles.container
                }
            >
                {children}
            </div>
        </main>
    );
};

export default VerifyEmailStructure;