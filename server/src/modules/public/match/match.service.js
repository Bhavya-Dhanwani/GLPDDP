import NotFoundError from "../../../shared/errors/notfound.error.js";
import { MatchRepository } from "../../../shared/repositories/match.repository.js";

// Service class for getting match details for public routes 
export class MatchService {
  constructor() {
    this.matchRepository = new MatchRepository();
  }

  // Get all matche with optional filters - seriesId, teamId, status
  async getMatches(filters = {}) {
    return this.matchRepository.findAll(filters);
  }

  // Get match by matchId
  async getMatchById(matchId) {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new NotFoundError("Match not found");
    }

    return match;
  }

  // Get all matches for a given seriesId
  async getMatchesBySeriesId(seriesId) {
    return this.matchRepository.findBySeriesId(seriesId);
  }

  // Get all matches whose status is LIVE
  async getLiveMatches() {
    return this.matchRepository.findByStatus("LIVE");
  }

  // Get all matches whose status is UPCOMING
  async getUpcomingMatches() {
    return this.matchRepository.findByStatus("UPCOMING");
  }

  // Get all matches whose status is COMPLETED
  async getCompletedMatches() {
    return this.matchRepository.findByStatus("COMPLETED");
  }

  // Get matches by status (LIVE, UPCOMING, TOSS_COMPLETED, COMPLETED, etc.)
  async getMatchesByStatus(status) {
    return this.matchRepository.findByStatus(status);
  }
}