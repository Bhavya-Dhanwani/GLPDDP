// importing modules 
import express from 'express';
import authRouter from '../../modules/auth/auth.router.js';
import seriesRouter from '../../modules/series/series.route.js';

// making the main router
const router = express.Router();

// add the routers here
router.use('/auth', authRouter);
router.use('/series', seriesRouter);

// exporting the main router
export default router; 