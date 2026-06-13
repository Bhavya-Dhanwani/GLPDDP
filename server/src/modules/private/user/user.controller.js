// Importing modules 
import UserService from "./user.service.js";
import ApiResponse from "../../../shared/utils/apiResponse.util.js";

// creating the user controller class
class UserController {

    constructor() {

        // creating the user service instance
        this.userService = new UserService();

    }

    // getting all the users
    getAllUsers = async (req, res) => {

        // getting all the users
        const users = await this.userService.getAllUsers();

        // sending the response
        return ApiResponse(res, 200, "Users fetched successfully", users);

    }

    getUserById = async (req, res) => {

        // getting the user id from the request params
        const userId = req.params.id;

        // getting the user by id
        const user = await this.userService.getUserById(userId);

        // sending the response
        return ApiResponse(res, 200, "User fetched successfully", user);

    }

    makeAdmin = async (req, res) => {

        // getting the user id from the request params
        const userId = req.params.id;

        // making the user admin
        const user = await this.userService.makeAdmin(userId);

        // sending the response
        return ApiResponse(res, 200, "User made admin successfully", user);

    }

}

export default UserController;