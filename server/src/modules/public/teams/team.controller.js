// Importing necessary modules
import TeamService from "./team.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import NotFound from "../../../shared/errors/notfound.error.js";

// class for team controller
class TeamController {

    constructor() {

        // initializing the team service
        this.teamService = new TeamService();

    }

    // function to get all teams
    getAllController = async (req, res) => {

        // getting all teams
        const teams = await this.teamService.getAllTeams(req.query);

        // sending the response
        return ApiResponse(res, 200, "Teams retrieved successfully", teams);

    }

    // function to get a team by id
    getByIdController = async (req, res) => {

        // accepting the data
        const teamId = req.params.id;

        // getting a team by id
        const team = await this.teamService.getTeamById(teamId);

        // sending the response
        if (team) {
            return ApiResponse(res, 200, "Team retrieved successfully", team);
        }

        throw new NotFound("Team not found");

    }

}

export default TeamController;