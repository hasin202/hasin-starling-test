import type { NextApiRequest, NextApiResponse } from "next";
import { starling } from "../../../helpers/starling-instance";
import { TApiError, handleError } from "../../../helpers/handle-error";

type StarlingApiSavingsPutResponse = {
  transferUid?: string;
  savingsGoalUid?: string;
  success: boolean;
};

//return type SavingsGoals[], TAPIError, StarlingAPISavingsPutResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | TApiError>
) {
  try {
    const { accountUid, savingsGoalUid } = req.query;
    const body = req.body;
    const savingsBaseUrl = `/account/${accountUid}`;

    //delete a savings goal
    //postman test endpoint: http://localhost:3000/api/savings/6451c9b5-8eb6-4544-a406-494c1f069a82/{savingsGoalUid}/delete
    //make sure to set a savingsGoalUid in params to a vaild savings goal uid
    if (req.method === "DELETE") {
      await starling.delete<StarlingApiSavingsPutResponse>(
        `${savingsBaseUrl}/savings-goals/${savingsGoalUid}`,
        body
      );
      return res.status(200).json(true);
    }
  } catch (error) {
    handleError(
      res,
      error,
      "Something went wrong when trying to delete your goal"
    );
  }
}
