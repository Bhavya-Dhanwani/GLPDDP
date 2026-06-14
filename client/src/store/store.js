/**
 * store.js — application Redux store.
 * Import `store` for the Provider, `useAppDispatch` / `useAppSelector`
 * in components instead of the plain hooks.
 */

import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/state";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
