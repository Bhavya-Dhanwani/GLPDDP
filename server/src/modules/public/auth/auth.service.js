// Importing the modules
import { OAuth2Client } from "google-auth-library";
import { generateAccessToken, generateRefreshToken } from "../../../shared/utils/token.util.js";
import UserRepository from "../../../shared/repositories/user.repository.js";
import sessionRepository from "../../../shared/repositories/session.repository.js";
import { sanitizeUser } from "../../../shared/utils/sanitizer.util.js";
import Conflict from "../../../shared/errors/conflict.error.js";
import NotFound from "../../../shared/errors/notfound.error.js";
import Unauthorized from "../../../shared/errors/unauthorized.error.js";
import TokenService from "../token/token.service.js";
import envs from "../../../shared/config/env.config.js";
import logger from "../../../shared/config/logger.config.js";

const googleClient = new OAuth2Client(envs.GOOGLE_CLIENT_ID);

const oauth2Client = new OAuth2Client(
    envs.GOOGLE_CLIENT_ID,
    envs.GOOGLE_CLIENT_SECRET,
    envs.GOOGLE_REDIRECT_URI
);

// class to handle the service logic of the auth module
class AuthService {
    constructor() {
        // initializing the user repository
        this.userRepository = new UserRepository();

        // initializing the session repository
        this.sessionRepository = new sessionRepository();

        // initializing the token service
        this.tokenService = new TokenService();
    }

    async signupService(name, email, password) {

        // Find if email exist or not 
        const exisitingUser = await this.userRepository.findUserByEmail(email);

        if (exisitingUser) {
            throw new Conflict("Email already exist");
        }

        // creating the user
        const user = await this.userRepository.createUser({ name, email, password });

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
        const user = await this.userRepository.findUserByEmail(email);

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

        if (!user.isVerified) {

            // sending otp to verify 
            await this.tokenService.createAndSendOTP(user._id, user.email);

        }

        // sanitizing the user
        const sanitizedUser = sanitizeUser(user, accessToken);

        return { user: sanitizedUser, refreshToken };
    }

    async verifyService(userId, otp) {

        // verifying the otp
        await this.tokenService.verifyOtp(userId, otp);

        // updating the user as verified
        const user = await this.userRepository.updateUser({ _id: userId }, { isVerified: true });

        return user;

    }

    async resendOtpService(userId, email) {
        // deleting the existing OTP
        await this.tokenService.deleteOtp(userId);

        // generating a new OTP and sending it to the user email
        await this.tokenService.createAndSendOTP(userId, email);
    }

    async logoutService(userId, refreshToken, sessionId) {

        // deleting the session
        await this.sessionRepository.deleteSessions({ userId, refreshToken, _id: sessionId });

    }

    async logoutAllService(userId) {

        // deleting all the sessions of the user
        await this.sessionRepository.deleteManySessions({ userId });

    }

    async refreshService(userId, refreshToken, sessionId) {

        // finding the session
        const session = await this.sessionRepository.findOneSession({ userId, refreshToken, _id: sessionId });

        // if session not found then throw error
        if (!session) {
            throw new Unauthorized("Invalid refresh token");
        }

        // generating new refresh token
        const newrefreshToken = generateRefreshToken(sessionId, userId);

        // updating the session with the new refresh token
        session.refreshToken = newrefreshToken;

        // saving the session
        await session.save();

        // generating new access token
        const newaccessToken = generateAccessToken(session.userId);

        // returning the new tokens
        return { newaccessToken, newrefreshToken };
    }

    async forgetService(email) {

        // finding the user by email
        const user = await this.userRepository.findUserByEmail(email);

        // if user not found then throw error
        if (!user) {
            throw new NotFound("User not found");
        }

        // generating the reset token and sending it to the user email
        const token = await this.tokenService.createAndSendResetToken(user._id, user.email);

    }

    async resetService(token, password) {

        // verifying the reset token
        const user = await this.tokenService.verifyResetToken(token);

        // updating the user password
        await this.userRepository.updateUser({ _id: user._id }, { password });

        // deleting the reset token
        await this.tokenService.deleteResetToken(user._id);

    }

    async getMeService(userId) {

        // finding the user
        const user = await this.userRepository.getUserById(userId);

        // if user not found then throw error
        if (!user) {
            throw new NotFound("User not found");
        }

        logger.info(user);

        // generating new access token
        const accessToken = generateAccessToken(user);

        // sanitizing the user
        const sanitizedUser = sanitizeUser(user, accessToken);

        // returning the user
        return sanitizedUser;
    }

    async googleAuthService(credential) {

        // verifying the google credential
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: envs.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // finding the user by email
        let user = await this.userRepository.findUserByEmail(email);

        if (user) {
            // if user exists but signed up with email/password, link google account
            if (user.provider === "local" && !user.googleId) {
                user = await this.userRepository.updateUser(
                    { _id: user._id },
                    { googleId, provider: "google", avatar: picture }
                );
            }
        } else {
            // creating a new user
            user = await this.userRepository.createUser({
                name,
                email,
                password: "",
                provider: "google",
                googleId,
                avatar: picture,
                isVerified: true,
            });
        }

        // making the access token
        const accessToken = generateAccessToken(user);

        // making the session token
        const sessionId = this.sessionRepository.getSessionId();

        // making the refresh token
        const refreshToken = generateRefreshToken(sessionId, user._id);

        // creating the session
        await this.sessionRepository.createSession({
            _id: sessionId,
            refreshToken,
            userId: user._id,
        });

        // sanitizing the user
        const sanitizedUser = sanitizeUser(user, accessToken);

        return { user: sanitizedUser, refreshToken };
    }

    getGoogleAuthUrl() {
        return oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["openid", "email", "profile"],
            prompt: "consent",
        });
    }

    async googleCallbackService(code) {

        // exchanging the authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // getting the user info from Google
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: envs.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // finding the user by email
        let user = await this.userRepository.findUserByEmail(email);

        if (user) {
            // if user exists but signed up with email/password, link google account
            if (user.provider === "local" && !user.googleId) {
                user = await this.userRepository.updateUser(
                    { _id: user._id },
                    { googleId, provider: "google", avatar: picture }
                );
            }
        } else {
            // creating a new user
            user = await this.userRepository.createUser({
                name,
                email,
                password: "",
                provider: "google",
                googleId,
                avatar: picture,
                isVerified: true,
            });
        }

        // making the access token
        const accessToken = generateAccessToken(user);

        // making the session token
        const sessionId = this.sessionRepository.getSessionId();

        // making the refresh token
        const refreshToken = generateRefreshToken(sessionId, user._id);

        // creating the session
        await this.sessionRepository.createSession({
            _id: sessionId,
            refreshToken,
            userId: user._id,
        });

        // sanitizing the user
        const sanitizedUser = sanitizeUser(user, accessToken);

        return { user: sanitizedUser, refreshToken };
    }
}

export default AuthService;