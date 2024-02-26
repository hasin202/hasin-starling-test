import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import formatBalance from "@/modules/user-info/helpers/format-balance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TArgsTransfer, transferToGoal } from "@/modules/savings/savings-slice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { BalanceItem } from "@/pages/api/balance/[accountUid]";
import { toast } from "@/components/ui/use-toast";
import CreateGoalForm from "@/modules/savings/components/create-goal-form";

const FormSchema = z.object({
  savingsName: z.string({ required_error: "Please select a savings goal!" }),
});

const RoundUpBtn = () => {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, TArgsTransfer<BalanceItem>, Action>>();
  //Get the roundup amount from state
  const { roundUpAmount } = useSelector(
    (state: RootState) => state.transactionsInfo
  );
  //Get the currency and account Uid from state
  const { currency, accountUid } = useSelector(
    (state: RootState) => state.userInfo
  );
  //Get the list of savings goals from state
  const { savingsGoals, transferInLoading } = useSelector(
    (state: RootState) => state.savings
  );
  //create the form using zod. This is what was recommended in the shadcn docs
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  //form on submit handler
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const args = {
      accountUid: accountUid,
      savingsGoalUid: data.savingsName,
      body: { currency: currency, minorUnits: roundUpAmount },
      transferAmount: roundUpAmount,
    };

    const result = await dispatch(transferToGoal(args));

    //if the api call is successful then show a success toast
    if (transferToGoal.fulfilled.match(result)) {
      // dispatch(removeBalance(roundUpAmount));
      toast({
        variant: "default",
        title: "Success!",
        description: `Transferred ${formatBalance(
          roundUpAmount,
          currency
        )} to your savings goal.`,
      });
    }
    //if the api call fails then show a destructive toast
    if (transferToGoal.rejected.match(result)) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "We didn't manage to transfer to your savings goal.",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Round Up</Button>
      </SheetTrigger>
      {savingsGoals.length > 0 ? (
        <SheetContent
          side={"bottom"}
          className="px-12 flex w-full justify-center"
        >
          <div className="flex flex-col gap-4 w-[400px] md:w-[600px] lg:w-[800px]">
            <div className="flex w-full justify-between">
              <SheetHeader>Weekly round up:</SheetHeader>
              <SheetHeader>
                {formatBalance(roundUpAmount, currency)}
              </SheetHeader>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="savingsName"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {savingsGoals.map((goal, i) => (
                            <SelectItem key={i} value={goal.savingsGoalUid}>
                              {goal.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  //if the api call is pending then disable the button
                  disabled={transferInLoading}
                  className="w-full disabled:bg-teal-800"
                >
                  Transfer
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      ) : (
        <CreateGoalForm />
      )}
    </Sheet>
  );
};

export default RoundUpBtn;
