import { body, param } from "express-validator";
import {
  BOUNDARY_TYPES,
  DISMISSAL_TYPES,
} from "../../../shared/constants/scoring.constants.js";

const objectIdParam = (field) =>
  param(field).isMongoId().withMessage(`Invalid ${field}`);

const normalizeId = (value) => {
  if (!value) return value;
  if (typeof value === "object") return String(value._id?.$oid ?? value._id ?? value.id ?? value.$oid ?? "");
  return String(value).trim();
};

const objectIdBody = (field, message) =>
  body(field).customSanitizer(normalizeId).isMongoId().withMessage(message);

export const startInningsValidator = [
  objectIdParam("matchId"),
  objectIdBody("battingTeamId", "Invalid batting team ID"),
  objectIdBody("strikerId", "Invalid striker ID"),
  objectIdBody("nonStrikerId", "Invalid non-striker ID"),
  objectIdBody("bowlerId", "Invalid bowler ID"),
];

export const recordDeliveryValidator = [
  objectIdParam("inningsId"),
  body("expectedRevision")
    .isInt({ min: 0 })
    .withMessage("Expected revision is required"),
  body("batterRuns")
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage("Batter runs must be between 0 and 6"),
  body("boundaryType")
    .optional()
    .isIn(Object.values(BOUNDARY_TYPES))
    .withMessage("Invalid boundary type"),
  body("bowlerId").optional({ checkFalsy: true }).customSanitizer(normalizeId).isMongoId().withMessage("Invalid bowler ID"),
  body("nextBatterId").optional({ checkFalsy: true }).customSanitizer(normalizeId).isMongoId().withMessage("Invalid next batter ID"),
  body("extras.wides").optional().isInt({ min: 0 }),
  body("extras.noBalls").optional().isInt({ min: 0, max: 1 }),
  body("extras.byes").optional().isInt({ min: 0 }),
  body("extras.legByes").optional().isInt({ min: 0 }),
  body("extras.penalties").optional().isInt({ min: 0 }),
  body("wicket.occurred").optional().isBoolean(),
  body("wicket.playerOutId").optional({ checkFalsy: true }).customSanitizer(normalizeId).isMongoId(),
  body("wicket.dismissalType")
    .optional()
    .isIn(Object.values(DISMISSAL_TYPES))
    .withMessage("Invalid dismissal type"),
  body("wicket.fielderId").optional({ checkFalsy: true }).customSanitizer(normalizeId).isMongoId(),
  body("wicket.countsAsTeamWicket").optional().isBoolean(),
  body("wicket.creditedToBowler").optional().isBoolean(),
];

export const updateCurrentPlayersValidator = [
  objectIdParam("inningsId"),
  body("expectedRevision")
    .isInt({ min: 0 })
    .withMessage("Expected revision is required"),
  objectIdBody("strikerId", "Invalid striker ID"),
  objectIdBody("nonStrikerId", "Invalid non-striker ID"),
  objectIdBody("bowlerId", "Invalid bowler ID"),
];

export const manualCommentaryValidator = [
  objectIdParam("matchId"),
  body("text")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Commentary message is required and must be under 500 characters"),
];
