import NotFoundError from "../../../shared/errors/notfound.error.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import { MatchRepository } from "../../../shared/repositories/match.repository.js";
import { sanitizeMatch } from "./match.sanitize.js";
import { MATCH_STATUS } from "../../../shared/constants/match.constatnts.js";


export class MatchService {
    constructor() {
        this.matchRepository = new MatchRepository();
    }

    //   Create a new match
    async createMatch(payload, userId) {
        const matchData = {
            ...payload,
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

        return sanitizedMatch;
    }

    //   Update the toss information for a match with toss winner and toss Decision
    async updateToss(matchId, payload, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.UPCOMING) {
            throw new ConflictError(
                "Toss can only be updated for upcoming matches"
            );
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            tossWinner: payload.tossWinner,
            tossDecision: payload.tossDecision,
            status: MATCH_STATUS.TOSS_COMPLETED,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

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

        return sanitizedMatch;
    }

    //   Update the status of a match to "LIVE" after the playing XI has been selected
    async startMatch(matchId, userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.PLAYING_XI_SELECTED) {
            throw new ConflictError(
                "Playing XI must be selected before starting the match"
            );
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.LIVE,
            currentInnings: 1,
            updateById: userId
        });
        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        return sanitizedMatch;
    }

    //  Update the status of a match to "INNINGS_BREAK" during the match
    async pauseForInningsBreak(matchId,userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.LIVE) {
            throw new ConflictError(
                "Only live matches can enter innings break"
            );
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.INNINGS_BREAK,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        return sanitizedMatch;
    }

    //  Update the status of a match to "LIVE" and set the current innings to 2 after the innings break
    async startSecondInnings(matchId,userId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== MATCH_STATUS.INNINGS_BREAK && match.currentInnings !== 1) {
            throw new ConflictError(
                "Match is not currently in innings break"
            );
        }

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            status: MATCH_STATUS.LIVE,
            currentInnings: 2,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        return sanitizedMatch;
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

        let updatedMatch = await this.matchRepository.updateById(matchId, {
            winner: payload.winner,
            result: payload.result,
            manOfTheMatch: payload.manOfTheMatch,
            status: MATCH_STATUS.COMPLETED,
            updatedBy: userId
        });

        // sanitizing match data
        let sanitizedMatch = sanitizeMatch(updatedMatch);

        return sanitizedMatch;
    }
}