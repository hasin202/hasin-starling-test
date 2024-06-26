import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Layout from "./layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout Component={<Component {...pageProps} />} />
    </Provider>
  );
}
