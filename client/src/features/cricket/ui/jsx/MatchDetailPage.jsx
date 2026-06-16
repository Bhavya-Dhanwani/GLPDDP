"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Activity,
    CalendarDays,
    Clock,
    MapPin,
    ShieldCheck,
    Trophy,
    UserRound,
    UsersRound,
} from "lucide-react";
import PublicShell from "./PublicShell";
import StateBlock from "./StateBlock";
import StatusBadge from "./StatusBadge";
import styles from "../css/Cricket.module.css";
import { useMatchDetail } from "../../hooks/useCricketQueries";
import { useLiveMatch } from "../../hooks/useLiveMatchSocket";

const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
          }).format(new Date(value))
        : "TBA";

const tabs = ["Live", "Scorecard", "Commentary", "Fall of Wickets", "Stats", "Graph", "Fantasy"];

const getTeamTone = (team, fallback) => {
    const value = `${team?.shortName || ""} ${team?.name || ""}`.toLowerCase();

    if (value.includes("india") || value.includes("ind")) return "india";
    if (value.includes("australia") || value.includes("aus")) return "australia";
    return fallback;
};

const idOf = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (value.$oid) return String(value.$oid);
    if (value.id) return idOf(value.id);
    if (value._id) return idOf(value._id);
    return "";
};

const formatOvers = (legalBalls = 0) => `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;

const getName = (value, fallback = "Player") => value?.name || value?.shortName || fallback;

const getCurrentInnings = (snapshot) => {
    const innings = snapshot?.innings || [];
    return innings.find((item) => item.status === "LIVE") || innings.at(-1);
};

const getTeamById = (match, teamId) =>
    [match?.team1, match?.team2].find((team) => idOf(team) === idOf(teamId));

const getScoreRowByPlayer = (innings, player) =>
    (innings?.battingScorecard || []).find((row) => idOf(row.player) === idOf(player));

const getComputedResult = (match, inningsList = []) => {
    const [firstInnings, secondInnings] = inningsList;
    if (!firstInnings || !secondInnings || secondInnings.status !== "COMPLETED") return "";
    const firstRuns = Number(firstInnings.runs || 0);
    const secondRuns = Number(secondInnings.runs || 0);

    if (secondRuns > firstRuns) {
        const winner = getTeamById(match, secondInnings.battingTeamId);
        const wickets = Math.max(10 - Number(secondInnings.wickets || 0), 0);
        return `${winner?.name || winner?.shortName || "Team"} won by ${wickets} wicket${wickets === 1 ? "" : "s"}`;
    }

    if (firstRuns > secondRuns) {
        const winner = getTeamById(match, firstInnings.battingTeamId);
        const runs = firstRuns - secondRuns;
        return `${winner?.name || winner?.shortName || "Team"} won by ${runs} run${runs === 1 ? "" : "s"}`;
    }

    return "Match tied";
};

const getBallLabel = (delivery) => {
    if (delivery?.wicket?.occurred) return "W";
    if (delivery?.extras?.wides > 0) return "Wd";
    if (delivery?.extras?.noBalls > 0) return "Nb";
    return String(delivery?.batterRuns ?? delivery?.totalRuns ?? 0);
};

const getDismissal = (row) =>
    row?.isOut ? (row.dismissalType || "out").replaceAll("_", " ").toLowerCase() : "not out";

const getStrikeRate = (runs = 0, balls = 0) => (balls ? ((runs * 100) / balls).toFixed(2) : "0.00");

const getEconomy = (runs = 0, legalBalls = 0) => (legalBalls ? ((runs * 6) / legalBalls).toFixed(2) : "0.00");

const getInningsTitle = (match, innings) => {
    const team = getTeamById(match, innings?.battingTeamId);
    const suffix = innings?.inningsNumber ? ` Innings ${innings.inningsNumber}` : " Innings";
    return `${team?.name || "Team"}${suffix}`;
};

const getInningsExtrasText = (innings) => {
    const extras = innings?.extras || {};
    const total = Object.values(extras).reduce((sum, value) => sum + (Number(value) || 0), 0);
    return `${total} (b ${extras.byes || 0}, lb ${extras.legByes || 0}, w ${extras.wides || 0}, nb ${extras.noBalls || 0}, p ${extras.penalties || 0})`;
};

const getFallOfWickets = (snapshot) => {
    const deliveriesByInnings = new Map();
    (snapshot?.deliveries || []).forEach((delivery) => {
        const inningsId = idOf(delivery.inningsId);
        if (!inningsId) return;
        deliveriesByInnings.set(inningsId, [...(deliveriesByInnings.get(inningsId) || []), delivery]);
    });

    return (snapshot?.innings || []).map((innings) => {
        let runs = 0;
        let wickets = 0;
        const wicketsList = (deliveriesByInnings.get(idOf(innings)) || [])
            .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
            .reduce((items, delivery) => {
                runs += Number(delivery.totalRuns || 0);
                if (delivery.wicket?.occurred && delivery.wicket?.countsAsTeamWicket !== false) {
                    wickets += 1;
                    items.push({
                        score: `${runs}/${wickets}`,
                        over: formatOvers((delivery.legalBallsBefore || 0) + (delivery.isLegalDelivery ? 1 : 0)),
                        player: getName(delivery.wicket.playerOutId, "Batter"),
                    });
                }
                return items;
            }, []);

        return { innings, wickets: wicketsList };
    });
};

const getOverGraph = (deliveries = []) => {
    const overs = new Map();
    deliveries.forEach((delivery) => {
        const over = Math.floor((delivery.legalBallsBefore || 0) / 6) + 1;
        overs.set(over, (overs.get(over) || 0) + Number(delivery.totalRuns || 0));
    });
    return [...overs.entries()].sort((a, b) => a[0] - b[0]).map(([over, runs]) => ({ over, runs }));
};

const getFantasyRows = (inningsList = []) => {
    const scores = new Map();
    const addScore = (player, points, detail) => {
        const playerId = idOf(player) || getName(player);
        const current = scores.get(playerId) || { player, points: 0, detail: [] };
        current.points += points;
        current.detail.push(detail);
        scores.set(playerId, current);
    };

    inningsList.forEach((innings) => {
        (innings.battingScorecard || []).forEach((row) => {
            addScore(row.player, (row.runs || 0) + (row.fours || 0) + (row.sixes || 0) * 2, `${row.runs || 0} runs`);
        });
        (innings.bowlingScorecard || []).forEach((row) => {
            addScore(row.player, (row.wickets || 0) * 25, `${row.wickets || 0} wickets`);
        });
    });

    return [...scores.values()].sort((a, b) => b.points - a.points).slice(0, 10);
};

const reconcileInningsFromDeliveries = (inningsList = [], deliveries = []) => {
    if (!deliveries.length) return inningsList;
    const emptyExtras = () => ({ wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0 });
    const deliveriesByInnings = new Map();
    deliveries.forEach((delivery) => {
        const inningsId = idOf(delivery.inningsId);
        if (!inningsId) return;
        deliveriesByInnings.set(inningsId, [...(deliveriesByInnings.get(inningsId) || []), delivery]);
    });

    return inningsList.map((innings) => {
        const inningsDeliveries = (deliveriesByInnings.get(idOf(innings)) || []).sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        if (!inningsDeliveries.length) return innings;

        const extras = emptyExtras();
        const battingRows = new Map((innings.battingScorecard || []).map((row) => [idOf(row.player), { ...row, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }]));
        const bowlingRows = new Map((innings.bowlingScorecard || []).map((row) => [idOf(row.player), { ...row, legalBalls: 0, runsConceded: 0, wickets: 0, wides: 0, noBalls: 0 }]));
        const ensureBatting = (player) => {
            const playerId = idOf(player);
            if (!playerId) return null;
            if (!battingRows.has(playerId)) battingRows.set(playerId, { player, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false });
            return battingRows.get(playerId);
        };
        const ensureBowling = (player) => {
            const playerId = idOf(player);
            if (!playerId) return null;
            if (!bowlingRows.has(playerId)) bowlingRows.set(playerId, { player, legalBalls: 0, runsConceded: 0, wickets: 0, wides: 0, noBalls: 0 });
            return bowlingRows.get(playerId);
        };

        let runs = 0;
        let wickets = 0;
        let legalBalls = 0;
        let currentStriker = inningsDeliveries[0]?.strikerId || innings.strikerId;
        let currentNonStriker = inningsDeliveries[0]?.nonStrikerId || innings.nonStrikerId;
        let currentBowler = innings.currentBowlerId;
        const swapBatters = () => {
            const striker = currentStriker;
            currentStriker = currentNonStriker;
            currentNonStriker = striker;
        };
        inningsDeliveries.forEach((delivery) => {
            const deliveryExtras = { ...emptyExtras(), ...(delivery.extras || {}) };
            const batterRuns = Number(delivery.batterRuns || 0);
            const totalRuns = Number(delivery.totalRuns || 0);
            const batter = ensureBatting(currentStriker || delivery.strikerId);
            const bowler = ensureBowling(delivery.bowlerId);
            currentBowler = delivery.bowlerId || currentBowler;

            runs += totalRuns;
            Object.keys(extras).forEach((key) => {
                extras[key] += Number(deliveryExtras[key] || 0);
            });
            if (delivery.isLegalDelivery) legalBalls += 1;

            if (batter) {
                batter.runs += batterRuns;
                if (!deliveryExtras.wides) batter.balls += 1;
                if (delivery.boundaryType === "FOUR" || batterRuns === 4) batter.fours += 1;
                if (delivery.boundaryType === "SIX" || batterRuns === 6) batter.sixes += 1;
            }
            if (bowler) {
                if (delivery.isLegalDelivery) bowler.legalBalls += 1;
                bowler.runsConceded += batterRuns + Number(deliveryExtras.wides || 0) + Number(deliveryExtras.noBalls || 0);
                bowler.wides += Number(deliveryExtras.wides || 0);
                bowler.noBalls += Number(deliveryExtras.noBalls || 0);
            }
            if (delivery.wicket?.occurred) {
                const outRow = ensureBatting(delivery.wicket.playerOutId);
                if (outRow) {
                    outRow.isOut = true;
                    outRow.dismissalType = delivery.wicket.dismissalType;
                }
                if (delivery.wicket.countsAsTeamWicket !== false) wickets += 1;
                if (bowler && delivery.wicket.creditedToBowler !== false) bowler.wickets += 1;
                if (delivery.nextBatterId) {
                    if (idOf(delivery.wicket.playerOutId) === idOf(currentStriker)) {
                        currentStriker = delivery.nextBatterId;
                        ensureBatting(delivery.nextBatterId);
                    } else if (idOf(delivery.wicket.playerOutId) === idOf(currentNonStriker)) {
                        currentNonStriker = delivery.nextBatterId;
                        ensureBatting(delivery.nextBatterId);
                    }
                }
            }

            if (totalRuns % 2 === 1) swapBatters();
            if (delivery.isLegalDelivery && legalBalls % 6 === 0) swapBatters();
        });

        return {
            ...innings,
            runs,
            wickets,
            legalBalls,
            extras,
            strikerId: currentStriker,
            nonStrikerId: currentNonStriker,
            currentBowlerId: currentBowler,
            runRate: legalBalls ? Number(((runs * 6) / legalBalls).toFixed(2)) : 0,
            battingScorecard: [...battingRows.values()].map((row) => ({
                ...row,
                strikeRate: row.balls ? Number(((row.runs * 100) / row.balls).toFixed(2)) : 0,
            })),
            bowlingScorecard: [...bowlingRows.values()].map((row) => ({
                ...row,
                overs: formatOvers(row.legalBalls),
                economy: row.legalBalls ? Number(((row.runsConceded * 6) / row.legalBalls).toFixed(2)) : 0,
            })),
        };
    });
};

const TeamFlag = ({ team, tone }) => (
    <div className={`${styles.matchFlag} ${styles[`matchFlag${tone}`] || ""}`}>
        {team?.logo ? (
            <img src={team.logo} alt={team.name} />
        ) : (
            <span>{team?.shortName?.slice(0, 3) || "TBA"}</span>
        )}
    </div>
);

const TeamSummary = ({ team, align = "left", tone, label }) => (
    <div className={`${styles.matchTeam} ${align === "right" ? styles.matchTeamRight : ""}`}>
        <TeamFlag team={team} tone={tone} />
        <div>
            <h2 className={styles.wrapText}>
                {team?.name || "Team TBA"}
                {label && <span className={styles.teamStateLabel}>{label}</span>}
            </h2>
            <p className={`${styles.muted} ${styles.wrapText}`}>{team?.shortName || "TBA"}</p>
        </div>
    </div>
);

const MatchDetailPage = () => {
    const [activeTab, setActiveTab] = useState("Live");
    const { id } = useParams();
    const { data: match, isLoading, isError } = useMatchDetail(id);
    const { data: liveSnapshot, connectionState, isLoading: isLiveSnapshotLoading } = useLiveMatch(id, { enabled: Boolean(id) });
    const displayMatch = liveSnapshot?.match || match;
    const inningsList = reconcileInningsFromDeliveries(liveSnapshot?.innings || [], liveSnapshot?.deliveries || []);
    const displaySnapshot = liveSnapshot ? { ...liveSnapshot, innings: inningsList } : liveSnapshot;
    const activeInnings = getCurrentInnings(displaySnapshot);
    const battingTeam = getTeamById(displayMatch, activeInnings?.battingTeamId) || displayMatch?.team1;
    const bowlingTeam = getTeamById(displayMatch, activeInnings?.bowlingTeamId) || displayMatch?.team2;
    const team1Tone = getTeamTone(displayMatch?.team1, "india");
    const team2Tone = getTeamTone(displayMatch?.team2, "australia");
    const venue = [displayMatch?.venue, displayMatch?.city].filter(Boolean).join(", ");
    const seriesName = displayMatch?.series?.name || displayMatch?.seriesId?.name || "TBA";
    const battingTeamName = battingTeam?.name || "Batting team";
    const bowlingTeamName = bowlingTeam?.name || "Bowling team";
    const scorecardInnings = inningsList.length ? inningsList : activeInnings ? [activeInnings] : [];
    const resultText = displayMatch?.result || getComputedResult(displayMatch, scorecardInnings);
    const isMatchOver = displayMatch?.status === "COMPLETED" || Boolean(resultText && scorecardInnings[1]?.status === "COMPLETED");
    const battingRows = activeInnings?.battingScorecard || [];
    const bowlingRows = activeInnings?.bowlingScorecard || [];
    const strikerRow = getScoreRowByPlayer(activeInnings, activeInnings?.strikerId);
    const nonStrikerRow = getScoreRowByPlayer(activeInnings, activeInnings?.nonStrikerId);
    const currentOverStart = Math.floor((activeInnings?.legalBalls || 0) / 6) * 6;
    const currentOverEnd = currentOverStart + 6;
    const currentOverDeliveries = activeInnings
        ? [...(liveSnapshot?.deliveries || [])]
              .filter((delivery) => {
                  const sameInnings = idOf(delivery.inningsId) === idOf(activeInnings);
                  return sameInnings && delivery.legalBallsBefore >= currentOverStart && delivery.legalBallsBefore < currentOverEnd;
              })
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
        : [];
    const commentary = liveSnapshot?.commentary || [];
    const totalBalls = (displayMatch?.oversPerInnings || 0) * 6;
    const ballsRemaining = Math.max(totalBalls - (activeInnings?.legalBalls || 0), 0);
    const runsRequired = activeInnings?.target ? Math.max(activeInnings.target - activeInnings.runs, 0) : 0;
    const requirement =
        activeInnings?.target && runsRequired > 0
            ? `${battingTeamName} need ${runsRequired} runs in ${ballsRemaining} balls`
            : activeInnings
              ? displayMatch?.result || ""
              : displayMatch?.status === "LIVE" && isLiveSnapshotLoading
                ? ""
              : "Live score will appear once innings starts";
    const currentRunRate = activeInnings?.runRate ?? (activeInnings?.legalBalls ? ((activeInnings.runs * 6) / activeInnings.legalBalls).toFixed(2) : "0.00");
    const requiredRunRate = activeInnings?.target && ballsRemaining ? ((runsRequired * 6) / ballsRemaining).toFixed(2) : "-";
    const topBatter = [...battingRows].sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
    const topBowler = [...bowlingRows].sort((a, b) => (b.wickets || 0) - (a.wickets || 0))[0];
    const fallOfWickets = getFallOfWickets(displaySnapshot);
    const overGraph = getOverGraph(liveSnapshot?.deliveries || []);
    const maxOverRuns = Math.max(...overGraph.map((item) => item.runs), 1);
    const fantasyRows = getFantasyRows(scorecardInnings);

    return (
        <PublicShell contentClassName={styles.matchDetailMain}>
            <Link href="/matches" className={styles.back}>
                &lt;- Back to Matches
            </Link>
            {isLoading && <StateBlock type="loading">Loading match...</StateBlock>}
            {isError && <StateBlock>Unable to load this match.</StateBlock>}
            {displayMatch && (
                <div className={styles.matchDetailLayout}>
                    <div className={styles.matchMainColumn}>
                        <section className={`${styles.card} ${styles.liveHeroCard}`}>
                            <div className={styles.matchHeroMeta}>
                                <div className={styles.matchHeroBadges}>
                                    <StatusBadge status={isMatchOver ? "COMPLETED" : displayMatch.status} />
                                    <span>{seriesName}</span>
                                    <span>{displayMatch.matchNumber || displayMatch.matchType}</span>
                                    <span className={styles.socketState}>{connectionState === "connected" ? "Live sync on" : "Syncing..."}</span>
                                </div>
                                <p>
                                    <MapPin size={15} />
                                    {venue || "Venue TBA"}
                                </p>
                            </div>

                            <div className={styles.liveScoreGrid}>
                                <div className={styles.liveTeamStack}>
                                    <TeamSummary team={battingTeam} tone={getTeamTone(battingTeam, team1Tone)} label="Batting" />
                                    <TeamSummary team={bowlingTeam} tone={getTeamTone(bowlingTeam, team2Tone)} />
                                </div>
                                <div className={styles.liveScoreCenter}>
                                    <h1>{activeInnings ? `${activeInnings.runs}/${activeInnings.wickets}` : "-/-"}</h1>
                                    <strong>vs</strong>
                                    <p>{activeInnings ? `${formatOvers(activeInnings.legalBalls)} Overs` : "Innings not started"}</p>
                                    {resultText ? <span className={styles.matchResultText}>{resultText}</span> : requirement && <span>{requirement}</span>}
                                </div>
                                {!isMatchOver && <div className={styles.currentBatters}>
                                    <div>
                                        <span>Striker</span>
                                        <strong>{getName(activeInnings?.strikerId, "Not set")} *</strong>
                                        <p>{strikerRow ? `${strikerRow.runs} (${strikerRow.balls}) - ${Number(strikerRow.strikeRate ?? getStrikeRate(strikerRow.runs, strikerRow.balls)).toFixed(2)} SR` : "Yet to face"}</p>
                                    </div>
                                    <div>
                                        <span>Non-striker</span>
                                        <strong>{getName(activeInnings?.nonStrikerId, "Not set")}</strong>
                                        <p>{nonStrikerRow ? `${nonStrikerRow.runs} (${nonStrikerRow.balls}) - ${Number(nonStrikerRow.strikeRate ?? getStrikeRate(nonStrikerRow.runs, nonStrikerRow.balls)).toFixed(2)} SR` : "Yet to face"}</p>
                                    </div>
                                </div>}
                                {isMatchOver && (
                                    <div className={styles.matchResultPanel}>
                                        <span>Match over</span>
                                        <strong>{resultText || "Completed"}</strong>
                                    </div>
                                )}
                                <div className={styles.rateBox}>
                                    <div>
                                        <span>CRR</span>
                                        <strong>{currentRunRate}</strong>
                                    </div>
                                    <div>
                                        <span>RRR</span>
                                        <strong>{requiredRunRate}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.lastOverRow}>
                                <span>This Over</span>
                                {currentOverDeliveries.map((delivery, index) => {
                                    const ball = getBallLabel(delivery);
                                    return (
                                    <b key={`${ball}-${index}`} className={ball === "6" ? styles.boundaryBall : ""}>
                                        {ball}
                                    </b>
                                    );
                                })}
                                {!currentOverDeliveries.length && <em>New over started</em>}
                                <div>
                                    Batting: <strong>{battingTeam?.shortName || "TBA"}</strong>
                                    <i />
                                    Bowling: <strong>{bowlingTeam?.shortName || "TBA"}</strong>
                                </div>
                            </div>
                        </section>

                        <nav className={styles.matchTabs} aria-label="Match sections">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={tab === activeTab ? styles.matchTabActive : ""}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {activeTab === "Live" && (
                            <section className={`${styles.card} ${styles.tabPanel}`}>
                                <h2>Live</h2>
                                <div className={styles.liveTabGrid}>
                                    <div>
                                        <span>Batting</span>
                                        <strong>{battingTeamName}</strong>
                                        <p>{activeInnings ? `${activeInnings.runs}/${activeInnings.wickets} in ${formatOvers(activeInnings.legalBalls)} overs` : "Innings not started"}</p>
                                    </div>
                                    <div>
                                        <span>Bowling</span>
                                        <strong>{bowlingTeamName}</strong>
                                        <p>{topBowler ? `${getName(topBowler.player)} ${topBowler.wickets}/${topBowler.runsConceded}` : "Bowling figures pending"}</p>
                                    </div>
                                    <div>
                                        <span>Top batter</span>
                                        <strong>{getName(topBatter?.player, "Top batter")}</strong>
                                        <p>{topBatter ? `${topBatter.runs}${topBatter.isOut ? "" : "*"} (${topBatter.balls}) - ${getStrikeRate(topBatter.runs, topBatter.balls)} SR` : "Batting figures pending"}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === "Scorecard" && (
                        <section className={`${styles.card} ${styles.scorecardPanel}`}>
                            <h2>
                                <TeamFlag team={battingTeam} tone={team1Tone} />
                                Scorecard
                            </h2>
                            <div className={styles.inningsStack}>
                                {scorecardInnings.map((innings) => {
                                    const inningsBattingTeam = getTeamById(displayMatch, innings.battingTeamId) || battingTeam;
                                    const battingScoreRows = innings.battingScorecard || [];
                                    const bowlingScoreRows = innings.bowlingScorecard || [];

                                    return (
                                        <div className={styles.inningsScorecard} key={idOf(innings)}>
                                            <header className={styles.inningsHeader}>
                                                <h3>{getInningsTitle(displayMatch, innings)}</h3>
                                                <strong>{innings.runs}/{innings.wickets} ({formatOvers(innings.legalBalls)} Overs)</strong>
                                            </header>
                                            <div className={styles.scoreTables}>
                                                <div className={styles.tableWrap}>
                                                    <table className={`${styles.table} ${styles.compactTable}`}>
                                                        <thead>
                                                            <tr>
                                                                <th>Batting</th>
                                                                <th />
                                                                <th>R</th>
                                                                <th>B</th>
                                                                <th>4s</th>
                                                                <th>6s</th>
                                                                <th>SR</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {battingScoreRows.map((row) => {
                                                                const dismissal = getDismissal(row);
                                                                const strikeRate = row.strikeRate ?? getStrikeRate(row.runs, row.balls);
                                                                return (
                                                                    <tr key={idOf(row.player)}>
                                                                        <td>{getName(row.player)}</td>
                                                                        <td className={dismissal === "not out" ? styles.greenText : styles.muted}>{dismissal}</td>
                                                                        <td>{row.runs}</td>
                                                                        <td>{row.balls}</td>
                                                                        <td>{row.fours}</td>
                                                                        <td>{row.sixes}</td>
                                                                        <td>{Number(strikeRate).toFixed(2)}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            {!battingScoreRows.length && (
                                                                <tr>
                                                                    <td colSpan="7">Scorecard will appear once innings starts.</td>
                                                                </tr>
                                                            )}
                                                            <tr>
                                                                <td>Extras</td>
                                                                <td />
                                                                <td colSpan="5">{getInningsExtrasText(innings)}</td>
                                                            </tr>
                                                            <tr className={styles.totalRow}>
                                                                <td>Total</td>
                                                                <td />
                                                                <td colSpan="5">
                                                                    {innings.runs}/{innings.wickets} ({formatOvers(innings.legalBalls)} Overs)
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className={styles.tableWrap}>
                                                    <table className={`${styles.table} ${styles.compactTable}`}>
                                                        <thead>
                                                            <tr>
                                                                <th>Bowling</th>
                                                                <th>O</th>
                                                                <th>M</th>
                                                                <th>R</th>
                                                                <th>W</th>
                                                                <th>ER</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bowlingScoreRows.map((row) => {
                                                                const economy = row.economy ?? getEconomy(row.runsConceded, row.legalBalls);
                                                                return (
                                                                    <tr key={idOf(row.player)}>
                                                                        <td>{getName(row.player)}</td>
                                                                        <td>{row.overs || formatOvers(row.legalBalls)}</td>
                                                                        <td>0</td>
                                                                        <td>{row.runsConceded}</td>
                                                                        <td>{row.wickets}</td>
                                                                        <td>{Number(economy).toFixed(2)}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            {!bowlingScoreRows.length && (
                                                                <tr>
                                                                    <td colSpan="6">Bowling figures will appear once innings starts.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <p className={styles.inningsMeta}>
                                                Batting: <strong>{inningsBattingTeam?.shortName || inningsBattingTeam?.name || "TBA"}</strong>
                                                <span>Run rate: <strong>{Number(innings.runRate ?? 0).toFixed(2)}</strong></span>
                                            </p>
                                        </div>
                                    );
                                })}
                                {!scorecardInnings.length && <StateBlock>Scorecard will appear once innings starts.</StateBlock>}
                            </div>
                        </section>
                        )}

                        {activeTab === "Commentary" && (
                        <section className={`${styles.card} ${styles.commentaryPanel}`}>
                            <header>
                                <h2>
                                    <Activity size={18} /> Live Commentary
                                </h2>
                                <button>View All</button>
                            </header>
                            {commentary.map((item) => (
                                <div className={styles.commentaryItem} key={item._id || item.id || item.sequenceNumber}>
                                    <strong>#{item.sequenceNumber}</strong>
                                    <b className={item.types?.includes("SIX") || item.types?.includes("FOUR") ? styles.boundaryBall : ""}>
                                        {item.types?.includes("WICKET") ? "W" : item.types?.includes("SIX") ? "6" : item.types?.includes("FOUR") ? "4" : "-"}
                                    </b>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                            {!commentary.length && <StateBlock>No live commentary yet.</StateBlock>}
                        </section>
                        )}

                        {activeTab === "Fall of Wickets" && (
                            <section className={`${styles.card} ${styles.tabPanel}`}>
                                <h2>Fall of Wickets</h2>
                                <div className={styles.fallList}>
                                    {fallOfWickets.map(({ innings, wickets }) => (
                                        <div key={idOf(innings)}>
                                            <h3>{getInningsTitle(displayMatch, innings)}</h3>
                                            {wickets.map((wicket, index) => (
                                                <p key={`${wicket.score}-${wicket.player}-${index}`}>
                                                    <strong>{wicket.score}</strong>
                                                    <span>{wicket.player}</span>
                                                    <em>{wicket.over} ov</em>
                                                </p>
                                            ))}
                                            {!wickets.length && <span className={styles.muted}>No wickets yet.</span>}
                                        </div>
                                    ))}
                                    {!fallOfWickets.length && <StateBlock>Fall of wickets will appear after wickets.</StateBlock>}
                                </div>
                            </section>
                        )}

                        {activeTab === "Stats" && (
                            <section className={`${styles.card} ${styles.tabPanel}`}>
                                <h2>Stats</h2>
                                <div className={styles.statsGrid}>
                                    <div><span>Total runs</span><strong>{scorecardInnings.reduce((sum, innings) => sum + (innings.runs || 0), 0)}</strong></div>
                                    <div><span>Total wickets</span><strong>{scorecardInnings.reduce((sum, innings) => sum + (innings.wickets || 0), 0)}</strong></div>
                                    <div><span>Boundaries</span><strong>{scorecardInnings.reduce((sum, innings) => sum + (innings.battingScorecard || []).reduce((rowSum, row) => rowSum + (row.fours || 0) + (row.sixes || 0), 0), 0)}</strong></div>
                                    <div><span>Run rate</span><strong>{Number(activeInnings?.runRate || 0).toFixed(2)}</strong></div>
                                </div>
                            </section>
                        )}

                        {activeTab === "Graph" && (
                            <section className={`${styles.card} ${styles.tabPanel}`}>
                                <h2>Graph</h2>
                                <div className={styles.graphList}>
                                    {overGraph.map((item) => (
                                        <div key={item.over}>
                                            <span>Over {item.over}</span>
                                            <b style={{ width: `${Math.max((item.runs / maxOverRuns) * 100, 8)}%` }} />
                                            <strong>{item.runs}</strong>
                                        </div>
                                    ))}
                                    {!overGraph.length && <StateBlock>Run graph will appear once balls are scored.</StateBlock>}
                                </div>
                            </section>
                        )}

                        {activeTab === "Fantasy" && (
                            <section className={`${styles.card} ${styles.tabPanel}`}>
                                <h2>Fantasy</h2>
                                <div className={styles.fantasyList}>
                                    {fantasyRows.map((row, index) => (
                                        <div key={idOf(row.player) || index}>
                                            <strong>{index + 1}</strong>
                                            <span>{getName(row.player)}</span>
                                            <em>{row.detail.slice(0, 2).join(" - ")}</em>
                                            <b>{row.points}</b>
                                        </div>
                                    ))}
                                    {!fantasyRows.length && <StateBlock>Fantasy points will appear once scoring starts.</StateBlock>}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className={styles.matchSideColumn}>
                        <section className={`${styles.card} ${styles.matchInfoPanel}`}>
                            <h2>Match Info</h2>
                            <div className={styles.metaList}>
                                <div className={styles.metaItem}>
                                    <span><Trophy size={16} /> Series</span>
                                    <strong>{seriesName}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><ShieldCheck size={16} /> Match</span>
                                    <strong>{displayMatch.matchNumber || displayMatch.matchType}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><CalendarDays size={16} /> Date</span>
                                    <strong>{formatDate(displayMatch.startTime)}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><Clock size={16} /> Time</span>
                                    <strong>{formatDate(displayMatch.startTime)}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><MapPin size={16} /> Venue</span>
                                    <strong>{venue || "TBA"}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><UsersRound size={16} /> Umpires</span>
                                    <strong>Paul Reiffel, Richard Kettleborough</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><UserRound size={16} /> Referee</span>
                                    <strong>David Boon</strong>
                                </div>
                            </div>
                        </section>

                        <section className={`${styles.card} ${styles.probabilityPanel}`}>
                            <h2>Live Win Probability</h2>
                            <div className={styles.probabilityItem}>
                                <span><TeamFlag team={displayMatch.team1} tone={team1Tone} /> {displayMatch.team1?.name || "Team 1"}</span>
                                <strong>72%</strong>
                                <div><i style={{ width: "72%" }} /></div>
                            </div>
                            <div className={styles.probabilityItem}>
                                <span><TeamFlag team={displayMatch.team2} tone={team2Tone} /> {displayMatch.team2?.name || "Team 2"}</span>
                                <strong>28%</strong>
                                <div><i style={{ width: "28%" }} /></div>
                            </div>
                        </section>

                        <section className={`${styles.card} ${styles.keyPlayersPanel}`}>
                            <h2>Key Players</h2>
                            <div className={styles.keyPlayer}>
                                <TeamFlag team={battingTeam} tone={team1Tone} />
                                <div>
                                    <h3>{getName(topBatter?.player, "Top batter")}</h3>
                                    <strong>{topBatter ? `${topBatter.runs}${topBatter.isOut ? "" : "*"} (${topBatter.balls})` : "-"}</strong>
                                    <p>{topBatter?.fours || 0} 4s <span /> {topBatter?.sixes || 0} 6s <span /> {getStrikeRate(topBatter?.runs, topBatter?.balls)} SR</p>
                                </div>
                            </div>
                            <div className={styles.keyPlayer}>
                                <TeamFlag team={bowlingTeam} tone={team2Tone} />
                                <div>
                                    <h3>{getName(topBowler?.player, "Top bowler")}</h3>
                                    <strong>{topBowler ? `${formatOvers(topBowler.legalBalls)} - ${topBowler.runsConceded} - ${topBowler.wickets}` : "-"}</strong>
                                    <p>{getEconomy(topBowler?.runsConceded, topBowler?.legalBalls)} Economy</p>
                                </div>
                            </div>
                        </section>

                    </aside>
                </div>
            )}
        </PublicShell>
    );
};

export default MatchDetailPage;
