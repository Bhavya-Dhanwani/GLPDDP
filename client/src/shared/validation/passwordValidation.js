/**
 * passwordValidation.js — pure password strength utility.
 *
 * Each function accepts a string and returns a boolean.
 * Shared by:
 *   - REGISTER_RULES   (RHF validate — blocks form submission)
 *   - PasswordRequirements component (real-time visual feedback)
 */

/** Password must be at least 8 characters. */
export function hasMinLength(value) {
  return typeof value === "string" && value.length >= 8;
}

/** Password must contain at least one digit or special symbol. */
export function hasNumberOrSymbol(value) {
  return (
    typeof value === "string" &&
    /[\d!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/~`]/.test(value)
  );
}

/** Password must contain both an uppercase and a lowercase letter. */
export function hasUpperAndLowerCase(value) {
  return (
    typeof value === "string" &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value)
  );
}
