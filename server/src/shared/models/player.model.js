// Importing modules 
import mongoose from "mongoose";
import PLAYER_ROLES from "../constants/playerRoles.constants.js";
import BATTING_STYLES from "../constants/batting.constants.js";
import BOWLING_STYLES from "../constants/bowling.constants.js";

const playerStatsSchema = new mongoose.Schema(
    {
        matches: { type: Number, default: 0, min: 0 },
        innings: { type: Number, default: 0, min: 0 },
        notOuts: { type: Number, default: 0, min: 0 },
        runs: { type: Number, default: 0, min: 0 },
        ballsFaced: { type: Number, default: 0, min: 0 },
        fours: { type: Number, default: 0, min: 0 },
        sixes: { type: Number, default: 0, min: 0 },
        highestScore: { type: Number, default: 0, min: 0 },
        wickets: { type: Number, default: 0, min: 0 },
        ballsBowled: { type: Number, default: 0, min: 0 },
        runsConceded: { type: Number, default: 0, min: 0 },
        wides: { type: Number, default: 0, min: 0 },
        noBalls: { type: Number, default: 0, min: 0 },
    },
    { _id: false }
);

// Making the mongoose schema 
const playerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        image: String,
        role: [
            {
                type: String,
                enum: Object.values(PLAYER_ROLES),
                required: true,
            }
        ],
        country: {
            type: String,
            required: true,
            trim: true
        },
        battingStyle: {
            type: String,
            enum: Object.values(BATTING_STYLES)
        },
        bowlingStyle: {
            type: String,
            enum: Object.values(BOWLING_STYLES)
        },
        stats: { type: playerStatsSchema, default: () => ({}) },
        isDeleted: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
);

// Creating the model
const Player = mongoose.model("players", playerSchema);
export default Player;
