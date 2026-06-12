import Unauthorized from "../errors/unauthorized.error.js";
import { decodeRefreshToken } from "../utils/token.util.js";

// function to get the refresh token from the request
function getRefreshToken(req, res, next) {

    // getting the refresh token from the cookies
    const refreshToken = req.cookies.glpddp_refreshToken;

    if (refreshToken == undefined) {
        throw new Unauthorized("Refresh token not found");
    };

    const decoded = decodeRefreshToken(refreshToken);

    if (decoded == null) {
        throw new Unauthorized("Invalid refresh token");
    }

    // setting the refresh token in the request object
    req.refreshToken = refreshToken;
    req.sessionId = decoded.sessionId;
    req.userId = decoded.userId;

    next();
}

export default getRefreshToken;