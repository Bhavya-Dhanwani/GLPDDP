"use client";

import { useMemo, useState } from "react";
import FormField from "./FormField";
import styles from "../css/Dashboard.module.css";

const emptyForm = {
    seriesId: "",
    title: "",
    matchNumber: "",
    venue: "",
    city: "",
    country: "",
    startTime: "",
    matchType: "T20",
    status: "DRAFT",
    team1: "",
    team2: "",
    playingXI: {
        team1: [],
        team2: [],
    },
};

const matchStatuses = [
    "DRAFT",
    "UPCOMING",
    "TOSS_COMPLETED",
    "PLAYING_XI_SELECTED",
    "LIVE",
    "INNINGS_BREAK",
    "COMPLETED",
    "ABANDONED",
    "NO_RESULT",
];

const formatLabel = (value) =>
    value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const toDateTimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
};

const idOf = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (value.$oid) return String(value.$oid);
    if (value.id) return idOf(value.id);
    if (value._id) return idOf(value._id);
    return "";
};

const prepareInitialValues = (initialValues) =>
    initialValues
        ? {
              ...emptyForm,
              ...initialValues,
              seriesId: initialValues.series?.id || initialValues.series?._id || initialValues.seriesId || "",
              team1: initialValues.team1?._id || initialValues.team1?.id || initialValues.team1 || "",
              team2: initialValues.team2?._id || initialValues.team2?.id || initialValues.team2 || "",
              startTime: toDateTimeLocal(initialValues.startTime),
              playingXI: {
                  team1: (initialValues.playingXI?.team1 || []).map((item) => idOf(item.player)).filter(Boolean),
                  team2: (initialValues.playingXI?.team2 || []).map((item) => idOf(item.player)).filter(Boolean),
              },
          }
        : emptyForm;

const MatchForm = ({ initialValues, series = [], teams = [], onSubmit, isSubmitting }) => {
    const [form, setForm] = useState(prepareInitialValues(initialValues));
    const [formError, setFormError] = useState("");
    const teamsById = useMemo(() => new Map(teams.map((team) => [idOf(team), team])), [teams]);
    const team1 = teamsById.get(idOf(form.team1));
    const team2 = teamsById.get(idOf(form.team2));
    const team1Squad = team1?.squadPlayers || [];
    const team2Squad = team2?.squadPlayers || [];

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const updateTeam = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
            playingXI: {
                ...current.playingXI,
                [field]: [],
            },
        }));
    };

    const toggleXIPlayer = (teamKey, playerId) => {
        setForm((current) => {
            const currentXI = current.playingXI[teamKey] || [];
            const hasPlayer = currentXI.includes(playerId);
            const nextXI = hasPlayer
                ? currentXI.filter((id) => id !== playerId)
                : currentXI.length < 11
                  ? [...currentXI, playerId]
                  : currentXI;

            return {
                ...current,
                playingXI: {
                    ...current.playingXI,
                    [teamKey]: nextXI,
                },
            };
        });
    };

    const buildPlayingXI = (playerIds) =>
        playerIds.map((player, index) => ({
            player,
            isCaptain: index === 0,
            isWicketKeeper: index === 1,
        }));

    const submit = (event) => {
        event.preventDefault();
        setFormError("");

        if (form.playingXI.team1.length !== 11 || form.playingXI.team2.length !== 11) {
            setFormError("Select exactly 11 players for both teams before saving the match.");
            return;
        }

        const payload = {
            ...form,
            playingXI: {
                team1: buildPlayingXI(form.playingXI.team1),
                team2: buildPlayingXI(form.playingXI.team2),
            },
            startTime: new Date(form.startTime).toISOString(),
        };
        onSubmit(payload);
        if (!initialValues) {
            setForm(emptyForm);
        }
    };

    return (
        <form className={`${styles.card} ${styles.form}`} onSubmit={submit}>
            <FormField label="Series">
                <select
                    className={styles.select}
                    value={form.seriesId}
                    onChange={(event) => update("seriesId", event.target.value)}
                    required
                >
                    <option value="">Select series</option>
                    {series.map((item) => (
                        <option key={item.id || item._id} value={item.id || item._id} title={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </FormField>
            <FormField label="Match Type">
                <select
                    className={styles.select}
                    value={form.matchType}
                    onChange={(event) => update("matchType", event.target.value)}
                >
                    {["ODI", "T20"].map((type) => (
                        <option key={type} value={type}>{formatLabel(type)}</option>
                    ))}
                </select>
            </FormField>
            {initialValues && (
                <FormField label="Status">
                    <select
                        className={styles.select}
                        value={form.status}
                        onChange={(event) => update("status", event.target.value)}
                    >
                        {matchStatuses.map((status) => (
                            <option key={status} value={status}>{formatLabel(status)}</option>
                        ))}
                    </select>
                </FormField>
            )}
            <FormField label="Title">
                <input className={styles.input} value={form.title} onChange={(event) => update("title", event.target.value)} />
            </FormField>
            <FormField label="Match Number">
                <input className={styles.input} value={form.matchNumber} onChange={(event) => update("matchNumber", event.target.value)} />
            </FormField>
            <FormField label="Team 1">
                <select className={styles.select} value={form.team1} onChange={(event) => updateTeam("team1", event.target.value)} required>
                    <option value="">Select team</option>
                    {teams.map((team) => (
                        <option key={team.id || team._id} value={team.id || team._id} title={team.name}>{team.name}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Team 2">
                <select className={styles.select} value={form.team2} onChange={(event) => updateTeam("team2", event.target.value)} required>
                    <option value="">Select team</option>
                    {teams.map((team) => (
                        <option key={team.id || team._id} value={team.id || team._id} title={team.name}>{team.name}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Venue">
                <input className={styles.input} value={form.venue} onChange={(event) => update("venue", event.target.value)} required />
            </FormField>
            <FormField label="Start Time">
                <input className={styles.input} value={form.startTime} onChange={(event) => update("startTime", event.target.value)} required type="datetime-local" />
            </FormField>
            <FormField label="City">
                <input className={styles.input} value={form.city} onChange={(event) => update("city", event.target.value)} />
            </FormField>
            <FormField label="Country">
                <input className={styles.input} value={form.country} onChange={(event) => update("country", event.target.value)} />
            </FormField>
            {form.team1 && (
                <FormField label={`${team1?.name || "Team 1"} Playing XI (${form.playingXI.team1.length}/11)`} full>
                    <div className={styles.pickGrid}>
                        {team1Squad.map((player) => {
                            const playerId = idOf(player);
                            const active = form.playingXI.team1.includes(playerId);
                            return (
                                <button
                                    className={`${styles.pickCard} ${active ? styles.pickCardActive : ""}`}
                                    key={playerId}
                                    onClick={() => toggleXIPlayer("team1", playerId)}
                                    type="button"
                                >
                                    <strong>{player.name}</strong>
                                    <span>{(player.role || []).join(", ") || "Player"}</span>
                                </button>
                            );
                        })}
                        {!team1Squad.length && <div className={styles.empty}>This team has no squad players.</div>}
                    </div>
                </FormField>
            )}
            {form.team2 && (
                <FormField label={`${team2?.name || "Team 2"} Playing XI (${form.playingXI.team2.length}/11)`} full>
                    <div className={styles.pickGrid}>
                        {team2Squad.map((player) => {
                            const playerId = idOf(player);
                            const active = form.playingXI.team2.includes(playerId);
                            return (
                                <button
                                    className={`${styles.pickCard} ${active ? styles.pickCardActive : ""}`}
                                    key={playerId}
                                    onClick={() => toggleXIPlayer("team2", playerId)}
                                    type="button"
                                >
                                    <strong>{player.name}</strong>
                                    <span>{(player.role || []).join(", ") || "Player"}</span>
                                </button>
                            );
                        })}
                        {!team2Squad.length && <div className={styles.empty}>This team has no squad players.</div>}
                    </div>
                </FormField>
            )}
            {formError && <div className={`${styles.empty} ${styles.full}`}>{formError}</div>}
            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.primary}`} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Match"}
                </button>
            </div>
        </form>
    );
};

export default MatchForm;
