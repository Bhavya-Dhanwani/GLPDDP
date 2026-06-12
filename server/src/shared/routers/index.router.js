// importing modules 
import express from 'express';
import authRouter from '../../modules/public/auth/auth.router.js';
import seriesRouter from './series.router.js';

// making the main router
const router = express.Router();

// add the routers here
router.use('/auth', authRouter);
router.use('/series', seriesRouter);

// exporting the main router
export default router; 