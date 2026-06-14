/**
 * passwordValidation.js — pure password strength utility.
 *
 * Each function accepts a string and returns a boolean.
 * Used by:
 *   - REGISTER_RULES  (RHF validate — blocks submission)
 *   - PasswordHints   (UI — drives real-time visual feedback)
 *
 * Keeping these in one place means the validation rules and the
 * hint indicators are always in sync.
 */

/**
 * Passes when the password is at least 8 characters.
 * @param {string} value
 * @returns {boolean}
 */
export function hasMinLength(value) {
  return typeof value === "string" && value.length >= 8;
}

/**
 * Passes when the password contains at least one digit or special symbol.
 * @param {string} value
 * @returns {boolean}
 */
export function hasNumberOrSymbol(value) {
  return typeof value === "string" && /[\d!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/~`]/.test(value);
}

/**
 * Passes when the password contains both an uppercase and a lowercase letter.
 * @param {string} value
 * @returns {boolean}
 */
export function hasUpperAndLowerCase(value) {
  return typeof value === "string" && /[A-Z]/.test(value) && /[a-z]/.test(value);
}
