import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import ROLES from "../constants/roles.constants.js";
import privateScoringRouter from "../../modules/private/scoring/scoring.route.js";

const router = express.Router();

router.use(
  "/",
  authMiddleware,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  privateScoringRouter
);

export default router;
