// Importing modules 
import mongoose from 'mongoose';

// mkaing the session schema 
const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users',
            index: true
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days
            index: {
                expires: 0
            }
        }
    },
    {
        timestamps: true
    }
);

// making the model from the schema
const Session = mongoose.model("sessions", sessionSchema);

// exporting the model
export default Session;