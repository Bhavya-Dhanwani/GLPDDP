// Importing modules
import { param } from 'express-validator';

// Validation rules for getting a team by id
export const getTeamByIdValidationRules = [

    param('id')
        .notEmpty()
        .withMessage('Team ID is required')
        .isMongoId()
        .withMessage('Invalid Team ID'),

];

export default getTeamByIdValidationRules;