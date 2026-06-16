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
        const user = await this.userModel.findOneAndUpdate(filter, update, { returnDocument: "after"  }).select("-password");
        
        // returning the updated user
        return user;
    }

    async getAllusers() {

        // getting all the non deleted users
        const users = await this.userModel.find({ isDeleted: false }).select("-password");
        
        return users;

    }

    async getUserById(userId) {

        // getting the user by id
        const user = await this.userModel.findOne({ _id: userId, isDeleted: false }).select("-password");


        return user;

    }

    async deleteUser(filter) {

        // deleting the user
        const user = await this.userModel.findOneAndUpdate(filter, { isDeleted: true }, { returnDocument: "after" }).select("-password");

        return user;
    }

    async getUser(data) {

        // getting the user by email or id
        const user = await this.userModel.find(data).select("-password");

        return user;

    }
}

export default UserRepository;
