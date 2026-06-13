import express from "express";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import authorize from "../../shared/middlewares/authorize.middleware.js";
import ROLES from "../../shared/constants/roles.constants.js";

import privateMatchRouter from "../../modules/private/match/match.route.js";
import publicMatchRouter from "../../modules/public/match/match.route.js"

const router = express.Router();

router.use(
  "/",
  publicMatchRouter
)

router.use(
  "/",
  authMiddleware,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  privateMatchRouter
);


export default router;