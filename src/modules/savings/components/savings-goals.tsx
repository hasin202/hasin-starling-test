import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import IndividualGoal from "./individual-goal";
import SavingsGoalsSkeleton from "./skeleton/savings-goal-skelton";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CreateGoalForm from "./create-goal-form";

const SavingsGoals = () => {
  const { savingsGoals } = useSelector((state: RootState) => state.savings);
  const { initalLoading, accountUid } = useSelector(
    (state: RootState) => state.userInfo
  );

  if (initalLoading) return <SavingsGoalsSkeleton />;
  return (
    //if there are no saving goals render a short message telling the user this.
    <div className="flex flex-col gap-4">
      <p className="font-light">Savings Goals</p>
      <div className="flex flex-col flex-grow gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full">Make a new savings goals</Button>
          </SheetTrigger>
          <CreateGoalForm />
        </Sheet>
        {savingsGoals.length ? (
          <div className="flex flex-col gap-4">
            {savingsGoals.map((g, i) => {
              return (
                <IndividualGoal
                  key={i}
                  goalDetails={g}
                  accountUid={accountUid}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col flex-grow gap-4">
            <p className="text-lg text-center">
              Looks like you haven't made any savings goals yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;
