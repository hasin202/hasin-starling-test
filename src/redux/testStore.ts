import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { reducers } from "./store";

const rootReducer = combineReducers(reducers);

export const testStore = configureStore({
  reducer: rootReducer,
});
