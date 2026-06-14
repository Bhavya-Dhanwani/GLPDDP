// Importing modules
import PlayerRepository from "../../../shared/repositories/player.repository.js";
import NotFound from "../../../shared/errors/notfound.error.js";

// Service class for Player
class PlayerService {

    constructor() {

        // Repository for Player
        this.playerRepository = new PlayerRepository();

    }

    // Method to get all players
    async getPlayers(query) {

        // Building filters based on query parameters
        const filters = {};

        // Adding filters based on query parameters
        if (query.role) {
            filters.role = query.role;
        }

        if (query.battingStyle) {
            filters.battingStyle = query.battingStyle;
        }

        if (query.bowlingStyle) {
            filters.bowlingStyle = query.bowlingStyle;
        }

        if (query.country) {
            filters.country = query.country;
        }

        // Fetching players using the repository with filters
        const players = await this.playerRepository.getPlayers(filters);

        // If no players found, throw a NotFound error
        if (!players.length) {
            throw new NotFound("No players found");
        }

        // Returning the list of players
        return players;

    }

    // Method to get a player by ID
    async getPlayerById(id) {

        // Fetching a player by ID using the repository
        const player = await this.playerRepository.getPlayerById(id);

        if (!player) {
            throw new NotFound(`Player with ID ${id} not found`);
        }

        // Returning the player
        return player;
    }

}

export default PlayerService;