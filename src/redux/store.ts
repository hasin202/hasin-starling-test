import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "@/modules/user-info/user-info-slice";
import transactionsReducer from "@/modules/transactions/transactions-slice";

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    transactionsInfo: transactionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
