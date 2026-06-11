// Importing modueles 
import { body } from 'express-validator';

const signupValidator = [
    body("name")
    .trim()
    .isEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

    body("email")
    .trim()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

    body("password")
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
];

const loginValidator = [
    body("email")
    .trim()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

    body("password")
    .isEmpty()
    .withMessage("Password is required")
];

export { signupValidator, loginValidator };