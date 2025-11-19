// Service để khởi tạo authentication state từ localStorage
import { store } from '../store';
import { loginSuccess, logout } from '../store/authSlice';
import { aliasPreferencesService, freeTrialService } from './apiService';

// Decode JWT token
const decodeJwt = (token) => {
    try {
        // Check if token is a valid JWT format (should have 3 parts separated by dots)
        if (!token || typeof token !== 'string') return null;

        const parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }

        const payload = parts[1];
        if (!payload) return null;

        // Add padding if needed
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);

        // Try to decode base64 first
        let decodedPayload;
        try {
            decodedPayload = atob(padded);
        } catch (base64Error) {
            return null;
        }

        // Try to parse JSON
        try {
            const decoded = JSON.parse(decodedPayload);
            return decoded;
        } catch (jsonError) {
            return null;
        }
    } catch (error) {
        return null;
    }
};

// Khởi tạo authentication state từ localStorage
export const initializeAuth = () => {
    try {
        const token = localStorage.getItem("access_token");
        const userStr = localStorage.getItem("auth_user");

        if (!token || !userStr) {
            return false;
        }

        // Parse user data
        let userData;
        try {
            userData = JSON.parse(userStr);
        } catch (e) {
            console.error("Invalid user data in localStorage:", e);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("auth_user");
            return false;
        }

        // Debug token information

        // Validate token - check if it's a valid JWT format first
        const decoded = decodeJwt(token);
        if (!decoded) {
            // Check if it's a demo token or other non-JWT token
            if (token.startsWith("demo-") || token.startsWith("test-") || token.includes("demo")) {
                // Using demo/test token, skipping JWT validation
            } else {
                // Invalid token format - not a valid JWT and not a demo token
                clearCorruptedAuth();
                return false;
            }
        } else {
            // Valid JWT token - check expiration
            if (decoded.exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                if (decoded.exp <= currentTime) {
                    clearAuth();
                    return false;
                }
            }
        }

        // Update Redux store
        store.dispatch(loginSuccess({
            user: userData,
            token: token
        }));

        // Prefetch alias preferences to localStorage (non-blocking)
        try { aliasPreferencesService.getPreferences().catch(() => { }); } catch { }

        // Note: Free trial check is handled by AliasGuard to avoid duplicate calls

        return true;
    } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear potentially corrupted data
        clearCorruptedAuth();
        return false;
    }
};

// Clear authentication data
export const clearAuth = () => {
    try {
        localStorage.clear();
        store.dispatch(logout());
    } catch (error) {
        console.error("Error clearing auth:", error);
    }
};

// Clear corrupted auth data
export const clearCorruptedAuth = () => {
    try {
        localStorage.clear();
        store.dispatch(logout());
    } catch (error) {
        console.error("Error clearing corrupted auth:", error);
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const state = store.getState();
    return state.auth.isAuthenticated;
};

// Get current user
export const getCurrentUser = () => {
    const state = store.getState();
    return state.auth.user;
};

// Get current token
export const getCurrentToken = () => {
    const state = store.getState();
    return state.auth.token;
};

