import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called when login / register succeeds
    setCredentials(state, action) {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.error = null;
    },

    // Clear everything on logout or token expiry
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },

    // Loading state management (hooks call these manually)
    setLoading(state, action) {
      state.isLoading = action.payload;
    },

    // Store a human-readable error for the UI to display
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear a stale error when the user starts typing again
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectCurrentUser        = (state) => state.auth.user;
export const selectAccessToken        = (state) => state.auth.accessToken;
export const selectAuthIsLoading      = (state) => state.auth.isLoading;
export const selectAuthError          = (state) => state.auth.error;
export const selectIsAuthenticated    = (state) => !!state.auth.accessToken;

export default authSlice.reducer;
