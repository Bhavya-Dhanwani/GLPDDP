import { body, param } from "express-validator";
import {
  BOUNDARY_TYPES,
  DISMISSAL_TYPES,
} from "../../../shared/constants/scoring.constants.js";

const objectIdParam = (field) =>
  param(field).isMongoId().withMessage(`Invalid ${field}`);

export const startInningsValidator = [
  objectIdParam("matchId"),
  body("battingTeamId").isMongoId().withMessage("Invalid batting team ID"),
  body("strikerId").isMongoId().withMessage("Invalid striker ID"),
  body("nonStrikerId").isMongoId().withMessage("Invalid non-striker ID"),
  body("bowlerId").isMongoId().withMessage("Invalid bowler ID"),
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
  body("bowlerId").optional().isMongoId().withMessage("Invalid bowler ID"),
  body("nextBatterId").optional().isMongoId().withMessage("Invalid next batter ID"),
  body("extras.wides").optional().isInt({ min: 0 }),
  body("extras.noBalls").optional().isInt({ min: 0, max: 1 }),
  body("extras.byes").optional().isInt({ min: 0 }),
  body("extras.legByes").optional().isInt({ min: 0 }),
  body("extras.penalties").optional().isInt({ min: 0 }),
  body("wicket.occurred").optional().isBoolean(),
  body("wicket.playerOutId").optional().isMongoId(),
  body("wicket.dismissalType")
    .optional()
    .isIn(Object.values(DISMISSAL_TYPES))
    .withMessage("Invalid dismissal type"),
  body("wicket.fielderId").optional().isMongoId(),
  body("wicket.countsAsTeamWicket").optional().isBoolean(),
  body("wicket.creditedToBowler").optional().isBoolean(),
];

export const updateCurrentPlayersValidator = [
  objectIdParam("inningsId"),
  body("expectedRevision")
    .isInt({ min: 0 })
    .withMessage("Expected revision is required"),
  body("strikerId").isMongoId().withMessage("Invalid striker ID"),
  body("nonStrikerId").isMongoId().withMessage("Invalid non-striker ID"),
  body("bowlerId").isMongoId().withMessage("Invalid bowler ID"),
];
