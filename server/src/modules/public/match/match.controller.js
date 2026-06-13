import { MatchService } from "./match.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js"


export default class MatchController {
    constructor() {
        this.matchService = new MatchService();
    }

    // Get all matches with optional filters - title, city, country, venue, matchType, status, matchNumber and Result
    getAllMatches = async (req, res) => {
        const matches = await this.matchService.getMatches(req.query);
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }

    // Get match by matchId
    getMatchById = async (req, res) => {
        const { id } = req.params;
        const match = await this.matchService.getMatchById(id);
        return ApiResponse(res, 200, "Match fetched successfully", match)
    }

    // Get all matches for a given seriesId
    getMatchesBySeriesId = async (req, res) => {
        const { seriesId } = req.params;
        const matches = await this.matchService.getMatchesBySeriesId(seriesId)
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }
}