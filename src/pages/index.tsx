import { useEffect } from "react";
import { getAccountUid } from "@/modules/user-info/user-info-slice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import Transactions from "@/modules/transactions/components/transactions";

export default function Home() {
  const dispatch = useDispatch<ThunkDispatch<string, void, any>>();

  useEffect(() => {
    dispatch(getAccountUid());
  }, []);

  return (
    <main>
      <Transactions />
    </main>
  );
}
