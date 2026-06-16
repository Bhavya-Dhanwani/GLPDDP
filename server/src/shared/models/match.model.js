import mongoose from "mongoose";
import { MATCH_STATUS, MATCH_TYPES } from "../constants/match.constatnts.js";

const playingXIPlayerSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "players",
      required: true,
    },

    isCaptain: {
      type: Boolean,
      default: false,
    },

    isWicketKeeper: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    seriesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },

    matchNumber: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    matchType: {
      type: String,
      enum: Object.values(MATCH_TYPES),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(MATCH_STATUS),
      default: MATCH_STATUS.DRAFT,
    },

    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
      required: true,
    },

    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
      required: true,
    },

    tossWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
    },

    tossDecision: {
      type: String,
      enum: ["BAT", "BOWL"],
    },

    playingXI: {
      team1: [playingXIPlayerSchema],
      team2: [playingXIPlayerSchema],
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
    },

    result: {
      type: String,
      trim: true,
    },

    manOfTheMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "players",
    },

    oversPerInnings: {
      type: Number,
      default: 20,
      min: 1,
      max: 50,
    },

    currentInnings: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.index({
  status: 1,
  startTime: 1,
  isDeleted: 1,
});

matchSchema.index({
  seriesId: 1,
  startTime: 1,
  isDeleted: 1,
});

matchSchema.index({
  team1: 1,
  startTime: 1,
  isDeleted: 1,
});

matchSchema.index({
  team2: 1,
  startTime: 1,
  isDeleted: 1,
});

export const Match = mongoose.model("Match", matchSchema);
