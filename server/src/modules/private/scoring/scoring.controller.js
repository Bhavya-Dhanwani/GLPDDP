import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import { ScoringService } from "./scoring.service.js";

export default class ScoringController {
  constructor() {
    this.scoringService = new ScoringService();
  }

  startInnings = async (req, res) => {
    const innings = await this.scoringService.startInnings(
      req.params.matchId,
      req.body,
      req.user.id
    );
    return ApiResponse(res, 201, "Innings started successfully", innings);
  };

  recordDelivery = async (req, res) => {
    const result = await this.scoringService.recordDelivery(
      req.params.inningsId,
      req.body,
      req.user.id
    );
    return ApiResponse(res, 201, "Delivery recorded successfully", result);
  };

  updateCurrentPlayers = async (req, res) => {
    const innings = await this.scoringService.updateCurrentPlayers(
      req.params.inningsId,
      req.body,
      req.user.id
    );
    return ApiResponse(res, 200, "Current players updated successfully", innings);
  };

  addManualCommentary = async (req, res) => {
    const commentary = await this.scoringService.addManualCommentary(
      req.params.matchId,
      req.body,
      req.user.id
    );
    return ApiResponse(res, 201, "Commentary added successfully", commentary);
  };
}
