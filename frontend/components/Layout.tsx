import React, { ReactNode } from "react";
import Header from "./Header"; // Import your header component

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
