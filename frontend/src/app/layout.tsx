import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Uyonoh's Blog | Engineering & Technical Insights",
    template: "%s | Uyonoh's Blog",
  },
  description:
    "Explore deep dives into software engineering, technical SEO, and modern web development architectures.",
  keywords: [
    "Software Engineering",
    "Technical SEO",
    "Web Development",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Uyonoh" }],
  creator: "Uyonoh",
  publisher: "Uyonoh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    // google: 'BW3giniw1EydeTftID8VS2n2elApCe7pjKByxwfwPiU' // Onomah
    google: "cjK7AMrx63AvyjmZa2NMJ5OrBqexsGy0ToNSbO3vbJM",
  },
  alternates: {
    canonical: "https://blog.uyonoh.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Uyonoh's Blog",
    url: "https://blog.uyonoh.com",
    description: "Engineering and Technical Insights by Uyonoh",
    publisher: {
      "@type": "Organization",
      name: "Uyonoh",
      logo: {
        "@type": "ImageObject",
        url: "https://blog.uyonoh.com/logo.png",
      },
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Suspense fallback={null}>
              <Layout>{children}</Layout>
            </Suspense>
            <Script
              src="/prism-themes/prism-tomorrow.js"
              strategy="lazyOnload"
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
