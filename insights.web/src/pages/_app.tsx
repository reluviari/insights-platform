import { store } from "@src/store";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import useTokenExpirationCheck from "@src/hooks/useTokenExpiration";
const inter = Inter({ subsets: ["latin"] });

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || (page => page);
  const WithTokenExpirationCheck: React.FC = () => {
    useTokenExpirationCheck();
    return null;
  };

  return (
    <Provider store={store}>
      <WithTokenExpirationCheck />
      <Head>
        <title>Insights</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <main className={inter.className}>
        <Toaster />
        {getLayout(<Component {...pageProps} />)}
      </main>
    </Provider>
  );
}

export default App;
