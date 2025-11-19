import React, { useEffect, useCallback, useRef, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../molecules/PostCard";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import {
  fetchPostsSuccess,
  fetchPostsStart,
  fetchPostsFailure,
  fetchFeedStart,
  fetchFeedSuccess,
  fetchFeedFailure,
  fetchPostsFromFeedSuccess
} from "../../store/postsSlice";
import { postService } from "../../services/postService";

// Mock data for demo
const mockPosts = [
  {
    id: "test-post",
    images: [],
    content: "testsss",
    author: {
      id: "test-user",
      username: "RoseWolf33",
      isOnline: true,
    },
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
    liked: false,
    categoryTagIds: ["bbd7a59d-6922-4127-b0cc-06386e8d5153"], // Education
    emotionTagIds: ["8e0ca545-6e1d-4896-8a53-143781432229"], // Amazed
    categoryTagId: "bbd7a59d-6922-4127-b0cc-06386e8d5153", // Education
    emotionId: "8e0ca545-6e1d-4896-8a53-143781432229", // Amazed
    comments: [],
  },
  {
    id: 1,
    images: ["https://chus.vn/images/Blog/CH%E1%BB%AEA%20L%C3%80NH%20B%E1%BA%A2N%20TH%C3%82N%20L%C3%80%20G%C3%8C/%E1%BA%A2nh%2001.%20Ch%E1%BB%AFa%20l%C3%A0nh%20b%E1%BA%A3n%20th%C3%A2n%2C%20ch%E1%BB%AFa%20l%C3%A0nh%2C%20xu%20h%C6%B0%E1%BB%9Bng%20ch%E1%BB%AFa%20l%C3%A0nh.png?1721633950094"],
    content:
      "Hôm nay cảm thấy khá buồn vì công việc. Ai cũng có những ngày khó khăn như vậy không? 😔",
    author: {
      id: "user1",
      username: "MysteriousFox42",
      isOnline: true,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likesCount: 12,
    commentsCount: 3,
    liked: false,
    categoryTagIds: ["e332c23f-d32b-4cd5-b80c-b05e7a3b4ac8"], // Relationships
    emotionTagIds: ["fb30d818-d83e-47ff-a662-7f98e8684562"], // Afraid
    categoryTagId: "e332c23f-d32b-4cd5-b80c-b05e7a3b4ac8", // Relationships
    emotionId: "fb30d818-d83e-47ff-a662-7f98e8684562", // Afraid
    comments: [
      {
        id: 1,
        content: "Mình cũng vậy, cùng nhau vượt qua nhé! 💪",
        author: "GentleWolf89",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    images: ["https://bchannel.vn/wp-content/uploads/2023/08/tu-chua-lanhv-vet-thuong-tam-hon.jpg"],
    content:
      "Chia sẻ một tip nhỏ: Khi stress, thử ngồi thiền 10 phút hoặc nghe nhạc nhẹ nhàng. Mình thấy rất hiệu quả! 🧘‍♀️✨",
    author: {
      id: "user2",
      username: "PeacefulMoon16",
      isOnline: false,
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likesCount: 28,
    commentsCount: 7,
    liked: true,
    categoryTagIds: ["64b41630-6224-4ad4-aaab-e16f31c15db7"], // Family
    emotionTagIds: ["8e0ca545-6e1d-4896-8a53-143781432229"], // Amazed
    categoryTagId: "64b41630-6224-4ad4-aaab-e16f31c15db7", // Family
    emotionId: "8e0ca545-6e1d-4896-8a53-143781432229", // Amazed
    comments: [],
  },
  {
    id: 3,
    images: ["https://luxuo.vn/wp-content/uploads/2021/07/photo-1624137461186-b1e0196b8702.jpg"],
    content:
      "Có ai muốn tham gia nhóm chat về sách tâm lý học không? Mình muốn tìm những người cùng sở thích để thảo luận và học hỏi! 📚",
    author: {
      id: "user3",
      username: "WiseOwl23",
      isOnline: true,
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likesCount: 15,
    commentsCount: 12,
    liked: false,
    categoryTagIds: ["bbd7a59d-6922-4127-b0cc-06386e8d5153"], // Education
    emotionTagIds: [], // No emotion
    categoryTagId: "bbd7a59d-6922-4127-b0cc-06386e8d5153", // Education
    emotionId: "", // No emotion
    comments: [],
  },
  {
    id: 4,
    images: ["https://nguoiduatin.mediacdn.vn/thumb_w/642/media/dong-xuan-thuan/2024/05/06/shutterstock1803134719-2-870x522jpg-.jpeg"],
    content:
      "Gần đây cảm thấy rất cô đơn và tuyệt vọng. Không biết phải làm sao nữa... 😭",
    author: {
      id: "user4",
      username: "SilentStar77",
      isOnline: false,
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likesCount: 8,
    commentsCount: 15,
    liked: false,
    categoryTagIds: ["e332c23f-d32b-4cd5-b80c-b05e7a3b4ac8"], // Relationships
    emotionTagIds: ["fb30d818-d83e-47ff-a662-7f98e8684562"], // Afraid
    categoryTagId: "e332c23f-d32b-4cd5-b80c-b05e7a3b4ac8", // Relationships
    emotionId: "fb30d818-d83e-47ff-a662-7f98e8684562", // Afraid
    comments: [
      {
        id: 2,
        content:
          "Bạn không đơn độc đâu! Ở đây có rất nhiều người sẵn sàng lắng nghe và chia sẻ. Hãy tin rằng mọi thứ sẽ tốt lên! ❤️",
        author: "KindHeart91",
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

const Feed = ({ onNavigateToChat, selectedCategory, selectedTab, posts: externalPosts }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts: reduxPosts, loading, error, hasMore, feedItems, nextCursor, totalCount } = useSelector(
    (state) => state.posts
  );

  // Use external posts if provided, otherwise use Redux posts
  const posts = externalPosts || reduxPosts;

  // Refs for infinite scroll
  const observerRef = useRef();
  const loadingRef = useRef();

  // Memoize post transformation function to avoid recreating on every render
  const transformPost = useCallback((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: {
      id: post.author.aliasId,
      username: post.author.displayName,
      avatar: post.author.avatarUrl,
      isOnline: false,
    },
    createdAt: post.publishedAt,
    editedAt: post.editedAt,
    likesCount: post.reactionCount,
    commentCount: post.commentCount,
    commentsCount: post.commentCount,
    liked: post.isReactedByCurrentUser,
    comments: [],
    images: post.medias || [],
    hasMedia: post.hasMedia,
    viewCount: post.viewCount,
    visibility: post.visibility,
    categoryTagIds: post.categoryTagIds || [],
    emotionTagIds: post.emotionTagIds || [],
    giftCount: post.giftCount || 0,
  }), []);

  // Load more posts function - skip if using external posts
  const loadMorePosts = useCallback(async () => {
    // Skip if using external posts
    if (externalPosts || loading || !hasMore) return;

    dispatch(fetchFeedStart());
    try {
      let apiPosts = [];
      let hasMorePosts = false;
      let totalPostsCount = 0;

      if (selectedTab === 'mine') {
        // Load posts authored by current user
        const authUserStr = localStorage.getItem('auth_user');
        const aliasId = authUserStr ? (JSON.parse(authUserStr)?.aliasId) : null;
        if (!aliasId) {
          throw new Error('Missing aliasId. Please ensure user alias is set.');
        }
        const mineResponse = await postService.getPostsByAliasIds([aliasId], 1, 20);
        apiPosts = mineResponse.posts?.data || [];
        hasMorePosts = mineResponse.posts?.hasNextPage || false;
        totalPostsCount = mineResponse.posts?.totalCount || 0;
        // fallthrough to transform and batch dispatch below
      } else if (selectedCategory) {
        // Load posts by category
        const categoryResponse = await postService.getPostsByCategory(selectedCategory.id, 1, 20);
        apiPosts = categoryResponse.posts?.data || [];
        hasMorePosts = categoryResponse.posts?.hasNextPage || false;
        totalPostsCount = categoryResponse.posts?.totalCount || 0;

        // fallthrough to transform and batch dispatch below
      } else {
        // Get next batch of feed items using cursor
        const feedResponse = await postService.getFeed(20, nextCursor);
        const newFeedItems = feedResponse.items || [];

        if (newFeedItems.length === 0) {
          // No more items
          dispatch(fetchFeedSuccess({
            feedItems: [],
            nextCursor: null,
            hasMore: false,
            totalCount: totalCount,
            reset: false,
          }));
          return;
        }

        // Get post details for the new batch
        const postIds = newFeedItems.map(item => item.postId);
        const postsResponse = await postService.getPostsByIds(postIds, 1, 20);
        apiPosts = postsResponse.posts?.data || [];
        hasMorePosts = feedResponse.hasMore;
        totalPostsCount = feedResponse.totalCount;
        // Now batch both feed meta and posts update
        const transformedPosts = apiPosts.map(transformPost);
        batch(() => {
          dispatch(fetchFeedSuccess({
            feedItems: newFeedItems,
            nextCursor: feedResponse.nextCursor,
            hasMore: feedResponse.hasMore,
            totalCount: feedResponse.totalCount,
            reset: false,
          }));
          dispatch(fetchPostsFromFeedSuccess({
            posts: transformedPosts,
            reset: false,
            hasMore: hasMorePosts,
            totalCount: totalPostsCount,
          }));
        });
        return; // already dispatched in batch
      }

      // Transform API data to match our component structure
      const transformedPosts = apiPosts.map(transformPost);

      batch(() => {
        dispatch(fetchFeedSuccess({
          feedItems: [],
          nextCursor: selectedTab === 'mine' || selectedCategory ? null : nextCursor,
          hasMore: hasMorePosts,
          totalCount: totalPostsCount,
          reset: false,
        }));
        dispatch(fetchPostsFromFeedSuccess({
          posts: transformedPosts,
          reset: false,
          hasMore: hasMorePosts,
          totalCount: totalPostsCount,
        }));
      });
    } catch (error) {
      console.error("Error loading more posts:", error);
      dispatch(fetchFeedFailure(error.message));
    }
  }, [dispatch, loading, hasMore, nextCursor, totalCount, selectedCategory, selectedTab, transformPost, externalPosts]);

  // Initial load - skip if using external posts
  useEffect(() => {
    // If external posts are provided, skip API call
    if (externalPosts) {
      return;
    }

    const loadInitialFeed = async () => {
      dispatch(fetchFeedStart());
      try {
        let apiPosts = [];
        let hasMorePosts = false;
        let totalPostsCount = 0;

        if (selectedTab === 'mine') {
          const authUserStr = localStorage.getItem('auth_user');
          const aliasId = authUserStr ? (JSON.parse(authUserStr)?.aliasId) : null;
          if (!aliasId) {
            throw new Error('Missing aliasId. Please ensure user alias is set.');
          }
          const mineResponse = await postService.getPostsByAliasIds([aliasId], 1, 20);
          apiPosts = mineResponse.posts?.data || [];
          hasMorePosts = mineResponse.posts?.hasNextPage || false;
          totalPostsCount = mineResponse.posts?.totalCount || 0;
        } else if (selectedCategory) {
          // Load posts by category
          const categoryResponse = await postService.getPostsByCategory(selectedCategory.id, 1, 20);
          apiPosts = categoryResponse.posts?.data || [];
          hasMorePosts = categoryResponse.posts?.hasNextPage || false;
          totalPostsCount = categoryResponse.posts?.totalCount || 0;

          // keep batching below
        } else {
          // Get initial feed items
          const feedResponse = await postService.getFeed(20);
          const feedItems = feedResponse.items || [];

          // Get post details for the first batch
          if (feedItems.length > 0) {
            const postIds = feedItems.map(item => item.postId);
            const postsResponse = await postService.getPostsByIds(postIds, 1, 20);
            apiPosts = postsResponse.posts?.data || [];
            hasMorePosts = feedResponse.hasMore;
            totalPostsCount = feedResponse.totalCount;
            const transformedPostsInitial = apiPosts.map(transformPost);
            batch(() => {
              dispatch(fetchFeedSuccess({
                feedItems,
                nextCursor: feedResponse.nextCursor,
                hasMore: feedResponse.hasMore,
                totalCount: feedResponse.totalCount,
                reset: true,
              }));
              dispatch(fetchPostsFromFeedSuccess({
                posts: transformedPostsInitial,
                reset: true,
                hasMore: hasMorePosts,
                totalCount: totalPostsCount,
              }));
            });
            return; // already dispatched
          }
        }

        // Transform API data to match our component structure
        const transformedPosts = apiPosts.map(transformPost);

        batch(() => {
          dispatch(fetchFeedSuccess({
            feedItems: [],
            nextCursor: selectedTab === 'mine' || selectedCategory ? null : undefined,
            hasMore: hasMorePosts,
            totalCount: totalPostsCount,
            reset: true,
          }));
          dispatch(fetchPostsFromFeedSuccess({
            posts: transformedPosts,
            reset: true,
            hasMore: hasMorePosts,
            totalCount: totalPostsCount,
          }));
        });
      } catch (error) {
        console.error("Error loading initial feed:", error);
        dispatch(fetchFeedFailure(error.message));
      }
    };

    loadInitialFeed();
  }, [dispatch, selectedCategory, selectedTab, transformPost, externalPosts]);

  // Intersection Observer for infinite scroll - skip if using external posts
  useEffect(() => {
    // Skip infinite scroll if using external posts
    if (externalPosts) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMorePosts, hasMore, loading, externalPosts]);

  const handleLoadMore = () => {
    loadMorePosts();
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-red-800 dark:text-red-200 font-medium">
            Không thể tải bài viết
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo khi không có bài viết
  if (!loading && (posts.length === 0 || totalCount === 0)) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            {selectedCategory ? `Chưa có bài viết nào trong chủ đề "${selectedCategory.displayName}"` : "Chưa có bài viết nào"}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            {selectedCategory ? "Hãy tạo bài viết đầu tiên cho chủ đề này!" : "Hãy tạo bài viết đầu tiên của bạn!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
            }}
          >
            <PostCard
              post={post}
              onNavigateToChat={onNavigateToChat}
              index={index}
              onShowComment={() => navigate(`/post/${post.id}`)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Infinite Scroll Loading Indicator - skip if using external posts */}
      {!externalPosts && hasMore && (
        <div ref={loadingRef} className="text-center py-6">
          <div className="w-6 h-6 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Manual Load More Button (fallback) - skip if using external posts */}
      {!externalPosts && hasMore && !loading && (
        <div className="text-center py-6">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleLoadMore}
            className="px-8">
            Xem thêm bài viết
          </Button>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm">Bạn đã xem hết bài feed. Hãy chia sẻ câu chuyện của mình nhé!</span>
            <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Hãy là người đầu tiên chia sẻ cảm xúc và câu chuyện của bạn với cộng
            đồng!
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;