// Importing modules
import express from 'express';
import AuthController from './auth.controller.js';
import validateErrors from '../../../shared/middlewares/validateErrors.middleware.js';
import { forgotPasswordValidator, loginValidator, resetPasswordValidator, signupValidator  } from './auth.validators.js';
import asyncHandler from '../../../shared/utils/asynchandler.util.js';
import authMiddleware from '../../../shared/middlewares/auth.middleware.js';
import getRefreshToken from '../../../shared/middlewares/getRefresh.middleware.js';

// creating the auth controller
const authController = new AuthController();

// making the auth router
const router = express.Router();

// adding the routes
router.post('/signup', signupValidator, validateErrors, asyncHandler(authController.signupController));
router.post('/login', loginValidator, validateErrors, asyncHandler(authController.loginController));
router.post("/verify",authMiddleware, asyncHandler(authController.verifyController));
router.post("/resend-otp", authMiddleware, asyncHandler(authController.resendOTPController));
router.post("/logout", authMiddleware, getRefreshToken, asyncHandler(authController.logoutController));
router.post("/logout-all", authMiddleware, getRefreshToken, asyncHandler(authController.logoutAllController));
router.post("/refresh", getRefreshToken, asyncHandler(authController.refreshController));
router.post("/forgot-password", forgotPasswordValidator, validateErrors, asyncHandler(authController.forgetController));
router.post("/reset-password", resetPasswordValidator, validateErrors, asyncHandler(authController.resetController));


// exporting the auth router
export default router;