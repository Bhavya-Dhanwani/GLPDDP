// Importing modules
import { params, body } from "express-validator";
import PLAYER_ROLES from "../../../shared/constants/playerRoles.constants.js";
import BATTING_STYLES from "../../../shared/constants/batting.constants.js";
import BOWLING_STYLES from "../../../shared/constants/bowling.constants.js";

// Validator for player ID
const idValidator = [
    params("id")
        .isMongoId()
        .withMessage("Invalid player ID")
];

const PlayerDataValidator = [
    body("name")
        .notEmpty()
        .withMessage("Player name is required")
        .isString()
        .withMessage("Player name must be a string")
        .isLength({ min: 2, max: 30 })
        .withMessage("Player name must be between 2 and 30 characters"),

    body("image")
        .notEmpty()
        .withMessage("Player image is required")
        .isURL()
        .withMessage("Player image must be a valid URL"),

    body("country")
        .notEmpty()
        .withMessage("Player country is required"),

    body("battingStyle")
        .notEmpty()
        .withMessage("Player batting style is required")
        .isIn(BATTING_STYLES)
        .withMessage("Invalid batting style"),

    body("bowlingStyle")
        .notEmpty()
        .withMessage("Player bowling style is required")
        .isIn(BOWLING_STYLES)
        .withMessage("Invalid bowling style"),

    body("role")
        .notEmpty()
        .withMessage("Player role is required")
        .isArray({ min: 1 })
        .withMessage("Player role must be a non-empty array"),

    body("role.*")
        .isIn(Object.values(PLAYER_ROLES))
        .withMessage("Invalid player role")
];

export { idValidator, PlayerDataValidator };