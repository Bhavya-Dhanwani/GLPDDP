// extending the default error class to create a custom API error class
class ApiError extends Error {
    constructor(statusCode, message) {

        // calling the parent constructor
        super(message);

        // setting the status code and message
        this.statusCode = statusCode;
        this.message = message;
    }
}

export default ApiError;