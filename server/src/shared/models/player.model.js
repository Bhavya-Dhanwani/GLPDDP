// Importing modules 
import mongoose from "mongoose";
import PLAYER_ROLES from "../constants/playerRoles.constants.js";
import BATTING_STYLES from "../constants/batting.constants.js";
import BOWLING_STYLES from "../constants/bowling.constants.js";

// Making the mongoose schema 
const playerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
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