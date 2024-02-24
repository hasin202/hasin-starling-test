import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { reducers } from "./store";

const rootReducer = combineReducers(reducers);

export const createTestStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type AppStore = ReturnType<typeof createTestStore>;
