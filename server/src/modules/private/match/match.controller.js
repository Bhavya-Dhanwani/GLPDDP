import { MatchService } from "./match.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js"


export default class MatchController {
    constructor() {
        this.matchService = new MatchService();
    }

    // Create match - expects req.body and authorized req.user.id, returns 201 with created resource
    createMatch = async (req, res) => {
        const match =
            await this.matchService.createMatch(
                req.body,
                req.user.id
            );

        return ApiResponse(res, 201, "Match created successfully", match);
    };

    // Update Match - accepts partial updates, uses req.user.id as updater
    updateMatch = async (req, res) => {
        const match =
            await this.matchService.updateMatch(
                req.params.id,
                req.body,
                req.user.id
            );

        return ApiResponse(res, 200, "Match updated successfully", match);
    };

    // Delete Match (soft-delete) - marks match as deleted and returns updated document
    deleteMatch = async (req, res) => {
        const match =
            await this.matchService.deleteMatch(
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Match deleted successfully", match);
    };

    //  Publish a match by changing its status from "DRAFT" to "UPCOMING"
    publishMatch = async (req, res) => {
        const match =
            await this.matchService.publishMatch(
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

   //   Update the toss information from "UPCOMING" to "TOSS_COMPLETED" with toss winner and toss Decision
    updateToss = async (req, res) => {
        const match =
            await this.matchService.updateToss(
                req.params.id,
                req.body,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

   // Update Match status from "TOSS_COMPLETED" to "PLAYING_XI_SELECTED" along with the selected players of both teams 
    selectPlayingXI = async (req, res) => {
        const match =
            await this.matchService.selectPlayingXI(
                req.params.id,
                req.body,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status and playing-XI updated successfully", match);
    };

    //   Update the status of a match to "LIVE" after the playing XI has been selected
    startMatch = async (req, res) => {
        const match =
            await this.matchService.startMatch(
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

    //  Update the status of a match to "INNINGS_BREAK" during the match
    pauseForInningsBreak = async (req, res) => {
        const match =
            await this.matchService.pauseForInningsBreak(
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

    //  Update the status of a match to "LIVE" and set the current innings to 2 after the innings break
    startSecondInnings = async (req, res) => {
        const match =
            await this.matchService.startSecondInnings(
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

    // Update the status of a match to "ABANDONED" if it cannot be completed or cancelled due to unforeseen circumstances
    abandonMatch = async (req, res) => {
        const match =
            await this.matchService.abandonMatch(
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

     // Update the status of a match to "NO_RESULT" if it cannot be completed due to unforeseen circumstances
    markNoResult = async (req, res) => {
        const match =
            await this.matchService.markNoResult(
                req.params.id,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

    //   Update the status of a match to "COMPLETED" and record the result, winner, manOfTheMatch
    completeMatch = async (req, res) => {
        const match =
            await this.matchService.completeMatch(
                req.params.id,
                req.body,
                req.user.id
            );

        return ApiResponse(res, 200, "Match status updated successfully", match);
    };

}