import axios from "axios";
import { getToken, getRefreshToken, saveToken, saveRefreshToken, logout } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:5151/api",
  headers:{
    "Content-Type":"application/json",
  },
});

api.interceptors.request.use(
(config)=>{
const token = getToken();
if(token){
config.headers.Authorization =
`Bearer ${token}`;
}
console.log(
"API:",
config.method?.toUpperCase(),
config.url
);
return config;
},
(error)=>Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
(response)=>response,
async (error)=>{
console.error(
"Status:",
error.response?.status
);
console.error(
"Response:",
JSON.stringify(error.response?.data, null, 2)
);

const originalRequest = error.config;

if(error.response?.status===401 && !originalRequest._retry){

  if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/login")) {
    logout();
    return Promise.reject(error);
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logout();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        resolve(api(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.post("http://localhost:5151/api/auth/refresh", {
      refreshToken: refreshToken,
    });

    const newToken = response.data.token;
    const newRefreshToken = response.data.refreshToken;

    saveToken(newToken);
    saveRefreshToken(newRefreshToken);

    isRefreshing = false;
    onRefreshed(newToken);

    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  } catch (refreshError) {
    isRefreshing = false;
    refreshSubscribers = [];
    logout();
    return Promise.reject(refreshError);
  }
}

return Promise.reject(error);
}
);

export default api;