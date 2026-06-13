// Importing modules
import TeamRepository from "../../../shared/repositories/team.repository.js";

// class for team service
class TeamService {

    constructor() {

        // initializing the team repository
        this.teamRepository = new TeamRepository();

    }

    // function to get all teams
    async getAllTeams() {

        // getting all teams
        const teams = await this.teamRepository.getAllTeams();

        // returning the teams
        return teams;

    }

    // function to get a team by id
    async getTeamById(teamId) {

        // getting a team by id
        const team = await this.teamRepository.getTeamById(teamId);

        // returning the team
        return team;

    }

}

export default TeamService;