import mongoose from "mongoose";
import { BOUNDARY_TYPES, DISMISSAL_TYPES } from "../constants/scoring.constants.js";

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

const wicketSchema = new mongoose.Schema(
  {
    occurred: { type: Boolean, default: false },
    playerOutId: { type: mongoose.Schema.Types.ObjectId, ref: "players" },
    dismissalType: { type: String, enum: Object.values(DISMISSAL_TYPES) },
    fielderId: { type: mongoose.Schema.Types.ObjectId, ref: "players" },
    countsAsTeamWicket: { type: Boolean, default: true },
    creditedToBowler: { type: Boolean, default: true },
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    inningsId: { type: mongoose.Schema.Types.ObjectId, ref: "Innings", required: true },
    sequenceNumber: { type: Number, required: true, min: 1 },
    legalBallsBefore: { type: Number, required: true, min: 0 },
    isLegalDelivery: { type: Boolean, required: true },
    strikerId: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    nonStrikerId: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    bowlerId: { type: mongoose.Schema.Types.ObjectId, ref: "players", required: true },
    batterRuns: { type: Number, default: 0, min: 0, max: 6 },
    totalRuns: { type: Number, default: 0, min: 0 },
    boundaryType: {
      type: String,
      enum: Object.values(BOUNDARY_TYPES),
      default: BOUNDARY_TYPES.NONE,
    },
    extras: { type: extrasSchema, default: () => ({}) },
    wicket: { type: wicketSchema, default: () => ({}) },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

deliverySchema.index({ inningsId: 1, sequenceNumber: 1 }, { unique: true });
deliverySchema.index({ matchId: 1, inningsId: 1, createdAt: -1 });

export const Delivery = mongoose.model("Delivery", deliverySchema);
