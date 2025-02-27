import { MemeModalProvider } from "@/context/MemeModalContext";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MemeModalProvider>
      <Component {...pageProps} />
    </MemeModalProvider>
  );
}

export default MyApp;
