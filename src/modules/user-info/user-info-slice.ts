import { BalanceItem } from "@/pages/api/balance/[accountUid]";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getTransactions } from "../transactions/transactions-slice";
import axios from "axios";
import formatBalance from "./helpers/format-balance";

//user info type
export type UserInfo = {
  //set loading states to true by default so skeleton loaders are shown straight away
  accountUid: string;
  accountUidLoading: boolean;
  accountUidError: boolean;
  currency: string;
  balance: number;
  balanceLoading: boolean;
  //dont need balance error because it will be set in the global error slice.
};

const initialState: UserInfo = {
  accountUid: "",
  accountUidLoading: true,
  accountUidError: false,
  currency: "USD",
  balance: 0,
  balanceLoading: true,
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    //dev reducer to display blocking error alert. Using redux chrome extension dispatch: userInfo/Account
    accountErr: (state) => {
      state.accountUidError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAccountUid.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.accountUid = action.payload;
          state.accountUidLoading = false;
        }
      )
      .addCase(getAccountUid.rejected, (state) => {
        state.accountUidError = true;
      })
      .addCase(
        getBalance.fulfilled,
        (state, action: PayloadAction<BalanceItem>) => {
          state.currency = action.payload.currency;
          (state.balance = action.payload.minorUnits),
            (state.balanceLoading = false);
        }
      );
    // .addCase(getBalance.rejected, (state) => {
    //   // //toast logic here!
    //   // //might not need to set loading state to false if the
    //   // state.balanceLoading = false;
    // });
  },
});

//using a thunk to store user info is useful because thunks provide extra functionality like loading and error.
export const getAccountUid = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("userInfo/accountUid", async (_, { rejectWithValue, dispatch }) => {
  try {
    const { data: response } = await axios.get<string>("/api/account-uid");
    //pass the account uid as a param to the getBalance, getTransactions thunk
    //this means that the account uid can be set as a query param when making the API calling so that it can be consumed by the endpoint in /api
    dispatch(getBalance(response));
    dispatch(getTransactions(response));
    return response;
  } catch (error) {
    return rejectWithValue("failed to get user info.");
  }
});

export const getBalance = createAsyncThunk<
  BalanceItem,
  string,
  { rejectValue: string }
>("userInfo/balance", async (accountUid, { rejectWithValue }) => {
  try {
    const { data: response } = await axios.get<BalanceItem>(
      `/api/balance/${accountUid}`
    );
    return response;
  } catch (error) {
    return rejectWithValue("failed at balance");
  }
});

export const {} = userInfoSlice.actions;

export default userInfoSlice.reducer;
