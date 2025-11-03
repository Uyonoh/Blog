
interface CsrfTokenResponse {
  detail: string;
  csrfToken: string;
}

const APIROOT = process.env.NEXT_PUBLIC_API_ROOT;

const authFetch = async (url: string, options: RequestInit = {}, media: string="") => {
  const token = localStorage.getItem("access_token") || "";

  if (!(media === "media")) {
    options.headers =  {
      ...(options.headers),
      "Content-Type": "application/json"
    };
  }

//   const getCookie = (name: string) => {
//     const value = `; ${document.cookie}`;
//     let parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(';').shift();
// }

const getCsrfToken = async () => {
  try {
    const response = await fetch(APIROOT + "/auth/csrf/", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok){
      const errData = await response.json();
      throw new TypeError(`Failed to fetch csrf token: ${response.status} - ${JSON.stringify(errData)}`);
    }

    const data:CsrfTokenResponse = await response.json();
    return data.csrfToken;
  } catch(err) {
    if (err instanceof TypeError){
      throw err;
    }
  }
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

  const csrftoken = await getCsrfToken() //getCookie('csrftoken');
  console.log("CSFR token: ", csrftoken);
  let response = await fetchWithToken(token, csrftoken || "");

  if (response.status === 401) {
    // console.log("Error: ", response);
    throw new Error("Invalid credentials.");
  }

  return response;
};

export { APIROOT, authFetch };