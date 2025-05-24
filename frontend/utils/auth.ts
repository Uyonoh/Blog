
const APIROOT = "http://localhost:8000"


const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token available");

  const response = await fetch("/auth/token/refresh/", {
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


const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token") || "";

  const getCookie = async (name: string) => {
    const value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

  const fetchWithToken = async (token: string, csrftoken: string) => {
    
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        'X-CSRFToken': csrftoken,
      },
      credentials: "include",
    });
  };

  const csrftoken = await getCookie('csrftoken');
  console.log("CSFR: ", csrftoken);
  let response = await fetchWithToken(token, csrftoken || "");

  if (response.status === 401) {
    try {
      // const newAccess = await refreshAccessToken();
      // response = await fetchWithToken(newAccess);
      throw new Error("")
    } catch (err) {
      console.log("Error: ", err);
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};

export { APIROOT, authFetch };