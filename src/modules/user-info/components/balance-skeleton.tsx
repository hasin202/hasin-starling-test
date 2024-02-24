import { Skeleton } from "@/components/ui/skeleton";

const BalanceSkeleton = () => {
  return (
    <div className="w-full px-2 py-4 flex flex-col items-center gap-2">
      <Skeleton className="w-36 h-8 rounded" />
      <Skeleton className="w-48 h-12 rounded" />
    </div>
  );
};

export default BalanceSkeleton;
