"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../transactions-slice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const DatePicker = () => {
  const [date, setDate] = useState<Date>();
  const dispatch =
    useDispatch<
      ThunkDispatch<
        RootState,
        { accountUid: string; selectedMinDate?: Date },
        Action
      >
    >();
  const { accountUid } = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    dispatch(
      getTransactions({ accountUid: accountUid, selectedMinDate: date })
    );
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[160px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Week starting</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
