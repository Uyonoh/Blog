import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import DarkModeToggle from "./DarkModeToggle";
import Auth from "./Auth";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in (you may replace this with real auth check)
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("access");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    router.push("/");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);  // Set authentication state to true
    setIsAuthModalOpen(false); // Close the auth modal
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link href="/">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer">
          Uyonoh&apos;s Blog
        </h1>
      </Link>

      <nav className="space-x-6">
        <Link
          href="/about"
          className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
        >
          Contact
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none"
        />

        {/* <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </button> */}
        <DarkModeToggle />

        {isAuthenticated ? (
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
                setIsAuthModalOpen(true)}
              }
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setIsAuthModalOpen(true)}
              }
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
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
