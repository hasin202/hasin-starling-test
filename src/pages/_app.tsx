import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import BlockingError from "@/modules/blocking-error/blocking-error";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <BlockingError />
      <Component {...pageProps} />
    </Provider>
  );
}
