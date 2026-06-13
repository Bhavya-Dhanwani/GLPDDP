// Importing moduels 
import express from 'express';
import publicTeamRouter from '../../modules/public/teams/team.route.js';
import privateTeamRouter from '../../modules/private/teams/teams.route.js';

// Initializing the router
const router = express.Router();

// setting up the routes
router.use("/", privateTeamRouter);
router.use("/", publicTeamRouter);

export default router;