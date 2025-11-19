import axios from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";
import { tokenManager } from "./tokenManager";

// Base API URL - có thể thay đổi theo môi trường
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - Thêm token vào mỗi request và check expiry
api.interceptors.request.use(
  async (config) => {
    try {
      // Sử dụng tokenManager để đảm bảo token hợp lệ
      const token = await tokenManager.ensureValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      // Token invalid, will be handled by response interceptor
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi và refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Sử dụng tokenManager để refresh
        const newToken = await tokenManager.refreshToken();

        // Retry original request với token mới
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // TokenManager đã xử lý logout, không cần làm gì thêm
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
