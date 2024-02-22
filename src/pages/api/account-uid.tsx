// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { starling } from "./helpers/starling-instance";
import { handleError } from "./helpers/handle-error";

type AccountInfo = {
  accountUid: string;
  accountType: string;
  defaultCategory: string;
  currency: string;
  createdAt: string;
  name: string;
};

type AccountRes = {
  accounts: AccountInfo[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //if the access token isnt set in the env then throw an error
    if (!process.env.ACCESS_TOKEN) {
      return res.status(401).json({ message: "Missing ACCESS_TOKEN" });
    }
    const { data: response } = await starling.get<AccountRes>("/accounts");
    const accountUid = response.accounts[0].accountUid;
    res.status(200).json(accountUid);
  } catch (error) {
    handleError(res, error, "Something went wrong when getting account info");
  }
}
