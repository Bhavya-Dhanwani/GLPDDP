import mongoose from "mongoose";
import { INNINGS_STATUS } from "../constants/scoring.constants.js";

const extrasSchema = new mongoose.Schema(
  {
    wides: { type: Number, default: 0, min: 0 },
    noBalls: { type: Number, default: 0, min: 0 },
    byes: { type: Number, default: 0, min: 0 },
    legByes: { type: Number, default: 0, min: 0 },
    penalties: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const battingScoreSchema = new mongoose.Schema(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    runs: { type: Number, default: 0, min: 0 },
    balls: { type: Number, default: 0, min: 0 },
    fours: { type: Number, default: 0, min: 0 },
    sixes: { type: Number, default: 0, min: 0 },
    isOut: { type: Boolean, default: false },
    dismissalType: String,
  },
  { _id: false }
);

const bowlingScoreSchema = new mongoose.Schema(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    legalBalls: { type: Number, default: 0, min: 0 },
    runsConceded: { type: Number, default: 0, min: 0 },
    wickets: { type: Number, default: 0, min: 0 },
    wides: { type: Number, default: 0, min: 0 },
    noBalls: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const inningsSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    inningsNumber: { type: Number, required: true, min: 1, max: 2 },
    battingTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "teams", required: true },
    bowlingTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "teams", required: true },
    status: {
      type: String,
      enum: Object.values(INNINGS_STATUS),
      default: INNINGS_STATUS.LIVE,
    },
    runs: { type: Number, default: 0, min: 0 },
    wickets: { type: Number, default: 0, min: 0, max: 10 },
    legalBalls: { type: Number, default: 0, min: 0 },
    extras: { type: extrasSchema, default: () => ({}) },
    strikerId: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    nonStrikerId: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    currentBowlerId: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    battingScorecard: { type: [battingScoreSchema], default: [] },
    bowlingScorecard: { type: [bowlingScoreSchema], default: [] },
    target: { type: Number, min: 1 },
    revision: { type: Number, default: 0, min: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    statsApplied: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

inningsSchema.index({ matchId: 1, inningsNumber: 1 }, { unique: true });
inningsSchema.index({ matchId: 1, status: 1 });

inningsSchema.virtual("overs").get(function () {
  return `${Math.floor(this.legalBalls / 6)}.${this.legalBalls % 6}`;
});

inningsSchema.virtual("runRate").get(function () {
  return this.legalBalls === 0 ? 0 : Number(((this.runs * 6) / this.legalBalls).toFixed(2));
});

inningsSchema.set("toJSON", { virtuals: true });

export const Innings = mongoose.model("Innings", inningsSchema);
