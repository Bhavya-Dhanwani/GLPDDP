import { param } from "express-validator";


// Validation for getting and deleting series by id
export const getSeriesByIdValidator = [
    param("id")
    .isMongoId()
    .withMessage("Invalid series id"),
];