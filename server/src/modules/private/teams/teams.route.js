// Importing modules 
import express from "express";
import TeamController from "./team.controller.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import authorize from "../../../shared/middlewares/authorize.middleware.js";
import ROLES from "../../../shared/constants/roles.constants.js";
import { validateID, validateTeam } from "./team.validator.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";

// Initializing the team controller
const teamController = new TeamController();

// Initializing the router
const router = express.Router();

// Applying authentication middleware to all routes
router.use(authMiddleware);

// Route to create a team
router.post("/", validateTeam, validateErrors, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), asyncHandler(teamController.createController));

// Route to update a team
router.patch("/:id", validateID, validateTeam, validateErrors, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), asyncHandler(teamController.updateController));

// Route to delete a team
router.delete("/:id", validateID, validateErrors, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), asyncHandler(teamController.deleteController));

export default router;