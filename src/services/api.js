import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please try again.");
      return Promise.reject(new Error("Request timeout"));
    }

    if (!error.response) {
      if (error.code === "ERR_NETWORK") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
        return Promise.reject(new Error("Network error"));
      }
      toast.error("Connection failed. Please check your internet connection.");
      return Promise.reject(new Error("Connection failed"));
    }

    const message =
      error.response?.data?.message || error.message || "An error occurred";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      }
    } else if (error.response?.status === 403) {
      toast.error("Access denied");
    } else if (error.response?.status === 429) {
      toast.error("Too many requests. Please try again later.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found");
    } else if (error.response?.status === 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

export const apiRequest = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};
