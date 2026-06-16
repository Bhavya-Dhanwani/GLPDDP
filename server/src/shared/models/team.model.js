// Importing modules
import mongoose from 'mongoose';

// Defining the team schema
const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        shortName: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        logo: {
            type: String,
            default: ""
        },
        primaryColor: String,
        squadPlayers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "players"
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
    },
    {
        timestamps: true
    }
);

// making the team model 
const Team = mongoose.model('teams', teamSchema);

// exporting the team model
export default Team;
