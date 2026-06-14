export const sanitizeMatch = (match) => ({
    id: match._id,

    series: match.seriesId,

    matchNumber: match.matchNumber,
    title: match.title,

    venue: match.venue,
    city: match.city,
    country: match.country,

    startTime: match.startTime,

    matchType: match.matchType,
    status: match.status,

    team1: match.team1,
    team2: match.team2,

    tossWinner: match.tossWinner,
    tossDecision: match.tossDecision,

    playingXI: match.playingXI,

    currentInnings: match.currentInnings,
    oversPerInnings: match.oversPerInnings,

    winner: match.winner,
    result: match.result,

    manOfTheMatch: match.manOfTheMatch,
});

export const sanitizeMatchList = (matches) =>
    matches.map((match) => sanitizeMatch(match));