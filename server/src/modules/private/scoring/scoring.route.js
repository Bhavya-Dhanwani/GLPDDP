import express from "express";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";
import ScoringController from "./scoring.controller.js";
import {
  recordDeliveryValidator,
  startInningsValidator,
  updateCurrentPlayersValidator,
} from "./scoring.validator.js";

const router = express.Router();
const controller = new ScoringController();

router.post(
  "/matches/:matchId/innings",
  startInningsValidator,
  validateErrors,
  asyncHandler(controller.startInnings)
);

router.post(
  "/innings/:inningsId/deliveries",
  recordDeliveryValidator,
  validateErrors,
  asyncHandler(controller.recordDelivery)
);

router.patch(
  "/innings/:inningsId/current-players",
  updateCurrentPlayersValidator,
  validateErrors,
  asyncHandler(controller.updateCurrentPlayers)
);

export default router;
