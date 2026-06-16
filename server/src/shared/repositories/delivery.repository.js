import { Delivery } from "../models/delivery.model.js";

export class DeliveryRepository {
  create(data) {
    return Delivery.create(data);
  }

  findRecentByMatch(matchId, limit = 30) {
    return Delivery.find({ matchId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("strikerId nonStrikerId bowlerId", "name");
  }

  findLastByInnings(inningsId) {
    return Delivery.findOne({ inningsId }).sort({ sequenceNumber: -1 });
  }
}
