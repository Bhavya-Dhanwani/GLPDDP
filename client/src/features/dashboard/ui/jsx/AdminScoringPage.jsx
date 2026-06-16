"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Circle, RotateCcw, Save, Send, ShieldAlert, Zap } from "lucide-react";
import { useLiveMatch } from "@/features/cricket/hooks/useLiveMatchSocket";
import { useTeams } from "@/features/cricket/hooks/useCricketQueries";
import {
    addManualCommentary,
    getDashboardMatchById,
    recordDelivery,
    startInnings,
    startMatch,
    updateCurrentPlayers,
    updateToss,
} from "../../api/dashboard.api";
import DashboardShell from "./DashboardShell";
import styles from "../css/Dashboard.module.css";

const DISMISSALS = [
    { value: "BOWLED", label: "Bowled" },
    { value: "CAUGHT", label: "Caught" },
    { value: "LBW", label: "LBW" },
    { value: "RUN_OUT", label: "Run out" },
    { value: "STUMPED", label: "Stumped" },
    { value: "HIT_WICKET", label: "Hit wicket" },
    { value: "RETIRED_HURT", label: "Retired hurt" },
    { value: "OBSTRUCTING_FIELD", label: "Obstructing field" },
];

const DISMISSALS_WITH_FIELDER = new Set(["CAUGHT", "RUN_OUT", "STUMPED"]);

const initialStart = {
    battingTeamId: "",
    strikerId: "",
    nonStrikerId: "",
    bowlerId: "",
};

const initialToss = {
    tossWinner: "",
    tossDecision: "BAT",
};

const initialBall = {
    batterRuns: 0,
    extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
        penalties: 0,
    },
    wicket: false,
    dismissalType: "BOWLED",
    playerOutId: "",
    fielderId: "",
    nextBatterId: "",
    bowlerId: "",
};

const idOf = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (value.$oid) return String(value.$oid);
    if (value.id) return idOf(value.id);
    if (value._id) return idOf(value._id);
    return "";
};
const nameOf = (value, fallback = "Unknown") => value?.name || value?.shortName || fallback;
const oversOf = (legalBalls = 0) => `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
const messageFromError = (error, fallback) => error.response?.data?.message || fallback;

const getTossBattingTeamId = (match) => {
    const tossWinnerId = idOf(match?.tossWinner);
    if (!match || !tossWinnerId) return "";
    if (match.tossDecision === "BAT") return tossWinnerId;
    return idOf(match.team1) === tossWinnerId ? idOf(match.team2) : idOf(match.team1);
};

const getDefaultBattingTeamId = (match, innings) => {
    if (!match) return "";
    if (innings.length === 1) {
        const firstBattingTeamId = idOf(innings[0]?.battingTeamId);
        return firstBattingTeamId === idOf(match.team1) ? idOf(match.team2) : idOf(match.team1);
    }
    return getTossBattingTeamId(match) || idOf(match.team1);
};

const mergeMatchData = (detailMatch, liveMatch) => {
    if (!detailMatch && !liveMatch) return null;
    return {
        ...(detailMatch || {}),
        ...(liveMatch || {}),
        team1: detailMatch?.team1 || liveMatch?.team1,
        team2: detailMatch?.team2 || liveMatch?.team2,
        tossWinner: detailMatch?.tossWinner || liveMatch?.tossWinner,
        playingXI: detailMatch?.playingXI || liveMatch?.playingXI,
    };
};

const Select = ({ label, value, onChange, options, placeholder = "Select", disabled = false }) => (
    <label className={styles.field}>
        <span className={styles.label}>{label}</span>
        <select
            className={styles.select}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </label>
);

const PlayerCard = ({ player, active, onClick, disabled = false }) => (
    <button
        className={`${styles.pickCard} ${active ? styles.pickCardActive : ""}`}
        type="button"
        onClick={onClick}
        disabled={disabled}
    >
        <strong>{nameOf(player)}</strong>
        <span>{player?.role || player?.battingStyle || "Player"}</span>
    </button>
);

const AdminScoringPage = () => {
    const { matchId } = useParams();
    const queryClient = useQueryClient();
    const matchQuery = useQuery({
        queryKey: ["dashboard-scoring-match", String(matchId || "")],
        queryFn: () => getDashboardMatchById(matchId),
        enabled: Boolean(matchId),
        staleTime: 1000 * 60 * 5,
    });
    const teamsQuery = useTeams();
    const liveQuery = useLiveMatch(matchId, { enabled: Boolean(matchId) });
    const match = mergeMatchData(matchQuery.data, liveQuery.data?.match);
    const innings = liveQuery.data?.innings || [];
    const liveInnings = innings.find((item) => item.status === "LIVE");
    const currentInnings = liveInnings || innings.at(-1);
    const isLiveStateLoading = Boolean(matchId) && liveQuery.isLoading && !liveQuery.data;
    const [startForm, setStartForm] = useState(initialStart);
    const [tossForm, setTossForm] = useState(initialToss);
    const [ball, setBall] = useState(initialBall);
    const [playersForm, setPlayersForm] = useState({ strikerId: "", nonStrikerId: "", bowlerId: "" });
    const [freeHit, setFreeHit] = useState(false);
    const [manualCommentary, setManualCommentary] = useState("");

    const teams = useMemo(
        () => [match?.team1, match?.team2].filter(Boolean).map((team) => ({ value: idOf(team), label: nameOf(team) })),
        [match]
    );
    const canStartInnings = !isLiveStateLoading && ["LIVE", "INNINGS_BREAK"].includes(match?.status) && !liveInnings && innings.length < 2;
    const defaultBattingTeamId = canStartInnings ? getDefaultBattingTeamId(match, innings) : "";
    const startBattingTeamId = startForm.battingTeamId || defaultBattingTeamId;
    const teamsById = useMemo(
        () => new Map((teamsQuery.data || []).map((team) => [idOf(team), team])),
        [teamsQuery.data]
    );
    const team1Detail = teamsById.get(idOf(match?.team1));
    const team2Detail = teamsById.get(idOf(match?.team2));
    const team1XIPlayers = match?.playingXI?.team1?.map((item) => item.player).filter(Boolean) || [];
    const team2XIPlayers = match?.playingXI?.team2?.map((item) => item.player).filter(Boolean) || [];
    const team1SquadPlayers = match?.team1?.squadPlayers?.length ? match.team1.squadPlayers : team1Detail?.squadPlayers || [];
    const team2SquadPlayers = match?.team2?.squadPlayers?.length ? match.team2.squadPlayers : team2Detail?.squadPlayers || [];
    const team1Players = team1XIPlayers.length ? team1XIPlayers : team1SquadPlayers;
    const team2Players = team2XIPlayers.length ? team2XIPlayers : team2SquadPlayers;
    const hasPlayingXI = team1XIPlayers.length === 11 && team2XIPlayers.length === 11;
    const hasSquadXI = team1SquadPlayers.length >= 11 && team2SquadPlayers.length >= 11;
    const canStartFromPlayers = hasPlayingXI || hasSquadXI;
    const hasToss = Boolean(idOf(match?.tossWinner) && match?.tossDecision);
    const canSetToss = match?.status === "UPCOMING" && !hasToss;
    const canMakeLive = ["TOSS_COMPLETED", "PLAYING_XI_SELECTED"].includes(match?.status);
    const selectedBattingTeamId = idOf(liveInnings?.battingTeamId || startBattingTeamId);
    const selectedBowlingTeamId = liveInnings
        ? idOf(liveInnings.bowlingTeamId)
        : selectedBattingTeamId
          ? selectedBattingTeamId === idOf(match?.team1)
              ? idOf(match?.team2)
              : idOf(match?.team1)
          : "";
    const battingPlayers = selectedBattingTeamId
        ? selectedBattingTeamId === idOf(match?.team1)
            ? team1Players
            : team2Players
        : [];
    const bowlingPlayers = selectedBowlingTeamId
        ? selectedBowlingTeamId === idOf(match?.team1)
            ? team1Players
            : team2Players
        : [];
    const battingOptions = battingPlayers.map((player) => ({ value: idOf(player), label: nameOf(player) }));
    const bowlingOptions = bowlingPlayers.map((player) => ({ value: idOf(player), label: nameOf(player) }));
    const activeBatterIds = new Set(
        (currentInnings?.battingScorecard || [])
            .filter((row) => !row.isOut)
            .map((row) => idOf(row.player))
    );
    const isFinalTeamWicket = ball.wicket && ball.dismissalType !== "RETIRED_HURT" && (currentInnings?.wickets || 0) + 1 >= 10;
    const availableNextBatters = battingPlayers.filter(
        (player) => !(currentInnings?.battingScorecard || []).some((row) => idOf(row.player) === idOf(player))
    );
    const invalidateLive = () => {
        queryClient.invalidateQueries({ queryKey: ["live-match", String(matchId)] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-scoring-match", String(matchId)] });
        queryClient.invalidateQueries({ queryKey: ["matches", String(matchId)] });
        queryClient.invalidateQueries({ queryKey: ["matches"] });
    };

    const tossMutation = useMutation({
        mutationFn: updateToss,
        onSuccess: () => {
            toast.success("Toss saved");
            setTossForm(initialToss);
            invalidateLive();
        },
        onError: (error) => toast.error(messageFromError(error, "Unable to save toss")),
    });

    const startMatchMutation = useMutation({
        mutationFn: startMatch,
        onSuccess: () => {
            toast.success("Match is live");
            invalidateLive();
        },
        onError: (error) => toast.error(messageFromError(error, "Unable to make match live")),
    });

    const startMutation = useMutation({
        mutationFn: startInnings,
        onSuccess: () => {
            toast.success("Innings started");
            setStartForm(initialStart);
            invalidateLive();
        },
        onError: (error) => toast.error(messageFromError(error, "Unable to start innings")),
    });

    const deliveryMutation = useMutation({
        mutationFn: recordDelivery,
        onSuccess: () => {
            toast.success("Ball saved");
            setBall((current) => ({ ...initialBall, bowlerId: current.bowlerId }));
            setFreeHit(false);
            invalidateLive();
        },
        onError: (error) => toast.error(messageFromError(error, "Unable to save ball")),
    });

    const playersMutation = useMutation({
        mutationFn: updateCurrentPlayers,
        onSuccess: () => {
            toast.success("Current players updated");
            setPlayersForm({ strikerId: "", nonStrikerId: "", bowlerId: "" });
            invalidateLive();
        },
        onError: (error) => toast.error(messageFromError(error, "Unable to update players")),
    });

    const commentaryMutation = useMutation({
        mutationFn: addManualCommentary,
        onSuccess: () => {
            toast.success("Commentary sent");
            setManualCommentary("");
            invalidateLive();
        },
        onError: (error) => toast.error(messageFromError(error, "Unable to send commentary")),
    });

    const updateExtra = (key, value) => {
        setBall((current) => ({
            ...current,
            extras: {
                ...current.extras,
                [key]: Number(value),
            },
        }));
    };

    const toggleExtra = (key) => {
        setBall((current) => ({
            ...current,
            extras: {
                ...current.extras,
                wides: key === "wides" ? (current.extras.wides ? 0 : 1) : 0,
                noBalls: key === "noBalls" ? (current.extras.noBalls ? 0 : 1) : 0,
            },
        }));
    };

    const submitToss = (event) => {
        event.preventDefault();
        const payload = {
            tossWinner: idOf(tossForm.tossWinner),
            tossDecision: tossForm.tossDecision,
        };
        if (!payload.tossWinner || !payload.tossDecision) {
            toast.error("Select toss winner and decision");
            return;
        }
        tossMutation.mutate({ id: matchId, payload });
    };

    const makeMatchLive = () => {
        if (!hasToss) {
            toast.error("Set the toss before making the match live");
            return;
        }
        if (!canStartFromPlayers) {
            toast.error("Add at least 11 squad players to both teams before making the match live");
            return;
        }
        startMatchMutation.mutate(matchId);
    };

    const submitManualCommentary = (event) => {
        event.preventDefault();
        const text = manualCommentary.trim();
        if (!text) {
            toast.error("Enter a commentary message");
            return;
        }
        commentaryMutation.mutate({ matchId, payload: { text } });
    };

    const submitStart = (event) => {
        event.preventDefault();
        const payload = {
            battingTeamId: idOf(startBattingTeamId),
            strikerId: idOf(startForm.strikerId),
            nonStrikerId: idOf(startForm.nonStrikerId),
            bowlerId: idOf(startForm.bowlerId),
        };
        if (!payload.battingTeamId || !payload.strikerId || !payload.nonStrikerId || !payload.bowlerId) {
            toast.error("Select batting team, both openers, and bowler");
            return;
        }
        startMutation.mutate({ matchId, payload });
    };

    const submitDelivery = () => {
        if (!liveInnings) return toast.error("Start an innings first");
        const inningsId = idOf(liveInnings);
        if (!inningsId) {
            invalidateLive();
            return toast.error("Refreshing innings state. Please try again.");
        }
        if (freeHit && ball.wicket && !["RUN_OUT", "RETIRED_HURT", "OBSTRUCTING_FIELD"].includes(ball.dismissalType)) {
            return toast.error("Only run out, retired hurt, or obstructing field can be marked on a free hit");
        }
        if (ball.wicket && !ball.playerOutId) return toast.error("Select the player who is out");
        if (ball.wicket && DISMISSALS_WITH_FIELDER.has(ball.dismissalType) && !ball.fielderId) {
            return toast.error("Select the fielder");
        }
        if (
            ball.wicket &&
            activeBatterIds.size > 1 &&
            !isFinalTeamWicket &&
            availableNextBatters.length > 0 &&
            !ball.nextBatterId &&
            ball.dismissalType !== "RETIRED_HURT"
        ) {
            return toast.error("Select the new batter");
        }

        const batterRuns = ball.wicket ? 0 : Number(ball.batterRuns);
        const payload = {
            expectedRevision: liveInnings.revision,
            batterRuns,
            boundaryType: batterRuns === 4 ? "FOUR" : batterRuns === 6 ? "SIX" : "NONE",
            extras: ball.extras,
            ...(ball.bowlerId ? { bowlerId: ball.bowlerId } : {}),
            ...(ball.wicket
                ? {
                      wicket: {
                          occurred: true,
                          playerOutId: ball.playerOutId,
                          dismissalType: ball.dismissalType,
                          ...(DISMISSALS_WITH_FIELDER.has(ball.dismissalType) && ball.fielderId ? { fielderId: ball.fielderId } : {}),
                          countsAsTeamWicket: ball.dismissalType !== "RETIRED_HURT",
                          creditedToBowler: !["RUN_OUT", "RETIRED_HURT", "OBSTRUCTING_FIELD"].includes(ball.dismissalType),
                      },
                      ...(ball.nextBatterId ? { nextBatterId: ball.nextBatterId } : {}),
                  }
                : { wicket: { occurred: false } }),
        };

        deliveryMutation.mutate({ inningsId, payload });
    };

    const saveCurrentPlayers = () => {
        if (!liveInnings) return toast.error("Start an innings first");
        const inningsId = idOf(liveInnings);
        if (!inningsId) {
            invalidateLive();
            return toast.error("Refreshing innings state. Please try again.");
        }
        playersMutation.mutate({
            inningsId,
            payload: {
                expectedRevision: liveInnings.revision,
                strikerId: playersForm.strikerId || idOf(liveInnings.strikerId),
                nonStrikerId: playersForm.nonStrikerId || idOf(liveInnings.nonStrikerId),
                bowlerId: playersForm.bowlerId || ball.bowlerId || idOf(liveInnings.currentBowlerId),
            },
        });
    };

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>Live Scoring</h1>
                    <p className={styles.muted}>
                        {match ? `${nameOf(match.team1)} vs ${nameOf(match.team2)}` : "Loading match..."}
                    </p>
                </div>
                <span className={styles.scoreStatus}>{liveQuery.connectionState === "connected" ? "Socket connected" : "Syncing socket"}</span>
            </div>

            {matchQuery.isLoading && <div className={styles.empty}>Loading match...</div>}
            {match && (
                <div className={styles.scoringLayout}>
                    <section className={`${styles.card} ${styles.scorePanel}`}>
                        <div className={styles.scoreHero}>
                            <span>{currentInnings ? `${nameOf(currentInnings.battingTeamId)} innings` : "No innings running"}</span>
                            <strong>{currentInnings ? `${currentInnings.runs}/${currentInnings.wickets}` : "-/-"}</strong>
                            <p>{currentInnings ? `${oversOf(currentInnings.legalBalls)} overs - revision ${currentInnings.revision}` : "Start innings to score balls"}</p>
                        </div>

                        {isLiveStateLoading && <div className={styles.empty}>Loading saved innings...</div>}

                        {canSetToss && (
                            <form className={styles.scoringForm} onSubmit={submitToss}>
                                <Select
                                    label="Toss winner"
                                    value={tossForm.tossWinner}
                                    onChange={(value) => setTossForm((current) => ({ ...current, tossWinner: value }))}
                                    options={teams}
                                />
                                <Select
                                    label="Toss decision"
                                    value={tossForm.tossDecision}
                                    onChange={(value) => setTossForm((current) => ({ ...current, tossDecision: value }))}
                                    options={[
                                        { value: "BAT", label: "Bat first" },
                                        { value: "BOWL", label: "Bowl first" },
                                    ]}
                                />
                                <button className={`${styles.button} ${styles.primary} ${styles.full}`} type="submit" disabled={tossMutation.isPending}>
                                    Save Toss
                                </button>
                            </form>
                        )}

                        {canMakeLive && !liveInnings && !isLiveStateLoading && (
                            <div className={styles.scorerStack}>
                                <div className={styles.empty}>
                                    {canStartFromPlayers ? "Toss is done. Make the match live to start scoring." : "Add at least 11 squad players to both teams before the match can go live."}
                                </div>
                                <button className={`${styles.button} ${styles.primary} ${styles.full}`} type="button" onClick={makeMatchLive} disabled={startMatchMutation.isPending || !canStartFromPlayers}>
                                    <Zap size={17} /> Make Match Live
                                </button>
                            </div>
                        )}

                        {canStartInnings && (
                            <form className={styles.scoringForm} onSubmit={submitStart}>
                                <Select label="Batting team" value={startBattingTeamId} onChange={(value) => setStartForm((current) => ({ ...current, battingTeamId: value, strikerId: "", nonStrikerId: "", bowlerId: "" }))} options={teams} />
                                <Select label="Striker" value={startForm.strikerId} onChange={(value) => setStartForm((current) => ({ ...current, strikerId: value }))} options={battingOptions} />
                                <Select label="Non-striker" value={startForm.nonStrikerId} onChange={(value) => setStartForm((current) => ({ ...current, nonStrikerId: value }))} options={battingOptions} />
                                <Select label="Bowler" value={startForm.bowlerId} onChange={(value) => setStartForm((current) => ({ ...current, bowlerId: value }))} options={bowlingOptions} />
                                <button className={`${styles.button} ${styles.primary} ${styles.full}`} type="submit" disabled={startMutation.isPending}>
                                    <Zap size={17} /> Start Innings
                                </button>
                            </form>
                        )}

                        {!canStartInnings && liveInnings && (
                            <div className={styles.scorerStack}>
                                <div>
                                    <span className={styles.label}>Runs</span>
                                    <div className={styles.runGrid}>
                                        {[0, 1, 2, 3, 4, 5, 6].map((run) => (
                                            <button
                                                key={run}
                                                className={`${styles.runButton} ${Number(ball.batterRuns) === run ? styles.runButtonActive : ""}`}
                                                type="button"
                                                onClick={() => setBall((current) => (current.wicket && run > 0 ? current : { ...current, batterRuns: run }))}
                                                disabled={ball.wicket && run > 0}
                                            >
                                                {run}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.quickGrid}>
                                    <button className={styles.button} type="button" onClick={() => toast.info("Dead ball noted. No score update sent.")}>
                                        <Circle size={16} /> Dead ball
                                    </button>
                                    <button className={`${styles.button} ${freeHit ? styles.primary : ""}`} type="button" onClick={() => setFreeHit((value) => !value)}>
                                        <Zap size={16} /> Free hit
                                    </button>
                                    <button className={styles.button} type="button" onClick={() => toggleExtra("wides")}>
                                        Wide {ball.extras.wides ? "on" : ""}
                                    </button>
                                    <button className={styles.button} type="button" onClick={() => toggleExtra("noBalls")}>
                                        No ball {ball.extras.noBalls ? "on" : ""}
                                    </button>
                                </div>

                                <div className={styles.scoringForm}>
                                    <Select label="Bowler override" value={ball.bowlerId} onChange={(value) => setBall((current) => ({ ...current, bowlerId: value }))} options={bowlingOptions} placeholder={nameOf(currentInnings.currentBowlerId, "Current bowler")} />
                                    <label className={styles.field}>
                                        <span className={styles.label}>Byes</span>
                                        <input className={styles.input} min="0" type="number" value={ball.extras.byes} onChange={(event) => updateExtra("byes", event.target.value)} />
                                    </label>
                                    <label className={styles.field}>
                                        <span className={styles.label}>Leg byes</span>
                                        <input className={styles.input} min="0" type="number" value={ball.extras.legByes} onChange={(event) => updateExtra("legByes", event.target.value)} />
                                    </label>
                                    <label className={styles.field}>
                                        <span className={styles.label}>Penalty</span>
                                        <input className={styles.input} min="0" type="number" value={ball.extras.penalties} onChange={(event) => updateExtra("penalties", event.target.value)} />
                                    </label>
                                </div>

                                <section className={styles.wicketBox}>
                                    <label className={styles.checkLine}>
                                        <input type="checkbox" checked={ball.wicket} onChange={(event) => setBall((current) => ({ ...current, wicket: event.target.checked, batterRuns: event.target.checked ? 0 : current.batterRuns }))} />
                                        <span><ShieldAlert size={16} /> Wicket on this ball</span>
                                    </label>
                                    {ball.wicket && (
                                        <div className={styles.scoringForm}>
                                            <Select label="Out player" value={ball.playerOutId} onChange={(value) => setBall((current) => ({ ...current, playerOutId: value }))} options={battingOptions.filter((option) => activeBatterIds.has(option.value))} />
                                            <Select label="How out" value={ball.dismissalType} onChange={(value) => setBall((current) => ({ ...current, dismissalType: value, fielderId: DISMISSALS_WITH_FIELDER.has(value) ? current.fielderId : "" }))} options={DISMISSALS} />
                                            {DISMISSALS_WITH_FIELDER.has(ball.dismissalType) && (
                                                <Select label="Fielder" value={ball.fielderId} onChange={(value) => setBall((current) => ({ ...current, fielderId: value }))} options={bowlingOptions} />
                                            )}
                                            <div className={styles.full}>
                                                <span className={styles.label}>New batter</span>
                                                {isFinalTeamWicket ? (
                                                    <div className={styles.empty}>10th wicket. Innings will end after this ball.</div>
                                                ) : (
                                                    <div className={styles.pickGrid}>
                                                        {availableNextBatters.map((player) => (
                                                            <PlayerCard
                                                                key={idOf(player)}
                                                                player={player}
                                                                active={ball.nextBatterId === idOf(player)}
                                                                onClick={() => setBall((current) => ({ ...current, nextBatterId: idOf(player) }))}
                                                            />
                                                        ))}
                                                        {!availableNextBatters.length && <div className={styles.empty}>No batters left. Innings will end after this ball.</div>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <div className={styles.actions}>
                                    <button className={styles.button} type="button" onClick={() => setBall(initialBall)}>
                                        <RotateCcw size={17} /> Reset
                                    </button>
                                    <button className={`${styles.button} ${styles.primary}`} type="button" onClick={submitDelivery} disabled={deliveryMutation.isPending}>
                                        <Save size={17} /> Save Ball
                                    </button>
                                </div>

                                <form className={styles.scoringForm} onSubmit={submitManualCommentary}>
                                    <label className={`${styles.field} ${styles.full}`}>
                                        <span className={styles.label}>Add commentary message</span>
                                        <input
                                            className={styles.input}
                                            maxLength="500"
                                            type="text"
                                            value={manualCommentary}
                                            onChange={(event) => setManualCommentary(event.target.value)}
                                            placeholder="Type scorer commentary..."
                                        />
                                    </label>
                                    <button className={`${styles.button} ${styles.primary} ${styles.full}`} type="submit" disabled={commentaryMutation.isPending}>
                                        <Send size={17} /> Send Commentary
                                    </button>
                                </form>
                            </div>
                        )}
                    </section>

                    <aside className={`${styles.card} ${styles.scorePanel}`}>
                        <h2>Current Players</h2>
                        <div className={styles.currentGrid}>
                            <div>
                                <span>Striker</span>
                                <strong>{nameOf(currentInnings?.strikerId, "Not set")}</strong>
                            </div>
                            <div>
                                <span>Non-striker</span>
                                <strong>{nameOf(currentInnings?.nonStrikerId, "Not set")}</strong>
                            </div>
                            <div>
                                <span>Bowler</span>
                                <strong>{nameOf(currentInnings?.currentBowlerId, "Not set")}</strong>
                            </div>
                        </div>
                        {liveInnings && (
                            <>
                                <Select label="Striker" value={playersForm.strikerId} onChange={(value) => setPlayersForm((current) => ({ ...current, strikerId: value }))} options={battingOptions.filter((option) => activeBatterIds.has(option.value))} placeholder={nameOf(liveInnings.strikerId, "Current striker")} />
                                <Select label="Non-striker" value={playersForm.nonStrikerId} onChange={(value) => setPlayersForm((current) => ({ ...current, nonStrikerId: value }))} options={battingOptions.filter((option) => activeBatterIds.has(option.value))} placeholder={nameOf(liveInnings.nonStrikerId, "Current non-striker")} />
                                <Select label="Bowler" value={playersForm.bowlerId} onChange={(value) => setPlayersForm((current) => ({ ...current, bowlerId: value }))} options={bowlingOptions} placeholder={nameOf(liveInnings.currentBowlerId, "Current bowler")} />
                                <button className={`${styles.button} ${styles.primary}`} type="button" onClick={saveCurrentPlayers} disabled={playersMutation.isPending}>
                                    Update Current Players
                                </button>
                            </>
                        )}
                    </aside>
                </div>
            )}
        </DashboardShell>
    );
};

export default AdminScoringPage;
