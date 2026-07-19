import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || (error.response ? "An unexpected error occurred." : "Unable to connect to server. Please check backend.");

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      } else {
        toast.error(message);
      }
    } else if (status === 429) {
      toast.error("Too many requests. Please slow down.");
    } else if (status >= 500) {
      toast.error("Internal Server Error. Please contact support.");
    } else if (data && data.errors && data.errors.length > 0) {
      // Loop over multiple validation errors if sent by express-validator
      data.errors.forEach((err) => {
        toast.error(`${err.msg}`);
      });
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

