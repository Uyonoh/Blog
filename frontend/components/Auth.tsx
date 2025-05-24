import { useState } from "react";
import { useRouter } from "next/router";
import { authFetch } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

type AuthProps = {
  register: boolean;
  onLoginSuccess: () => void; // This callback will be triggered on successful login
};

type DecodedToken = {
  username: string;
  user_id: number;
  exp: number;
  iat: number;
};

const getCSRFToken = async () => {
  // Ensure CSRF token is available for protected routes
  await fetch("http://localhost:8000/auth/csrf/", {
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
  const [error, setError] = useState("");
  const router = useRouter();

  

  // Call to ensure CSRF token is set
  getCSRFToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const register = async (url: string, options: RequestInit) => {
      const response = await fetch(url,{
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token ",
      },
      credentials: "include",
    }
  );
    console.log("RESPON: ", response.text());
    return response;
  }

    const endpoint = isRegister ? "register" : "login"; // Determine endpoint
    const body = isRegister
      ? { username, email, password1, password2 }
      : { username, password };
    const meth = isRegister? register : authFetch;

    try {
      const response = await authFetch(
        `http://localhost:8000/auth/${endpoint}/`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(
          isRegister ? "Registration failed" : "Invalid credentials"
        );
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem("token", data.key); // Store JWT access token
      // localStorage.setItem("refresh", data.refresh); // Store refresh token
      // // localStorage.setItem("username", data.username); // Store username
      // const decoded: DecodedToken = jwtDecode(data.access);
      // localStorage.setItem("username", decoded.username); // now stored for use in comments

      // const isHome = (router.pathname === "/");
      // isHome ? router.reload() : router.push("/"); // Redirect to homepage
      onLoginSuccess();
      // router.push("/");
      router.reload();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-lg rounded">
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
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
