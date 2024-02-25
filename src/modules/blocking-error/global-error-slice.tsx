import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

//user info type
export type GlobalError = {
  //set loading states to true by default so skeleton loaders are shown straight away
  accountUidError: boolean;
  otherErrors: boolean;
  otherErrorsExplination: string[];
};

const initialState: GlobalError = {
  accountUidError: false,
  otherErrors: false,
  otherErrorsExplination: [],
};

export type ClientSideReject = {
  error: true;
  where: string;
};

export const globalErrorSlice = createSlice({
  name: "globalError",
  initialState,
  reducers: {
    //dev reducer to display blocking error alert. Using redux chrome extension dispatch: userInfo/Account
    setAccountUidError: (state) => {
      state.accountUidError = true;
    },
    setOtherErrors: (state, action: PayloadAction<string[]>) => {
      state.otherErrors = true;
      state.otherErrorsExplination = action.payload;
    },
  },
});

export const { setAccountUidError, setOtherErrors } = globalErrorSlice.actions;

export default globalErrorSlice.reducer;
