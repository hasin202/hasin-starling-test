import { Skeleton } from "@/components/ui/skeleton";
import FeedItemSkeleton from "./individual-feed-item-skeleton";

const TransactionSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-24 h-6 mb-8" />
      {Array.from({ length: 10 }, (_, id) => {
        return <FeedItemSkeleton key={id} id={id} />;
      })}
    </div>
  );
};
export default TransactionSkeleton;
