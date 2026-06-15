import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isInitialized = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        finishAuthCheck: (state) => {
            state.isInitialized = true;
        },
    },
});

export const { setUser, clearUser, updateUser, finishAuthCheck } = authSlice.actions;
export default authSlice.reducer;
