import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import CommentForm from "./CommentForm";
import GiftSection from "./GiftSection";
import Button from "../atoms/Button";
import { MessageSquare } from "lucide-react";
import JoinGroupButton from "./JoinGroupButton";
// Removed Redux imports - PostComments now handles comments locally
import { postsService } from "../../services/apiService";
import { addConversation } from "../../store/chatSlice";
import { useParams } from "react-router-dom";

const baseUrl = "https://api.emoease.vn/post-service";

const PostCard = ({
  post,
  onNavigateToChat,
  index = 0,
  onShowComment,
  forceShowComments = false,
  onBack,
  hideRepliesByDefault = false,
}) => {
  const { id: routePostId } = useParams();
  // Removed dispatch - PostComments handles comments locally
  const { user } = useSelector((state) => state.auth);
  const postFromStore = useSelector((state) =>
    state.posts?.posts?.find((p) => p.id === post?.id)
  );
  const effectivePost = postFromStore || post;
  const [showComments, setShowComments] = useState(forceShowComments);
  const [maxVisibleComments, setMaxVisibleComments] = useState(3);
  const [isCommenting, setIsCommenting] = useState(false);
  const [localGiftCount, setLocalGiftCount] = useState(effectivePost?.giftCount || 0);
  const commentEndRef = useRef(null);
  const postCommentsRef = useRef(null);

  const bgColors = [
    "bg-white dark:bg-[#1C1C1E]",

  ];


  useEffect(() => {
    if ((showComments || forceShowComments) && commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showComments, forceShowComments]);

  // Sync localGiftCount with effectivePost.giftCount
  useEffect(() => {
    setLocalGiftCount(effectivePost?.giftCount || 0);
  }, [effectivePost?.giftCount]);

  const handleShowComments = () => {
    setShowComments(true);
    onShowComment?.();
  };

  const handleGiftSent = (postId) => {
    // Update local gift count immediately
    setLocalGiftCount(prev => prev + 1);
  };

  const handleShowMoreComments = () => {
    setMaxVisibleComments((prev) => prev + 5);
  };

  // Comment submission for post
  const handleCommentSubmit = async (content) => {
    if (!content.trim()) return;

    setIsCommenting(true);
    try {
      const response = await postsService.addComment(effectivePost.id, content, null);

      // Refresh comments in PostComments
      if (postCommentsRef.current?.refreshComments) {
        postCommentsRef.current.refreshComments();
      }
    } catch (error) {
    } finally {
      setIsCommenting(false);
    }
  };

  // Reply handling is now done by PostComments component
  const handleReply = (parentId, comment, update) => {
  };

  const handleDirectMessage = () => {
    const conversationId = `${user.id}-${effectivePost.author.id}`;
    dispatch(addConversation({ id: conversationId, recipient: effectivePost.author }));
    onNavigateToChat(conversationId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 ${bgColors[index % bgColors.length]} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
    >
      <PostHeader
        post={effectivePost}
        showJoinedBadge={post.type === "group"}
        onBack={onBack}
      />
      <PostContent post={effectivePost} isSafeMode={false} className="mt-4" />
      {post.type === "group" && (
        <JoinGroupButton
          groupId={post.id}
          status={post.joinStatus}
          className="mt-3"
        />
      )}
      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <PostActions
          post={effectivePost}
          onComment={handleShowComments}
        />
        {/* {effectivePost.author.id !== user?.id && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDirectMessage}
            title="Nhắn tin"
            className="!rounded-full !p-2"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        )} */}
      </div>
      <GiftSection
        postId={effectivePost?.id}
        userId={effectivePost?.author?.id}
        giftCount={localGiftCount}
        onGiftSent={handleGiftSent}
      />
      <PostComments
        ref={postCommentsRef}
        comments={effectivePost?.comments}
        show={showComments || forceShowComments}
        maxVisible={maxVisibleComments}
        onShowMore={handleShowMoreComments}
        onReply={handleReply}
        postId={effectivePost?.id || routePostId}
        hideRepliesByDefault={hideRepliesByDefault}
        autoLoadComments={forceShowComments} // Only auto-load comments in detail view
        onCountsChange={(delta) => {
          try {
            // Update counts on the visible card object
            effectivePost.commentCount = Math.max((effectivePost.commentCount || 0) + delta, 0);
            effectivePost.commentsCount = Math.max((effectivePost.commentsCount || 0) + delta, 0);
          } catch { }
        }}
        className="mt-3 sm:mt-4"
      />
      {(showComments || forceShowComments) && (
        <CommentForm
          onSubmit={handleCommentSubmit}
          isSubmitting={isCommenting}
          placeholder="Viết bình luận..."
        />
      )}
      <div ref={commentEndRef} />
    </motion.div>
  );
};

export default PostCard;