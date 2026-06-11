// work of tokens will be done here 
import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';

// function to generate the accesss token
function generateAccessToken({ _id, email, role, name }) {

    const accessToken = jwt.sign(
        {
            id: _id,
            name,
            email,
            role
        },
        env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
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
        { expiresIn: '7d' }
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

// exporting the functions
export {
    generateAccessToken,
    generateRefreshToken,
    decodeAccessToken,
    decodeRefreshToken
}