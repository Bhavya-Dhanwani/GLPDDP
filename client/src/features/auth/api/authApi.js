

import axios from "axios";

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});

authClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);


/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export async function login(credentials) {
  return authClient.post("/api/auth/login", credentials);
}

/**
 * POST /api/auth/register
 * @param {{ fullName: string, email: string, password: string }} payload
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export async function register(payload) {
  return authClient.post("/api/auth/register", payload);
}

/**
 * @returns {Promise<void>}
 */
export async function logout() {
  return authClient.post("/api/auth/logout");
}

/**
 * POST /api/auth/refresh
 * @returns {Promise<{ accessToken: string }>}
 */
export async function refreshToken() {
  return authClient.post("/api/auth/refresh");
}

/**
 * GET /api/auth/me
 * @param {string} accessToken
 * @returns {Promise<{ user: object }>}
 */
export async function getMe(accessToken) {
  return authClient.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
