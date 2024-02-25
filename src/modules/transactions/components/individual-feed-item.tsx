import React, { useEffect, useState } from "react";
import { FeedItem } from "@/pages/api/transactions/[accountUid]";
import formatBalance from "@/modules/user-info/helpers/format-balance";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FeedItemProps = {
  feedItem: FeedItem;
  feedItems: FeedItem[];
  id: number;
};

const incomingStyle = "bg-teal-200 text-teal-800";
const outgoingStyle = "bg-red-400 text-red-800";

const FeedItem: React.FC<FeedItemProps> = ({ feedItem, id, feedItems }) => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const convertToDate = new Date(feedItem.settlementTime);
    const formatDate = convertToDate.toISOString().split("T")[0];
    const formatTime = convertToDate
      .toISOString()
      .split("T")[1]
      .substring(0, 5);

    setDate(formatDate);
    setTime(formatTime);
  }, []);
  return (
    <Card
      className={`border-stone-800 rounded-none ${
        id === 0 && "rounded-tl-xl rounded-tr-xl"
      } ${id === feedItems.length - 1 && "rounded-bl-xl rounded-br-xl"}`}
    >
      <div className="flex justify-between p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-lg">{feedItem.counterPartyName}</CardTitle>
          <CardDescription>{`${date} · ${time}`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex flex-col items-end">
          <CardTitle className="text-lg">
            {formatBalance(
              feedItem.amount.minorUnits,
              feedItem.amount.currency
            )}
          </CardTitle>
          <CardDescription
            className={`w-12 text-center rounded mt-[6px] ${
              feedItem.direction === "IN" && incomingStyle
            } ${feedItem.direction === "OUT" && outgoingStyle}`}
          >
            {feedItem.direction}
          </CardDescription>
          {/* <CardDescription>{feedItem.spendingCategory}</CardDescription> */}
        </CardContent>
      </div>
    </Card>
  );
};

export default FeedItem;
