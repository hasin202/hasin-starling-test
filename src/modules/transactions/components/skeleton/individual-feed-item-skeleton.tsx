import React, { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type FeedItemSkeletonProps = {
  id: number;
};

const FeedItemSkeleton: React.FC<FeedItemSkeletonProps> = ({ id }) => {
  return (
    <Card
      className={`border-stone-800 rounded-none ${
        id === 0 && "rounded-tl-xl rounded-tr-xl"
      } ${id === 9 && "rounded-bl-xl rounded-br-xl"}`}
    >
      <div className="flex justify-between p-4">
        <div className="p-0 flex flex-col gap-2">
          <Skeleton className="w-12 h-8" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="p-0 flex flex-col gap-2 items-end">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-12 h-4" />
        </div>
      </div>
    </Card>
  );
};

export default FeedItemSkeleton;
