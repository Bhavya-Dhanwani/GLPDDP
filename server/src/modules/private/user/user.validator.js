// Importing modules 
import { params } from "express-validator";

const idValidator = [
    params("id")
    .isMongoId()
    .withMessage("Invalid user ID")
];

export default idValidator;