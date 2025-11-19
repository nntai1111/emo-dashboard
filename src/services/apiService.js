import api from "./api";
import { getCurrentToken, createApiHeaders } from "./tokenService";
import { postService } from "./postService";
import { generateIdempotencyKey } from "../utils/uuid";
import { tokenManager } from "./tokenManager";

export const authService = {
    // Đăng ký
    register: async (email, password) => {
        const response = await api.post("/auth/register", { email, password });
        return response.data;
    },

    // Đăng nhập
    login: async (email, password) => {
        // Cơ chế đặc biệt cho demo
        if (email === "emo@gmail.com" && password === "emo@123") {
            return {
                success: true,
                token: "demo-emo-token-67890",
                refreshToken: "demo-refresh-token-67890",
                user: {
                    id: "b6a76f02-be77-4ef9-b8f9-ca5c88736cbf",
                    email: "emo@gmail.com",
                    username: "Anonymous",
                    avatar: null,
                    createdAt: new Date().toISOString(),
                },
                message: "Chào mừng đến với EmoSocial!",
            };
        }

        const response = await api.post("/auth/login", { email, password });
        return response.data;
    },

    // Đăng xuất
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    // Lấy thông tin profile
    getProfile: async () => {
        const response = await api.get("/auth/profile");
        return response.data;
    },

    // Refresh token
    refreshToken: async () => {
        const response = await api.post("/auth/refresh");
        return response.data;
    },
};

export const postsService = {
    // Lấy feed data từ API feed endpoint với cursor pagination
    getFeed: async (limit = 2, cursor = null) => {
        const baseUrl = "https://api.emoease.vn/Feed-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        // Build URL with cursor if provided
        let url = `${baseUrl}/v1/feed?limit=${limit}`;
        if (cursor) {
            url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            }
        });

        if (!response.ok) {
            // Try to extract meaningful server error
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const raw = await response.text();
                if (raw) {
                    try {
                        const json = JSON.parse(raw);
                        errorMessage = json.detail || json.message || json.error || errorMessage;
                    } catch {
                        errorMessage = raw || errorMessage;
                    }
                }
            } catch { /* ignore */ }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    },

    // Lấy chi tiết posts theo danh sách IDs
    getPostsByIds: async (postIds, pageIndex = 1, pageSize = 10) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        // Tạo query string với multiple IDs
        const idsParam = postIds.map(id => `Ids=${id}`).join('&');
        const url = `${baseUrl}/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&${idsParam}`;

        const response = await fetch(url, {
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

    // Lấy danh sách posts từ API thực tế (legacy method)
    getPosts: async (pageIndex = 1, pageSize = 10, sortBy = "CreatedAt", sortDescending = true) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=${sortBy}&SortDescending=${sortDescending}`, {
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

    // Lấy chi tiết bài viết
    getPostDetail: async (postId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/posts/${postId}`, {
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

    // Tạo post mới
    createPost: async (content, isAnonymous = true) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post("/posts",
            {
                content,
                isAnonymous,
                medias: []
            },
            {
                headers: {
                    'Idempotency-Key': idempotencyKey
                }
            }
        );
        return response.data;
    },

    // Like/Unlike post
    toggleLike: async (postId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/posts/${postId}/like`, {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Thêm comment
    addComment: async (postId, content, parentCommentId = null) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const idempotencyKey = generateIdempotencyKey();
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        headers['Idempotency-Key'] = idempotencyKey;

        const response = await fetch(`${baseUrl}/v1/comments`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                postId,
                content,
                parentCommentId,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể thêm bình luận: ${errorText}`);
        }

        return await response.json();
    },

    // Lấy comments với pagination
    getComments: async (postId, pageIndex = 1, pageSize = 20, parentCommentId = null) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        let url = `${baseUrl}/v1/comments/post/${postId}?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=true`;
        if (parentCommentId) {
            url += `&ParentCommentId=${parentCommentId}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể tải bình luận: ${errorText}`);
        }

        return await response.json();
    },

    // Lấy replies của comment
    getCommentReplies: async (parentCommentId, pageIndex = 1, pageSize = 20) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/comments/${parentCommentId}/replies?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=false`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể tải replies: ${errorText}`);
        }

        return await response.json();
    },

    // Xóa post
    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },

    // Like post
    likePost: async (postId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
            body: JSON.stringify({
                targetType: "Post",
                targetId: postId,
                reactionCode: "Like",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể thích bài viết: ${errorText}`);
        }

        return await response.json();
    },

    // Unlike post
    unlikePost: async (postId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions?TargetType=Post&TargetId=${postId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể bỏ thích bài viết: ${errorText}`);
        }

        return await response.json();
    },

    // Like comment
    likeComment: async (commentId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
            body: JSON.stringify({
                targetType: "Comment",
                targetId: commentId,
                reactionCode: "Like",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể thích bình luận: ${errorText}`);
        }

        return await response.json();
    },

    // Unlike comment
    unlikeComment: async (commentId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions?TargetType=Comment&TargetId=${commentId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể bỏ thích bình luận: ${errorText}`);
        }

        return await response.json();
    },
};

export const chatService = {
    // Lấy danh sách conversations
    getConversations: async () => {
        const response = await api.get("/chat/conversations");
        return response.data;
    },

    // Tạo conversation mới (DM)
    createConversation: async (userId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post("/chat/conversations", { userId }, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Lấy messages của conversation
    getMessages: async (conversationId, page = 1) => {
        const response = await api.get(
            `/chat/conversations/${conversationId}/messages?page=${page}`
        );
        return response.data;
    },

    // Gửi message
    sendMessage: async (conversationId, content, type = "text") => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(
            `/chat/conversations/${conversationId}/messages`,
            {
                content,
                type,
            },
            {
                headers: {
                    'Idempotency-Key': idempotencyKey
                }
            }
        );
        return response.data;
    },

    // Lấy danh sách groups
    getGroups: async () => {
        const response = await api.get("/chat/groups");
        return response.data;
    },

    // Request join group từ post
    requestJoinGroup: async (postId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/chat/groups/request-join`, { postId }, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Approve/reject join request (cho chủ post)
    handleJoinRequest: async (requestId, action) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/chat/groups/handle-request`, {
            requestId,
            action, // 'approve' hoặc 'reject'
        }, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Leave group
    leaveGroup: async (groupId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/chat/groups/${groupId}/leave`, {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },
};

export const tagService = {
    // Lấy danh sách category tags
    getCategoryTags: async () => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/category-tags`, {
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

    // Lấy danh sách emotion tags
    getEmotionTags: async () => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/emotion-tags`, {
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
};

// Service mới cho emotion tags từ digitalgoods-service
export const emotionService = {
    // Lấy danh sách emotion tags từ API mới
    getEmotionTags: async () => {
        const baseUrl = "https://api.emoease.vn/digitalgoods-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        // Decode token để lấy subject ID
        const subjectId = decodeTokenForSubject(token);
        if (!subjectId) {
            throw new Error("Unable to extract subject ID from token");
        }

        const response = await fetch(`${baseUrl}/v1/emotion-tags?SubjectRef=${subjectId}`, {
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
};

// Helper function để decode JWT token và lấy subject ID
const decodeTokenForSubject = (token) => {
    try {
        // JWT token có 3 phần được phân tách bởi dấu chấm
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT token format');
            return null;
        }

        // Decode payload (phần thứ 2)
        const payload = parts[1];
        // Thêm padding nếu cần
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedPayload = atob(paddedPayload);
        const parsedPayload = JSON.parse(decodedPayload);

        return parsedPayload.sub;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const notificationService = {
    // Lấy notifications
    getNotifications: async (page = 1) => {
        const response = await api.get(`/notifications?page=${page}`);
        return response.data;
    },

    // Đánh dấu đã đọc
    markAsRead: async (notificationId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/notifications/${notificationId}/read`, {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: async () => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post("/notifications/read-all", {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },
};

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
                label,
                reservationToken
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Đổi tên alias
    renameAlias: async (newLabel) => {
        const baseUrl = "https://api.emoease.vn/alias-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/me/aliases/rename`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
            body: JSON.stringify({
                newLabel: newLabel
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Tên đã được sử dụng";

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                // If not JSON, use the text as is
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    },
};

export const freeTrialService = {
    baseUrl: "https://api.emoease.vn/auth-service",

    // Check free trial status
    checkFreeTrialStatus: async () => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${freeTrialService.baseUrl}/Auth/v2/me/free-trial-status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Free Trial Status API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Activate free trial
    activateFreeTrial: async () => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${freeTrialService.baseUrl}/Auth/v2/me/activate-free-trial`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Activate Free Trial API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },
};

export const profileService = {
    baseUrl: "https://api.emoease.vn/profile-service",

    // Submit PII onboarding data
    submitPIIOnboarding: async (piiData) => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${profileService.baseUrl}/v1/users/me/onboarding`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(piiData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('PII Onboarding API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Submit patient profile onboarding data
    submitPatientProfileOnboarding: async (patientData) => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${profileService.baseUrl}/v1/patients/me/onboarding`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Patient Profile Onboarding API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Get list of industries
    getIndustries: async () => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${profileService.baseUrl}/v1/industries?PageSize=30`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Get Industries API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.industries?.data || [];
    },

    // Get jobs for a specific industry
    getJobsByIndustry: async (industryId) => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${profileService.baseUrl}/v1/industries/${industryId}/jobs?PageSize=30`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Get Jobs API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.jobs || [];
    },
};

export const aliasPreferencesService = {
    baseUrl: "https://api.emoease.vn/alias-service",

    getPreferences: async () => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }
        const response = await fetch(`${aliasPreferencesService.baseUrl}/v1/me/alias/preferences`, {
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
        try { localStorage.setItem('alias_preferences', JSON.stringify(data.preferences || {})); } catch { }
        return data.preferences;
    },

    updatePreferences: async (preferences) => {
        const token = await tokenManager.ensureValidToken();
        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }
        const response = await fetch(`${aliasPreferencesService.baseUrl}/v1/me/alias/preferences`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            },
            body: JSON.stringify(preferences)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update preferences: ${errorText}`);
        }
        const data = await response.json();
        try { localStorage.setItem('alias_preferences', JSON.stringify(data.preferences || preferences || {})); } catch { }
        return data.preferences || preferences;
    },

    clearLocal: () => {
        try { localStorage.removeItem('alias_preferences'); } catch { }
    }
};

// Digital Goods Service
export const digitalGoodsService = {
    // Lấy danh sách quà tặng
    getGifts: async (subjectRef) => {
        const baseUrl = "https://api.emoease.vn/digitalgoods-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }
        const subjectId = decodeTokenForSubject(token);

        if (!subjectRef) {
            throw new Error("SubjectRef is required to fetch gifts");
        }

        const response = await fetch(`${baseUrl}/v1/digital-goods?SubjectRef=${subjectId}&Type=Gift`, {
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

    // Gửi quà tặng đến bài post
    sendGift: async (targetId, giftId, message) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const idempotencyKey = generateIdempotencyKey();
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        headers['Idempotency-Key'] = idempotencyKey;

        const response = await fetch(`${baseUrl}/v1/gifts`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                targetType: "post",
                targetId: targetId,
                giftId: giftId,
                quantity: 1,
                message: message
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send gift: ${errorText}`);
        }

        return await response.json();
    },

    // Lấy danh sách người tặng quà cho một bài post
    getGiftGivers: async (postId, pageIndex = 1, pageSize = 20) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = await tokenManager.ensureValidToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/gifts/post/${postId}?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${await tokenManager.ensureValidToken()}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch gift givers: ${errorText}`);
        }

        return await response.json();
    }
};