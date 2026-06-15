"use client";

import { useMemo, useState } from "react";
import PublicShell from "./PublicShell";
import PageHeader from "./PageHeader";
import PlayerCard from "./PlayerCard";
import StateBlock from "./StateBlock";
import Tabs from "./Tabs";
import { usePlayers } from "../../hooks/useCricketQueries";
import styles from "../css/Cricket.module.css";

const tabs = [
    { label: "All Players", value: "ALL" },
    { label: "Batsmen", value: "BATSMAN" },
    { label: "Bowlers", value: "BOWLER" },
    { label: "All-rounders", value: "ALL_ROUNDER" },
    { label: "Wicket Keepers", value: "WICKET_KEEPER" },
];

const PlayersListPage = () => {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("ALL");
    const { data = [], isLoading, isError } = usePlayers(role === "ALL" ? {} : { role });

    const players = useMemo(
        () =>
            data.filter((player) =>
                player.name?.toLowerCase().includes(search.toLowerCase())
            ),
        [data, search]
    );

    return (
        <PublicShell>
            <PageHeader
                title="Players"
                subtitle="Explore player profiles and cricket details."
                search={search}
                onSearch={setSearch}
                placeholder="Search players by name, team, country..."
            />
            <Tabs items={tabs} active={role} onChange={setRole} />
            {isLoading && <StateBlock type="loading">Loading players...</StateBlock>}
            {isError && <StateBlock>Unable to load players.</StateBlock>}
            {!isLoading && !isError && (
                <div className={styles.grid}>
                    {players.map((item) => (
                        <PlayerCard key={item.id || item._id} player={item} />
                    ))}
                    {!players.length && <StateBlock>No players found.</StateBlock>}
                </div>
            )}
        </PublicShell>
    );
};

export default PlayersListPage;
