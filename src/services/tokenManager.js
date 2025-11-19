import axios from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";

class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.refreshTimer = null;
    this.apiBase =
      import.meta.env.VITE_API_AUTH_URL ||
      "https://api.emoease.vn/auth-service";
  }

  // Kiểm tra token có sắp hết hạn không (trong vòng 5 phút)
  isTokenExpiringSoon(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      return exp - now < fiveMinutes;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // If can't parse, assume expired
    }
  }

  // Lấy token từ localStorage (không phải Redux)
  getCurrentToken() {
    return localStorage.getItem("access_token");
  }

  // Refresh token với retry logic
  async refreshToken() {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this._performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async _performRefresh() {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");
    const clientDeviceId = localStorage.getItem("device_id");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        `${this.apiBase}/Auth/v2/token/refresh`,
        { token: accessToken, refreshToken, clientDeviceId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: 10000,
        }
      );

      const newAccessToken = response.data?.token;
      const newRefreshToken = response.data?.refreshToken;

      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // Update Redux store
        store.dispatch({
          type: "auth/updateToken",
          payload: { token: newAccessToken },
        });

        return newAccessToken;
      } else {
        throw new Error("No access token in refresh response");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear all tokens and logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      store.dispatch(logout());
      throw error;
    }
  }

  // Kiểm tra và refresh token nếu cần
  async ensureValidToken() {
    const currentToken = this.getCurrentToken();

    if (!currentToken) {
      throw new Error("No access token available");
    }

    if (this.isTokenExpiringSoon(currentToken)) {
      // Token expiring soon, refreshing...
      return await this.refreshToken();
    }

    return currentToken;
  }

  // Bắt đầu timer để check token định kỳ
  startTokenRefreshTimer() {
    // Clear existing timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // Check every 4 minutes
    this.refreshTimer = setInterval(async () => {
      try {
        await this.ensureValidToken();
      } catch (error) {
        console.error("Auto token refresh failed:", error);
        // Timer will continue, will try again next interval
      }
    }, 4 * 60 * 1000); // 4 minutes
  }

  // Dừng timer
  stopTokenRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Cleanup
  destroy() {
    this.stopTokenRefreshTimer();
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
export default tokenManager;
