import { FeedItem } from "@/pages/api/transactions/[accountUid]";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

//user info type
export type TransactionsInfo = {
  feedItems: FeedItem[];
  transactionsLoading: boolean;
};

const initialState: TransactionsInfo = {
  feedItems: [],
  transactionsLoading: true,
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
  try {
    const { data: response } = await axios.get<FeedItem[]>(
      `/api/transactions/${accountUid}?minTimeStamp=2022-01-01T12:34:56.000Z&maxTimeStamp=2024-03-01T12:34:56.000Z`
    );
    return response;
  } catch (error) {
    return rejectWithValue("failed at balance");
  }
});

export const {} = transactionInfoSlice.actions;

export default transactionInfoSlice.reducer;
