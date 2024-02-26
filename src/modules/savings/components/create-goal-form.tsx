import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SheetContent, SheetHeader } from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CreateGoalBody, TArgs, createGoal } from "../savings-slice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { toast } from "@/components/ui/use-toast";
import { currencyToSymbol } from "@/modules/user-info/helpers/format-balance";

const FormSchema = z.object({
  savingsName: z
    .string()
    .trim()
    .min(1, { message: "You need to provide a name for your goal" }),
  target: z.number({
    required_error: "Please make sure you enter a target!",
    invalid_type_error: "Please make sure you enter a valid number",
  }),
});

const CreateGoalForm = () => {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, TArgs<CreateGoalBody>, Action>>();
  const { currency, accountUid } = useSelector(
    (state: RootState) => state.userInfo
  );
  const { createGoalLoading } = useSelector(
    (state: RootState) => state.savings
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: { savingsName: "", target: 0.0 },
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const args = {
      accountUid: accountUid,
      body: {
        name: data.savingsName,
        currency: currency,
        target: { currency: currency, minorUnits: data.target * 100 },
      },
    };
    const result = await dispatch(createGoal(args));

    if (createGoal.fulfilled.match(result)) {
      // dispatch(removeBalance(roundUpAmount));
      toast({
        variant: "default",
        title: "Success!",
        description: `Created savings goal ${data.savingsName}`,
      });
    }
    //if the api call fails then show a destructive toast
    if (createGoal.rejected.match(result)) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "We didn't manage to create your savings goal.",
      });
    }
  };

  return (
    <SheetContent side={"bottom"} className="px-12 flex flex-col gap-4">
      <SheetHeader className="text-left">Create a new goal</SheetHeader>
      <hr />
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
                <FormLabel>Savings Goal Name:</FormLabel>
                <FormControl>
                  <Input placeholder="Your goals name" {...field} />
                </FormControl>
                {form.formState.errors.savingsName && (
                  <p className="text-xs text-red-800">
                    {form.formState.errors.savingsName.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target"
            render={() => (
              <FormItem>
                <FormLabel>Savings Target:</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <div className="bg-stone-800 h-[40px] w-[25px] flex items-center justify-center rounded-tl rounded-bl">
                      {currencyToSymbol(currency)}
                    </div>
                    <Input
                      className="rounded-tl-none rounded-bl-none"
                      type="number"
                      step=".01"
                      {...form.register("target", {
                        setValueAs: (value) => Number(value),
                      })}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={createGoalLoading}
            className="w-full disabled:bg-teal-800"
          >
            Create Goal
          </Button>
        </form>
      </Form>
    </SheetContent>
  );
};

export default CreateGoalForm;
