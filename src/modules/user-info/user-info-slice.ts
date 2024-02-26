import { BalanceItem } from "@/pages/api/balance/[accountUid]";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getTransactions } from "../transactions/transactions-slice";
import { getSavings } from "../savings/savings-slice";
import axios from "axios";
import { ClientSideReject } from "../blocking-error/global-error-slice";
import {
  setAccountUidError,
  setOtherErrors,
} from "../blocking-error/global-error-slice";

//user info type
export type UserInfo = {
  //set loading states to true by default so skeleton loaders are shown straight away
  accountUid: string;
  initalLoading: boolean;
  currency: string;
  balance: number;
  balanceLoading: boolean;
  //dont need balance error because it will be set in the global error slice.
};

const initialState: UserInfo = {
  accountUid: "",
  initalLoading: true,
  currency: "USD",
  balance: 0,
  balanceLoading: true,
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    addBalance: (state, action: PayloadAction<number>) => {
      state.balance = state.balance + action.payload;
    },
    removeBalance: (state, action: PayloadAction<number>) => {
      state.balance = state.balance - action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAccountUid.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.accountUid = action.payload;
          state.initalLoading = false;
        }
      )
      .addCase(
        getBalance.fulfilled,
        (state, action: PayloadAction<BalanceItem>) => {
          state.currency = action.payload.currency;
          state.balance = action.payload.minorUnits;
          state.balanceLoading = false;
        }
      )
      .addCase(getBalance.pending, (state) => {
        state.balanceLoading = true;
      });
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
    //dispatch all the API calls at the same time so that if multiple of them have an error this can be shown to the user
    const promiseErrors = await Promise.allSettled([
      //pass the account uid as a param to the getBalance, getTransactions thunk
      //this means that the account uid can be set as a query param when making the API calling so that it can be consumed by the endpoint in /api
      dispatch(getBalance(response)),
      dispatch(getTransactions(response)),
      dispatch(getSavings(response)),
    ])
      //promise.allSettled returns a lot of data, not just the resolve/reject value
      //so this code is seeing if there has been an error in any of the dispatched actions
      .then((results) =>
        results
          .map((result) => {
            if (result.status === "fulfilled") {
              const payload = result.value.payload;
              //if the promise resolves payload will be the data, if it rejects it will be {error: true, payload: message}
              if (payload && "error" in payload && "where" in payload) {
                return payload.where;
              }
            }
          })
          //the map returns where the error happened, if any occurred, or undefined if there was none.
          //so filter the array to only contain values saying where errors occured
          .filter((where) => where != undefined)
      );

    //if this array has any errors then throw an error
    if (promiseErrors.length > 0) {
      throw promiseErrors;
    }
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch(setAccountUidError());
      // return rejectWithValue("failed to get user info.");
    } else if (Array.isArray(error)) {
      dispatch(setOtherErrors(error));
    }
    return rejectWithValue("oops");
  }
});

//------------------------------------------------------------
//----GET BALANCE---------------------------------------------
//------------------------------------------------------------

export const getBalance = createAsyncThunk<
  BalanceItem,
  string,
  { rejectValue: ClientSideReject }
>("userInfo/balance", async (accountUid, { rejectWithValue }) => {
  try {
    const { data: response } = await axios.get<BalanceItem>(
      `/api/balance/${accountUid}`
    );
    return response;
  } catch (error) {
    return rejectWithValue({ error: true, where: "balance" });
  }
});

export const { addBalance, removeBalance } = userInfoSlice.actions;

export default userInfoSlice.reducer;
