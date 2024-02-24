// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { starling } from "../../../helpers/starling-instance";
import { TApiError, handleError } from "../../../helpers/handle-error";
import { v4 as uuidv4 } from "uuid";
import { BalanceItem } from "@/pages/api/balance/[accountUid]";

type StarlingApiSavingsPutResponse = {
  transferUid?: string;
  savingsGoalUid?: string;
  success: boolean;
};

//endpoint for transferring amount back to account
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | TApiError>
) {
  try {
    const { accountUid, savingsGoalUid } = req.query;
    const body: BalanceItem = req.body;
    const savingsBaseUrl = `/account/${accountUid}`;

    //transfer to a savings goal
    //postman test endpoint: http://localhost:3000/api/savings/6451c9b5-8eb6-4544-a406-494c1f069a82/{savingsGoalUid}/transfer-out
    //when using postman don't forget to set the body
    //example body:
    // {
    //     "amount": {
    //         "currency": "GBP",
    //         "minorUnits": 20000
    //     }
    // }
    if (req.method === "PUT" && savingsGoalUid) {
      const transferUid = uuidv4();
      const { data: response } =
        await starling.put<StarlingApiSavingsPutResponse>(
          `${savingsBaseUrl}/savings-goals/${savingsGoalUid}/withdraw-money/${transferUid}`,
          { amount: body }
        );
      return res.status(200).json(response.success);
    }
  } catch (error) {
    handleError(
      res,
      error,
      "Something went wrong when transferring into your savings goal"
    );
  }
}
