// Importing modules 
import { param } from "express-validator";

const idValidator = [
    param("id")
    .isMongoId()
    .withMessage("Invalid player ID")
];

export default idValidator;