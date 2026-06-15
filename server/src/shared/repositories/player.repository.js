// Importing modules
import PlayerModel from "../models/player.model.js";

// Repository class for Player
class PlayerRepository {

    constructor() {

        // Model for Player
        this.playerModel = PlayerModel;

    }

    // Method to create a new player
    async createPlayer(playerData) {

        // Creating a new player instance
        const player = await this.playerModel.create(playerData);

        // Returning the created player
        return player;
        
    }

    async getPlayers(data) {

        // Fetching all players from the database
        const players = await this.playerModel.find({ ...data, isDeleted: false });

        // Returning the list of players
        return players;

    }

    async getPlayerById(id) {

        // Fetching a player by ID from the database
        const player = await this.playerModel.findOne({ _id: id, isDeleted: false });

        // Returning the player
        return player;

    }

    async updatePlayer(id, updateData) {

        // Updating a player by ID in the database
        const updatedPlayer = await this.playerModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true }
        );

        // Returning the updated player
        return updatedPlayer;

    }

    async deletePlayer(id) {

        // Soft deleting a player by ID in the database
        const deletedPlayer = await this.playerModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        // Returning the deleted player
        return deletedPlayer;
    }

    async getDeletedPlayers() {

        // Fetching all deleted players from the database
        const deletedPlayers = await this.playerModel.find({ isDeleted: true });

        // Returning the list of deleted players
        return deletedPlayers;
    }

    async restorePlayer(id) {

        // Restoring a deleted player by ID in the database
        const restoredPlayer = await this.playerModel.findOneAndUpdate(
            { _id: id, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );

        // Returning the restored player
        return restoredPlayer;

    }

}

export default PlayerRepository;
