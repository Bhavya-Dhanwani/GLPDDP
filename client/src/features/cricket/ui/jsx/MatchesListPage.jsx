"use client";

import { useMemo, useState } from "react";
import PublicShell from "./PublicShell";
import PageHeader from "./PageHeader";
import MatchCard from "./MatchCard";
import StateBlock from "./StateBlock";
import Tabs from "./Tabs";
import { useMatches } from "../../hooks/useCricketQueries";
import { useLiveMatchRooms } from "../../hooks/useLiveMatchSocket";
import styles from "../css/Cricket.module.css";

const tabs = [
    { label: "All Matches", value: "ALL" },
    { label: "Live", value: "LIVE" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Completed", value: "COMPLETED" },
];

const idOf = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (value.$oid) return String(value.$oid);
    if (value.id) return idOf(value.id);
    if (value._id) return idOf(value._id);
    return "";
};

const MatchesListPage = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const { data = [], isLoading, isError } = useMatches(search ? { title: search } : {});

    const matchIds = useMemo(() => data.map((item) => idOf(item)), [data]);
    const liveSnapshots = useLiveMatchRooms(matchIds, { enabled: !isLoading && !isError });

    const snapshotsByMatchId = useMemo(
        () =>
            new Map(
                (liveSnapshots || [])
                    .map((snapshot) => [idOf(snapshot?.match), snapshot])
                    .filter(([matchId]) => Boolean(matchId))
            ),
        [liveSnapshots]
    );
    const displayMatches = useMemo(
        () =>
            data.map((item) => {
                const liveSnapshot = snapshotsByMatchId.get(idOf(item)) || item.liveSnapshot;
                return {
                    ...item,
                    ...(liveSnapshot?.match || {}),
                    liveSnapshot,
                };
            }),
        [data, snapshotsByMatchId]
    );
    const matches = useMemo(
        () => displayMatches.filter((item) => status === "ALL" || item.status === status),
        [displayMatches, status]
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
                        <MatchCard key={idOf(item)} match={item} />
                    ))}
                    {!matches.length && <StateBlock>No matches found.</StateBlock>}
                </div>
            )}
        </PublicShell>
    );
};

export default MatchesListPage;
