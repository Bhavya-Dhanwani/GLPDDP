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

    verifyController = async (req, res) => {

        // accepting the data
        const { otp } = req.body;
        const userId = req.user.id;

        if (req.user.isVerified) {

            // returning the response
            return ApiResponse(res, 200, "Email already verified");

        }

        // calling the verify service
        await this.authService.verifyService(userId, otp);

        // Change the access token to reflect the change in the isVerified field
        const accessToken = await this.authService.generateAccessToken(userId);

        // returning the response
        return ApiResponse(res, 200, "Email verified successfully", { accessToken });

    }

    resendOTPController = async (req, res) => {

        // accepting the data
        const userId = req.user.id;
        const email = req.user.email;

        if (req.user.isVerified) {
            return ApiResponse(res, 400, "Email already verified");
        }

        // calling the resend otp service
        await this.authService.resendOtpService(userId, email);

        // returning the response
        return ApiResponse(res, 200, "OTP sent successfully");
    }

    logoutController = async (req, res) => {

        // accepting the data
        const userId = req.user.id;
        const refreshToken = req.refreshToken;
        const sessionId = req.sessionId;

        // calling the logout service
        await this.authService.logoutService(userId, refreshToken, sessionId);

        // clearing the cookies in the response
        res.clearCookie("glpddp_refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            path: "/api/auth"
        });

        // returning the response
        return ApiResponse(res, 204, "");
    }

    logoutAllController = async (req, res) => {

        // accepting the data
        const userId = req.userId;

        // calling the logout all service
        await this.authService.logoutAllService(userId);

        // returning the response
        return ApiResponse(res, 204, "");
    }

    refreshController = async (req, res) => {

        // accepting the data
        const refreshToken = req.refreshToken;
        const sessionId = req.sessionId;
        const userId = req.userId;
       
        // calling the refresh service
        const response = await this.authService.refreshService(userId, refreshToken, sessionId);
       
        // setting the cookies in the response
        res.cookie("glpddp_refreshToken", response.newrefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/api/auth"
        });

        // returning the response
        return ApiResponse(res, 200, "Token refreshed successfully", { accessToken: response.newaccessToken });
    }
}

export default AuthController;