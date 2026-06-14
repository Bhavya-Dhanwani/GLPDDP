// Importing modules
import TeamRepository from "../../../shared/repositories/team.repository.js";

// class for team service
class TeamService {

    constructor() {

        // initializing the team repository
        this.teamRepository = new TeamRepository();

    }

    // function to create a team
    async createTeam(teamData) {

        // creating a team
        const team = await this.teamRepository.createTeam(teamData);

        // returning the team
        return team;

    }

    // function to update a team
    async updateTeam(teamId, teamData) {

        // updating a team
        const team = await this.teamRepository.updateTeam(teamId, teamData);

        // returning the updated team
        return team;

    }

    // function to delte a team 
    async deleteTeam(teamId) {
        
        // deleting a team
        const team = await this.teamRepository.deleteTeam(teamId);

        // returning the deleted team
        return team;

    }

}

export default TeamService;