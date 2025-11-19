import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PostCard from "../components/molecules/PostCard";
import { fetchPostsStart, fetchPostsSuccess } from "../store/postsSlice";
import { postsService } from "../services/apiService";


const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                setLoading(true);
                dispatch(fetchPostsStart());

                // Fetch post data using the new API service
                const postData = await postsService.getPostDetail(id);

                // Map post data based on the new API response structure
                const mappedPost = {
                    id: postData.postSummary.id,
                    content: postData.postSummary.content,
                    title: postData.postSummary.title,
                    author: {
                        id: postData.postSummary.author.aliasId,
                        username: postData.postSummary.author.displayName,
                        avatar: postData.postSummary.author.avatarUrl || null,
                    },
                    createdAt: postData.postSummary.publishedAt,
                    editedAt: postData.postSummary.editedAt,
                    likesCount: postData.postSummary.reactionCount,
                    commentCount: postData.postSummary.commentCount,
                    commentsCount: postData.postSummary.commentCount, // Sync with PostActions display - lấy từ commentCount của API
                    viewCount: postData.postSummary.viewCount,
                    liked: postData.postSummary.isReactedByCurrentUser || false,
                    comments: [], // Comments will be loaded by PostComments component
                    images: postData.postSummary.medias || [],
                    hasMedia: postData.postSummary.hasMedia,
                    visibility: postData.postSummary.visibility,
                    categoryTagIds: postData.postSummary.categoryTagIds || [],
                    emotionTagIds: postData.postSummary.emotionTagIds || [],
                    categoryTagId: postData.postSummary.categoryTagIds?.[0] || '',
                    emotionId: postData.postSummary.emotionTagIds?.[0] || '',
                    giftCount: postData.postSummary.giftCount || 0,
                };

                // Set post state directly instead of using Redux
                setPost(mappedPost);

                dispatch(fetchPostsSuccess({
                    posts: [mappedPost],
                    reset: true,
                    page: 1,
                    hasMore: false,
                }));
            } catch (err) {
                console.error("Error loading post detail:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [dispatch, id]);

    if (loading) return <div className="text-center py-8">Đang tải bài viết...</div>;
    if (!post) return <div className="text-center py-8">Không tìm thấy bài viết</div>;


    return (
        <div className="max-w-3xl mx-auto py-8">
            <PostCard
                post={post}
                index={0}
                forceShowComments={true}
                hideRepliesByDefault={true}
                onBack={() => navigate(-1)}
                onNavigateToChat={(conversationId) => {
                    navigate(`/chat?id=${conversationId}`);
                }}
            />
        </div>
    );
};

export default PostDetailPage;