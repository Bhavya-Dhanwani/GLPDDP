// Importing modules
import { body, param } from 'express-validator';

// Validation rules for creating a team
export const validateTeam = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),

    body('shortName')
        .notEmpty()
        .withMessage('Short name is required'),

    body('logo')
        .notEmpty()
        .withMessage('Logo is required'),

    body('primaryColor')
        .optional()
        .isString()
        .withMessage('Primary color must be a string'),

    body("squadPlayers")
        .isArray({ min: 11, max: 15 })
        .withMessage("Squad must contain between 11 and 15 players"),

    body("squadPlayers.*")
        .isMongoId()
        .withMessage("Each squad player must be a valid player ID"),


];

// Validation rules for deleting a team
export const validateID = [
    param('id')
        .notEmpty()
        .withMessage('Team ID is required')
        .isMongoId()
        .withMessage('Invalid Team ID'),
];