import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

//user info type
export type UserInfo = {
  accountUid: string;
  accountUidLoading: boolean;
  accountUidError: boolean;
  currency: string;
};

const initialState: UserInfo = {
  accountUid: "",
  accountUidLoading: false,
  accountUidError: false,
  currency: "USD",
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccountUid.pending, (state) => {
        state.accountUidLoading = true;
      })
      .addCase(
        getAccountUid.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.accountUid = action.payload;
          localStorage.setItem("accountUid", state.accountUid);
          state.accountUidLoading = false;
        }
      )
      .addCase(getAccountUid.rejected, (state) => {
        state.accountUidLoading = false;
      });
  },
});

//using a thunk to store user info is useful because thunks provide extra functionality like loading and error.
export const getAccountUid = createAsyncThunk(
  "userInfo/accountUid",
  async (_, { rejectWithValue }) => {
    try {
      const { data: response } = await axios.get<string>("/api/account-uid");
      return response;
    } catch (error) {
      return rejectWithValue("failed to get user info.");
    }
  }
);

export const {} = userInfoSlice.actions;

export default userInfoSlice.reducer;
