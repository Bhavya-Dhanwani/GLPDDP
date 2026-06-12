// Importing modules
import express from "express";
import publicSeriesRouter from "../../modules/public/series/series.route.js";
import privateSeriesRouter from "../../modules/private/series/series.route.js";

// making the series router
const router = express.Router();

// adding the routes
router.use("/", publicSeriesRouter);
router.use("/", privateSeriesRouter);

// exporting the series router
export default router;