// Importing modules
import express from "express";
import publicSeriesRouter from "../../modules/public/series/series.route.js";
import privateSeriesRouter from "../../modules/private/series/series.route.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import ROLES from "../constants/roles.constants.js";

// making the series router
const router = express.Router();

// adding the routes
router.use("/", publicSeriesRouter);
router.use("/", authMiddleware, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), privateSeriesRouter);

// exporting the series router
export default router;