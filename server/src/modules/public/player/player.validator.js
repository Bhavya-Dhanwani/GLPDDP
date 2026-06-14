// Importing modules 
import { params } from "express-validator";

const idValidator = [
    params("id")
    .isMongoId()
    .withMessage("Invalid player ID")
];

export default idValidator;