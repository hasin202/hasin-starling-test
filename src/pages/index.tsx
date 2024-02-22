import { Inter } from "next/font/google";
import { useEffect } from "react";
import { getAccountUid } from "@/modules/user-info/user-info-slice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dispatch = useDispatch<ThunkDispatch<string, void, any>>();
  useEffect(() => {
    dispatch(getAccountUid());
    const a = localStorage.getItem("accountUid");
    console.log(a);
  }, []);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <p>hello</p>
    </main>
  );
}
