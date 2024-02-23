// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { starling } from "../helpers/starling-instance";
import { TApiError, handleError } from "../helpers/handle-error";
import { BalanceItem } from "../balance/[accountUid]";

export type FeedItem = {
  feedItemUid: string;
  categoryUid: string;
  amount: BalanceItem;
  sourceAmount: BalanceItem;
  direction: string;
  updatedAt: string;
  transactionTime: string;
  settlementTime: string;
  source: string;
  status: string;
  counterPartyType: string;
  counterPartyName: string;
  counterPartySubEntityName: string;
  counterPartySubEntityIdentifier: string;
  counterPartySubEntitySubIdentifier: string;
  reference: string;
  country: string;
  spendingCategory: string;
  hasAttachment: boolean;
  hasReceipt: boolean;
  batchPaymentDetails: null | {
    batchPaymentUid: string;
    batchPaymentType: string;
  };
};

export type StarlingApiTransactionResponse = {
  feedItems: FeedItem[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeedItem[] | TApiError>
) {
  try {
    //with the request on the front end need to pass the parameter accountUid.
    //in the form /api/balance?accountUid=${accountUid}
    const { accountUid, minTimeStamp, maxTimeStamp } = req.query;
    console.log(maxTimeStamp);
    const { data: response } = await starling<StarlingApiTransactionResponse>(
      `/feed/account/${accountUid}/settled-transactions-between?minTransactionTimestamp=${minTimeStamp}&maxTransactionTimestamp=${maxTimeStamp}`
    );
    //send over all the users transactions
    res.status(200).json(response.feedItems);
  } catch (error) {
    handleError(res, error, "Something went wrong when getting transactions");
  }
}
