import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import formatBalance from "../helpers/format-balance";
import BalanceSkeleton from "./balance-skeleton";

const Balance = () => {
  const { balance, currency, balanceLoading } = useSelector(
    (state: RootState) => state.userInfo
  );

  return balanceLoading ? (
    <BalanceSkeleton />
  ) : (
    <div className="w-full px-2 py-4 flex flex-col items-center gap-2">
      <h1 className="font-light text-slate-300">Your Balance</h1>
      <h2 className="font-bold text-4xl">{formatBalance(balance, currency)}</h2>
    </div>
  );
};

export default Balance;
