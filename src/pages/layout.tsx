import { Toaster } from "@/components/ui/toaster";
import BlockingError from "@/modules/blocking-error/blocking-error";
import Navbar from "@/modules/nav/nav";
import Balance from "@/modules/user-info/components/balance";
import { getAccountUid } from "@/modules/user-info/user-info-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";

type LayoutProps = {
  Component: ReactElement;
};

function Layout({ Component }: LayoutProps) {
  const dispatch = useDispatch<ThunkDispatch<string, void, any>>();

  useEffect(() => {
    dispatch(getAccountUid());
  }, []);
  return (
    <div>
      <div className="flex flex-col py-16 px-12">
        <BlockingError />
        <Navbar />
        <Balance />
        {Component}
      </div>
      <Toaster />
    </div>
  );
}

export default Layout;
