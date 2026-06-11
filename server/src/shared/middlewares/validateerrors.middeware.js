// Importing modules
import pkg from 'express-validator';
const { validationResult } = pkg;
import ApiError from '../utils/ApiError.util.js';

// middleware to handle the validation errors
function validateErrors(req, res, next) {

    // getting the validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        
        //if errors send only err number 1
        throw new ApiError(400, errors.array()[0].msg);
    }
    
    next();
}

export default validateErrors;