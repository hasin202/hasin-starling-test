import { BalanceItem } from "@/pages/api/balance/[accountUid]";
import { SavingsGoals } from "@/pages/api/savings/[accountUid]";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ClientSideReject } from "../blocking-error/global-error-slice";
import { addBalance, removeBalance } from "../user-info/user-info-slice";

export type TArgs<T> = {
  accountUid: string;
  savingsGoalUid?: string;
  body?: T;
  transferAmount?: number;
};

export type TArgsDeleteGoal = {
  accountUid: string;
  savingsGoalUid: string;
  savedAmount: number;
};

export type CreateGoalBody = {
  name: string;
  currency: string;
  target: BalanceItem;
};

//---------------------------------------
export type SavingsInfo = {
  savingsGoals: SavingsGoals[];
  savingsLoading: boolean;
  //states for tracking if the goal has been created
  createGoalLoading: boolean;
  createGoalError: boolean;
  //states for tracking if the amount incoming to  a goal has been transferred
  transferInLoading: boolean;
  transferInError: boolean;
  //states for tracking if the amount outgoing to  a goal has been transferred
  transferOutLoading: boolean;
  transferOutError: boolean;
  //states for tracking if the goal has been deleted
  deleteGoalLoading: boolean;
  deleteGoalError: boolean;
};

export const initialState: SavingsInfo = {
  savingsGoals: [],
  savingsLoading: true,
  createGoalLoading: false,
  createGoalError: false,
  transferInLoading: false,
  transferInError: false,
  transferOutLoading: false,
  transferOutError: false,
  deleteGoalLoading: false,
  deleteGoalError: false,
};

export const savingsSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getSavings.fulfilled,
        (state, action: PayloadAction<SavingsGoals[]>) => {
          state.savingsGoals = action.payload;
          state.savingsLoading = false;
        }
      )
      //managing states for when create a goal btn is pressed
      .addCase(createGoal.pending, (state) => {
        state.createGoalLoading = true;
      })
      .addCase(
        createGoal.fulfilled,
        (state, action: PayloadAction<SavingsGoals>) => {
          state.savingsGoals.push(action.payload);
          state.createGoalLoading = false;
        }
      )
      .addCase(createGoal.rejected, (state) => {
        state.createGoalError = true;
        state.createGoalLoading = false;
      })
      //managing states for when a user transfers a roundup to their goal
      .addCase(transferToGoal.pending, (state) => {
        state.transferInLoading = true;
      })
      .addCase(transferToGoal.fulfilled, (state) => {
        state.transferInLoading = false;
      })
      .addCase(transferToGoal.rejected, (state) => {
        state.transferInError = true;
        state.transferInLoading = false;
      })
      //managing states for when a user transfers an amonut to from a goal to their account
      .addCase(transferFromGoal.pending, (state) => {
        state.transferOutLoading = true;
      })
      .addCase(transferFromGoal.fulfilled, (state) => {
        state.transferOutLoading = false;
      })
      .addCase(transferFromGoal.rejected, (state) => {
        state.transferOutError = true;
        state.transferOutLoading = false;
      })
      //managing states for when a user deletes a goal
      .addCase(deleteGoal.pending, (state) => {
        state.deleteGoalLoading = true;
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.savingsGoals = state.savingsGoals.filter(
          (goal) => goal.savingsGoalUid != action.payload
        );
        state.deleteGoalLoading = false;
      })
      .addCase(deleteGoal.rejected, (state) => {
        state.deleteGoalError = true;
        state.deleteGoalLoading = false;
      });
  },
});

//------------------------------------------------------------------
//THUNKS------------------------------------------------------------
//------------------------------------------------------------------
export const getSavings = createAsyncThunk<
  SavingsGoals[],
  string,
  { rejectValue: ClientSideReject }
>("savings/getSavings", async (accountUid, { rejectWithValue }) => {
  try {
    const { data: response } = await axios.get<SavingsGoals[]>(
      `api/savings/${accountUid}`
    );
    return response;
  } catch (error) {
    return rejectWithValue({ error: true, where: "savings" });
  }
});

//when calling the following thunks some will need a body alongside the accountUid.
//because of this need to pass the params in the form {accountUid: , body: }
export const createGoal = createAsyncThunk<
  SavingsGoals,
  TArgs<CreateGoalBody>,
  { rejectValue: string }
>(
  "savings/createGoal",
  //need to pass in an object because only a single arg can be passed to the payload creator
  //by passing in an object we can send over more than one arg
  async (args, { rejectWithValue }) => {
    const { accountUid, body } = args as TArgs<CreateGoalBody>;
    try {
      const { data: response } = await axios.put(
        `api/savings/${accountUid}`,
        body
      );
      return response;
    } catch (error) {
      return rejectWithValue("failed to make goal");
    }
  }
);

export const transferToGoal = createAsyncThunk<
  boolean,
  TArgs<BalanceItem>,
  { rejectValue: string }
>(
  "savings/transferToGoal",
  //need to pass in an object because only a single arg can be passed to the payload creator
  //by passing in an object we can send over more than one arg
  async (args, { dispatch, rejectWithValue }) => {
    const { accountUid, body, savingsGoalUid, transferAmount } = args;
    try {
      await axios.put(
        `api/savings/${accountUid}/${savingsGoalUid}/transfer-in`,
        body
      );
      if (transferAmount) dispatch(removeBalance(transferAmount));
      return true;
    } catch (error) {
      return rejectWithValue("failed to transfer amount to goal");
    }
  }
);

export const transferFromGoal = createAsyncThunk<
  boolean,
  TArgs<BalanceItem>,
  { rejectValue: string }
>(
  "savings/transferFromGoal",
  //need to pass in an object because only a single arg can be passed to the payload creator
  //by passing in an object we can send over more than one arg
  async (args, { dispatch, rejectWithValue }) => {
    const { accountUid, savingsGoalUid, transferAmount } = args;
    try {
      await axios.put(
        `api/savings/${accountUid}/${savingsGoalUid}/transfer-out`
      );
      if (transferAmount) dispatch(addBalance(transferAmount));
      return true;
    } catch (error) {
      return rejectWithValue("failed to transfer amount to account");
    }
  }
);

export const deleteGoal = createAsyncThunk<
  string,
  TArgsDeleteGoal,
  { rejectValue: string }
>(
  "savings/deleteGoal",
  //need to pass in an object because only a single arg can be passed to the payload creator
  //by passing in an object we can send over more than one arg
  async (args, { dispatch, rejectWithValue }) => {
    const { accountUid, savingsGoalUid, savedAmount } = args;
    try {
      await axios.delete(`api/savings/${accountUid}/${savingsGoalUid}/delete`);
      dispatch(addBalance(savedAmount));
      return savingsGoalUid;
    } catch (error) {
      return rejectWithValue("failed delete goal");
    }
  }
);

export const {} = savingsSlice.actions;

export default savingsSlice.reducer;
