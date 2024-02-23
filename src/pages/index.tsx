import { useEffect } from "react";
import { getAccountUid } from "@/modules/user-info/user-info-slice";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export default function Home() {
  const dispatch = useDispatch<ThunkDispatch<string, void, any>>();
  const { balance } = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    dispatch(getAccountUid());
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >
      <p>hello</p>
      <p>{JSON.stringify(balance)}</p>
    </main>
  );
}
