import { Skeleton } from "@/components/ui/skeleton";

const NavSkeleton = () => {
  return (
    <div className="w-full flex justify-between">
      <div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      <div className="hidden md:flex gap-4 items-center">
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-20 h-8" />
      </div>
      <div className="flex md:hidden">
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};

export default NavSkeleton;
