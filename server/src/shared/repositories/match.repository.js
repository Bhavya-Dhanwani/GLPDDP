import { Match } from "../models/match.model.js"

// Repository class for Match model to interact with the database
export class MatchRepository {
  constructor() {
    this.matchModel = Match;
  }

  // Create a new Match document in database
  async create(matchData) {
    return this.matchModel.create(matchData);
  }

  // Update a Match document by its ID only if it is not soft deleted
  async updateById(id, updateData) {
    return this.matchModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );
  }

  // Soft delete a Match document by its ID by setting isDeleted to true
  async softDelete(id, userId) {
    return this.matchModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        updatedBy: userId
      },
      {
        returnDocument: 'after',
      }
    );
  }

  // Find all Matches that are not soft deleted with optional filters - title, city, country, venue, matchType, status, matchNumber and Result
  async findAll(filters = {}) {
    const query = {
      isDeleted: false,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      query[key] =
        typeof value === "string"
          ? {
            $regex: value,
            $options: "i",
          }
          : value;
    });

    return this.matchModel
      .find(query)
      .populate("seriesId", "name shortName season")
      .populate("team1", "name shortName logo")
      .populate("team2", "name shortName logo");
  }

  // Find a Match by its ID 
  async findById(id) {
    return this.matchModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("seriesId", "name shortName season")
      .populate({
        path: "team1",
        select: "name shortName logo squadPlayers",
        populate: { path: "squadPlayers", select: "name image role battingStyle bowlingStyle" },
      })
      .populate({
        path: "team2",
        select: "name shortName logo squadPlayers",
        populate: { path: "squadPlayers", select: "name image role battingStyle bowlingStyle" },
      })
      .populate("tossWinner", "name shortName")
      .populate("winner", "name shortName")
      .populate("playingXI.team1.player", "name image role battingStyle bowlingStyle")
      .populate("playingXI.team2.player", "name image role battingStyle bowlingStyle")
      .populate("manOfTheMatch", "name image");
  }

  // Find Matches by seriesId
  async findBySeriesId(seriesId) {
    return this.matchModel
      .find({
        seriesId,
        isDeleted: false,
      })
      .populate("seriesId", "name shortName season")
      .populate("team1", "name shortName logo")
      .populate("team2", "name shortName logo");
  }

  // Find Matches by status (LIVE, UPCOMING, COMPLETED, etc.)
  async findByStatus(status) {
    return this.matchModel.find({
      status,
      isDeleted: false,
    });
  }

  // Check if a Match exists by its ID 
  async exists(id) {
    return this.matchModel.exists({
      _id: id,
      isDeleted: false,
    });
  }
}
