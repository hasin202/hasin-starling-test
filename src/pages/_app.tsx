import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import BlockingError from "@/modules/blocking-error/blocking-error";
import Balance from "@/modules/user-info/components/balance";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="flex flex-col py-16 px-12">
        <BlockingError />
        <Balance />
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}
