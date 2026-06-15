// Importing modules
import playerService from "./player.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";

// Controller class for Player
class PlayerController {

    constructor() {

        // Service for Player
        this.playerService = new playerService();

    }

    // Method to create a new player
    createPlayer = async (req, res, next) => {

        // accepting the data 
        const { name, image, country, battingStyle, bowlingStyle, role } = req.body;
    
        // Creating a new player using the service
        const player = await this.playerService.createPlayer(
            { name, image, country, battingStyle, bowlingStyle, role },
            req.user.id
        );

        // Returning the response
        return ApiResponse(res, 201, "Player created successfully", player);

    }

    // Method to update a player by ID
    updatePlayer = async (req, res, next) => {

        // accepting the ID from params
        const { id } = req.params;

        // accepting the data
        const { name, image, country, battingStyle, bowlingStyle, role } = req.body;

        // Updating a player by ID using the service
        const updatedPlayer = await this.playerService.updatePlayer(
            id,
            { name, image, country, battingStyle, bowlingStyle, role },
            req.user.id
        );

        // Returning the response
        return ApiResponse(res, 200, "Player updated successfully", updatedPlayer);
    }

    // Method to delete a player by ID
    deletePlayer = async (req, res, next) => {

        // accepting the ID from params
        const { id } = req.params;

        // Deleting a player by ID using the service
        const deletedPlayer = await this.playerService.deletePlayer(id);

        // Returning the response
        return ApiResponse(res, 200, "Player deleted successfully", deletedPlayer);
    }

    // Method to get deleted players
    getDeletedPlayers = async (req, res, next) => {

        // Fetching deleted players using the service
        const deletedPlayers = await this.playerService.getDeletedPlayers();

        // Returning the response
        return ApiResponse(res, 200, "Deleted players fetched successfully", deletedPlayers);

    }

    restorePlayer = async (req, res, next) => {

        // accepting the ID from params
        const { id } = req.params;

        // Restoring a deleted player by ID using the service
        const restoredPlayer = await this.playerService.restorePlayer(id);

        // Returning the response
        return ApiResponse(res, 200, "Player restored successfully", restoredPlayer);

    }

}

export default PlayerController;
