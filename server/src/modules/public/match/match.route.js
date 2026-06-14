import express from "express";

import MatchController from "./match.controller.js";

import asyncHandler from "../../../shared/utils/asynchandler.util.js";

import {
  getMatchesValidator,
  getMatchByIdValidator,
  getMatchesBySeriesValidator,
} from "./match.validator.js";
import validateErrors from "../../../shared/middlewares/validateErrors.middleware.js";

const router = express.Router();

const matchController = new MatchController();

/**
 * @route GET /api/matches
 * @desc Get all matches with optional filters
 * @access Public
 *
 * Query Params: (title, city, country, venue, matchType, status, matchNumber and Result)
 */
router.get(
  "/",
  getMatchesValidator,
  validateErrors,
  asyncHandler(matchController.getAllMatches)
);

/**
 * @route GET /api/matches/:id
 * @desc Get match by id
 * @access Public 
 */
router.get(
  "/:id",
  getMatchByIdValidator,
  validateErrors,
  asyncHandler(matchController.getMatchById)
);

/**
 * @route GET /api/matches/series/:seriesId
 * @desc Get all matches of a series
 * @access Public
 */
router.get(
  "/series/:seriesId",
  getMatchesBySeriesValidator,
  validateErrors,
  asyncHandler(matchController.getMatchesBySeriesId)
);

export default router;