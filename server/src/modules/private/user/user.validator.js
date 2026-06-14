// Importing modules 
import { param } from "express-validator";

const idValidator = [
    param("id")
    .isMongoId()
    .withMessage("Invalid user ID")
];

export default idValidator;