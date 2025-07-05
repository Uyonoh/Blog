import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout"; // Import the Layout
// import 'prismjs/themes/prism.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.id = 'prism-theme'

    if (theme === 'dark') {
      link.href = '/prism-dark.css'
    } else {
      link.href = '/prism-light.css'
    }

    document.head.appendChild(link)

    return () => {
      const existing = document.getElementById('prism-theme')
      if (existing) existing.remove()
    }
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
