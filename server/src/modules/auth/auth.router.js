// Importing modules
import express from 'express';
import AuthController from './auth.controller.js';
import validateErrors from '../../shared/middlewares/validateerrors.middeware.js';
import { signupValidator  } from './auth.validators.js';

// creating the auth controller
const authController = new AuthController();

// making the auth router
const router = express.Router();

// adding the routes
router.post('/signup', signupValidator, validateErrors, authController.signupController);

// exporting the auth router
export default router;