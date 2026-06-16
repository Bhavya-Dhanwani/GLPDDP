import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import { ScoringService } from "../../private/scoring/scoring.service.js";

export default class PublicScoringController {
  constructor() {
    this.scoringService = new ScoringService();
  }

  getSnapshot = async (req, res) => {
    const snapshot = await this.scoringService.getSnapshot(req.params.matchId);
    return ApiResponse(res, 200, "Live score fetched successfully", snapshot);
  };

  getCommentary = async (req, res) => {
    const commentary = await this.scoringService.getCommentary(req.params.matchId, {
      beforeSequence: req.query.beforeSequence
        ? Number(req.query.beforeSequence)
        : undefined,
      limit: req.query.limit ? Number(req.query.limit) : 30,
    });
    return ApiResponse(res, 200, "Commentary fetched successfully", commentary);
  };
}
