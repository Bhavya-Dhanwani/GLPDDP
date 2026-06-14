// Importing modules 
import express from "express";
import PlayerController from "./player.controller.js";
import idValidator from "./player.validator.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";

// Creating a router
const router = express.Router();

// Creating an instance of the controller
const playerController = new PlayerController();

// Defining routes
router.get("/", asyncHandler(playerController.getPlayers));
router.get("/:id", idValidator, validateErrors, asyncHandler(playerController.getPlayerById));

// Exporting the router
export default router;