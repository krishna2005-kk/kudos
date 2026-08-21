import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

let accessToken = null;
let refreshRequest = null;

export function setAccessToken(token) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.data?.accessToken)
      setAccessToken(response.data.data.accessToken);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.includes("/auth/");

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshRequest ||= api.post("/auth/refresh-token");

    try {
      const refreshResponse = await refreshRequest;
      setAccessToken(refreshResponse.data.data.accessToken);
      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = null;
    }
  },
);

export function getApiError(error) {
  const details = error.response?.data?.errors;
  if (details && Array.isArray(details))
    return details.map((item) => item.message).join(", ");
  return (
    error.response?.data?.message || "Something went wrong. Please try again."
  );
}

export default api;
