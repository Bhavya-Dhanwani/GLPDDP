// importing modules
import logger from "../config/logger.config.js";

// funciton to throw all the errors in a single place
function errorMiddleware(err, req, res, next) {

    // logging the error stack
    logger.error(err.stack);

    // sending the error response
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        success: false,
    });
}

export default errorMiddleware;