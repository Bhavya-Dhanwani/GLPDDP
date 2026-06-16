"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
    CalendarPlus,
    ChevronDown,
    Eye,
    ListPlus,
    LogOut,
    Menu,
    PlusCircle,
    Trophy,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import DashboardGuard from "./DashboardGuard";
import styles from "../css/Dashboard.module.css";

const groups = [
    {
        title: "Series",
        icon: Trophy,
        items: [
            { href: "/dashboard/series", label: "View Series", icon: Eye },
            { href: "/dashboard/series/add", label: "Add Series", icon: PlusCircle },
        ],
    },
    {
        title: "Matches",
        icon: CalendarPlus,
        items: [
            { href: "/dashboard/matches", label: "View Matches", icon: Eye },
            { href: "/dashboard/matches/add", label: "Add Match", icon: PlusCircle },
        ],
    },
    {
        title: "Players",
        icon: UserPlus,
        items: [
            { href: "/dashboard/players", label: "View Players", icon: Eye },
            { href: "/dashboard/players/add", label: "Add Player", icon: PlusCircle },
        ],
    },
    {
        title: "Teams",
        icon: Users,
        items: [
            { href: "/dashboard/teams", label: "View Teams", icon: Eye },
            { href: "/dashboard/teams/add", label: "Add Team", icon: PlusCircle },
        ],
    },
    {
        title: "Site",
        icon: Users,
        items: [{ href: "/", label: "Public Website", icon: Users }],
    },
];

const DashboardShell = ({ children }) => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const logoutMutation = useLogout();
    const user = useSelector((state) => state.auth.user);
    const visibleGroups = user?.role === "SUPER_ADMIN"
        ? [
            ...groups.slice(0, 4),
            {
                title: "Users",
                icon: Users,
                items: [{ href: "/dashboard/users", label: "View Users", icon: Eye }],
            },
            ...groups.slice(4),
        ]
        : groups;

    return (
        <DashboardGuard>
        <div className={`${styles.layout} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
            <aside className={styles.sidebar} aria-label="Dashboard navigation">
                <Link href="/dashboard" className={styles.brand}>
                    <span className={styles.brandMark}>G</span>
                    <span>GLPDDP Admin</span>
                </Link>
                <button
                    aria-label="Close navigation"
                    className={styles.sidebarClose}
                    onClick={() => setIsSidebarOpen(false)}
                    type="button"
                >
                    <X size={18} />
                </button>
                {visibleGroups.map((group) => {
                    const GroupIcon = group.icon;

                    return (
                    <nav className={styles.navGroup} key={group.title}>
                        <span className={styles.navTitle}>
                            <GroupIcon size={15} />
                            <span className={styles.truncate}>{group.title}</span>
                            <ChevronDown size={14} />
                        </span>
                        {group.items.map((item) => {
                            const Icon = item.icon || ListPlus;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                    title={item.label}
                                >
                                    <Icon size={18} />
                                    <span className={styles.truncate}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                    );
                })}
            </aside>
            <section className={styles.content}>
                <header className={styles.topbar}>
                    <button
                        aria-expanded={isSidebarOpen}
                        aria-label="Open navigation"
                        className={styles.menuButton}
                        onClick={() => setIsSidebarOpen(true)}
                        type="button"
                    >
                        <Menu size={20} />
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => logoutMutation.mutate()}
                        type="button"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </header>
                <main className={styles.main}>{children}</main>
            </section>
        </div>
        </DashboardGuard>
    );
};

export default DashboardShell;
