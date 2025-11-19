// Service để lấy token từ Redux store
import { store } from '../store';

// Lấy token hiện tại từ Redux store
export const getCurrentToken = () => {
    const state = store.getState();
    return state.auth.token;
};

// Lấy refresh token từ localStorage
export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};

// Kiểm tra token có hợp lệ không
export const isTokenValid = () => {
    const token = getCurrentToken();
    if (!token) return false;

    try {
        // Decode JWT để kiểm tra expiration
        const payload = token.split(".")[1];
        if (!payload) return false;

        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(
            decodeURIComponent(
                atob(normalized)
                    .split("")
                    .map((c) => ` %${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
                    .join("")
            )
        );

        if (!decoded.exp) return false;

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
    } catch {
        return false;
    }
};

// Tạo headers với token
export const getAuthHeaders = () => {
    const token = getCurrentToken();
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Tạo headers cho API calls với token
export const createApiHeaders = (additionalHeaders = {}) => {
    return {
        ...getAuthHeaders(),
        ...additionalHeaders
    };
};
