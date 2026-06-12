// Importing the modules
import { generateAccessToken, generateRefreshToken } from "../../../shared/utils/token.util.js";
import AuthRepository from "../../../shared/repositories/auth.repository.js";
import sessionRepository from "../../../shared/repositories/session.repository.js";
import { sanitizeUser } from "../../../shared/utils/sanitizer.util.js";
import Conflict from "../../../shared/errors/conflict.error.js";
import NotFound from "../../../shared/errors/notfound.error.js";
import Unauthorized from "../../../shared/errors/unauthorized.error.js";
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
        const user = await this.authRepository.updateUser({ _id: userId }, { isVerified: true });

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
        const user = await this.authRepository.findUserByEmail(email);

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
        await this.authRepository.updateUser({ _id: user._id }, { password });

        // deleting the reset token
        await this.tokenService.deleteResetToken(user._id);

    }
}

export default AuthService;