"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Activity,
    CalendarDays,
    Clock,
    MapPin,
    MessageCircle,
    Send,
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

const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
          }).format(new Date(value))
        : "TBA";

const liveScore = {
    battingTeamScore: "278/6",
    battingTeamOvers: "45.2 Overs",
    requirement: "India need 45 runs in 28 balls",
    crr: "6.13",
    rrr: "9.64",
    lastOver: ["0", "1", "0", "6", "1", "2"],
    batting: "IND",
    bowling: "AUS",
};

const battingRows = [
    ["Rohit Sharma", "c Maxwell b Starc", "76", "45", "8", "4", "168.89"],
    ["Virat Kohli", "lbw b Hazlewood", "65", "48", "6", "2", "135.42"],
    ["Suryakumar Yadav", "not out", "98", "54", "7", "5", "181.48"],
    ["Rishabh Pant (wk)", "c Carey b Zampa", "24", "16", "2", "1", "150.00"],
    ["Hardik Pandya", "not out", "10", "6", "1", "0", "166.67"],
];

const bowlingRows = [
    ["Mitchell Starc", "9.2", "1", "63", "2", "6.75"],
    ["Josh Hazlewood", "9.0", "0", "52", "1", "5.78"],
    ["Pat Cummins", "8.0", "0", "48", "1", "6.00"],
    ["Adam Zampa", "10.0", "0", "55", "2", "5.50"],
    ["Glenn Maxwell", "5.0", "0", "32", "0", "6.40"],
    ["Marcus Stoinis", "4.0", "0", "28", "0", "7.00"],
];

const commentary = [
    ["45.2", "6", "Starc to Suryakumar Yadav, SIX! That's huge! Over long-on for a big six."],
    ["45.1", "1", "Starc to Suryakumar Yadav, 1 run, full and straight."],
    ["45.0", "0", "Starc to Suryakumar Yadav, dot ball."],
];

const chatMessages = [
    ["Arjun Patel", "What a knock by Surya!", "7:35 PM", "12"],
    ["Rohit Fan Club", "That six was massive!", "7:35 PM", "8"],
    ["AussieLad", "Starc needs to step up here.", "7:35 PM", "3"],
    ["CricketLover99", "India can still win this!", "7:36 PM", "6"],
    ["Virat18", "Come on India! Let's finish strong", "7:36 PM", "9"],
    ["Maxwell Magic", "Zampa is doing well in the middle overs.", "7:36 PM", "4"],
    ["Desi Cricket", "45 needed from 28 balls. Thrilling!", "7:36 PM", "11"],
];

const tabs = ["Live", "Scorecard", "Commentary", "Fall of Wickets", "Stats", "Graph", "Fantasy"];

const getTeamTone = (team, fallback) => {
    const value = `${team?.shortName || ""} ${team?.name || ""}`.toLowerCase();

    if (value.includes("india") || value.includes("ind")) return "india";
    if (value.includes("australia") || value.includes("aus")) return "australia";
    return fallback;
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

const TeamSummary = ({ team, align = "left", tone }) => (
    <div className={`${styles.matchTeam} ${align === "right" ? styles.matchTeamRight : ""}`}>
        <TeamFlag team={team} tone={tone} />
        <div>
            <h2 className={styles.wrapText}>{team?.name || "Team TBA"}</h2>
            <p className={`${styles.muted} ${styles.wrapText}`}>{team?.shortName || "TBA"}</p>
        </div>
    </div>
);

const MatchDetailPage = () => {
    const { id } = useParams();
    const { data: match, isLoading, isError } = useMatchDetail(id);
    const team1Tone = getTeamTone(match?.team1, "india");
    const team2Tone = getTeamTone(match?.team2, "australia");
    const venue = [match?.venue, match?.city].filter(Boolean).join(", ");
    const battingTeamName = match?.team1?.name || "India";
    const bowlingTeamName = match?.team2?.name || "Australia";
    const requirement = liveScore.requirement.replace("India", battingTeamName);

    return (
        <PublicShell contentClassName={styles.matchDetailMain}>
            <Link href="/matches" className={styles.back}>
                &lt;- Back to Matches
            </Link>
            {isLoading && <StateBlock type="loading">Loading match...</StateBlock>}
            {isError && <StateBlock>Unable to load this match.</StateBlock>}
            {match && (
                <div className={styles.matchDetailLayout}>
                    <div className={styles.matchMainColumn}>
                        <section className={`${styles.card} ${styles.liveHeroCard}`}>
                            <div className={styles.matchHeroMeta}>
                                <div className={styles.matchHeroBadges}>
                                    <StatusBadge status={match.status} />
                                    <span>{match.series?.name || "T20 League"}</span>
                                    <span>{match.matchNumber || match.matchType}</span>
                                </div>
                                <p>
                                    <MapPin size={15} />
                                    {venue || "Venue TBA"}
                                </p>
                            </div>

                            <div className={styles.liveScoreGrid}>
                                <TeamSummary team={match.team1} tone={team1Tone} />
                                <div className={styles.liveScoreCenter}>
                                    <h1>{liveScore.battingTeamScore}</h1>
                                    <strong>vs</strong>
                                    <p>{liveScore.battingTeamOvers}</p>
                                    <span>{requirement}</span>
                                </div>
                                <TeamSummary team={match.team2} align="right" tone={team2Tone} />
                                <div className={styles.rateBox}>
                                    <div>
                                        <span>CRR</span>
                                        <strong>{liveScore.crr}</strong>
                                    </div>
                                    <div>
                                        <span>RRR</span>
                                        <strong>{liveScore.rrr}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.lastOverRow}>
                                <span>Last Over</span>
                                {liveScore.lastOver.map((ball, index) => (
                                    <b key={`${ball}-${index}`} className={ball === "6" ? styles.boundaryBall : ""}>
                                        {ball}
                                    </b>
                                ))}
                                <div>
                                    Batting: <strong>{liveScore.batting}</strong>
                                    <i />
                                    Bowling: <strong>{liveScore.bowling}</strong>
                                </div>
                            </div>
                        </section>

                        <nav className={styles.matchTabs} aria-label="Match sections">
                            {tabs.map((tab) => (
                                <button key={tab} className={tab === "Live" ? styles.matchTabActive : ""}>
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        <section className={`${styles.card} ${styles.scorecardPanel}`}>
                            <h2>
                                <TeamFlag team={match.team1} tone={team1Tone} />
                                {battingTeamName} Innings
                            </h2>
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
                                            {battingRows.map(([name, dismissal, runs, balls, fours, sixes, rate]) => (
                                                <tr key={name}>
                                                    <td>{name}</td>
                                                    <td className={dismissal === "not out" ? styles.greenText : styles.muted}>{dismissal}</td>
                                                    <td>{runs}</td>
                                                    <td>{balls}</td>
                                                    <td>{fours}</td>
                                                    <td>{sixes}</td>
                                                    <td>{rate}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td>Extras</td>
                                                <td />
                                                <td colSpan="5">5 (b 0, lb 1, w 3, nb 1, p 0)</td>
                                            </tr>
                                            <tr className={styles.totalRow}>
                                                <td>Total</td>
                                                <td />
                                                <td colSpan="5">278/6 ({liveScore.battingTeamOvers})</td>
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
                                            {bowlingRows.map((row) => (
                                                <tr key={row[0]}>
                                                    {row.map((cell) => (
                                                        <td key={`${row[0]}-${cell}`}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p className={styles.yetToBat}>
                                <strong>Yet to bat:</strong> Shivam Dube, Ravindra Jadeja, Axar Patel, Kuldeep Yadav, Jasprit Bumrah
                            </p>
                        </section>

                        <section className={`${styles.card} ${styles.commentaryPanel}`}>
                            <header>
                                <h2>
                                    <Activity size={18} /> Live Commentary
                                </h2>
                                <button>View All</button>
                            </header>
                            {commentary.map(([over, ball, text]) => (
                                <div className={styles.commentaryItem} key={`${over}-${text}`}>
                                    <strong>{over}</strong>
                                    <b className={ball === "6" ? styles.boundaryBall : ""}>{ball}</b>
                                    <p>{text}</p>
                                </div>
                            ))}
                        </section>
                    </div>

                    <aside className={styles.matchSideColumn}>
                        <section className={`${styles.card} ${styles.matchInfoPanel}`}>
                            <h2>Match Info</h2>
                            <div className={styles.metaList}>
                                <div className={styles.metaItem}>
                                    <span><Trophy size={16} /> Series</span>
                                    <strong>{match.series?.name || "TBA"}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><ShieldCheck size={16} /> Match</span>
                                    <strong>{match.matchNumber || match.matchType}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><CalendarDays size={16} /> Date</span>
                                    <strong>{formatDate(match.startTime)}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    <span><Clock size={16} /> Time</span>
                                    <strong>{formatDate(match.startTime)}</strong>
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
                                <span><TeamFlag team={match.team1} tone={team1Tone} /> {battingTeamName}</span>
                                <strong>72%</strong>
                                <div><i style={{ width: "72%" }} /></div>
                            </div>
                            <div className={styles.probabilityItem}>
                                <span><TeamFlag team={match.team2} tone={team2Tone} /> {bowlingTeamName}</span>
                                <strong>28%</strong>
                                <div><i style={{ width: "28%" }} /></div>
                            </div>
                        </section>

                        <section className={`${styles.card} ${styles.keyPlayersPanel}`}>
                            <h2>Key Players</h2>
                            <div className={styles.keyPlayer}>
                                <TeamFlag team={match.team1} tone={team1Tone} />
                                <div>
                                    <h3>Suryakumar Yadav</h3>
                                    <strong>98* (54)</strong>
                                    <p>7 4s <span /> 5 6s <span /> 181.48 SR</p>
                                </div>
                            </div>
                            <div className={styles.keyPlayer}>
                                <TeamFlag team={match.team2} tone={team2Tone} />
                                <div>
                                    <h3>Mitchell Starc</h3>
                                    <strong>9.2 - 1 - 63 - 2</strong>
                                    <p>6.75 Economy</p>
                                </div>
                            </div>
                        </section>
                    </aside>

                    <aside className={`${styles.card} ${styles.globalChatPanel}`}>
                        <header>
                            <div>
                                <h2>Global Chat</h2>
                                <p><span /> 1,248 Online</p>
                            </div>
                            <MessageCircle size={18} />
                        </header>
                        <div className={styles.chatList}>
                            {chatMessages.map(([name, text, time, likes]) => (
                                <article className={styles.chatItem} key={name}>
                                    <div className={styles.chatAvatar}>{name.slice(0, 1)}</div>
                                    <div>
                                        <h3>{name}<time>{time}</time></h3>
                                        <p>{text}</p>
                                    </div>
                                    <b>{likes}</b>
                                </article>
                            ))}
                        </div>
                        <form className={styles.chatForm}>
                            <input type="text" placeholder="Type a message..." aria-label="Type a message" />
                            <button type="button" aria-label="Send message"><Send size={18} /></button>
                        </form>
                        <small>Please keep the chat respectful. Follow our community guidelines.</small>
                    </aside>
                </div>
            )}
        </PublicShell>
    );
};

export default MatchDetailPage;
