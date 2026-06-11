import ApiError from "../utils/ApiError.util.js";

// function to handle not found routes
function notFoundHandler(req, res, next) {
    throw new ApiError(404, "Route not found");
}

export default notFoundHandler;