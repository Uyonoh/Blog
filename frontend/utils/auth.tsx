export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token available");

  const response = await fetch("http://localhost:8000/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) throw new Error("Failed to refresh token");

  const data = await response.json();
  localStorage.setItem("access", data.access);
  return data.access;
};


export const authFetch = async (url: string, options: RequestInit = {}) => {
  const access = localStorage.getItem("access");

  const fetchWithToken = async (token: string) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  };

  let response = await fetchWithToken(access!);

  if (response.status === 401) {
    try {
      const newAccess = await refreshAccessToken();
      response = await fetchWithToken(newAccess);
    } catch (err) {
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};
