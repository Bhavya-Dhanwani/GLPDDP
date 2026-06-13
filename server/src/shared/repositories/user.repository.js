// using the oops to follow lld's strucurture
// importing the user model
import User from '../models/user.model.js';

// making a user repository class
class UserRepository {
    constructor() {
        // initializing the user model
        this.userModel = User;
    }

    // function to find the user by email
    async findUserByEmail(email) {

        // Finding the non deleted users
        const user = await this.userModel.findOne({ email: email, isDeleted: false });
        return user;
    }

    async createUser(userData) {
        // creating the user
        const user = await this.userModel.create(userData);
        return user;
    }

    async updateUser(filter, update) {

        // updating the user
        const user = await this.userModel.findOneAndUpdate(filter, update, { returnDocument: "after"  });
        
        // returning the updated user
        return user;
    }
}

export default UserRepository;