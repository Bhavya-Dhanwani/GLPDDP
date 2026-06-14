// Importing modules
import PlayerService from "./player.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";

// Controller class for Player
class PlayerController {

    constructor() {

        // Service for Player
        this.playerService = new PlayerService();

    }

    // Method to get all players
    getPlayers = async (req, res, next) => {

        // Fetching players using the service
        const players = await this.playerService.getPlayers(req.query);

        // Returning the response
        return ApiResponse(res, 200, "Players fetched successfully", players);

    }

    // Method to get a player by ID
    getPlayerById = async (req, res, next) => {
     
        const { id } = req.params;

        // Fetching a player by ID using the service
        const player = await this.playerService.getPlayerById(id);
     
        // Returning the response
        return ApiResponse(res, 200, "Player fetched successfully", player);
    }

}

export default PlayerController;