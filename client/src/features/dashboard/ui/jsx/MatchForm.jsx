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

const emptyRoleMeta = {
    isCaptain: false,
    isWicketKeeper: false,
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
                  team1: (initialValues.playingXI?.team1 || [])
                      .map((item) => ({
                          player: idOf(item.player),
                          isCaptain: Boolean(item.isCaptain),
                          isWicketKeeper: Boolean(item.isWicketKeeper),
                      }))
                      .filter((item) => item.player),
                  team2: (initialValues.playingXI?.team2 || [])
                      .map((item) => ({
                          player: idOf(item.player),
                          isCaptain: Boolean(item.isCaptain),
                          isWicketKeeper: Boolean(item.isWicketKeeper),
                      }))
                      .filter((item) => item.player),
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
                [field === "team1" ? "team1" : "team2"]: [],
            },
        }));
    };

    const toggleXIPlayer = (teamKey, playerId) => {
        setForm((current) => {
            const currentXI = current.playingXI[teamKey] || [];
            const hasPlayer = currentXI.some((entry) => entry.player === playerId);
            const nextXI = hasPlayer
                ? currentXI.filter((entry) => entry.player !== playerId)
                : currentXI.length < 11
                  ? [...currentXI, { player: playerId, ...emptyRoleMeta }]
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

    const updatePlayerRole = (teamKey, playerId, role) => {
        setForm((current) => ({
            ...current,
            playingXI: {
                ...current.playingXI,
                [teamKey]: (current.playingXI[teamKey] || []).map((entry) =>
                    entry.player === playerId
                        ? {
                              ...entry,
                              isCaptain: role === "captain" || role === "both",
                              isWicketKeeper: role === "wicketkeeper" || role === "both",
                          }
                        : entry
                ),
            },
        }));
    };

    const getPlayerRole = (teamKey, playerId) => {
        const selectedPlayer = (form.playingXI[teamKey] || []).find((entry) => entry.player === playerId);
        if (!selectedPlayer) return "none";
        if (selectedPlayer.isCaptain && selectedPlayer.isWicketKeeper) return "both";
        if (selectedPlayer.isCaptain) return "captain";
        if (selectedPlayer.isWicketKeeper) return "wicketkeeper";
        return "none";
    };

    const validateRoles = (teamKey, label) => {
        const selectedPlayers = form.playingXI[teamKey] || [];
        const captainCount = selectedPlayers.filter((player) => player.isCaptain).length;
        const wicketKeeperCount = selectedPlayers.filter((player) => player.isWicketKeeper).length;

        if (captainCount !== 1) {
            return `${label} must have exactly one captain selected.`;
        }

        if (wicketKeeperCount !== 1) {
            return `${label} must have exactly one wicketkeeper selected.`;
        }

        return "";
    };

    const submit = (event) => {
        event.preventDefault();
        setFormError("");

        if (form.playingXI.team1.length !== 11 || form.playingXI.team2.length !== 11) {
            setFormError("Select exactly 11 players for both teams before saving the match.");
            return;
        }

        const team1RoleError = validateRoles("team1", team1?.name || "Team 1");
        if (team1RoleError) {
            setFormError(team1RoleError);
            return;
        }

        const team2RoleError = validateRoles("team2", team2?.name || "Team 2");
        if (team2RoleError) {
            setFormError(team2RoleError);
            return;
        }

        const payload = {
            ...form,
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
                            const active = form.playingXI.team1.some((entry) => entry.player === playerId);
                            return (
                                <div className={`${styles.pickCard} ${active ? styles.pickCardActive : ""}`} key={playerId}>
                                    <button className={styles.pickCardButton} onClick={() => toggleXIPlayer("team1", playerId)} type="button">
                                        <strong>{player.name}</strong>
                                        <span>{(player.role || []).join(", ") || "Player"}</span>
                                    </button>
                                    {active && (
                                        <select
                                            className={styles.select}
                                            value={getPlayerRole("team1", playerId)}
                                            onChange={(event) => updatePlayerRole("team1", playerId, event.target.value)}
                                        >
                                            <option value="none">None</option>
                                            <option value="captain">Captain</option>
                                            <option value="wicketkeeper">Wicketkeeper</option>
                                            <option value="both">Both</option>
                                        </select>
                                    )}
                                </div>
                            );
                        })}
                        {!team1Squad.length && <div className={styles.empty}>This team has no squad players.</div>}
                    </div>
                    <div className={styles.helperText}>After selecting a player, choose whether they are captain, wicketkeeper, both, or none.</div>
                </FormField>
            )}
            {form.team2 && (
                <FormField label={`${team2?.name || "Team 2"} Playing XI (${form.playingXI.team2.length}/11)`} full>
                    <div className={styles.pickGrid}>
                        {team2Squad.map((player) => {
                            const playerId = idOf(player);
                            const active = form.playingXI.team2.some((entry) => entry.player === playerId);
                            return (
                                <div className={`${styles.pickCard} ${active ? styles.pickCardActive : ""}`} key={playerId}>
                                    <button className={styles.pickCardButton} onClick={() => toggleXIPlayer("team2", playerId)} type="button">
                                        <strong>{player.name}</strong>
                                        <span>{(player.role || []).join(", ") || "Player"}</span>
                                    </button>
                                    {active && (
                                        <select
                                            className={styles.select}
                                            value={getPlayerRole("team2", playerId)}
                                            onChange={(event) => updatePlayerRole("team2", playerId, event.target.value)}
                                        >
                                            <option value="none">None</option>
                                            <option value="captain">Captain</option>
                                            <option value="wicketkeeper">Wicketkeeper</option>
                                            <option value="both">Both</option>
                                        </select>
                                    )}
                                </div>
                            );
                        })}
                        {!team2Squad.length && <div className={styles.empty}>This team has no squad players.</div>}
                    </div>
                    <div className={styles.helperText}>Exactly one captain and one wicketkeeper are required for each team.</div>
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
