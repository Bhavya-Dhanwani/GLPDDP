// Importing modules
import TeamRepository from "../../../shared/repositories/team.repository.js";
import NotFound from "../../../shared/errors/notfound.error.js";

// class for team service
class TeamService {

    constructor() {

        // initializing the team repository
        this.teamRepository = new TeamRepository();

    }

    // function to get all teams
    async getAllTeams(query) {

        const filters = {};
        
        if (query.name) {
            filters.name = { name: query.name };
        }

        // getting all teams
        const teams = await this.teamRepository.getAllTeams(filters);

        if (!teams.length) {
            throw new NotFound("No teams found");
        }

        // returning the teams
        return teams;

    }

    // function to get a team by id
    async getTeamById(teamId) {

        // getting a team by id
        const team = await this.teamRepository.getTeamById(teamId);

        // returning the team
        if (!team) {
            throw new NotFound("Team not found");
        }

        return team;

    }

}

export default TeamService;