// Importing modules
import express from "express";
import UserController from "./user.controller.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import ROLES from "../../../shared/constants/roles.constants.js";
import authorize from "../../../shared/middlewares/authorize.middleware.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import idValidator from "./user.validator.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";

// creating the user router
const userRouter = express.Router();

// creating the user controller instance
const userController = new UserController();

// defining the routes
userRouter.get("/", authMiddleware, authorize(ROLES.SUPER_ADMIN), asyncHandler(userController.getAllUsers));
userRouter.get("/:id", idValidator, validateErrors, authMiddleware, authorize(ROLES.SUPER_ADMIN), asyncHandler(userController.getUserById));
userRouter.put("/make-admin/:id", idValidator, validateErrors, authMiddleware, authorize(ROLES.SUPER_ADMIN), asyncHandler(userController.makeAdmin));

export default userRouter;