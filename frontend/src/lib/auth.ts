// import { getAccess, setAccess, clearTokens } from "./accessStore"; // simple in-memory getter/setter or React hook adapter

// async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
//   const access = getAccess();
//   const headers = new Headers(init.headers || {});
//   if (access) headers.set("Authorization", `Bearer ${access}`);

//   const res = await fetch(input, { ...init, headers, credentials: "include" }); // include cookies for refresh endpoint
//   if (res.status !== 401) return res;

//   // Access probably expired; try refresh
//   const refreshRes = await fetch(
//     `${process.env.NEXT_PUBLIC_API}/api/auth/refresh/`,
//     {
//       method: "POST",
//       credentials: "include", // send refresh cookie
//     }
//   );

//   if (!refreshRes.ok) {
//     // refresh failed -> user must login again
//     clearTokens();
//     return res; // original 401
//   }

//   const refreshData = await refreshRes.json(); // { access: "..." }
//   setAccess(refreshData.access);

//   // retry original request with new access
//   headers.set("Authorization", `Bearer ${refreshData.access}`);
//   return fetch(input, { ...init, headers, credentials: "include" });
// }

interface CsrfTokenResponse {
  detail: string;
  csrfToken: string;
}

const APIROOT = process.env.NEXT_PUBLIC_API_ROOT;

// const authFetch = async (
//   url: string,
//   options: RequestInit = {},
//   media: string = ""
// ) => {
//   const token = getAccess();

//   if (!(media === "media")) {
//     options.headers = {
//       ...options.headers,
//       "Content-Type": "application/json",
//     };
//   }

//   //   const getCookie = (name: string) => {
//   //     const value = `; ${document.cookie}`;
//   //     let parts = value.split(`; ${name}=`);
//   //     if (parts.length === 2) return parts.pop()?.split(';').shift();
//   // }

//   const getCsrfToken = async () => {
//     try {
//       const response = await fetch(APIROOT + "/auth/csrf/", {
//         method: "GET",
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new TypeError(
//           `Failed to fetch csrf token: ${response.status} - ${JSON.stringify(
//             errData
//           )}`
//         );
//       }

//       const data: CsrfTokenResponse = await response.json();
//       return data.csrfToken;
//     } catch (err) {
//       if (err instanceof TypeError) {
//         throw err;
//       }
//     }
//   };

//   const fetchWithToken = async (token: string | null, csrftoken: string) => {
//     return fetch(url, {
//       ...options,
//       headers: {
//         ...(options.headers || {}),
//         Authorization: `Bearer ${token}`,
//         "X-CSRFToken": csrftoken,
//       },
//       credentials: "include",
//     });
//   };

//   const csrftoken = await getCsrfToken(); //getCookie('csrftoken');
//   let response = await fetchWithToken(token, csrftoken || "");

//   if (response.status === 401) {
//     // Access probably expired; try refresh
//     const refreshRes = await fetch(
//       `${APIROOT}/auth/refresh/`,
//       {
//         method: "POST",
//         credentials: "include", // send refresh cookie
//       }
//     );

//     if (!refreshRes.ok) {
//       // refresh failed -> user must login again
//       clearTokens();
//       console.error("Auth Error: ", response);
//       throw new Error("Invalid credentials."); // original 401
//     }

//     const refreshData = await refreshRes.json(); // { access: "..." }
//     console.log("REfre:", refreshData);
//     setAccess(refreshData.access_token);

//     // retry original request with new access
//     response = await fetchWithToken(
//       refreshData.access_token as string,
//       csrftoken || ""
//     );

//     if (response.status === 401) {
//       console.error("Auth Error: ", response);
//       throw new Error("Invalid credentials.");
//     }
//   }

//   return response;
// };

export { APIROOT };
