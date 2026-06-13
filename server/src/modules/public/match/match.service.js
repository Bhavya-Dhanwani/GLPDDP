import NotFoundError from "../../../shared/errors/notfound.error.js";
import { MatchRepository } from "../../../shared/repositories/match.repository.js";


export class MatchService {
  constructor() {
    this.matchRepository = new MatchRepository();
  }

  async getMatches(filters = {}) {
    return this.matchRepository.findAll(filters);
  }

  async getMatchById(matchId) {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new NotFoundError("Match not found");
    }

    return match;
  }

  async getMatchesBySeries(seriesId) {
    return this.matchRepository.findBySeriesId(seriesId);
  }

  async getLiveMatches() {
    return this.matchRepository.findByStatus("LIVE");
  }

  async getUpcomingMatches() {
    return this.matchRepository.findByStatus("UPCOMING");
  }

  async getCompletedMatches() {
    return this.matchRepository.findByStatus("COMPLETED");
  }

  async getMatchesByStatus(status) {
    return this.matchRepository.findByStatus(status);
  }
}