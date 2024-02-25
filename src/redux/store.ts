import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userInfoReducer from "@/modules/user-info/user-info-slice";
import transactionsReducer from "@/modules/transactions/transactions-slice";
import savingsReducer from "@/modules/savings/savings-slice";
import globalErrorReducer from "@/modules/blocking-error/global-error-slice";

export const reducers = {
  globalError: globalErrorReducer,
  userInfo: userInfoReducer,
  transactionsInfo: transactionsReducer,
  savings: savingsReducer,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
