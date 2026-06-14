import NotFoundError from "../../../shared/errors/notfound.error.js";
import { MatchRepository } from "../../../shared/repositories/match.repository.js";
import { sanitizeMatch, sanitizeMatchList } from "./match.sanitize.js";

// Service class for getting match details for public routes 
export class MatchService {
  constructor() {
    this.matchRepository = new MatchRepository();
  }

  // Get all matche with optional filters - title, city, country, venue, matchType, status, matchNumber and Result
  async getMatches(filters = {}) {
    let matches = await this.matchRepository.findAll(filters);
    let sanitizedMatches = sanitizeMatchList(matches)
    return sanitizedMatches
  }

  // Get match by matchId
  async getMatchById(matchId) {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new NotFoundError("Match not found");
    }

    let sanitizedMatch = sanitizeMatch(match)
    return sanitizedMatch;
  }

  // Get all matches for a given seriesId
  async getMatchesBySeriesId(seriesId) {
    let matches = await this.matchRepository.findBySeriesId(seriesId);
    let sanitizedMatches = sanitizeMatchList(matches)
    return sanitizedMatches;
  }

}