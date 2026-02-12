import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = getRefreshToken();
        if (!refresh) {
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/refresh/`,
          { refresh }
        );
        setTokens(res.data.access, refresh);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        clearTokens();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const getLocations = () =>
  api.get("/api/locations/");

export const createLocation = (data: {
  name: string;
  code: string;
}) =>
  api.post("/api/locations/", data);

export const getStats = () =>
  api.get("/api/stats/");
