import express from "express";
import { param, query } from "express-validator";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";
import PublicScoringController from "./scoring.controller.js";

const router = express.Router();
const controller = new PublicScoringController();

router.get(
  "/matches/:matchId",
  param("matchId").isMongoId().withMessage("Invalid match ID"),
  validateErrors,
  asyncHandler(controller.getSnapshot)
);

router.get(
  "/matches/:matchId/commentary",
  param("matchId").isMongoId().withMessage("Invalid match ID"),
  query("beforeSequence").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  validateErrors,
  asyncHandler(controller.getCommentary)
);

export default router;
