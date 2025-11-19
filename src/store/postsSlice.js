import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  feedItems: [], // Lưu trữ feed items từ API feed
  nextCursor: null, // Cursor cho pagination feed
  totalCount: 0, // Tổng số items trong feed
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload.reset
        ? action.payload.posts
        : [...state.posts, ...action.payload.posts];
      state.currentPage = action.payload.page;
      state.hasMore = action.payload.hasMore;
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload };
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    likePost: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload.postId
      );
      if (post) {
        post.liked = action.payload.liked;
        post.reactionCount = action.payload.reactionCount;
      }
    },
    // DEPRECATED: Comment handling moved to PostComments local state
    addComment: (state, action) => {
      const { postId, comment, parentId, update } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post) {
        console.error(`Post not found for postId: ${postId}`);
        return;
      }
      if (!post.comments) post.comments = [];

      if (comment) {
        if (!parentId) {
          // Add top-level comment
          const existsIndex = post.comments.findIndex((c) => c.id === comment.id);
          if (existsIndex === -1) {
            post.comments.unshift(comment);
            post.commentCount = (post.commentCount || 0) + 1;
            post.commentsCount = (post.commentsCount || 0) + 1; // Sync with PostActions display
          } else {
            // Merge/update existing to avoid duplicates
            post.comments[existsIndex] = { ...post.comments[existsIndex], ...comment };
          }
        } else {
          // Add reply to existing comment
          const addReplyRecursive = (comments) => {
            for (let c of comments) {
              if (c.id === parentId) {
                if (!c.replies) c.replies = [];
                const existsReplyIndex = c.replies.findIndex((r) => r.id === comment.id);
                if (existsReplyIndex === -1) {
                  c.replies.unshift(comment);
                  c.replyCount = (c.replyCount || 0) + 1;
                  // Cộng commentCount khi thêm reply
                  post.commentCount = (post.commentCount || 0) + 1;
                  post.commentsCount = (post.commentsCount || 0) + 1; // Sync with PostActions display
                } else {
                  c.replies[existsReplyIndex] = { ...c.replies[existsReplyIndex], ...comment };
                }
                return true;
              }
              if (c.replies && c.replies.length > 0) {
                if (addReplyRecursive(c.replies)) return true;
              }
            }
            console.warn(`Comment with parentId ${parentId} not found`);
            return false;
          };
          addReplyRecursive(post.comments);
        }
      } else if (update && parentId) {
        const updateRecursive = (comments) => {
          for (let c of comments) {
            if (c.id === parentId) {
              Object.assign(c, update);
              return true;
            }
            if (c.replies && c.replies.length > 0) {
              if (updateRecursive(c.replies)) return true;
            }
          }
          console.warn(`Comment with parentId ${parentId} not found for update`);
          return false;
        };
        updateRecursive(post.comments);
      } else if (update && !parentId) {
        // Update post-level data (like comment count from API response)
        Object.assign(post, update);
      }
    },
    likeComment: (state, action) => {
      const { postId, commentId, isLiked, reactionCount } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post || !post.comments) {
        console.error(`Post or comments not found for postId: ${postId}`);
        return;
      }

      const toggleLikeRecursive = (comments) => {
        for (let c of comments) {
          if (c.id === commentId) {
            // Support both old and new field names
            if (isLiked !== undefined) {
              c.isReactedByCurrentUser = isLiked;
              c.liked = isLiked; // Keep backward compatibility
            } else {
              c.isReactedByCurrentUser = !c.isReactedByCurrentUser;
              c.liked = !c.liked; // Keep backward compatibility
            }

            if (reactionCount !== undefined) {
              c.reactionCount = reactionCount;
            } else {
              c.reactionCount = (c.reactionCount || 0) + (c.isReactedByCurrentUser ? 1 : -1);
            }
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (toggleLikeRecursive(c.replies)) return true;
          }
        }
        console.warn(`Comment with id ${commentId} not found for like`);
        return false;
      };
      toggleLikeRecursive(post.comments);
    },
    // DEPRECATED: Comment handling moved to PostComments local state
    finalizeComment: (state, action) => {
      const { postId, tempId, newData } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post || !post.comments) return;
      const replaceRecursive = (comments) => {
        for (let i = 0; i < comments.length; i++) {
          const c = comments[i];
          if (c.id === tempId) {
            comments[i] = { ...c, ...newData };
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (replaceRecursive(c.replies)) return true;
          }
        }
        return false;
      };
      replaceRecursive(post.comments);
    },
    // DEPRECATED: Comment handling moved to PostComments local state
    removeComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post || !post.comments) return;

      let commentRemoved = false;
      let isTopLevelComment = false;

      const removeRecursive = (comments, isTopLevel = true) => {
        const idx = comments.findIndex((c) => c.id === commentId);
        if (idx !== -1) {
          comments.splice(idx, 1);
          commentRemoved = true;
          isTopLevelComment = isTopLevel;
          return true;
        }
        for (let c of comments) {
          if (c.replies && c.replies.length > 0) {
            if (removeRecursive(c.replies, false)) return true;
          }
        }
        return false;
      };

      removeRecursive(post.comments);

      // Decrease comment count if any comment (top-level or reply) was removed
      if (commentRemoved) {
        post.commentCount = Math.max((post.commentCount || 0) - 1, 0);
        post.commentsCount = Math.max((post.commentsCount || 0) - 1, 0); // Sync with PostActions display

        // Also decrease replyCount if it was a top-level comment
        if (isTopLevelComment) {
          // Find the parent comment and decrease its replyCount
          const updateReplyCountRecursive = (comments) => {
            for (let c of comments) {
              if (c.replies && c.replies.some(r => r.id === commentId)) {
                c.replyCount = Math.max((c.replyCount || 0) - 1, 0);
                return true;
              }
              if (c.replies && c.replies.length > 0) {
                if (updateReplyCountRecursive(c.replies)) return true;
              }
            }
            return false;
          };
          updateReplyCountRecursive(post.comments);
        }
      }
    },
    // DEPRECATED: Comment handling moved to PostComments local state
    fetchRepliesSuccess: (state, action) => {
      const { postId, parentId, replies } = action.payload;
      let post = state.posts.find((post) => post.id === postId);
      if (!post) {
        console.warn(`Post not found for postId: ${postId}, creating new post`);
        post = { id: postId, comments: [] };
        state.posts.push(post);
      }
      if (!post.comments) post.comments = [];

      const addRepliesRecursive = (comments, level = 0) => {
        for (let c of comments) {
          if (c.id === parentId) {
            // Append new replies to existing ones instead of replacing
            if (!c.replies) c.replies = [];

            // Filter out duplicates based on id
            const existingIds = new Set(c.replies.map(r => r.id));
            const newReplies = replies.filter(reply => !existingIds.has(reply.id));

            c.replies = [...c.replies, ...newReplies];
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (addRepliesRecursive(c.replies, level + 1)) return true;
          }
        }
        return false;
      };
      const found = addRepliesRecursive(post.comments);
      if (!found) {
        console.warn(`❌ Comment with parentId ${parentId} not found in any level of comments`);
      }
    },
    // New action to handle the new comment API structure
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      let post = state.posts.find((post) => post.id === postId);
      if (!post) {
        console.warn(`Post not found for postId: ${postId}, creating new post`);
        post = { id: postId, comments: [] };
        state.posts.push(post);
      }

      // Map the new API structure to our internal structure
      const mappedComments = comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.author.displayName,
        avatar: comment.author.avatarUrl,
        createdAt: comment.createdAt,
        editedAt: comment.editedAt,
        reactionCount: comment.reactionCount || 0,
        replyCount: comment.replyCount || 0,
        isReactedByCurrentUser: comment.isReactedByCurrentUser || false,
        isDeleted: comment.isDeleted || false,
        hierarchy: comment.hierarchy,
        replies: comment.replies ? comment.replies.map(reply => ({
          id: reply.id,
          content: reply.content,
          author: reply.author.displayName,
          avatar: reply.author.avatarUrl,
          createdAt: reply.createdAt,
          editedAt: reply.editedAt,
          reactionCount: reply.reactionCount || 0,
          replyCount: reply.replyCount || 0,
          isReactedByCurrentUser: reply.isReactedByCurrentUser || false,
          isDeleted: reply.isDeleted || false,
          hierarchy: reply.hierarchy,
          replies: [] // Replies don't have nested replies in this structure
        })) : []
      }));

      post.comments = mappedComments;
      // Không cập nhật commentCount ở đây vì nó đã được set từ API post detail
      // post.commentCount = mappedComments.length;
    },

    // Feed-specific actions
    fetchFeedStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeedSuccess: (state, action) => {
      state.loading = false;
      const { feedItems, nextCursor, hasMore, totalCount, reset = false } = action.payload;

      if (reset) {
        state.feedItems = feedItems;
        state.posts = [];
      } else {
        // Append new feed items to existing ones
        state.feedItems = [...state.feedItems, ...feedItems];
      }

      state.nextCursor = nextCursor;
      state.hasMore = hasMore;
      state.totalCount = totalCount;
    },
    fetchFeedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchPostsFromFeedSuccess: (state, action) => {
      const { posts, reset = false, hasMore, totalCount } = action.payload;

      if (reset) {
        state.posts = posts;
      } else {
        state.posts = [...state.posts, ...posts];
      }

      if (hasMore !== undefined) {
        state.hasMore = hasMore;
      }
      if (totalCount !== undefined) {
        state.totalCount = totalCount;
      }
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  likeComment,
  finalizeComment,
  removeComment,
  fetchRepliesSuccess,
  setComments,
  fetchFeedStart,
  fetchFeedSuccess,
  fetchFeedFailure,
  fetchPostsFromFeedSuccess,
} = postsSlice.actions;

export default postsSlice.reducer;