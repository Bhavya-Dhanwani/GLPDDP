"use client";

import { useMemo, useState } from "react";
import PublicShell from "./PublicShell";
import PageHeader from "./PageHeader";
import MatchCard from "./MatchCard";
import StateBlock from "./StateBlock";
import Tabs from "./Tabs";
import { useMatches } from "../../hooks/useCricketQueries";
import styles from "../css/Cricket.module.css";

const tabs = [
    { label: "All Matches", value: "ALL" },
    { label: "Live", value: "LIVE" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Completed", value: "COMPLETED" },
];

const MatchesListPage = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const { data = [], isLoading, isError } = useMatches(search ? { title: search } : {});

    const matches = useMemo(
        () => data.filter((item) => status === "ALL" || item.status === status),
        [data, status]
    );

    return (
        <PublicShell>
            <PageHeader
                title="Matches"
                subtitle="Stay updated with live, upcoming and completed matches."
                search={search}
                onSearch={setSearch}
                placeholder="Search matches, teams, venues..."
            />
            <Tabs items={tabs} active={status} onChange={setStatus} />
            {isLoading && <StateBlock type="loading">Loading matches...</StateBlock>}
            {isError && <StateBlock>Unable to load matches.</StateBlock>}
            {!isLoading && !isError && (
                <div className={styles.stack}>
                    {matches.map((item) => (
                        <MatchCard key={item.id || item._id} match={item} />
                    ))}
                    {!matches.length && <StateBlock>No matches found.</StateBlock>}
                </div>
            )}
        </PublicShell>
    );
};

export default MatchesListPage;
