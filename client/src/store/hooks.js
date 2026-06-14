/**
 * hooks.js — typed Redux hooks.
 * Use these everywhere instead of the raw useDispatch / useSelector.
 */

import { useDispatch, useSelector } from "react-redux";

/** @returns {import('./store').store.dispatch} */
export const useAppDispatch = () => useDispatch();

/** @type {import('react-redux').TypedUseSelectorHook<ReturnType<typeof import('./store').store.getState>>} */
export const useAppSelector = useSelector;
