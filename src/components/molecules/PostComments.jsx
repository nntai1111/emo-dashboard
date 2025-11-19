import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Avatar from "../atoms/Avatar";
import { Heart } from "lucide-react";
import CommentForm from "./CommentForm";
import FormattedComment from "../atoms/FormattedComment";
import { formatTimeAgo } from "../../utils/helpers";
import { postService } from "../../services/postService";
import { useWebSocket } from "../../hooks/useWebSocket";
import websocketService from "../../services/websocketService";

const baseUrl = "https://api.emoease.vn/post-service";

const PostComments = forwardRef(({
  comments = [],
  show = false,
  maxVisible = 3,
  onShowMore,
  className = "",
  onReply,
  hideRepliesByDefault = false,
  postId,
  autoLoadComments = false,
  onCountsChange = () => { },
}, ref) => {
  // Get user info from Redux
  const user = useSelector((state) => state.auth.user);
  const currentAliasId = (() => {
    try {
      const str = localStorage.getItem('auth_user');
      return str ? JSON.parse(str)?.aliasId : null;
    } catch {
      return null;
    }
  })();

  // Local state management (no Redux needed with WebSocket)
  const [localComments, setLocalComments] = useState(comments);
  const [showReplyForm, setShowReplyForm] = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [replyVisibleCount, setReplyVisibleCount] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [fetchingReplies, setFetchingReplies] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const removeCommentById = (comments, targetId) => {
    return comments
      .filter(c => c.id !== targetId)
      .map(c => ({
        ...c,
        replies: Array.isArray(c.replies) ? removeCommentById(c.replies, targetId) : [],
      }));
  };
  const commentEndRef = useRef(null);

  // Expose refreshComments function to parent
  useImperativeHandle(ref, () => ({
    refreshComments: () => {
      if (postId) {
        loadComments();
      }
    }
  }));

  // WebSocket hook with callback for real-time updates
  const handleCommentUpdate = useCallback((type, data) => {
    switch (type) {
      case 'newComment':
        // Map WebSocket data to local format
        const mappedComment = {
          ...data,
          author: data.author?.displayName || data.author || "Unknown",
          avatar: data.author?.avatarUrl || data.avatar || null,
        };
        setLocalComments(prev => [mappedComment, ...prev]);
        break;
      case 'newReply':
        setLocalComments(prev => {
          const addReplyToComment = (comments) => {
            return comments.map(comment => {
              if (comment.id === data.parentId) {
                // Map WebSocket reply data to local format
                const mappedReply = {
                  ...data.reply,
                  author: data.reply.author?.displayName || data.reply.author || "Unknown",
                  avatar: data.reply.author?.avatarUrl || data.reply.avatar || null,
                };
                return {
                  ...comment,
                  replies: [mappedReply, ...(comment.replies || [])],
                  replyCount: (comment.replyCount || 0) + 1
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReplyToComment(comment.replies)
                };
              }
              return comment;
            });
          };
          return addReplyToComment(prev);
        });
        break;
      case 'commentLiked':
        setLocalComments(prev => {
          const updateLike = (comments) => {
            return comments.map(comment => {
              if (comment.id === data.commentId) {
                return {
                  ...comment,
                  isReactedByCurrentUser: data.isLiked,
                  reactionCount: data.reactionCount || (comment.reactionCount || 0) + (data.isLiked ? 1 : -1)
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateLike(comment.replies)
                };
              }
              return comment;
            });
          };
          return updateLike(prev);
        });
        break;
      case 'commentDeleted':
        setLocalComments(prev => prev.filter(comment => comment.id !== data.commentId));
        break;
      case 'replyDeleted':
        setLocalComments(prev => {
          const removeReply = (comments) => {
            return comments.map(comment => {
              if (comment.replies && comment.replies.length > 0) {
                const filteredReplies = comment.replies.filter(reply => reply.id !== data.replyId);
                return {
                  ...comment,
                  replies: filteredReplies,
                  replyCount: Math.max((comment.replyCount || 0) - 1, 0)
                };
              }
              return comment;
            });
          };
          return removeReply(prev);
        });
        break;
    }
  }, []);

  const { sendComment, sendReply, sendLike, isConnected } = useWebSocket(postId, show, handleCommentUpdate);

  // Sync local comments with props (only if localComments is empty)
  useEffect(() => {
    if (comments && comments.length > 0 && localComments.length === 0) {
      setLocalComments(comments);
    }
  }, [comments, localComments.length]);

  // Load comments when component mounts or postId changes (only if autoLoadComments is true)
  useEffect(() => {
    if (postId && !commentsLoaded && autoLoadComments) {
      loadComments();
    }
  }, [postId, commentsLoaded, autoLoadComments]);

  // Reset state when postId changes
  useEffect(() => {
    setFetchingReplies(new Set());
    setShowReplyForm({}); // Close all reply forms when postId changes
  }, [postId]);

  // Initialize WebSocket connection (disabled for now due to connection issues)
  useEffect(() => {
    if (postId && show) {
      // Temporarily disable WebSocket due to connection issues
      // const wsUrl = `wss://api.emoease.vn/ws?postId=${postId}&token=${token}`;
      // websocketService.connect(wsUrl);


      return () => {
        // websocketService.disconnect();
      };
    }
  }, [postId, show]);

  const loadComments = async () => {
    try {
      const response = await postService.getComments(postId, 1, 20);
      if (response.comments && response.comments.data) {
        // Map comments to local format
        const mappedComments = response.comments.data.map((comment) => ({
          id: comment.id,
          content: comment.content,
          author: comment.author.displayName,
          authorAliasId: comment.author.aliasId,
          avatar: comment.author.avatarUrl,
          createdAt: comment.createdAt,
          editedAt: comment.editedAt,
          reactionCount: comment.reactionCount || 0,
          replyCount: comment.replyCount || 0,
          isReactedByCurrentUser: comment.isReactedByCurrentUser || false,
          isDeleted: comment.isDeleted || false,
          hierarchy: comment.hierarchy,
          replies: comment.replies ? comment.replies.map((reply) => ({
            id: reply.id,
            content: reply.content,
            author: reply.author.displayName,
            authorAliasId: reply.author.aliasId,
            avatar: reply.author.avatarUrl,
            createdAt: reply.createdAt,
            editedAt: reply.editedAt,
            reactionCount: reply.reactionCount || 0,
            replyCount: reply.replyCount || 0,
            isReactedByCurrentUser: reply.isReactedByCurrentUser || false,
            isDeleted: reply.isDeleted || false,
            hierarchy: reply.hierarchy,
            replies: [], // Replies don't have nested replies in this structure
          })) : [],
        }));

        // Sort comments from newest to oldest (newest first)
        const sortedComments = mappedComments.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );


        setLocalComments(sortedComments);
        setCommentsLoaded(true);
      }
    } catch (error) {
    }
  };


  const handleReplySubmit = async (commentId, content) => {
    if (!postId) {
      return;
    }

    // Prepare optimistic reply id in outer scope so catch can access
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      content,
      author: user?.aliasLabel || user?.displayName || user?.username || "Anonymous",
      avatar: user?.avatar || user?.avatarUrl || null,
      createdAt: new Date().toISOString(),
      reactionCount: 0,
      replyCount: 0,
      isReactedByCurrentUser: false,
      replies: [],
    };

    try {
      // Optimistic reply

      // Add optimistic reply to local state
      setLocalComments(prev => {
        const addReplyToComment = (comments) => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [optimistic, ...(comment.replies || [])],
                replyCount: (comment.replyCount || 0) + 1
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies)
              };
            }
            return comment;
          });
        };
        return addReplyToComment(prev);
      });

      // Ensure the replies section opens when first reply is added
      setOpenReplies((prev) => ({ ...prev, [commentId]: true }));
      setReplyVisibleCount((prev) => ({ ...prev, [commentId]: Math.max(prev[commentId] || 0, 3) }));

      // Close the reply form after submitting
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));

      // Send via WebSocket if connected, otherwise fallback to API
      if (isConnected) {
        sendReply(postId, commentId, content);
        // WebSocket will handle the real-time update
      } else {
        // Fallback to API
        const response = await postService.addComment(postId, content, commentId);
        const realId = response?.commentId || response?.id;

        if (realId) {
          // Update optimistic reply with real ID
          setLocalComments(prev => {
            const updateReplyId = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.map(reply =>
                      reply.id === tempId ? { ...reply, id: realId } : reply
                    )
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateReplyId(comment.replies)
                  };
                }
                return comment;
              });
            };
            return updateReplyId(prev);
          });
        } else {
          // Remove optimistic reply if failed
          setLocalComments(prev => {
            const removeReply = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.filter(reply => reply.id !== tempId),
                    replyCount: Math.max((comment.replyCount || 0) - 1, 0)
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: removeReply(comment.replies)
                  };
                }
                return comment;
              });
            };
            return removeReply(prev);
          });
        }
      }
    } catch (error) {
      // Remove optimistic reply on error
      setLocalComments(prev => {
        const removeReply = (comments) => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== tempId),
                replyCount: Math.max((comment.replyCount || 0) - 1, 0)
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: removeReply(comment.replies)
              };
            }
            return comment;
          });
        };
        return removeReply(prev);
      });
    }
  };

  const handleLikeComment = async (commentId, isReacted) => {
    if (!postId) {
      return;
    }

    try {
      // Send via WebSocket if connected, otherwise fallback to API
      if (isConnected) {
        sendLike(postId, commentId, !isReacted);
        // WebSocket will handle the real-time update
      } else {
        // Fallback to API
        if (!isReacted) {
          const response = await postService.likeComment(commentId);

          // Update local state
          setLocalComments(prev => {
            const updateLike = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    isReactedByCurrentUser: true,
                    reactionCount: (comment.reactionCount || 0) + 1
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateLike(comment.replies)
                  };
                }
                return comment;
              });
            };
            return updateLike(prev);
          });
        } else {
          await postService.unlikeComment(commentId);

          // Update local state
          setLocalComments(prev => {
            const updateLike = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    isReactedByCurrentUser: false,
                    reactionCount: Math.max((comment.reactionCount || 0) - 1, 0)
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateLike(comment.replies)
                  };
                }
                return comment;
              });
            };
            return updateLike(prev);
          });
        }
      }
    } catch (error) {
    }
  };

  const handleFetchReplies = async (commentId) => {
    if (!postId) {
      return;
    }

    // Prevent duplicate API calls
    if (fetchingReplies.has(commentId)) {
      return;
    }

    try {
      setFetchingReplies(prev => new Set([...prev, commentId]));
      setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

      // Get current page based on existing replies - search in nested structure
      // Recursive function to find comment in nested structure
      const findComment = (comments) => {
        for (let comment of comments) {
          if (comment.id === commentId) {
            return comment;
          }
          if (comment.replies && comment.replies.length > 0) {
            const found = findComment(comment.replies);
            if (found) return found;
          }
        }
        return null;
      };

      const currentComment = findComment(localComments);
      const existingRepliesCount = currentComment?.replies?.length || 0;
      const pageIndex = Math.floor(existingRepliesCount / 20) + 1;

      // Chỉ gọi API nếu có replyCount > 0
      if (!currentComment?.replyCount || currentComment.replyCount === 0) {
        return;
      }

      // Nếu đã load hết replies thì không gọi API
      if (existingRepliesCount >= currentComment.replyCount) {
        return;
      }

      // Gọi API riêng cho replies của comment
      const responseData = await postService.getCommentReplies(commentId, pageIndex, 20);

      if (responseData.comments && responseData.comments.data) {
        const mappedReplies = responseData.comments.data.map((reply) => ({
          id: reply.id,
          content: reply.content,
          author: reply.author.displayName,
          authorAliasId: reply.author.aliasId,
          avatar: reply.author.avatarUrl || null,
          createdAt: reply.createdAt,
          reactionCount: reply.reactionCount || 0,
          replyCount: reply.replyCount || 0,
          isReactedByCurrentUser: reply.isReactedByCurrentUser || false,
          replies: [],
        }));

        // Filter chỉ lấy replies mới (chưa có trong existingReplies)
        const existingReplyIds = new Set(currentComment?.replies?.map(r => r.id) || []);
        const newReplies = mappedReplies.filter(reply => !existingReplyIds.has(reply.id));

        // Update local state with new replies
        if (newReplies.length > 0) {
          setLocalComments(prev => {
            const addRepliesToComment = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), ...newReplies]
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: addRepliesToComment(comment.replies)
                  };
                }
                return comment;
              });
            };
            return addRepliesToComment(prev);
          });

        } else {
          setOpenReplies((prev) => {
            const newState = { ...prev, [commentId]: true };
            return newState;
          });
        }

        // Open replies section when first batch is loaded
        if (existingRepliesCount === 0) {
          setOpenReplies((prev) => {
            const newState = { ...prev, [commentId]: true };
            return newState;
          });
          // Set initial visible count to 3 (social media style)
          setReplyVisibleCount((prev) => ({
            ...prev,
            [commentId]: 3,
          }));
        }
      }
    } catch (error) {
    } finally {
      setFetchingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => {
      // Close all other reply forms first
      const newState = {};
      newState[commentId] = !prev[commentId];
      return newState;
    });
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => {
      const newState = { ...prev, [commentId]: !prev[commentId] };
      return newState;
    });
    setReplyVisibleCount((prev) => ({
      ...prev,
      [commentId]: prev[commentId] || 3, // Bắt đầu với 3 replies
    }));
  };

  const handleShowMoreReplies = (commentId, total) => {
    setReplyVisibleCount((prev) => {
      const current = prev[commentId] || 3; // Bắt đầu với 3 replies
      const next = Math.min(current + 5, total || current + 5);
      return { ...prev, [commentId]: next };
    });
  };

  // Use local comments instead of Redux
  const validComments = localComments;

  // Auto-open replies that have replies from API (social media style)
  useEffect(() => {
    if (localComments.length > 0) {
      const commentsWithReplies = localComments.filter(comment =>
        comment.replies && comment.replies.length > 0
      );

      if (commentsWithReplies.length > 0) {
        setOpenReplies(prev => {
          const newOpenReplies = { ...prev };
          let hasChanges = false;

          commentsWithReplies.forEach(comment => {
            // Chỉ auto-open nếu có ít hơn 3 replies (giống social media)
            if (!newOpenReplies[comment.id] && comment.replies.length <= 3) {
              newOpenReplies[comment.id] = true;
              hasChanges = true;
            }
          });

          return hasChanges ? newOpenReplies : prev;
        });
      }
    }
  }, [localComments.length]);

  if (!show || localComments.length === 0) return null;

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => {
      const totalReplyCount = comment.replyCount || 0;
      const loadedReplies = Array.isArray(comment.replies) ? comment.replies.length : 0;
      const hasReplies = totalReplyCount > 0;
      const isOpen = openReplies[comment.id] ?? false;
      const areRepliesLoaded = loadedReplies >= totalReplyCount && loadedReplies > 0;
      const hasLoadedAny = loadedReplies > 0;
      const shouldShowReplies = isOpen;
      const isLoading = loadingReplies[comment.id] || false;
      // Hiển thị nút nếu có replyCount > loadedReplies và không đang loading
      const hasMoreReplies = totalReplyCount > loadedReplies && !isLoading;

      // Giới hạn chiều sâu comment chỉ có 5 level
      const isMaxDepth = level >= 5;


      const isMine = currentAliasId && comment.authorAliasId === currentAliasId;
      return (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative ${level > 0 ? "ml-4 sm:ml-8" : ""}`}
        >
          <div className="flex space-x-2 sm:space-x-3">
            <Avatar
              username={comment.author}
              avatarUrl={comment.avatar}
              size="sm"
              rounded={false}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                  {comment.author || "Unknown"}
                  {currentAliasId && comment.authorAliasId === currentAliasId ? " (tôi)" : ""}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatTimeAgo(comment.createdAt)}
                </span>
                {isMine && (
                  <div className="relative ml-auto">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-2"
                      title="Tùy chọn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(prev => prev === comment.id ? null : comment.id);
                      }}
                    >
                      ⋯
                    </button>
                    {openMenuId === comment.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white text-gray-800 dark:bg-neutral-800 dark:text-gray-100 border border-gray-200 dark:border-neutral-700 rounded-md shadow-xl z-20">
                        <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(comment.id);
                            setOpenMenuId(null);
                          }}
                        >
                          Xóa bình luận
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-1 text-sm sm:text-base text-gray-900 dark:text-gray-200 break-words">
                <FormattedComment
                  content={comment.content}
                  className="leading-relaxed"
                />
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <button
                  className={`flex items-center space-x-1 ${comment.isReactedByCurrentUser
                    ? "text-red-500 dark:text-red-500"
                    : "hover:text-red-500"
                    }`}
                  onClick={() => handleLikeComment(comment.id, comment.isReactedByCurrentUser)}
                >
                  <Heart
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill={comment.isReactedByCurrentUser ? "currentColor" : "none"}
                  />
                  <span>{comment.reactionCount}</span>
                </button>
                {!isMaxDepth && (
                  <button
                    className="hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => toggleReplyForm(comment.id)}
                  >
                    Trả lời
                  </button>
                )}
                {hasReplies && (
                  <button
                    className="hover:text-gray-700 dark:hover:text-gray-200 flex items-center space-x-1"
                    onClick={() => {
                      if (isLoading) {
                        // Đang loading -> Không làm gì
                        return;
                      }
                      if (isOpen) {
                        // Đã mở -> Ẩn
                        toggleReplies(comment.id);
                      } else {
                        // Chưa mở -> Load từ API nếu cần, rồi mở
                        if (!hasLoadedAny) {
                          handleFetchReplies(comment.id);
                        } else {
                          toggleReplies(comment.id);
                        }
                      }
                    }}
                    disabled={loadingReplies[comment.id]}
                  >
                    {loadingReplies[comment.id] ? (
                      <span>Đang tải...</span>
                    ) : isOpen ? (
                      <span>Ẩn phản hồi</span>
                    ) : (
                      <span>Xem thêm phản hồi</span>
                    )}
                  </button>
                )}
              </div>
              {!isMaxDepth && (
                <AnimatePresence>
                  {showReplyForm[comment.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <CommentForm
                        onSubmit={(content) => handleReplySubmit(comment.id, content)}
                        placeholder={`Trả lời ${comment.author}...`}
                        isSubmitting={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
          {/* Show replies when opened (social media style) - only if not at max depth */}
          {!isMaxDepth && shouldShowReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {(() => {
                const total = comment.replies.length;
                const initialVisible = 3; // Chỉ hiển thị 3 replies đầu tiên
                const visible = replyVisibleCount[comment.id] || initialVisible;
                const toRender = comment.replies.slice(0, visible);
                const remaining = total - visible;

                return (
                  <>
                    {renderComments(toRender, level + 1)}
                    {remaining > 0 && !hasMoreReplies && (
                      <button
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm mt-1 font-medium"
                        onClick={() => handleShowMoreReplies(comment.id, total)}
                      >
                        Xem thêm phản hồi
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}


        </motion.div>
      );
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>



      {renderComments(validComments.slice(0, maxVisible))}

      {validComments.length > maxVisible && (
        <button
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          onClick={onShowMore}
        >
          Xem thêm bình luận
        </button>
      )}
      <div ref={commentEndRef} />
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-80 p-5 border border-gray-200 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Xác nhận xóa</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Bạn có chắc muốn xóa bình luận này?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-neutral-600"
                onClick={() => setConfirmDeleteId(null)}
              >
                Hủy
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  try {
                    await postService.deleteComment(confirmDeleteId);
                    setLocalComments(prev => removeCommentById(prev, confirmDeleteId));
                    try { onCountsChange(-1); } catch { }
                  } catch { }
                  setConfirmDeleteId(null);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default PostComments;