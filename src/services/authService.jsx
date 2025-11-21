import { store } from "../store";
import axios from "axios";
import { logout as logoutAction } from "../store/authSlice";
import tokenManager from "./tokenManager";

// Centralized auth helpers
export const authService = {
  getToken: () => localStorage.getItem("access_token"),
  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem("access_token");
    const reduxState = store.getState().auth;
    return hasToken && reduxState.isAuthenticated;
  },

  // Synchronous local cleanup (keeps existing behavior)
  logout: () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch (e) {
      console.error("Error clearing tokens from localStorage", e);
    }
    // Note: Redux state clearing should be done by caller (dispatch logoutAction())
  },

  // Async: call revoke endpoint to inform backend, then clear local session and Redux
  logoutRemote: async () => {
    const apiBase = tokenManager?.apiBase || (import.meta.env.VITE_API_AUTH_URL || "https://api.emoease.vn/auth-service");

    const clientDeviceId = localStorage.getItem("device_id") || localStorage.getItem("clientDeviceId");
    const refreshToken = localStorage.getItem("refresh_token");
    const token = localStorage.getItem("access_token");

    try {
      // Send revoke request - backend expects { clientDeviceId, refreshToken, token }
      const headers = { "Content-Type": "application/json", Accept: "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`; // include access token in Bearer
      }

      await axios.post(
        `${apiBase}/Auth/v2/token/revoke`,
        { clientDeviceId, refreshToken, token },
        { headers, timeout: 8000 }
      );
    } catch (err) {
      // Ignore network errors on logout but log for debugging
      console.warn("Token revoke request failed (ignored):", err?.message || err);
    } finally {
      // Clear local session and update Redux
      try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } catch (e) {
        console.error("Error clearing tokens from localStorage", e);
      }
      try {
        store.dispatch(logoutAction());
      } catch (e) {
        console.error("Error dispatching logout action", e);
      }
    }
  },
};
