import { useEffect } from "react";
import { getAccountUid } from "@/modules/user-info/user-info-slice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

export default function Home() {
  const dispatch = useDispatch<ThunkDispatch<string, void, any>>();

  useEffect(() => {
    dispatch(getAccountUid());
  }, []);

  return (
    <main>
      <p>hello</p>
    </main>
  );
}
