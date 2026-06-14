import { body, param } from "express-validator";
import mongoose from "mongoose";
import { MATCH_TYPES } from "../../../shared/constants/match.constatnts.js";

/**
 * Common MongoDB ObjectId validator
 */
const objectIdValidator = (field) =>
  param(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(`Invalid ${field}`);

/**
 * Create Match
 */
export const createMatchValidator = [
  body("seriesId")
    .notEmpty()
    .withMessage("Series ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Series ID"),

  body("team1")
    .notEmpty()
    .withMessage("Team 1 is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Team 1 ID"),

  body("team2")
    .notEmpty()
    .withMessage("Team 2 is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Team 2 ID"),

  body("team2").custom((value, { req }) => {
    if (value === req.body.team1) {
      throw new Error("Both teams cannot be the same");
    }
    return true;
  }),

  body("venue")
    .trim()
    .notEmpty()
    .withMessage("Venue is required"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Invalid start time"),

  body("matchType")
    .notEmpty()
    .withMessage("Match type is required")
    .isIn(Object.values(MATCH_TYPES))
    .withMessage("Invalid match type"),
];

/**
 * Update Match
 */
export const updateMatchValidator = [
  objectIdValidator("id"),

  body("title").optional().trim(),

  body("matchNumber").optional().trim(),

  body("venue").optional().trim(),

  body("city").optional().trim(),

  body("country").optional().trim(),

  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Invalid start time"),

  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("Invalid end time"),
];

/**
 * Delete Match
 */
export const deleteMatchValidator = [
  objectIdValidator("id"),
];

/**
 * Publish Match
 */
export const publishMatchValidator = [
  objectIdValidator("id"),
];

/**
 * Update Toss
 */
export const updateTossValidator = [
  objectIdValidator("id"),

  body("tossWinner")
    .notEmpty()
    .withMessage("Toss winner is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid toss winner ID"),

  body("tossDecision")
    .notEmpty()
    .withMessage("Toss decision is required")
    .isIn(["BAT", "BOWL"])
    .withMessage("Toss decision must be BAT or BOWL"),
];

/**
 * Select Playing XI
 */
export const selectPlayingXIValidator = [
  objectIdValidator("id"),

  body("team1")
    .isArray({ min: 11, max: 11 })
    .withMessage("Team 1 Playing XI must contain exactly 11 players"),

  body("team2")
    .isArray({ min: 11, max: 11 })
    .withMessage("Team 2 Playing XI must contain exactly 11 players"),
];

/**
 * Start Match
 */
export const startMatchValidator = [
  objectIdValidator("id"),
];

/**
 * Innings Break
 */
export const inningsBreakValidator = [
  objectIdValidator("id"),
];

/**
 * Complete Match
 */
export const completeMatchValidator = [
  objectIdValidator("id"),

  body("winner")
    .notEmpty()
    .withMessage("Winner is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid winner ID"),

  body("result")
    .trim()
    .notEmpty()
    .withMessage("Result is required"),

  body("manOfTheMatch")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid man of the match ID"),
];