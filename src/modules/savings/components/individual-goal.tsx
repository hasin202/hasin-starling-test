import React from "react";
import { Card } from "@/components/ui/card";
import { SavingsGoals } from "@/pages/api/savings/[accountUid]";
import formatBalance from "@/modules/user-info/helpers/format-balance";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { TArgsDeleteGoal, deleteGoal } from "../savings-slice";
import { RootState } from "@/redux/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ComponentProps = {
  goalDetails: SavingsGoals;
  accountUid: string;
};

const IndividualGoal: React.FC<ComponentProps> = ({
  goalDetails,
  accountUid,
}) => {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, TArgsDeleteGoal, Action>>();

  const { savingsGoalUid, name, totalSaved } = goalDetails;
  const { currency, minorUnits: minorUnitsSaved } = goalDetails.totalSaved;

  const handleDelete = (savingsGoalUid: string) => {
    dispatch(
      deleteGoal({
        accountUid: accountUid,
        savingsGoalUid: savingsGoalUid,
        savedAmount: totalSaved.minorUnits,
      })
    );
  };
  return (
    <Card className="min-h-32 p-0 border-stone-800">
      <div className="min-h-32 flex">
        <div className="w-1/3 bg-[#98F6F4] flex flex-grow rounded-tl-lg rounded-bl-lg" />
        <div className="flex justify-between items-end w-2/3 px-4 py-2">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h1 className="font-semibold text-xl">{name}</h1>
              <p className="text-sm font-light">savings goal</p>
            </div>
            <h2 className="font-semibold text-2xl">
              {formatBalance(minorUnitsSaved, currency)}
            </h2>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="pb-2">
                <Trash2 color="#ef4444" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[300px] rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600"
                  onClick={() => handleDelete(savingsGoalUid)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};

export default IndividualGoal;
