// Importing modules
import { body, param } from 'express-validator';

// Validation rules for creating a team
export const createTeamValidationRules = [
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
];

// Validation rules for updating a team
export const updateTeamValidationRules = [
    param('id')
    .notEmpty()
    .withMessage('Team ID is required')
    .isMongoId()
    .withMessage('Invalid Team ID'),

    body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty'),

    body('shortName')
    .optional()
    .notEmpty()
    .withMessage('Short name cannot be empty'),
    
    body('logo')
    .optional()
    .notEmpty()
    .withMessage('Logo cannot be empty'),
    
    body('primaryColor')
    .optional()
    .isString()
    .withMessage('Primary color must be a string'),
];

// Validation rules for deleting a team
export const deleteTeamValidationRules = [
    param('id')
    .notEmpty()
    .withMessage('Team ID is required')
    .isMongoId()
    .withMessage('Invalid Team ID'),
];