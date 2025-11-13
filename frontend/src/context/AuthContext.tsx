"use client";
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { APIROOT } from "@/lib/auth";
import { access } from "fs";

async function getUser(
  access: string,
  setAccess: (token: string | null) => void,
  init: RequestInit = {}
) {
  const headers = new Headers(init.headers || {});
  if (access) headers.set("Authorization", `Bearer ${access}`);

  const url = `${APIROOT}/auth/user/`;
  const user_response = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
  }); // include cookies for refresh endpoint
  if (user_response.status !== 401) return user_response;

  // Access probably expired; try refresh
  const refreshRes = await fetch(`${APIROOT}/auth/refresh/`, {
    method: "POST",
    credentials: "include", // send refresh cookie
  });

  if (!refreshRes.ok) {
    // refresh failed -> user must login again
    return null; // original 401
  }

  const refreshData = await refreshRes.json(); // { access: "..." }
  setAccess(refreshData.access_token);

  // retry original request with new access
  headers.set("Authorization", `Bearer ${refreshData.access_token}`);
  return fetch(url, { ...init, headers, credentials: "include" });
}

type User = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
} | null;

type CsrfTokenResponse = {
  detail: string;
  csrfToken: string;
};

const p = Promise<Response>;

const AuthContext = createContext({
  user: null as User,
  access: null as string | null,
  setAccess: (token: string | null) => {},
  setUser: (user: User | null) => {},
  authFetch: (url: string, options: RequestInit = {}, media: string = "", token: string | null = null) =>
    p.prototype,
});

// Custom hook to handle polling logic safely
const usePolling = (
  access: string | null,
  setUser: (user: User | null) => void,
  setAccess: (token: string | null) => void
) => {
  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!access) {
        setUser(null);
        // Route to login logic can go here
        return;
      }
      const response = await getUser(access, setAccess);

      if (!response) {
        setAccess(null);
        setUser(null);
        // Route to login logic can go here
        return;
      }

      const user = await response.json();
      setUser(user as User);
    };

    // Call immediately on mount/access change
    fetchUserStatus();

    // Set up interval for polling (e.g., every 5 minutes)
    const intervalId = setInterval(fetchUserStatus, 5 * 60 * 1000); // 5 minutes (m, s, ms)

    // Clean up interval on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [access, setUser, setAccess]); // Dependencies
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [access, setAccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Use the custom hook to manage polling
  usePolling(access, setUser, setAccess);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      const response = await getUser(access || "", setAccess);

      if (!response) {
        setAccess(null);
        setUser(null);
        // Route to login logic can go here
        return;
      }

      const user = await response.json();
      setUser(user as User);
    }

    checkAuth();
  }, [])

  async function authFetch(
    url: string,
    options: RequestInit = {},
    media: string = "",
    token: string | null = null,
  ): Promise<Response> {

    if (!token) token = access;

    if (!(media === "media")) {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
    }

    // Helper to check if a CSRF token is necessary for the HTTP method
    const isCsrfSafeMethod = (method: string = 'GET') => ['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method.toUpperCase());


    const getCsrfToken = async () => {
      // Don't fetch CSRF token for safe methods
      if (isCsrfSafeMethod(options.method)) return ""; 

      try {
        const response = await fetch(APIROOT + "/auth/csrf/", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new TypeError(
            `Failed to fetch csrf token: ${response.status} - ${JSON.stringify(
              errData
            )}`
          );
        }

        const data: CsrfTokenResponse = await response.json();
        return data.csrfToken;
      } catch (err) {
        console.error(err);
      }
    };

    const fetchWithToken = async (token: string | null, csrftoken: string) => {
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
      });
    };

    const csrftoken = await getCsrfToken(); //getCookie('csrftoken');
    let response = await fetchWithToken(token, csrftoken || "");

    if (response.status === 401) {
      // Access probably expired; try refresh
      const refreshRes = await fetch(`${APIROOT}/auth/refresh/`, {
        method: "POST",
        credentials: "include", // send refresh cookie
      });

      if (!refreshRes.ok) {
        // refresh failed -> user must login again
        console.error("Auth Error: ", response);
         throw new Error("Invalid credentials. Please log in again.");
      }

      const refreshData = await refreshRes.json();
      console.log("REfre:", refreshData);
      setAccess(refreshData.access_token);

      // retry original request with new access
      response = await fetchWithToken(
        refreshData.access_token as string,
        csrftoken || ""
      );

      if (response.status === 401) {
        // User needs to login
        setAccess(null);
      }
    }

    return response;
  }

  return (
    <AuthContext.Provider
      value={{ user, access, setAccess, setUser, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
