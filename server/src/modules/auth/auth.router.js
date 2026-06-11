// Importing modules
import express from 'express';
import AuthController from './auth.controller.js';
import validateErrors from '../../shared/middlewares/validateerrors.middeware.js';
import { loginValidator, signupValidator  } from './auth.validators.js';
import asyncHandler from '../../shared/utils/asynchandler.util.js';

// creating the auth controller
const authController = new AuthController();

// making the auth router
const router = express.Router();

// adding the routes
router.post('/signup', signupValidator, validateErrors, asyncHandler(authController.signupController));
router.post('/login', loginValidator, validateErrors, asyncHandler(authController.loginController));

// exporting the auth router
export default router;