import React from "react";

import { Card } from "@/components/ui/card";
import { SavingsGoals } from "@/pages/api/savings/[accountUid]";
import formatBalance from "@/modules/user-info/helpers/format-balance";

type ComponentProps = {
  goalDetails: SavingsGoals;
};

const IndividualGoal: React.FC<ComponentProps> = ({ goalDetails }) => {
  const { savingsGoalUid, name } = goalDetails;
  const { currency, minorUnits: minorUnitsSaved } = goalDetails.totalSaved;
  return (
    <Card className="min-h-32 p-0 border-stone-800">
      <div className="min-h-32 flex">
        <div className="w-1/3 bg-[#98F6F4] flex flex-grow rounded-tl-lg rounded-bl-lg" />
        <div className="w-2/3 px-4 py-2 flex flex-col justify-between">
          <div>
            <h1 className="font-semibold text-xl">{name}</h1>
            <p className="text-sm font-light">savings goal</p>
          </div>
          <h2 className="font-semibold text-2xl">
            {formatBalance(minorUnitsSaved, currency)}
          </h2>
        </div>
      </div>
    </Card>
  );
};

export default IndividualGoal;
