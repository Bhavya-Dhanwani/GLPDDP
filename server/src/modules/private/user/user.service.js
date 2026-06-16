// Importing moduels
import UserRepository from "../../../shared/repositories/user.repository.js";
import ROLES from "../../../shared/constants/roles.constants.js";
import NotFound from "../../../shared/errors/notfound.error.js";

// creating the user service class
class UserService {

    constructor() {

        // creating the user repository instance
        this.userRepository = new UserRepository();

    }

    // getting the user by id
    async getAllUsers() {

        // getting all the users
        const users = await this.userRepository.getAllusers();

        return users;

    }

    async getUserById(userId) {

        // getting the user by id
        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            throw new NotFound("User not found");
        }

        return user;
    }

    async makeAdmin(userId) {

        // making the user admin
        const user = await this.userRepository.updateUser({ _id: userId }, { role: ROLES.ADMIN });

        if (!user) {
            throw new NotFound("User not found");
        }

        return user;
    }

}

export default UserService;
