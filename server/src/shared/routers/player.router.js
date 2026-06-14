// Importing modules
import express from "express";
import publicPlayerRouter from "../../modules/public/player/player.route.js";
import privatePlayerRouter from "../../modules/private/player/player.route.js";

// Creating a router
const router = express.Router();

// Defining routes
router.use("/", publicPlayerRouter);
router.use("/", privatePlayerRouter);

// Exporting the router
export default router;