// Importing modules
import Token from './token.model.js';

// class to communicate with the tokens from database 
class TokenRepository {

    constructor() {

        // setting the token model
        this.tokenModel = Token;
    }

    // method to create a token
    async createToken(tokenData) {
 
        // creating the token
        const token = await this.tokenModel.create(tokenData);
 
        // returning the token
        return token;
    }

    // method to find one token
    async findOneToken(data) {
 
        // finding the token
        const token = await this.tokenModel.findOne(data);
 
        //returning the token
        return token;
    }

    // method to delete one token
    async deleteToken(data) {
     
        // deleting the token
        const token = await this.tokenModel.deleteOne(data);
     
        // returning the token
        return token;
    }

    async updateOneToken(filter, update) {

        // updating the token
        const token = await this.tokenModel.findOneAndUpdate(filter, update, { new: true });

        // returning the token
        return token;
    }
}

export default TokenRepository;