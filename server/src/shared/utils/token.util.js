// work of tokens will be done here 
import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import EXPIRY_CONSTANTS from '../constants/expiry.constants.js';

// function to generate the accesss token
function generateAccessToken({ _id, email, role, name, isVerified }) {

    const accessToken = jwt.sign(
        {
            id: _id,
            name,
            email,
            role,
            isVerified
        },
        env.JWT_ACCESS_SECRET,
        { expiresIn: EXPIRY_CONSTANTS.accessToken }
    );

    return accessToken;
}

// function to generate the refresh token
function generateRefreshToken(sessionId, userId) {

    // generating the refresh token
    const refreshToken = jwt.sign(
        {
            sessionId,
            userId
        },
        env.JWT_REFRESH_SECRET,
        { expiresIn: EXPIRY_CONSTANTS.refreshToken }
    );

    return refreshToken;
}

// funciton to decode the access token
function decodeAccessToken(token) {
    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}

// function to decode the refresh token
function decodeRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}

function generateOtp(length = 6) {

    // setting the boundairies for the otp
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    // generating the otp
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    return otp;
}

function generateResetToken(length = 32) {

    // setting the characters for the reset token
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    let resetToken = '';

    // generating the reset token
    for (let i = 0; i < length; i++) {
        resetToken += characters[Math.floor(Math.random() * characters.length)];
    }

    return resetToken;
}

// exporting the functions
export {
    generateAccessToken,
    generateRefreshToken,
    decodeAccessToken,
    decodeRefreshToken,
    generateOtp,
    generateResetToken
}