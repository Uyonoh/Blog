"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";
import Auth from "./Auth";
import { APIROOT } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./SearchBar";

const Header = () => {
  // const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const isMounted = useRef(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, access, setAccess, authFetch } = useAuth();

  // Open login model if no user
  useEffect(() => {
    if (isMounted.current) {
      if (!user) {
        setIsAuthModalOpen(true);
        setIsAdmin(false);
      } else {
        setIsAdmin(user.is_staff);
      }
    } else {
      isMounted.current = true;
    }
  }, [user]);

  const handleLogout = async () => {
    const res = await authFetch(APIROOT + "/auth/logout/", {
      method: "POST",
      credentials: "include",
    });
    setAccess(null);
    router.push("/");
  };

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme");
  //   if (savedTheme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   }
  // }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false); // Close the auth modal
  };

  // TODO: Convert menu to usestate based
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* <Link href="/"> */}
      <h1
        className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer"
        onClick={() => router.push("/")}
      >
        Uyonoh&apos;s Blog
      </h1>
      {/* </Link> */}

      <div
        id="open-menu"
        className={`flex lg:hidden ${isMenuOpen ? "hidden" : ""}`}
      >
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white"
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      <nav className="hidden lg:flex space-x-6 text-gray-700 dark:text-gray-300 *:hover:text-blue-500">
        <Link href="/">Home</Link>
        <Link href="/topics">Topics</Link>
        <Link href="/contact">Contact</Link>

        {isAdmin && <Link href="/post/create/">Create</Link>}
      </nav>

      <div className="hidden lg:flex  items-center space-x-4">
        {/* <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none"
        /> */}
        <SearchBar />

        <DarkModeToggle />

        {user ? (
          <>
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsRegister(false);
                setIsAuthModalOpen(true);
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setIsAuthModalOpen(true);
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`${isMenuOpen ? "" : "hidden"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Background backdrop */}
        <div className="fixed inset-0 z-50"></div>
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={toggleMenu}>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer">
                Uyonoh&apos;s Blog
              </h1>
            </Link>

            {/* Replace with component */}
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-white"
              onClick={toggleMenu}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 flow-root text-gray-700 dark:text-white hover:text-blue-500">
            <div className="-my6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <div className="-mx-3 *:dark:text-white *:dark:hover:bg-gray-500 first:hover:none">
                  {user ? (
                    <div className="grid grid-cols-3 w-full items-center justify-items-center rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:none *:dark:hover:bg-gray-500">
                      <Link
                        href="/profile"
                        className="text-left hover:bg-gray-50 w-full"
                        aria-controls="disclosure-1"
                        aria-expanded="false"
                        onClick={toggleMenu}
                      >
                        Profile
                      </Link>
                      <span className="flex w-full justify-center">|</span>
                      <button
                        className="hover:bg-gray-50 pointer w-full align-self-end"
                        aria-controls="disclosure-1"
                        aria-expanded="false"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 w-full items-center justify-items-center rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 *:dark:hover:bg-gray-500">
                      <button
                        className="text-left hover:bg-gray-50 w-full"
                        aria-controls="disclosure-1"
                        aria-expanded="false"
                        onClick={() => {
                          toggleMenu();
                          setIsRegister(false);
                          setIsAuthModalOpen(true);
                        }}
                      >
                        Login
                      </button>
                      <span className="flex w-full justify-center">|</span>
                      <button
                        className="hover:bg-gray-50 w-full align-self-end"
                        aria-controls="disclosure-1"
                        aria-expanded="false"
                        onClick={() => {
                          toggleMenu();
                          setIsRegister(true);
                          setIsAuthModalOpen(true);
                        }}
                      >
                        Signup
                      </button>
                    </div>
                  )}

                  {isAdmin && (
                    <Link
                      href="/post/create"
                      className="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      aria-controls="disclosure-1"
                      aria-expanded="false"
                      onClick={toggleMenu}
                    >
                      Create Post
                    </Link>
                  )}

                  <Link
                    href="/topics"
                    className="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    aria-controls="disclosure-1"
                    aria-expanded="false"
                    onClick={toggleMenu}
                  >
                    Topics
                  </Link>
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    aria-controls="disclosure-1"
                    aria-expanded="false"
                    onClick={toggleMenu}
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-black bg-opacity-50"
          onClick={(e) => {
            setIsAuthModalOpen(false);
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <Auth register={isRegister} onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </header>
  );
};

// export {Header, };
export default Header;
