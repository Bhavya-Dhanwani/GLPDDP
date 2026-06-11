// Importing modules 
import BadRequest from "../../shared/errors/badrequest.error.js";
import NotFound from "../../shared/errors/notfound.error.js";
import sendMail from "../../shared/utils/sendMail.util.js";
import { generateOtp } from "../../shared/utils/token.util.js";
import TokenRepository from "./token.repository.js";

// class to handle the token services
class TokenService {
    constructor() {

        // initializing the token repository
        this.tokenRepository = new TokenRepository();

    }

    // method to cerate and send a otp
    async createAndSendOTP(userId, email) {

        // generating the otp
        const otp = generateOtp();

        // creating the token
        const token = await this.tokenRepository.createToken({
            userId,
            token: otp,
            type: "otp",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // expires in 10 minutes
        });

        await sendMail(email, "Your OTP for GLPDDP", `Your OTP for GLPDDP is ${otp}. It will expire in 10 minutes.`);

        return token;
    }

    async verifyOtp(userId, otp) {

        // finding the token
        const token = await this.tokenRepository.findOneToken({ userId, type: "otp" }).populate('userId');

        // if token not found
        if (!token) {
            throw new NotFound("Invalid OTP");
        }

        // incrementing the tries
        await this.tokenRepository.updateOneToken({ _id: token._id }, { tries: token.tries + 1 });

        // checking if the token is expired
        if (token.tries >= 5) {

            // deleting the token
            await this.tokenRepository.deleteToken({ _id: token._id });

            // throwing the error
            throw new BadRequest("Too many attempts. Please request a new OTP.");

        }

        // verifying the token
        if (token.token !== otp) {

            // incrementing the tries
            throw new BadRequest("Invalid OTP");

        }



        return token;
    }

    async deleteOtp(userId) {

        // deleting the token
        const token = await this.tokenRepository.deleteToken({ userId, type: "otp" });

        // returning the token
        return token;

    }
}

export default TokenService;