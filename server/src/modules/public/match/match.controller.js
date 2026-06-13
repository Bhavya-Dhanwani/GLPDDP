import { MatchService } from "./match.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js"


export default class MatchController {
    constructor() {
        this.matchService = new MatchService();
    }

    // Get all matches with optional filters - seriesId, teamId, status
    getAllMatches = async (req, res) => {
        const matches = await this.matchService.getMatches(filters);
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }

    // Get match by matchId
    getMatchById = async (req, res) => {
        const { matchId } = req.params.id;
        const match = await this.matchService.getMatchById(matchId);
        return ApiResponse(res, 200, "Match fetched successfully", match)
    }

    // Get all matches for a given seriesId
    getMatchesBySeriesId = async (req, res) => {
        const { seriesId } = req.params.id;
        const matches = await this.matchService.getMatchesBySeriesId(seriesId)
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }

    // Get all matches whose status is LIVE
    getLiveMatches = async (req, res) => {
        const matches = await this.matchService.getLiveMatches();
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }

    // Get all matches whose status is UPCOMING
    getUpcomingMatches = async (req, res) => {
        const matches = await this.matchService.getUpcomingMatches();
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }

    // Get all matches whose status is COMPLETED
    getCompletedMatches = async (req, res) => {
        const matches = await this.matchService.getCompletedMatches();
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }

    // Get matches by status (LIVE, UPCOMING, TOSS_COMPLETED, COMPLETED, etc.)
    getMatchesByStatus = async (req, res) => {
        const { status } = req.body;
        const matches = await this.matchService.getMatchesByStatus(status)
        return ApiResponse(res, 200, "Matches fetched successfully", matches)
    }

}