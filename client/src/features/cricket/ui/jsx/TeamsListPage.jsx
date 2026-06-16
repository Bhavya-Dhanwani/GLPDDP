"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PublicShell from "./PublicShell";
import PageHeader from "./PageHeader";
import StateBlock from "./StateBlock";
import styles from "../css/Cricket.module.css";
import { useTeams } from "../../hooks/useCricketQueries";

const TeamsListPage = () => {
    const [search, setSearch] = useState("");
    const { data = [], isLoading, isError } = useTeams();

    const teams = useMemo(
        () =>
            data.filter((team) =>
                team.name?.toLowerCase().includes(search.toLowerCase())
            ),
        [data, search]
    );

    return (
        <PublicShell>
            <PageHeader
                title="Teams"
                subtitle="Browse teams participating across GLPDDP cricket series."
                search={search}
                onSearch={setSearch}
                placeholder="Search teams..."
            />
            {isLoading && <StateBlock type="loading">Loading teams...</StateBlock>}
            {isError && <StateBlock>Unable to load teams.</StateBlock>}
            {!isLoading && !isError && (
                <div className={styles.grid}>
                    {teams.map((team) => (
                        <Link className={`${styles.card} ${styles.teamCard}`} href={`/teams/${team._id || team.id}`} key={team.id || team._id}>
                            <div className={styles.teamCardInner}>
                                <div className={styles.teamLogo}>
                                    {team.logo ? <img src={team.logo} alt={team.name} /> : <span>{team.shortName}</span>}
                                </div>
                                <div className={styles.teamCardInfo}>
                                    <h2>{team.name}</h2>
                                    <p className={styles.muted}>{team.shortName}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {!teams.length && <StateBlock>No teams found.</StateBlock>}
                </div>
            )}
        </PublicShell>
    );
};

export default TeamsListPage;
