"use client";

import Navbar from "@/components/layout/Navbar";
import styles from "../css/Cricket.module.css";

const PublicShell = ({ children, contentClassName = "" }) => {
    return (
        <div className={styles.shell}>
            <Navbar />
            <main className={`${styles.main} ${contentClassName}`}>{children}</main>
        </div>
    );
};

export default PublicShell;
