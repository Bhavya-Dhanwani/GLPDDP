// Importing the modules
import ApiError from "../../shared/utils/ApiError.util.js";
import { generateAccessToken, generateRefreshToken } from "../../shared/utils/token.util.js";
import AuthRepository from "./auth.repository.js";
import sessionRepository from "../sessions/session.repository.js";
import { sanitizeUser } from "../../shared/utils/sanitizer.util.js";

// class to handle the service logic of the auth module
class AuthService {
    constructor() {
        // initializing the auth repository
        this.authRepository = new AuthRepository();
        this.sessionRepository = new sessionRepository();
    }

    async signupService(name, email, password) {

        // Find if email exist or not 
        const exisitingUser = await this.authRepository.findUserByEmail(email);

        if (exisitingUser) {
            throw new ApiError(409, "Email already exist");
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

        return { user: sanitizedUser, refreshToken };
    }

    async loginService(email, password) {

        // Find if email exist or not
        const user = await this.authRepository.findUserByEmail(email);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // checking the password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
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
}

export default AuthService;