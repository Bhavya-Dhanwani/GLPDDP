// importing modules 
import express from 'express';
import authRouter from '../../modules/auth/auth.router.js';

// making the main router
const router = express.Router();

// add the routers here
router.use('/auth', authRouter);

// exporting the main router
export default router;