import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from 'next/head';
import Script from "next/script";
import Layout from "../components/Layout"; // Import the Layout
import { ThemeProvider } from "../components/ThemeContext";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.id = 'prism-theme'

    if (theme === 'dark') {
      link.href = '/prism-themes/prism-tomorrow.css'
    } else {
      link.href = '/prism-themes/prism.css'
    }

    document.head.appendChild(link)

    return () => {
      const existing = document.getElementById('prism-theme')
      if (existing) existing.remove()
    }
  }, []);

  return (
    <ThemeProvider>
      <Head>
        <title>Uyonoh&apos;s Blog</title>
        <meta name="description" content="Uyonoh&apos;s Blog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
        <Script src="/prism-themes/prism-tomorrow.js" ></Script>
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
