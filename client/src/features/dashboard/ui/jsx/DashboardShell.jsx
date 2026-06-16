"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CalendarPlus,
    ChevronDown,
    Eye,
    ListPlus,
    LogOut,
    PlusCircle,
    Trophy,
    UserPlus,
    Users,
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
    const logoutMutation = useLogout();

    return (
        <DashboardGuard>
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <Link href="/dashboard" className={styles.brand}>
                    <span className={styles.brandMark}>G</span>
                    <span>GLPDDP Admin</span>
                </Link>
                {groups.map((group) => {
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
