// Importing modules
import Team from "../models/team.model.js";

// class for team repository
class TeamRepository {

    constructor() {

        // initializing the team model
        this.teamModel = Team;

    }

    // function to create a team
    async createTeam(teamData) {

        // creating a team
        const team = await this.teamModel.create(teamData);

        // returning the team
        return team;
    }

    // function to get all teams
    async getAllTeams(filters) {

        // getting all teams
        const teams = await this.teamModel.find({ ...filters, isDeleted: false }).populate('squadPlayers', 'name position');

        // returning the teams
        return teams;
    }

    // function to get a team by id
    async getTeamById(teamId) {

        // getting a team by id
        const team = await this.teamModel.findOne({ _id: teamId, isDeleted: false }).populate('squadPlayers', 'name position');

        // returning the team
        return team;
    }

    // function to update a team
    async updateTeam(teamId, teamData) {
        
        // updating a team
        const team = await this.teamModel.findOneAndUpdate(
            { _id: teamId, isDeleted: false },
            teamData,
            { new: true }
        );

        // returning the updated team
        return team;
    }

    // function to delete a team
    async deleteTeam(teamId) {

        // deleting a team
        const team = await this.teamModel.findOneAndUpdate(
            { _id: teamId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        // returning the deleted team
        return team;
    }
}

export default TeamRepository;