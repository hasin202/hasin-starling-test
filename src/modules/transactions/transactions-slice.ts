import { FeedItem } from "@/pages/api/transactions/[accountUid]";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { calculateTotalRoundUpAmount } from "./helpers/transaction-helpers";

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
    builder.addCase(
      getTransactions.fulfilled,
      (state, action: PayloadAction<FeedItem[]>) => {
        state.feedItems = action.payload;
        state.roundUpAmount = calculateTotalRoundUpAmount(state.feedItems);
        state.transactionsLoading = false;
      }
    );
  },
});

export const getTransactions = createAsyncThunk<
  FeedItem[],
  string,
  { rejectValue: string }
>("transactionInfo/transactions", async (accountUid, { rejectWithValue }) => {
  const maxDate = new Date();
  const minDate = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  console.log(maxDate.toISOString());
  console.log(minDate.toISOString());
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
    return rejectWithValue("failed at balance");
  }
});

export const {} = transactionInfoSlice.actions;

export default transactionInfoSlice.reducer;
