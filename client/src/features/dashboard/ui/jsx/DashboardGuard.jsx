"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import styles from "../css/Dashboard.module.css";

const allowedRoles = new Set(["ADMIN", "SUPER_ADMIN"]);

const DashboardGuard = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, isInitialized, user } = useSelector((state) => state.auth);
    const isAllowed = allowedRoles.has(user?.role);

    useEffect(() => {
        if (!isInitialized) return;

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (!isAllowed) {
            router.replace("/");
        }
    }, [isAllowed, isAuthenticated, isInitialized, router]);

    if (!isInitialized) {
        return <div className={styles.guardState}>Checking dashboard access...</div>;
    }

    if (!isAuthenticated || !isAllowed) {
        return null;
    }

    return children;
};

export default DashboardGuard;
