import React, { ReactNode } from "react";
import Header from "./Header";
import DarkModeToggle from "./DarkModeToggle";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
      <div
      className="flex lg:hidden"
      style={{boxShadow: 'none', zIndex: 2147483647, position: 'fixed', bottom: 10 + 'px', right: 10 + 'px'}}
      >
        <DarkModeToggle  />
      </div>
    </div>
  );
};

export default Layout;
