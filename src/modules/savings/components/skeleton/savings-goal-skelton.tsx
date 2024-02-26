import { Skeleton } from "@/components/ui/skeleton";
import IndividualGoalSkeleton from "./individual-goal-skeleton";

const SavingsGoalsSkeleton = () => {
  return (
    //if there are no saving goals render a short message telling the user this.
    <div className="flex flex-col gap-4">
      <Skeleton className="w-24 h-6" />
      <div className="flex flex-col flex-grow gap-4">
        <Skeleton className="w-full h-12" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => {
            return <IndividualGoalSkeleton key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SavingsGoalsSkeleton;
