import { tokenManager } from "./tokenManager";

// Alias service - used by login flow
export const aliasService = {
    // Kiểm tra trạng thái alias của user
    checkAliasStatus: async () => {
        const baseUrl = "https://api.emoease.vn/auth-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/Auth/v2/me/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Lấy thông tin alias hiện tại của user
    getCurrentAlias: async () => {
        const baseUrl = "https://api.emoease.vn/alias-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/me/alias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.profile;
    },

    // Lấy danh sách alias gợi ý
    getAliasSuggestions: async (ttl = 20, pageIndex = 1, pageSize = 5) => {
        const baseUrl = "https://api.emoease.vn/alias-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/aliases/suggest?Ttl=${ttl}&PageIndex=${pageIndex}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Tạo alias mới từ gợi ý
    issueAlias: async (label, reservationToken) => {
        const baseUrl = "https://api.emoease.vn/alias-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/me/aliases/issue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
            body: JSON.stringify({
                label: label,
                reservationToken: reservationToken
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to issue alias: ${errorText}`);
        }

        const data = await response.json();
        return data.profile;
    },

    // Tạo alias tùy chỉnh
    createCustomAlias: async (label) => {
        const baseUrl = "https://api.emoease.vn/alias-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/me/aliases/custom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
            body: JSON.stringify({
                label: label
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create custom alias: ${errorText}`);
        }

        const data = await response.json();
        return data.profile;
    }
};
