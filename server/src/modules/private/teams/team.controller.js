// Importing modules 
import TeamService from "./team.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";

// class for team controller
class TeamController {

    constructor() {

        // initializing the team service
        this.teamService = new TeamService();

    }

    // function to create a team
    createController = async (req, res) => {

        // accepting the data 
        const { name, shortName, logo, primaryColor } = req.body;
        const userId = req.user.id;

        // creating a team
        const team = await this.teamService.createTeam({ name, shortName, logo, primaryColor, createdBy: userId });

        // sending the response
        return ApiResponse(res, 201, "Team created successfully", team);

    }

    // function to update a team
    updateController = async (req, res) => {

        // accepting the data
        const { name, shortName, logo, primaryColor } = req.body;
        const teamId = req.params.id;
        const userId = req.user.id;

        // updating a team
        const team = await this.teamService.updateTeam(teamId, { name, shortName, logo, primaryColor, updatedBy: userId });

        // sending the response
        return ApiResponse(res, 200, "Team updated successfully", team);

    }

    // function to delete a team
    deleteController = async (req, res) => {

        // accepting the data
        const teamId = req.params.id;

        // deleting a team
        const team = await this.teamService.deleteTeam(teamId);

        // sending the response
        return ApiResponse(res, 204, "");

    }

}

export default TeamController;