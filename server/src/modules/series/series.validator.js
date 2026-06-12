import { body, param } from "express-validator";
import { SERIES_STATUS } from "../../shared/constants/series.constants.js";

// Validation rules for series routes
// For create, all fields except status and logo are required
export const createSeriesValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Series name is required"),

    body("shortName")
        .optional(),

    body("season")
        .trim()
        .notEmpty()
        .withMessage("Season is required"),

    body("status")
        .optional()
        .isIn(Object.values(SERIES_STATUS))
        .withMessage("Invalid series status"),

    body("logo")
        .optional()
        .isURL()
        .withMessage("Logo must be a valid URL"),
];

// For update, all fields are optional but if provided, they must be valid
export const updateSeriesValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid series id"),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Series name cannot be empty"),

    body("shortName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Series short name cannot be empty"),

    body("season")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Season cannot be empty"),

    body("status")
        .optional()
        .isIn(Object.values(SERIES_STATUS))
        .withMessage("Invalid series status"),

    body("logo")
        .optional()
        .isURL()
        .withMessage("Logo must be a valid URL"),
];

// Validation for getting and deleting series by id
export const getSeriesByIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid series id"),
];

// Same validation for delete as get by id since we just need the id to delete
export const deleteSeriesValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid series id"),
];