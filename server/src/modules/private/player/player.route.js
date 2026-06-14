// Importing modules 
import express from "express";
import PlayerController from "./player.controller.js";
import { idValidator, PlayerDataValidator } from "./player.validator.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import ROLES from "../../../shared/constants/roles.constants.js";
import authorize from "../../../shared/middlewares/authorize.middleware.js";

// Creating a router
const router = express.Router();

// Creating an instance of the controller
const playerController = new PlayerController();

// Applying authentication and authorization middleware
router.use(authMiddleware);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

// Defining routes
router.post("/", PlayerDataValidator, validateErrors, asyncHandler(playerController.createPlayer));
router.put("/:id", idValidator, PlayerDataValidator, validateErrors, asyncHandler(playerController.updatePlayer));
router.delete("/:id", idValidator, validateErrors, asyncHandler(playerController.deletePlayer));
router.get("/deleted", asyncHandler(playerController.getDeletedPlayers));
router.patch("/restore/:id", idValidator, validateErrors, asyncHandler(playerController.restorePlayer));

// Exporting the router
export default router;