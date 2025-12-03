"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
import { APIROOT } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type AuthProps = {
  register: boolean;
  onLoginSuccess: () => void; // This callback will be triggered on successful login
};

const getCSRFToken = async () => {
  // Ensure CSRF token is available for protected routes
  await fetch(APIROOT + "/auth/csrf/", {
    credentials: "include", // Important for setting cookies
  });
};

const Auth = ({ register, onLoginSuccess }: AuthProps) => {
  const [isRegister, setIsRegister] = useState(register); // Toggle between login & register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState(""); // Only for registration
  const [submited, setSubmited] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  // const router = useRouter();

  const { setAccess, setUser, authFetch } = useAuth();

  

  // Call to ensure CSRF token is set
  getCSRFToken();

  // validation
  const validateForm = () => {
    const endpoint = isRegister ? "register" : "login"

    // Username
    if (!(username.length >= 2)) return false;

    // Password
    if (!(password.length >= 2)) return false;

    if (endpoint == "register") {
       // Email
      if (!(email.length >= 2)) return false;
      
      // Password
      if (!(password1.length >= 2)) return false;
      if (!(password1 === password2)) return false;
    }

    return true;
  }

  useEffect(() => {
    setIsValid(validateForm());
  }, [username, email, password, password1, password2]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");


    const endpoint = isRegister ? "register" : "login"; // Determine endpoint
    setIsValid(validateForm());
    const body = isRegister
      ? { username, email, password1, password2 }
      : { username, password };

    try {
      setSubmited(true);

      const response = await fetch(
        `${APIROOT}/auth/${endpoint}/`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(body),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new TypeError(
          isRegister ? "Registration failed" : "Invalid credentials"
        );
      }

      const data = await response.json();
      setAccess(data.access_token);
      // always set user along with access
      // setUser(data.user);

      // const isHome = (router.pathname === "/");
      // isHome ? router.reload() : router.push("/"); // Redirect to homepage
      onLoginSuccess();
      // router.push("/");
      // router.reload();
    } catch (error) {
      if (error instanceof TypeError) {
        setError(error.message);
      }
    } finally {
      setSubmited(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 dark:text-white rounded">
      <h2 className="text-2xl font-bold mb-4">{isRegister ? "Register" : "Login"}</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
        
        {isRegister && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      )}

        <input
          type="password"
          placeholder="Password"
          value={isRegister ? password1 : password}
          onChange={(e) => isRegister ? setPassword1(e.target.value) : setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      {isRegister && (
        <input
          type="password"
          placeholder="Password Again"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      )}
        <button disabled={!isValid || submited} type="submit" className={'w-full bg-blue-500 text-white p-2 rounded cursor-pointer disabled:cursor-not-allowed' + (submited? " animate-pulse ": "") + (!isValid? " bg-gray-400 ": "" )}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      {/* Toggle between Login/Register */}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-500 underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
