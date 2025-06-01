
const APIROOT = "http://localhost:8000"

const authFetch = async (url: string, options: RequestInit = {}, media: string="") => {
  const token = localStorage.getItem("access_token") || "";

  if (!(media === "media")) {
    options.headers =  {
      ...(options.headers),
      "Content-Type": "application/json"
    };
  }

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

  const fetchWithToken = async (token: string, csrftoken: string) => {
    
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Token ${token}`,
        'X-CSRFToken': csrftoken,
      },
      credentials: "include",
    });
  };

  const csrftoken = getCookie('csrftoken');
  console.log("CSFR: ", csrftoken);
  let response = await fetchWithToken(token, csrftoken || "");

  if (response.status === 401) {
    // console.log("Error: ", response);
    throw new Error("Invalid credentials.");
  }

  return response;
};

export { APIROOT, authFetch };