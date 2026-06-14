// Importing modules
import PlayerRepository from "../../../shared/repositories/player.repository.js";
import NotFound from "../../../shared/errors/notfound.error.js";

// Service class for Player
class PlayerService {

    constructor() {

        // Repository for Player
        this.playerRepository = new PlayerRepository();

    }

    // Method to create a new player
    async createPlayer(playerData) {

        // Creating a new player using the repository
        const player = await this.playerRepository.createPlayer(playerData);

        return player;
    }

    // Method to update a player by ID

    async updatePlayer(id, updateData) {

        // Updating a player by ID using the repository
        const updatedPlayer = await this.playerRepository.updatePlayer(id, updateData);

        if (!updatedPlayer) {
            throw new NotFound(`Player with ID ${id} not found`);
        }

        return updatedPlayer;

    }

    // Method to delete a player by ID
    async deletePlayer(id) {

        // Deleting a player by ID using the repository
        const deletedPlayer = await this.playerRepository.deletePlayer(id);

        if (!deletedPlayer) {
            throw new NotFound(`Player with ID ${id} not found`);
        }

        return deletedPlayer;

    }

    // Method to get deleted players
    async getDeletedPlayers() {

        // Fetching deleted players using the repository
        const deletedPlayers = await this.playerRepository.getDeletedPlayers();

        if (!deletedPlayers.length) {
            throw new NotFound("No deleted players found");
        }

        return deletedPlayers;
    }

    // Method to restore a deleted player by ID
    async restorePlayer(id) {

        // Restoring a deleted player by ID using the repository
        const restoredPlayer = await this.playerRepository.restorePlayer(id);

        if (!restoredPlayer) {
            throw new NotFound(`Player with ID ${id} not found or not deleted`);
        }

        return restoredPlayer;
    }

}

export default PlayerService;