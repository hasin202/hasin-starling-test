import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { RootState, reducers } from "./store";

const rootReducer = combineReducers(reducers);

export const createTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppStore = ReturnType<typeof createTestStore>;
