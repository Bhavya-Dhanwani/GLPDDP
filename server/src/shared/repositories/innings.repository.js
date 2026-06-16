import { Innings } from "../models/innings.model.js";

export class InningsRepository {
  create(data) {
    return Innings.create(data);
  }

  findById(id) {
    return Innings.findById(id);
  }

  findByMatch(matchId) {
    return Innings.find({ matchId })
      .sort({ inningsNumber: 1 })
      .populate("battingTeamId bowlingTeamId", "name shortName logo")
      .populate("strikerId nonStrikerId currentBowlerId", "name image")
      .populate("battingScorecard.player bowlingScorecard.player", "name image");
  }

  findByMatchAndNumber(matchId, inningsNumber) {
    return Innings.findOne({ matchId, inningsNumber });
  }

  findLiveByMatch(matchId) {
    return Innings.findOne({ matchId, status: "LIVE" }).sort({ inningsNumber: -1 });
  }
}
