// Importing the modules
import ApiError from "../../shared/utils/ApiError.util.js";
import AuthRepository from "./auth.repository.js";

// class to handle the service logic of the auth module
class AuthService {
    constructor() {
        // initializing the auth repository
        this.authRepository = new AuthRepository();
    }

    async signupService(name, email, password) {

        // Find if email exist or not 
        const exisitingUser = await this.authRepository.findUserByEmail(email);

        if(exisitingUser) {
            throw new ApiError(409, "Email already exist");
        }

        // creating the user
        const user = await this.authRepository.createUser({ name, email, password });
    }
}

export default AuthService;