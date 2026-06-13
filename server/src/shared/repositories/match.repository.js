import { Match } from "../models/match.model.js"

export class MatchRepository {
  constructor() {
    this.matchModel = Match;
  }

  async create(matchData) {
    return this.matchModel.create(matchData);
  }

  async findAll(filter = {}) {
    return this.matchModel
      .find({
        isDeleted: false,
        ...filter,
      })
      .populate("seriesId", "name shortName season")
      .populate("team1", "name shortName logo")
      .populate("team2", "name shortName logo");
  }

  async findById(id) {
    return this.matchModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("seriesId", "name shortName season")
      .populate("team1", "name shortName logo")
      .populate("team2", "name shortName logo")
      .populate("tossWinner", "name shortName")
      .populate("winner", "name shortName");
  }

  async updateById(id, updateData) {
    return this.matchModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async softDelete(id) {
    return this.matchModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      }
    );
  }

  async findBySeriesId(seriesId) {
    return this.matchModel.find({
      seriesId,
      isDeleted: false,
    });
  }

  async findByStatus(status) {
    return this.matchModel.find({
      status,
      isDeleted: false,
    });
  }

  async exists(id) {
    return this.matchModel.exists({
      _id: id,
      isDeleted: false,
    });
  }
}