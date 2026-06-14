import { param, query } from "express-validator";
import mongoose from "mongoose";

const isObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value);

/**
 * GET /api/matches
 */
export const getMatchesValidator = [
  query("seriesId")
    .optional()
    .custom(isObjectId)
    .withMessage("Invalid seriesId"),

  query("teamId")
    .optional()
    .custom(isObjectId)
    .withMessage("Invalid teamId"),

  query("status")
    .optional()
    .isString()
    .withMessage("Invalid status"),
];

/**
 * GET /api/matches/:id
 */
export const getMatchByIdValidator = [
  param("id")
    .custom(isObjectId)
    .withMessage("Invalid match id"),
];

/**
 * GET /api/matches/series/:seriesId
 */
export const getMatchesBySeriesValidator = [
  param("seriesId")
    .custom(isObjectId)
    .withMessage("Invalid series id"),
];