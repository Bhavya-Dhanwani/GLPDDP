"use client";

import { useEffect, useMemo, useState } from "react";
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

const roleCycle = ["none", "wicketkeeper", "captain", "both"];

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

const getTeamNameById = (teams, teamId) =>
    teams.find((team) => idOf(team) === idOf(teamId))?.name || "";

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
    const [teamSearch, setTeamSearch] = useState(() => ({
        team1: getTeamNameById(teams, prepareInitialValues(initialValues).team1),
        team2: getTeamNameById(teams, prepareInitialValues(initialValues).team2),
    }));
    const [openTeamMenu, setOpenTeamMenu] = useState("");
    const teamsById = useMemo(() => new Map(teams.map((team) => [idOf(team), team])), [teams]);
    const team1 = teamsById.get(idOf(form.team1));
    const team2 = teamsById.get(idOf(form.team2));
    const team1Squad = team1?.squadPlayers || [];
    const team2Squad = team2?.squadPlayers || [];

    useEffect(() => {
        setTeamSearch({
            team1: team1?.name || "",
            team2: team2?.name || "",
        });
    }, [team1?.name, team2?.name]);

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
        setFormError("");
        setTeamSearch((current) => ({
            ...current,
            [field]: getTeamNameById(teams, value),
        }));
        setOpenTeamMenu("");
    };

    const handleTeamSearchChange = (field, value) => {
        setTeamSearch((current) => ({ ...current, [field]: value }));
        setOpenTeamMenu(field);
        if (!value.trim()) {
            setForm((current) => ({
                ...current,
                [field]: "",
                playingXI: {
                    ...current.playingXI,
                    [field]: [],
                },
            }));
        }
    };

    const getAvailableTeams = (field) => {
        const otherField = field === "team1" ? "team2" : "team1";
        const blockedId = idOf(form[otherField]);
        const query = teamSearch[field].trim().toLowerCase();

        return teams.filter((team) => {
            const teamId = idOf(team);
            if (blockedId && teamId === blockedId) {
                return false;
            }

            if (!query) {
                return true;
            }

            return team.name?.toLowerCase().includes(query);
        });
    };

    const getNextRole = (currentRole) => {
        const currentIndex = roleCycle.indexOf(currentRole);
        if (currentIndex === -1) return "none";
        return roleCycle[currentIndex + 1] || null;
    };

    const getRoleMeta = (role) => ({
        isCaptain: role === "captain" || role === "both",
        isWicketKeeper: role === "wicketkeeper" || role === "both",
    });

    const getRoleLabel = (role) => {
        if (role === "wicketkeeper") return "Wicketkeeper";
        if (role === "captain") return "Captain";
        if (role === "both") return "Captain + Keeper";
        return "Player";
    };

    const cycleXIPlayer = (teamKey, playerId) => {
        setForm((current) => {
            const currentXI = current.playingXI[teamKey] || [];
            const currentEntry = currentXI.find((entry) => entry.player === playerId);

            let nextXI = currentXI;
            if (!currentEntry) {
                if (currentXI.length < 11) {
                    nextXI = [...currentXI, { player: playerId, ...emptyRoleMeta }];
                }
            } else {
                const nextRole = getNextRole(getPlayerRoleFromEntry(currentEntry));
                nextXI = nextRole
                    ? currentXI.map((entry) =>
                          entry.player === playerId ? { ...entry, ...getRoleMeta(nextRole) } : entry
                      )
                    : currentXI.filter((entry) => entry.player !== playerId);
            }

            return {
                ...current,
                playingXI: {
                    ...current.playingXI,
                    [teamKey]: nextXI,
                },
            };
        });
    };

    const getPlayerRoleFromEntry = (selectedPlayer) => {
        if (!selectedPlayer) return "none";
        if (selectedPlayer.isCaptain && selectedPlayer.isWicketKeeper) return "both";
        if (selectedPlayer.isCaptain) return "captain";
        if (selectedPlayer.isWicketKeeper) return "wicketkeeper";
        return "none";
    };

    const getPlayerRole = (teamKey, playerId) => {
        const selectedPlayer = (form.playingXI[teamKey] || []).find((entry) => entry.player === playerId);
        return getPlayerRoleFromEntry(selectedPlayer);
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

        if (!form.team1 || !form.team2) {
            setFormError("Select both teams before saving the match.");
            return;
        }

        if (idOf(form.team1) === idOf(form.team2)) {
            setFormError("Team 1 and Team 2 cannot be the same.");
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
                <div
                    className={styles.searchSelect}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            setOpenTeamMenu((current) => (current === "team1" ? "" : current));
                            setTeamSearch((current) => ({
                                ...current,
                                team1: form.team1 ? team1?.name || current.team1 : "",
                            }));
                        }
                    }}
                >
                    <input
                        className={styles.input}
                        onChange={(event) => handleTeamSearchChange("team1", event.target.value)}
                        onFocus={() => setOpenTeamMenu("team1")}
                        placeholder="Search team"
                        value={teamSearch.team1}
                        required={!form.team1}
                    />
                    {openTeamMenu === "team1" && (
                        <div className={styles.searchMenu}>
                            {getAvailableTeams("team1").map((team) => (
                                <button
                                    className={styles.searchOption}
                                    key={idOf(team)}
                                    onClick={() => updateTeam("team1", idOf(team))}
                                    onMouseDown={(event) => event.preventDefault()}
                                    type="button"
                                >
                                    {team.name}
                                </button>
                            ))}
                            {!getAvailableTeams("team1").length && (
                                <div className={styles.searchEmpty}>No teams found.</div>
                            )}
                        </div>
                    )}
                </div>
            </FormField>
            <FormField label="Team 2">
                <div
                    className={styles.searchSelect}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            setOpenTeamMenu((current) => (current === "team2" ? "" : current));
                            setTeamSearch((current) => ({
                                ...current,
                                team2: form.team2 ? team2?.name || current.team2 : "",
                            }));
                        }
                    }}
                >
                    <input
                        className={styles.input}
                        onChange={(event) => handleTeamSearchChange("team2", event.target.value)}
                        onFocus={() => setOpenTeamMenu("team2")}
                        placeholder="Search team"
                        value={teamSearch.team2}
                        required={!form.team2}
                    />
                    {openTeamMenu === "team2" && (
                        <div className={styles.searchMenu}>
                            {getAvailableTeams("team2").map((team) => (
                                <button
                                    className={styles.searchOption}
                                    key={idOf(team)}
                                    onClick={() => updateTeam("team2", idOf(team))}
                                    onMouseDown={(event) => event.preventDefault()}
                                    type="button"
                                >
                                    {team.name}
                                </button>
                            ))}
                            {!getAvailableTeams("team2").length && (
                                <div className={styles.searchEmpty}>No teams found.</div>
                            )}
                        </div>
                    )}
                </div>
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
                            const role = getPlayerRole("team1", playerId);
                            const active = role !== "none" || form.playingXI.team1.some((entry) => entry.player === playerId);
                            return (
                                <button
                                    className={`${styles.pickCard} ${active ? styles.pickCardActive : ""} ${active ? styles[`pickCard${role.charAt(0).toUpperCase()}${role.slice(1)}`] : ""}`}
                                    key={playerId}
                                    onClick={() => cycleXIPlayer("team1", playerId)}
                                    type="button"
                                >
                                    <span className={styles.pickCardStatus}>{getRoleLabel(role)}</span>
                                    <div className={styles.pickCardButton}>
                                        <strong>{player.name}</strong>
                                        <span>{(player.role || []).join(", ") || "Player"}</span>
                                    </div>
                                </button>
                            );
                        })}
                        {!team1Squad.length && <div className={styles.empty}>This team has no squad players.</div>}
                    </div>
                    <div className={styles.helperText}>Click cycle: player, wicketkeeper, captain, both, then unselect.</div>
                </FormField>
            )}
            {form.team2 && (
                <FormField label={`${team2?.name || "Team 2"} Playing XI (${form.playingXI.team2.length}/11)`} full>
                    <div className={styles.pickGrid}>
                        {team2Squad.map((player) => {
                            const playerId = idOf(player);
                            const role = getPlayerRole("team2", playerId);
                            const active = role !== "none" || form.playingXI.team2.some((entry) => entry.player === playerId);
                            return (
                                <button
                                    className={`${styles.pickCard} ${active ? styles.pickCardActive : ""} ${active ? styles[`pickCard${role.charAt(0).toUpperCase()}${role.slice(1)}`] : ""}`}
                                    key={playerId}
                                    onClick={() => cycleXIPlayer("team2", playerId)}
                                    type="button"
                                >
                                    <span className={styles.pickCardStatus}>{getRoleLabel(role)}</span>
                                    <div className={styles.pickCardButton}>
                                        <strong>{player.name}</strong>
                                        <span>{(player.role || []).join(", ") || "Player"}</span>
                                    </div>
                                </button>
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
