import NotFoundError from "../../../shared/errors/notfound.error.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import { MatchRepository } from "../../../shared/repositories/match.repository.js";
import { sanitizeMatch } from "./match.sanitize.js";
import { MATCH_STATUS } from "../../../shared/constants/match.constatnts.js";
import { MATCH_OVERS } from "../../../shared/constants/match.constatnts.js";
import BadRequest from "../../../shared/errors/badrequest.error.js";
import TeamRepository from "../../../shared/repositories/team.repository.js";
import { InningsRepository } from "../../../shared/repositories/innings.repository.js";
import { emitMatchEvent } from "../../../socket/socket.server.js";
import { INNINGS_STATUS } from "../../../shared/constants/scoring.constants.js";


export class MatchService {
    constructor() {
        this.matchRepository = new MatchRepository();
        this.teamRepository = new TeamRepository();
        this.inningsRepository = new InningsRepository();
    }

    //   Create a new match
    async createMatch(payload, userId) {
        const matchData = {
            ...payload,
            oversPerInnings: payload.oversPerInnings ?? MATCH_OVERS[payload.matchType],
            createdBy: userId,
        }

        let match = await this.matchRepository.create(matchData);

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(match);

        return sanitizedMatch;
    }

    //   Update an existing match by its ID
    async updateMatch(matchId, payload, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        const updateData = {
            ...payload,
            updatedBy: userId,
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, updateData);

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    //   Delete a match by its ID (soft delete)
    async deleteMatch(matchId, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        let deletedMatch = await this.matchRepository.softDelete(matchId, userId);

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(deletedMatch);

        return sanitizedMatch;
    }

    //  Publish a match by changing its status from "DRAFT" to "UPCOMING"
    async publishMatch(matchId, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.DRAFT) {
            throw new ConflictError(
                "Only draft matches can be published"
            );
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.UPCOMING,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    //   Update the toss information for a match with toss winner and toss Decision
    async updateToss(matchId, payload, userId) {
        const match = await this.matchRepository.findById(matchId);
        console.log(userId);
        

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.UPCOMING) {
            throw new ConflictError(
                "Toss can only be updated for upcoming matches"
            );
        }

        // const matchTeamIds = [
        //     String(match.team1?._id ?? match.team1),
        //     String(match.team2?._id ?? match.team2),
        // ];
        // if (!matchTeamIds.includes(String(payload.tossWinner))) {
        //     throw new BadRequest("Toss winner must be one of the match teams");
        // }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            tossWinner: payload.tossWinner,
            tossDecision: payload.tossDecision,
            status: MATCH_STATUS.TOSS_COMPLETED,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    // Update Match status from "TOSS_COMPLETED" to "PLAYING_XI_SELECTED" along with both teams 
    async selectPlayingXI(matchId, payload, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.TOSS_COMPLETED) {
            throw new ConflictError(
                "Playing XI can only be selected after the toss is completed"
            );
        }

        await this.validatePlayingXI(match, payload);

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            playingXI: {
                team1: payload.team1,
                team2: payload.team2,
            },
            status: MATCH_STATUS.PLAYING_XI_SELECTED,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    //   Update the status of a match to "LIVE" after the playing XI has been selected
    async startMatch(matchId, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        const team1XI = match.playingXI?.team1 || [];
        const team2XI = match.playingXI?.team2 || [];
        const hasPlayingXI = team1XI.length === 11 && team2XI.length === 11;
        const buildXIFromSquad = (team) =>
            (team?.squadPlayers || []).slice(0, 11).map((player, index) => ({
                player: player._id ?? player,
                isCaptain: index === 0,
                isWicketKeeper: index === 1,
            }));
        const team1SquadXI = buildXIFromSquad(match.team1);
        const team2SquadXI = buildXIFromSquad(match.team2);
        const canUseSquadXI = team1SquadXI.length === 11 && team2SquadXI.length === 11;

        if (
            match.status !== MATCH_STATUS.PLAYING_XI_SELECTED &&
            !(match.status === MATCH_STATUS.TOSS_COMPLETED && (hasPlayingXI || canUseSquadXI))
        ) {
            throw new ConflictError(
                "Playing XI must be selected before starting the match. Add at least 11 squad players to both teams."
            );
        }

        const updateData = {
            status: MATCH_STATUS.LIVE,
            currentInnings: 1,
            updatedBy: userId
        };
        if (!hasPlayingXI && canUseSquadXI) {
            updateData.playingXI = {
                team1: team1SquadXI,
                team2: team2SquadXI,
            };
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, updateData);
        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    //  Update the status of a match to "INNINGS_BREAK" during the match
    async pauseForInningsBreak(matchId,userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status === MATCH_STATUS.INNINGS_BREAK) {
            return sanitizeMatch(match);
        }

        if (match.status !== MATCH_STATUS.LIVE) {
            throw new ConflictError(
                "Only live matches can enter innings break"
            );
        }

        const firstInnings = await this.inningsRepository.findByMatchAndNumber(matchId, 1);
        if (!firstInnings || firstInnings.status !== INNINGS_STATUS.COMPLETED) {
            throw new ConflictError("First innings must be completed before innings break");
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.INNINGS_BREAK,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    //  Update the status of a match to "LIVE" and set the current innings to 2 after the innings break
    async startSecondInnings(matchId,userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.INNINGS_BREAK || ![1, 2].includes(match.currentInnings)) {
            throw new ConflictError(
                "Match is not currently in innings break"
            );
        }

        const firstInnings = await this.inningsRepository.findByMatchAndNumber(matchId, 1);
        if (!firstInnings || firstInnings.status !== INNINGS_STATUS.COMPLETED) {
            throw new ConflictError("First innings must be completed before starting the second innings");
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.LIVE,
            currentInnings: 2,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    async validatePlayingXI(match, payload) {
        const team1Id = match.team1._id ?? match.team1;
        const team2Id = match.team2._id ?? match.team2;
        const [team1, team2] = await Promise.all([
            this.teamRepository.getTeamById(team1Id),
            this.teamRepository.getTeamById(team2Id),
        ]);

        if (!team1 || !team2) {
            throw new NotFoundError("One or both match teams were not found");
        }

        this.validateTeamPlayingXI(payload.team1, team1, "Team 1");
        this.validateTeamPlayingXI(payload.team2, team2, "Team 2");

        const team1Players = new Set(payload.team1.map(({ player }) => String(player)));
        if (payload.team2.some(({ player }) => team1Players.has(String(player)))) {
            throw new BadRequest("A player cannot be selected for both Playing XIs");
        }
    }

    validateTeamPlayingXI(playingXI, team, label) {
        const playerIds = playingXI.map(({ player }) => String(player));
        const uniquePlayerIds = new Set(playerIds);

        if (uniquePlayerIds.size !== 11) {
            throw new BadRequest(`${label} Playing XI must contain 11 unique players`);
        }

        const squadPlayerIds = new Set(
            team.squadPlayers.map((player) => String(player._id ?? player))
        );

        if (playerIds.some((playerId) => !squadPlayerIds.has(playerId))) {
            throw new BadRequest(`${label} Playing XI contains a player outside the team squad`);
        }

        const captainCount = playingXI.filter(({ isCaptain }) => isCaptain).length;
        const wicketKeeperCount = playingXI.filter(({ isWicketKeeper }) => isWicketKeeper).length;

        if (captainCount !== 1) {
            throw new BadRequest(`${label} Playing XI must contain exactly one captain`);
        }

        if (wicketKeeperCount !== 1) {
            throw new BadRequest(`${label} Playing XI must contain exactly one wicketkeeper`);
        }
    }

    // Update the status of a match to "ABANDONED" if it cannot be completed or cancelled due to unforeseen circumstances
    async abandonMatch(matchId, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (
            match.status === MATCH_STATUS.COMPLETED ||
            match.status === MATCH_STATUS.ABANDONED
        ) {
            throw new ConflictError(
                "Match cannot be abandoned"
            );
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.ABANDONED,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    // Update the status of a match to "NO_RESULT" if it cannot be completed due to unforeseen circumstances
    async markNoResult(matchId,userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (
            match.status === MATCH_STATUS.COMPLETED ||
            match.status === MATCH_STATUS.ABANDONED
        ) {
            throw new ConflictError(
                "Cannot mark completed match as no result"
            );
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.NO_RESULT,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        return sanitizedMatch;
    }

    //   Update the status of a match to "COMPLETED" and record the result, winner
    async completeMatch(matchId, payload,userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (
            match.status !== MATCH_STATUS.LIVE &&
            match.status !== MATCH_STATUS.INNINGS_BREAK
        ) {
            throw new ConflictError(
                "Only live matches can be completed"
            );
        }

        const secondInnings = await this.inningsRepository.findByMatchAndNumber(matchId, 2);
        if (!secondInnings || secondInnings.status !== INNINGS_STATUS.COMPLETED) {
            throw new ConflictError("Second innings must be completed before completing the match");
        }

        const matchTeamIds = [String(match.team1._id ?? match.team1), String(match.team2._id ?? match.team2)];
        if (!matchTeamIds.includes(String(payload.winner))) {
            throw new BadRequest("Winner must be one of the match teams");
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            winner: payload.winner,
            result: payload.result,
            manOfTheMatch: payload.manOfTheMatch,
            status: MATCH_STATUS.COMPLETED,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        emitMatchEvent(matchId, "match:updated", sanitizedMatch);
        emitMatchEvent(matchId, "match:completed", sanitizedMatch);
        return sanitizedMatch;
    }
}
