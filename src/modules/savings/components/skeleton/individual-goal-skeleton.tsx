import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const IndividualGoalSkeleton = () => {
  return (
    <Card className="min-h-32 p-0 border-stone-800">
      <div className="min-h-32 flex">
        <Skeleton className="w-1/3 bg-[#98F6F4] flex flex-grow rounded-tl-lg rounded-bl-lg rounded-br-none rounded-tr-none" />
        <div className="w-2/3 px-4 py-2 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-14 h-8" />
            <Skeleton className="w-110 h-4" />
          </div>
          <Skeleton className="w-14 h-8" />
        </div>
      </div>
    </Card>
  );
};

export default IndividualGoalSkeleton;
