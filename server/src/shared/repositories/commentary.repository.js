import { Commentary } from "../models/commentary.model.js";

export class CommentaryRepository {
  create(data) {
    return Commentary.create(data);
  }

  findRecentByMatch(matchId, limit = 30) {
    return Commentary.find({ matchId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  findLatestByInnings(inningsId) {
    return Commentary.findOne({ inningsId }).sort({ sequenceNumber: -1 });
  }

  findByMatch(matchId, { beforeSequence, limit = 30 } = {}) {
    const query = { matchId };
    if (beforeSequence) query.sequenceNumber = { $lt: beforeSequence };

    return Commentary.find(query)
      .sort({ sequenceNumber: -1 })
      .limit(limit);
  }
}
