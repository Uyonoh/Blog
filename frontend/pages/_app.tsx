import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout"; // Import the Layout
import 'prismjs/themes/prism.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
