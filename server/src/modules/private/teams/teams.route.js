// Importing modules 
import express from "express";
import TeamController from "./team.controller.js";
import asyncHandler from "../../../shared/middlewares/asyncHandler.middleware.js";
import authorize from "../../../shared/middlewares/authorize.middleware.js";
import ROLES from "../../../shared/constants/roles.constants.js";
import { createTeamValidationRules, updateTeamValidationRules, deleteTeamValidationRules } from "./team.validator.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middeware.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";

// Applying authentication middleware to all routes
router.use(authMiddleware);


// Initializing the team controller
const teamController = new TeamController();

// Initializing the router
const router = express.Router();

// Route to create a team
router.post("/", createTeamValidationRules, validateErrors, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), asyncHandler(teamController.createController));

// Route to update a team
router.patch("/:id", updateTeamValidationRules, validateErrors, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), asyncHandler(teamController.updateController));

// Route to delete a team
router.delete("/:id", deleteTeamValidationRules, validateErrors, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), asyncHandler(teamController.deleteController));

export default router;