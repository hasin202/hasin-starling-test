// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { starling } from "./helpers/starling-instance";
import { TApiError, handleError } from "./helpers/handle-error";

export type BalanceItem = {
  currency: string;
  minorUnits: number;
};

export type Balance = {
  clearedBalance: BalanceItem;
  effectiveBalance: BalanceItem;
  pendingTransactions: BalanceItem;
  acceptedOverdraft: BalanceItem;
  amount: BalanceItem;
  totalClearedBalance: BalanceItem;
  totalEffectiveBalance: BalanceItem;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceItem | TApiError>
) {
  try {
    //with the request on the front end need to pass the parameter accountUid.
    //in the form /api/balance?accountUid=${accountUid}
    const { accountUid } = req.query;
    const { data: response } = await starling<Balance>(
      `/accounts/${accountUid}/balance`
    );
    //send the users amount over because if the user transfers some money into a space or savings goal amount reflects this
    //whereas some of ther other properties of response dont
    res.status(200).json(response.amount);
  } catch (error) {
    handleError(
      res,
      error,
      "Something went wrong when getting account balance"
    );
  }
}
