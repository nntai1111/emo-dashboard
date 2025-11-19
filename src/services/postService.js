import api from "./api";

// Post Service - Centralized API calls for post operations
export const postService = {
    // Create new post
    createPost: async (postData) => {
        // Ensure medias array is included
        const dataWithMedias = {
            ...postData,
            medias: postData.medias || []
        };

        const response = await api.post("https://api.emoease.vn/post-service/v1/posts", dataWithMedias, {
            headers: {
                "Idempotency-Key": crypto.randomUUID(),  // Random UUID mỗi lần
            },
        });
        return response.data;
    },

    // Get post detail
    getPostDetail: async (postId) => {
        const response = await api.get(`https://api.emoease.vn/post-service/v1/posts/${postId}`);
        return response.data;
    },

    // Get posts by IDs
    getPostsByIds: async (postIds, pageIndex = 1, pageSize = 10) => {
        const idsParam = postIds.map(id => `Ids=${id}`).join('&');
        const url = `https://api.emoease.vn/post-service/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&${idsParam}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get posts list
    getPosts: async (pageIndex = 1, pageSize = 10, sortBy = "CreatedAt", sortDescending = true) => {
        const url = `https://api.emoease.vn/post-service/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=${sortBy}&SortDescending=${sortDescending}`;
        const response = await api.get(url);
        return response.data;
    },

    // Add comment
    addComment: async (postId, content, parentCommentId = null) => {
        const response = await api.post("https://api.emoease.vn/post-service/v1/comments", {
            postId,
            content,
            parentCommentId,
        });
        return response.data;
    },

    // Get comments
    getComments: async (postId, pageIndex = 1, pageSize = 20, parentCommentId = null) => {
        let url = `https://api.emoease.vn/post-service/v1/comments/post/${postId}?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=true`;
        if (parentCommentId) {
            url += `&ParentCommentId=${parentCommentId}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    // Delete comment by id
    deleteComment: async (commentId) => {
        const url = `https://api.emoease.vn/post-service/v1/comments/${commentId}`;
        const response = await api.delete(url);
        return response.data;
    },

    // Get comment replies
    getCommentReplies: async (parentCommentId, pageIndex = 1, pageSize = 20) => {
        const url = `https://api.emoease.vn/post-service/v1/comments/${parentCommentId}/replies?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=false`;
        const response = await api.get(url);
        return response.data;
    },

    // Delete post
    deletePost: async (postId) => {
        const url = `https://api.emoease.vn/post-service/v1/posts/${postId}`;
        const response = await api.delete(url);
        return response.data;
    },

    // Like/Unlike post
    toggleLike: async (postId) => {
        const response = await api.post(`https://api.emoease.vn/post-service/v1/posts/${postId}/like`);
        return response.data;
    },

    // Like post
    likePost: async (postId) => {
        const response = await api.post("https://api.emoease.vn/post-service/v1/reactions", {
            targetType: "Post",
            targetId: postId,
            reactionCode: "Like",
        });
        return response.data;
    },

    // Unlike post
    unlikePost: async (postId) => {
        const response = await api.delete(`https://api.emoease.vn/post-service/v1/reactions?TargetType=Post&TargetId=${postId}`);
        return response.data;
    },

    // Like comment
    likeComment: async (commentId) => {
        const response = await api.post("https://api.emoease.vn/post-service/v1/reactions", {
            targetType: "Comment",
            targetId: commentId,
            reactionCode: "Like",
        });
        return response.data;
    },

    // Unlike comment
    unlikeComment: async (commentId) => {
        const response = await api.delete(`https://api.emoease.vn/post-service/v1/reactions?TargetType=Comment&TargetId=${commentId}`);
        return response.data;
    },

    // Get posts by category
    getPostsByCategory: async (categoryId, pageIndex = 1, pageSize = 10) => {
        const url = `https://api.emoease.vn/post-service/v1/tags/${categoryId}/posts?PageIndex=${pageIndex}&PageSize=${pageSize}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get feed
    getFeed: async (limit = 20, cursor = null) => {
        const url = `https://api.emoease.vn/Feed-service/v1/feed?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get posts by alias IDs (current user's posts)
    getPostsByAliasIds: async (aliasIds, pageIndex = 1, pageSize = 10) => {
        const url = `https://api.emoease.vn/post-service/v1/posts/by-alias-ids?PageIndex=${pageIndex}&PageSize=${pageSize}`;
        // API expects POST with body: { aliasIds: [...] }
        const response = await api.post(url, { aliasIds });
        return response.data;
    },

    // Get posts that user has reacted to (liked posts)
    getReactedPosts: async (aliasId, pageIndex = 1, pageSize = 20, reactionCode = "", sortDescending = true) => {
        const url = `https://api.emoease.vn/post-service/v1/users/${aliasId}/reacted-posts?PageIndex=${pageIndex}&PageSize=${pageSize}&SortDescending=${sortDescending}`;
        const response = await api.get(url);
        return response.data;
    },
};
