// Importing modules 
import express from 'express';
import TeamController from './team.controller.js';
import asyncHandler from '../../../shared/utils/asynchandler.util.js';
import getTeamByIdValidationRules from './team.validator.js';
import validateErrors from '../../../shared/middlewares/validateErrors.middleware.js';

// Initializing the router
const router = express.Router();

// Initializing the team controller
const teamController = new TeamController();

// seting up the routes
router.get('/', asyncHandler(teamController.getAllController));
router.get('/:id', getTeamByIdValidationRules, validateErrors, asyncHandler(teamController.getByIdController));

export default router;