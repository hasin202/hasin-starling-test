import { FeedItem } from "@/pages/api/transactions/[accountUid]";

export const individualRoundUp = (amount: number) => {
  if (!amount) return 0;
  return 100 - (amount % 100);
};

export const calculateTotalRoundUpAmount = (feedItems: FeedItem[]) => {
  const outGoingTransactions = feedItems.filter(
    (feedItem) => feedItem.direction === "OUT"
  );
  const totalAmount = outGoingTransactions.reduce((acc, cur) => {
    return acc + individualRoundUp(cur.amount.minorUnits);
  }, 0);
  return totalAmount;
};
