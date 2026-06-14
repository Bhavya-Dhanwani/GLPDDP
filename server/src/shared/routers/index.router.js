// importing modules 
import express from 'express';
import authRouter from '../../modules/public/auth/auth.router.js';
import seriesRouter from './series.router.js';
import teamsRouter from './teams.router.js';
import playerRouter from './player.router.js';

// making the main router
const router = express.Router();

// add the routers here
router.use('/auth', authRouter);
router.use('/series', seriesRouter);
router.use('/teams', teamsRouter);
router.use('/players', playerRouter);

// exporting the main router
export default router; 