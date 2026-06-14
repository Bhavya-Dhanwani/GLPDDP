import express from "express";
import MatchController from "./match.controller.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";
 
import {
  createMatchValidator,
  updateMatchValidator,
  deleteMatchValidator,
  publishMatchValidator,
  updateTossValidator,
  selectPlayingXIValidator,
  startMatchValidator,
  inningsBreakValidator,
  completeMatchValidator,
} from "./match.validator.js";

const router = express.Router();

const matchController = new MatchController();

/**
 * @route POST /api/matches
 * @desc Create a new match
 * @access Private (handled by parent router)
 */
router.post(
  "/",
  createMatchValidator,
  validateErrors,
  asyncHandler(matchController.createMatch)
);

/**
 * @route PATCH /api/matches/:id
 * @desc Update match details
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id",
  updateMatchValidator,
  validateErrors,
  asyncHandler(matchController.updateMatch)
);

/**
 * @route DELETE /api/matches/:id
 * @desc Soft delete a match
 * @access Private (handled by parent router)
 */
router.delete(
  "/:id",
  deleteMatchValidator,
  validateErrors,
  asyncHandler(matchController.deleteMatch)
);

/**
 * @route PATCH /api/matches/:id/publish
 * @desc Publish match (DRAFT -> UPCOMING)
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/publish",
  publishMatchValidator,
  validateErrors,
  asyncHandler(matchController.publishMatch)
);

/**
 * @route PATCH /api/matches/:id/toss
 * @desc Record toss result (UPCOMING -> TOSS_COMPLETED)
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/toss",
  updateTossValidator,
  validateErrors,
  asyncHandler(matchController.updateToss)
);

/**
 * @route PATCH /api/matches/:id/playing-xi
 * @desc Select playing XI for both teams (TOSS_COMPLETED -> PLAYING_XI_SELECTED)
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/playing-xi",
  selectPlayingXIValidator,
  validateErrors,
  asyncHandler(matchController.selectPlayingXI)
);

/**
 * @route PATCH /api/matches/:id/start
 * @desc Start match (PLAYING_XI_SELECTED -> LIVE)
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/start",
  startMatchValidator,
  validateErrors,
  asyncHandler(matchController.startMatch)
);

/**
 * @route PATCH /api/matches/:id/innings-break
 * @desc Move match to innings break (LIVE -> INNINGS_BREAK)
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/innings-break",
  inningsBreakValidator,
  validateErrors,
  asyncHandler(matchController.pauseForInningsBreak)
);

/**
 * @route PATCH /api/matches/:id/second-innings
 * @desc Start second innings (INNINGS_BREAK -> LIVE)
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/second-innings",
  inningsBreakValidator,
  validateErrors,
  asyncHandler(matchController.startSecondInnings)
);

/**
 * @route PATCH /api/matches/:id/abandon
 * @desc Mark match as abandoned
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/abandon",
  asyncHandler(matchController.abandonMatch)
);

/**
 * @route PATCH /api/matches/:id/no-result
 * @desc Mark match as no result
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/no-result",
  asyncHandler(matchController.markNoResult)
);

/**
 * @route PATCH /api/matches/:id/complete
 * @desc Complete match and record winner, result and man of the match
 * @access Private (handled by parent router)
 */
router.patch(
  "/:id/complete",
  completeMatchValidator,
  validateErrors,
  asyncHandler(matchController.completeMatch)
);

export default router;