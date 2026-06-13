import NotFoundError from "../../../shared/errors/notfound.error.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import { MatchRepository } from "../../../shared/repositories/match.repository.js";


export class MatchService {
    constructor() {
        this.matchRepository = new MatchRepository();
    }

    //   Create a new match
    async createMatch(payload) {
        return this.matchRepository.create(payload);
    }

    //   Update an existing match by its ID
    async updateMatch(matchId, payload) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        return this.matchRepository.updateById(matchId, payload);
    }

    //   Delete a match by its ID (soft delete)
    async deleteMatch(matchId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        return this.matchRepository.softDelete(matchId);
    }

    //  Publish a match by changing its status from "DRAFT" to "UPCOMING"
    async publishMatch(matchId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== "DRAFT") {
            throw new ConflictError(
                "Only draft matches can be published"
            );
        }

        return this.matchRepository.updateById(matchId, {
            status: "UPCOMING",
        });
    }

    //   Update the toss information for a match
    async updateToss(matchId, payload) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== "UPCOMING") {
            throw new ConflictError(
                "Toss can only be updated for upcoming matches"
            );
        }

        return this.matchRepository.updateById(matchId, {
            tossWinner: payload.tossWinner,
            tossDecision: payload.tossDecision,
            status: "TOSS_COMPLETED",
        });
    }

    async selectPlayingXI(matchId, payload) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== "TOSS_COMPLETED") {
            throw new ConflictError(
                "Playing XI can only be selected after the toss is completed"
            );
        }

        return this.matchRepository.updateById(matchId, {
            team1PlayingXI: payload.team1PlayingXI,
            team2PlayingXI: payload.team2PlayingXI,
            status: "PLAYING_XI_SELECTED",
        });
    }

    //   Update the status of a match to "LIVE" after the playing XI has been selected
    async startMatch(matchId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== "PLAYING_XI_SELECTED") {
            throw new ConflictError(
                "Playing XI must be selected before starting the match"
            );
        }

        return this.matchRepository.updateById(matchId, {
            status: "LIVE",
            currentInnings: 1,
        });
    }

    //  Update the status of a match to "INNINGS_BREAK" during the match
    async pauseForInningsBreak(matchId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== "LIVE") {
            throw new ConflictError(
                "Only live matches can enter innings break"
            );
        }

        return this.matchRepository.updateById(matchId, {
            status: "INNINGS_BREAK",
        });
    }

    //  Update the status of a match to "LIVE" and set the current innings to 2 after the innings break
    async startSecondInnings(matchId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (match.status !== "INNINGS_BREAK" && match.currentInnings !== 1) {
            throw new ConflictError(
                "Match is not currently in innings break"
            );
        }

        return this.matchRepository.updateById(matchId, {
            status: "LIVE",
            currentInnings: 2,
        });
    }

    // Update the status of a match to "ABANDONED" if it cannot be completed or cancelled due to unforeseen circumstances
    async abandonMatch(matchId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (
            match.status === "COMPLETED" ||
            match.status === "ABANDONED"
        ) {
            throw new ConflictError(
                "Match cannot be abandoned"
            );
        }

        return this.matchRepository.updateById(matchId, {
            status: "ABANDONED",
        });
    }

    // Update the status of a match to "NO_RESULT" if it cannot be completed due to unforeseen circumstances
    async markNoResult(matchId) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (
            match.status === "COMPLETED" ||
            match.status === "ABANDONED"
        ) {
            throw new ConflictError(
                "Cannot mark completed match as no result"
            );
        }

        return this.matchRepository.updateById(matchId, {
            status: "NO_RESULT",
        });
    }

    //   Update the status of a match to "COMPLETED" and record the result, winner
    async completeMatch(matchId, payload) {
        const match = await this.matchRepository.findById(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        if (
            match.status !== "LIVE" &&
            match.status !== "INNINGS_BREAK"
        ) {
            throw new ConflictError(
                "Only live matches can be completed"
            );
        }

        return this.matchRepository.updateById(matchId, {
            winner: payload.winner,
            result: payload.result,
            manOfTheMatch: payload.manOfTheMatch,
            status: "COMPLETED",
        });
    }
}