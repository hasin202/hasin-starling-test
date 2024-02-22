import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "@/modules/user-info/user-info-slice";

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
  },
});

export const testStore = configureStore({
  reducer: { userInfo: userInfoReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
