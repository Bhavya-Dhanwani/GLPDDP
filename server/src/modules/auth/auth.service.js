// Importing the modules
import { generateAccessToken, generateRefreshToken } from "../../shared/utils/token.util.js";
import AuthRepository from "./auth.repository.js";
import sessionRepository from "../sessions/session.repository.js";
import { sanitizeUser } from "../../shared/utils/sanitizer.util.js";
import Conflict from "../../shared/errors/conflict.error.js";
import NotFound from "../../shared/errors/notfound.error.js";
import Unauthorized from "../../shared/errors/unauthorized.error.js";
import TokenService from "../token/token.service.js";

// class to handle the service logic of the auth module
class AuthService {
    constructor() {
        // initializing the auth repository
        this.authRepository = new AuthRepository();
        this.sessionRepository = new sessionRepository();
        this.tokenService = new TokenService();
    }

    async signupService(name, email, password) {

        // Find if email exist or not 
        const exisitingUser = await this.authRepository.findUserByEmail(email);

        if (exisitingUser) {
            throw new Conflict("Email already exist");
        }

        // creating the user
        const user = await this.authRepository.createUser({ name, email, password });

        // making the access token
        const accessToken = generateAccessToken(user);

        // making the session token 
        const sessionId = this.sessionRepository.getSessionId();

        // making the refresh token 
        const refreshToken = generateRefreshToken(sessionId, user._id);

        // creating the session 
        const session = await this.sessionRepository.createSession({
            _id: sessionId,
            refreshToken,
            userId: user._id
        });

        // sanitizing the user
        const sanitizedUser = sanitizeUser(user, accessToken);

        // generating the otp and sending it to the user email
        const otpToken = await this.tokenService.createAndSendOTP(user._id, user.email);

        return { user: sanitizedUser, refreshToken };
    }

    async loginService(email, password) {

        // Find if email exist or not
        const user = await this.authRepository.findUserByEmail(email);

        if (!user) {
            throw new NotFound("User not found");
        }

        // checking the password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Unauthorized("Invalid credentials");
        }

        // making the access token
        const accessToken = generateAccessToken(user);

        // making the session token
        const sessionId = this.sessionRepository.getSessionId();

        // making the refresh token
        const refreshToken = generateRefreshToken(sessionId, user._id);

        // creating the session
        const session = await this.sessionRepository.createSession({
            _id: sessionId,
            refreshToken,
            userId: user._id
        });

        // sanitizing the user
        const sanitizedUser = sanitizeUser(user, accessToken);

        return { user: sanitizedUser, refreshToken };
    }

    async verifyService(userId, otp) {

        // verifying the otp
        await this.tokenService.verifyOtp(userId, otp);

        // updating the user as verified
        await this.authRepository.updateUser({ _id: userId }, { isVerified: true });

    }

    async resendOtpService(userId, email) {
        // deleting the existing OTP
        await this.tokenService.deleteOtp(userId);

        // generating a new OTP and sending it to the user email
        await this.tokenService.createAndSendOTP(userId, email);
    }
}

export default AuthService;