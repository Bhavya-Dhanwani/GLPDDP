"use client";

import { useMemo, useState } from "react";
import PublicShell from "./PublicShell";
import PageHeader from "./PageHeader";
import SeriesCard from "./SeriesCard";
import StateBlock from "./StateBlock";
import Tabs from "./Tabs";
import { useSeries } from "../../hooks/useCricketQueries";
import styles from "../css/Cricket.module.css";

const tabs = [
    { label: "All Series", value: "ALL" },
    { label: "Live", value: "LIVE" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Completed", value: "COMPLETED" },
];

const SeriesListPage = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const { data = [], isLoading, isError } = useSeries(search ? { name: search } : {});

    const series = useMemo(
        () => data.filter((item) => status === "ALL" || item.status === status),
        [data, status]
    );

    return (
        <PublicShell>
            <PageHeader
                title="Series"
                subtitle="Explore cricket series and tournaments."
                search={search}
                onSearch={setSearch}
                placeholder="Search series, tournaments..."
            />
            <Tabs items={tabs} active={status} onChange={setStatus} />
            {isLoading && <StateBlock type="loading">Loading series...</StateBlock>}
            {isError && <StateBlock>Unable to load series.</StateBlock>}
            {!isLoading && !isError && (
                <div className={styles.stack}>
                    {series.map((item) => (
                        <SeriesCard key={item.id || item._id} series={item} />
                    ))}
                    {!series.length && <StateBlock>No series found.</StateBlock>}
                </div>
            )}
        </PublicShell>
    );
};

export default SeriesListPage;
