import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import FeedItem from "./individual-feed-item";
import TransactionSkeleton from "./skeleton/transactions-skeleton";
import RoundUpBtn from "./transfer-to-goal-form";
import DatePicker from "./date-picker";

const NoTransactions = () => {
  return (
    <div className="flex flex-col items-center mt-12 gap-2">
      <h1 className="font-bold text-3xl">Interersting...</h1>
      <p>Looks like you dont have any transactions for that time perios.</p>
    </div>
  );
};

const Transactions = () => {
  const { feedItems, transactionsLoading, roundUpAmount } = useSelector(
    (state: RootState) => state.transactionsInfo
  );
  const { initalLoading, balance } = useSelector(
    (state: RootState) => state.userInfo
  );
  if (initalLoading) return <TransactionSkeleton />;
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-between items-center">
        <p className="font-light">Transactions</p>
        <DatePicker />
      </div>
      {feedItems.length === 0 ? (
        <NoTransactions />
      ) : (
        <>
          {/*If the users has transactions but they're all incoming or the roundup is 0 the roundup amount btn will be hidden */}
          {roundUpAmount && roundUpAmount < balance && <RoundUpBtn />}
          {transactionsLoading ? (
            <TransactionSkeleton />
          ) : (
            <div>
              {feedItems.map((feedItem, i) => (
                <FeedItem
                  key={i}
                  feedItem={feedItem}
                  id={i}
                  feedItems={feedItems}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;
