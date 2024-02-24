// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { starling } from "../../helpers/starling-instance";
import { TApiError, handleError } from "../../helpers/handle-error";
import { BalanceItem } from "../../balance/[accountUid]";
import { v4 as uuidv4 } from "uuid";

export type SavingsGoals = {
  savingsGoalUid: string;
  name: string;
  target: BalanceItem;
  totalSaved: BalanceItem;
  savedPercentage: number;
  state: string;
};

type StarlingApiGetSavingsResponse = {
  savingsGoalList: SavingsGoals[];
};

type StarlingApiSavingsPutResponse = {
  transferUid?: string;
  savingsGoalUid?: string;
  success: boolean;
};

//return type SavingsGoals[], TAPIError, StarlingAPISavingsPutResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SavingsGoals[] | boolean | TApiError>
) {
  try {
    const { accountUid } = req.query;
    const body = req.body;
    const savingsBaseUrl = `/account/${accountUid}`;

    //create a savings goal
    //postman test endpoint: http://localhost:3000/api/savings/6451c9b5-8eb6-4544-a406-494c1f069a82
    //example body:
    // {
    //     "name": "Trip to Paris",
    //     "currency": "GBP",
    //     "target": {
    //         "currency": "GBP",
    //         "minorUnits": 123456
    //     },
    //     "base64EncodedPhoto": "string"
    // }
    if (req.method === "PUT") {
      const { data: response } =
        await starling.put<StarlingApiSavingsPutResponse>(
          `${savingsBaseUrl}/savings-goals`,
          body
        );
      console.log("create a savings goal");
      return res.status(200).json(response.success);
    }

    const { data: response } = await starling<StarlingApiGetSavingsResponse>(
      `/account/${accountUid}/savings-goals`
    );
    res.status(200).json(response.savingsGoalList);
    // res.status(200).json("Get savings goals");
  } catch (error) {
    handleError(
      res,
      error,
      "Something went when either getting savings or creating a new goal"
    );
  }
}
