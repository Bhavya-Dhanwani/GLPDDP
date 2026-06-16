import { Delivery } from "../models/delivery.model.js";

export class DeliveryRepository {
  create(data) {
    return Delivery.create(data);
  }

  findRecentByMatch(matchId, limit = 30, inningsIds = []) {
    return Delivery.find(this.matchOrInningsQuery(matchId, inningsIds))
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("strikerId nonStrikerId bowlerId wicket.playerOutId wicket.fielderId nextBatterId", "name image");
  }

  findByMatch(matchId, inningsIds = []) {
    return Delivery.find(this.matchOrInningsQuery(matchId, inningsIds))
      .sort({ inningsId: 1, sequenceNumber: 1, createdAt: 1 })
      .populate("strikerId nonStrikerId bowlerId wicket.playerOutId wicket.fielderId nextBatterId", "name image");
  }

  matchOrInningsQuery(matchId, inningsIds = []) {
    const validInningsIds = (inningsIds || []).filter(Boolean);
    if (!validInningsIds.length) return { matchId };
    return {
      $or: [
        { matchId },
        { inningsId: { $in: validInningsIds } },
      ],
    };
  }

  findLastByInnings(inningsId) {
    return Delivery.findOne({ inningsId }).sort({ sequenceNumber: -1 });
  }
}
