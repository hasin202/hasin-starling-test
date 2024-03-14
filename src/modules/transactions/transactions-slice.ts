import { FeedItem } from "@/pages/api/transactions/[accountUid]";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { calculateTotalRoundUpAmount } from "./helpers/transaction-helpers";
import { ClientSideReject } from "../blocking-error/global-error-slice";

export type TransactionsInfo = {
  feedItems: FeedItem[];
  transactionsLoading: boolean;
  roundUpAmount: number;
};

const initialState: TransactionsInfo = {
  feedItems: [],
  transactionsLoading: true,
  roundUpAmount: 0,
};

export const transactionInfoSlice = createSlice({
  name: "transactionInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getTransactions.fulfilled,
        (state, action: PayloadAction<FeedItem[]>) => {
          //order the array from most recent to oldest
          state.feedItems = action.payload.reverse();
          state.roundUpAmount = calculateTotalRoundUpAmount(state.feedItems);
          state.transactionsLoading = false;
        }
      )
      .addCase(getTransactions.pending, (state) => {
        state.transactionsLoading = true;
      });
  },
});

export const getTransactions = createAsyncThunk<
  FeedItem[],
  { accountUid: string; selectedMaxDate?: Date },
  { rejectValue: ClientSideReject }
>("transactionInfo/transactions", async (args, { rejectWithValue }) => {
  const { accountUid, selectedMaxDate } = args;
  console.log(accountUid);

  let maxDate: Date = new Date();
  let minDate: Date = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (selectedMaxDate != undefined) {
    maxDate = selectedMaxDate;
    minDate = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    console.log(minDate);
    console.log(selectedMaxDate);
  }
  try {
    const { data: response } = await axios.get<FeedItem[]>(
      `/api/transactions/${accountUid}`,
      {
        params: {
          minTimeStamp: minDate.toISOString(),
          maxTimeStamp: maxDate.toISOString(),
        },
      }
    );
    return response;
  } catch (error) {
    return rejectWithValue({ error: true, where: "transactions" });
  }
});

export const {} = transactionInfoSlice.actions;

export default transactionInfoSlice.reducer;
