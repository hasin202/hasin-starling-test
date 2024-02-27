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
  { accountUid: string; selectedMinDate?: Date },
  { rejectValue: ClientSideReject }
>("transactionInfo/transactions", async (args, { rejectWithValue }) => {
  const { accountUid, selectedMinDate } = args;
  console.log(accountUid);

  let maxDate: Date = new Date();
  let minDate: Date = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (selectedMinDate != undefined) {
    minDate = selectedMinDate;
    maxDate = new Date(minDate.getTime() + 7 * 24 * 60 * 60 * 1000);
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
