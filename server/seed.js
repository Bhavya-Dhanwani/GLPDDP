import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Player from "./src/shared/models/player.model.js";
import Team from "./src/shared/models/team.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/glpddp";

const teamsSeed = [
    {
        name: "India",
        shortName: "IND",
        logo: "",
        primaryColor: "#1d4ed8",
        players: [
            { name: "Rohit Sharma", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Shubman Gill", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Virat Kohli", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Shreyas Iyer", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "KL Rahul", role: ["WICKET_KEEPER"], battingStyle: "RIGHT_HAND" },
            { name: "Rishabh Pant", role: ["WICKET_KEEPER"], battingStyle: "LEFT_HAND" },
            { name: "Hardik Pandya", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Ravindra Jadeja", role: ["ALL_ROUNDER"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_SPIN" },
            { name: "Axar Patel", role: ["ALL_ROUNDER"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_SPIN" },
            { name: "Kuldeep Yadav", role: ["BOWLER"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_SPIN" },
            { name: "Jasprit Bumrah", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Mohammed Shami", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Mohammed Siraj", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Yashasvi Jaiswal", role: ["BATSMAN"], battingStyle: "LEFT_HAND" },
            { name: "Suryakumar Yadav", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
        ],
    },
    {
        name: "Australia",
        shortName: "AUS",
        logo: "",
        primaryColor: "#facc15",
        players: [
            { name: "Pat Cummins", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Travis Head", role: ["BATSMAN"], battingStyle: "LEFT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "David Warner", role: ["BATSMAN"], battingStyle: "LEFT_HAND" },
            { name: "Steve Smith", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Marnus Labuschagne", role: ["BATSMAN"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_MEDIUM" },
            { name: "Glenn Maxwell", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "Mitchell Marsh", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_MEDIUM" },
            { name: "Cameron Green", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Alex Carey", role: ["WICKET_KEEPER"], battingStyle: "LEFT_HAND" },
            { name: "Josh Inglis", role: ["WICKET_KEEPER"], battingStyle: "RIGHT_HAND" },
            { name: "Mitchell Starc", role: ["BOWLER"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_FAST" },
            { name: "Josh Hazlewood", role: ["BOWLER"], battingStyle: "LEFT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Adam Zampa", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "Nathan Ellis", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Marcus Stoinis", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_MEDIUM" },
        ],
    },
    {
        name: "England",
        shortName: "ENG",
        logo: "",
        primaryColor: "#ef4444",
        players: [
            { name: "Jos Buttler", role: ["WICKET_KEEPER"], battingStyle: "RIGHT_HAND" },
            { name: "Jonny Bairstow", role: ["WICKET_KEEPER"], battingStyle: "RIGHT_HAND" },
            { name: "Ben Stokes", role: ["ALL_ROUNDER"], battingStyle: "LEFT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Joe Root", role: ["BATSMAN"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "Harry Brook", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Dawid Malan", role: ["BATSMAN"], battingStyle: "LEFT_HAND" },
            { name: "Jason Roy", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Moeen Ali", role: ["ALL_ROUNDER"], battingStyle: "LEFT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "Sam Curran", role: ["ALL_ROUNDER"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_MEDIUM" },
            { name: "Chris Woakes", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_MEDIUM" },
            { name: "Adil Rashid", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "Jofra Archer", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Mark Wood", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Reece Topley", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "LEFT_ARM_FAST" },
            { name: "Liam Livingstone", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
        ],
    },
    {
        name: "New Zealand",
        shortName: "NZ",
        logo: "",
        primaryColor: "#111827",
        players: [
            { name: "Kane Williamson", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Devon Conway", role: ["WICKET_KEEPER"], battingStyle: "LEFT_HAND" },
            { name: "Rachin Ravindra", role: ["ALL_ROUNDER"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_SPIN" },
            { name: "Daryl Mitchell", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_MEDIUM" },
            { name: "Tom Latham", role: ["WICKET_KEEPER"], battingStyle: "LEFT_HAND" },
            { name: "Glenn Phillips", role: ["BATSMAN"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "Will Young", role: ["BATSMAN"], battingStyle: "RIGHT_HAND" },
            { name: "Mark Chapman", role: ["BATSMAN"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_SPIN" },
            { name: "Mitchell Santner", role: ["ALL_ROUNDER"], battingStyle: "LEFT_HAND", bowlingStyle: "LEFT_ARM_SPIN" },
            { name: "Michael Bracewell", role: ["ALL_ROUNDER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
            { name: "Matt Henry", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Tim Southee", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Trent Boult", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "LEFT_ARM_FAST" },
            { name: "Lockie Ferguson", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_FAST" },
            { name: "Ish Sodhi", role: ["BOWLER"], battingStyle: "RIGHT_HAND", bowlingStyle: "RIGHT_ARM_SPIN" },
        ],
    },
];

const buildPlayerDoc = (teamName, player) => ({
    name: player.name,
    image: "",
    role: player.role,
    country: teamName,
    battingStyle: player.battingStyle,
    bowlingStyle: player.bowlingStyle,
});

async function upsertPlayer(teamName, player) {
    return Player.findOneAndUpdate(
        { name: player.name },
        {
            $set: buildPlayerDoc(teamName, player),
            $setOnInsert: {
                stats: {},
                isDeleted: false,
            },
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        }
    );
}

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);

    let playerCount = 0;
    let teamCount = 0;

    for (const team of teamsSeed) {
        const playerDocs = [];

        for (const player of team.players) {
            const playerDoc = await upsertPlayer(team.name, player);
            playerDocs.push(playerDoc);
            playerCount += 1;
        }

        await Team.findOneAndUpdate(
            { name: team.name },
            {
                $set: {
                    name: team.name,
                    shortName: team.shortName,
                    logo: team.logo,
                    primaryColor: team.primaryColor,
                    squadPlayers: playerDocs.map((player) => player._id),
                    isDeleted: false,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        teamCount += 1;
    }

    console.log(`Seed completed: ${playerCount} players processed across ${teamCount} teams.`);
}

seed()
    .then(async () => {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    })
    .catch(async (error) => {
        console.error("Seed failed:", error);
        await mongoose.disconnect();
        process.exit(1);
    });
