// Importing modules
import ApiResponse from "../../shared/utils/ApiResponse.utils.js";
import AuthService from "./auth.service.js";

// class to handle all the controller logic of the auth module
class AuthController {

    constructor() {

        // creating the auth service
        this.authService = new AuthService();
    }

    signupController = async (req, res) => {

        // accepting the data 
        const { name, email, password } = req.body;

        // calling the signup service
        const response = await this.authService.signupService(name, email, password);

        // setting the cookies in the response 
        res.cookie("glpddp_refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/api/auth"
        });

        // returing the response 
        return ApiResponse(res, 201, "User created successfully", response.user);
    }

    loginController = async (req, res) => {

        // accepting the data
        const { email, password } = req.body;

        // calling the login service
        const response = await this.authService.loginService(email, password);

        // setting the cookies in the response
        res.cookie("glpddp_refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/api/auth"
        });

        // returning the response
        return ApiResponse(res, 200, "User logged in successfully", response.user);
    }
}

export default AuthController;