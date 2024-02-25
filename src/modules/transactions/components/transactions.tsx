import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import FeedItem from "./individual-feed-item";
import TransactionSkeleton from "./skeleton/transactions-skeleton";
import RoundUpBtn from "./round-up-btn";

const NoTransactions = () => {
  return (
    <div className="flex flex-col items-center mt-12 gap-2">
      <h1 className="font-bold text-3xl">Interersting...</h1>
      <p>Looks like you dont have any transactions.</p>
      <p className="">Go buy something and try again</p>
    </div>
  );
};

const Transactions = () => {
  const { feedItems, transactionsLoading, roundUpAmount } = useSelector(
    (state: RootState) => state.transactionsInfo
  );
  if (transactionsLoading) return <TransactionSkeleton />;
  if (feedItems.length === 0) return <NoTransactions />;
  return (
    <div className="flex flex-col gap-4">
      <p className="font-light">Transactions</p>
      {/*If the users has transactions but they're all incoming or the roundup is 0 the roundup amount btn will be hidden */}
      {roundUpAmount && <RoundUpBtn />}
      <div>
        {feedItems.map((feedItem, i) => (
          <FeedItem key={i} feedItem={feedItem} id={i} feedItems={feedItems} />
        ))}
      </div>
    </div>
  );
};

export default Transactions;
