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

    async getPlayers() {

        // Fetching all players from the database
        const players = await this.playerModel.find();

        // Returning the list of players
        return players;

    }
}