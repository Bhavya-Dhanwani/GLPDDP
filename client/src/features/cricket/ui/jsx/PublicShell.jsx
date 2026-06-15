"use client";

import Navbar from "@/components/layout/Navbar";
import styles from "../css/Cricket.module.css";

const PublicShell = ({ children }) => {
    return (
        <div className={styles.shell}>
            <Navbar />
            <main className={styles.main}>{children}</main>
        </div>
    );
};

export default PublicShell;
