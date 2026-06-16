import mongoose from "mongoose";
import { COMMENTARY_TYPES } from "../constants/scoring.constants.js";

const commentarySchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    inningsId: { type: mongoose.Schema.Types.ObjectId, ref: "Innings", required: true },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
    sequenceNumber: { type: Number, required: true, min: 1 },
    text: { type: String, required: true, trim: true },
    types: [{
      type: String,
      enum: Object.values(COMMENTARY_TYPES),
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

commentarySchema.index({ inningsId: 1, sequenceNumber: -1 }, { unique: true });
commentarySchema.index({ matchId: 1, createdAt: -1 });

export const Commentary = mongoose.model("Commentary", commentarySchema);
