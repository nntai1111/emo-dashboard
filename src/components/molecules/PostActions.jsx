import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { Heart, MessageCircle, Eye, Hash } from "lucide-react";
import { postsService } from "../../services/apiService";
import {
  getCategoryTagsByIds,
  getUnicodeEmoji,
  getCategoryColorClasses,
} from "../../utils/tagHelpers";

const PostActions = ({ post, onComment, isLiking = false, className = "" }) => {
  const [liked, setLiked] = useState(
    post.liked || post.isReactedByCurrentUser || false
  );
  const [reactionCount, setReactionCount] = useState(
    post.reactionCount || post.likesCount || 0
  );
  const [error, setError] = useState(null);
  const baseUrl = "https://api.emoease.vn/post-service";

  const categoryTagIds = post.categoryTagIds || post.categoryTagId || [];
  const [categoryTags, setCategoryTags] = useState([]);

  useEffect(() => {
    const loadCategoryTags = async () => {
      const tags = await getCategoryTagsByIds(categoryTagIds);
      setCategoryTags(tags);
    };
    loadCategoryTags();
  }, [categoryTagIds]);

  const [showGhost, setShowGhost] = useState(false);
  const [ghostTick, setGhostTick] = useState(0);

  const handleLike = async () => {
    if (isLiking) return;
    const newLikedState = !liked;
    try {
      if (newLikedState) {
        await postsService.likePost(post.id);
        setReactionCount((prev) => prev + 1);
        setLiked(true);

        // 🎃 Hiệu ứng Halloween
        setShowGhost(true);
        setGhostTick((t) => t + 1);
        setTimeout(() => setShowGhost(false), 3000);
      } else {
        await postsService.unlikePost(post.id);
        setReactionCount((prev) => prev - 1);
        setLiked(false);
        setShowGhost(false);
      }
      setError(null);
    } catch (error) {
      console.error("Lỗi khi xử lý lượt thích:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 relative">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {reactionCount}
          </span>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={`!rounded-full !p-2 ${liked
                  ? "text-red-500 dark:text-red-500"
                  : "text-gray-500 hover:text-red-500"
                }`}
              title={liked ? "Bỏ thích" : "Thích"}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill={liked ? "currentColor" : "none"}
              />
            </Button>

            {showGhost && (
              <div
                key={ghostTick}
                className="pointer-events-none absolute -top-10 -right-6 sm:-top-12 sm:-right-8 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center"
              >
                {/* 🔮 Vòng sáng lấp lánh */}
                <div className="absolute inset-0 rounded-full bg-pink-400/20 blur-md animate-ping" />
                <div className="absolute inset-0 rounded-full ring-2 ring-orange-400/60 animate-pulse" />

                {/* ✨ Tia lấp lánh */}
                <span className="absolute left-1 top-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" />
                <span className="absolute right-2 top-3 w-1.5 h-1.5 bg-fuchsia-300 rounded-full animate-ping" />
                <span className="absolute left-3 bottom-2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" />

                {/* 🔥 Lửa lập lòe */}
                <div className="absolute bottom-0 w-12 h-12 bg-gradient-to-t from-orange-500/40 via-yellow-300/30 to-transparent blur-lg rounded-full animate-flame" />
                <div className="absolute bottom-0 w-10 h-10 bg-gradient-to-t from-fuchsia-500/30 via-pink-400/20 to-transparent blur-lg rounded-full animate-flame-delay" />

                {/* 🦇 Dơi bay quanh */}
                <span className="absolute left-0 top-1/2 text-xs text-gray-800 dark:text-gray-100 animate-bat">
                  🦇
                </span>
                <span className="absolute right-0 top-1/3 text-[10px] text-gray-700 dark:text-gray-300 animate-bat-delay">
                  🦇
                </span>

                {/* 👻 Con ma */}
                <img
                  src="/image/social/emo-haloween.png"
                  alt="ghost"
                  className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_6px_rgba(255,100,200,0.75)] animate-bounce"
                  style={{ animationDuration: "1.2s" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {post.commentCount || post.commentsCount || 0}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="!rounded-full !p-2"
            title="Bình luận"
            onClick={onComment}
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {post.viewCount || 0}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="!rounded-full !p-2"
            title="Lượt xem"
            disabled
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* Category Tags */}
      {categoryTags.length > 0 ? (
        <div className="flex items-center space-x-2">
          {categoryTags.map((category) => {
            const colors = getCategoryColorClasses(category);
            return (
              <button
                key={category.id}
                type="button"
                className={`flex items-center space-x-1 px-2 py-1 rounded-full transition cursor-pointer hover:scale-105 ${colors.container}`}
                title={`Lọc theo chủ đề: ${category.displayNameVi || category.displayName
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    window.dispatchEvent(
                      new CustomEvent("app:selectCategory", {
                        detail: { categoryId: category.id },
                      })
                    );
                  } catch (error) {
                    console.error("❌ Error dispatching event:", error);
                  }
                }}
              >
                <Hash className={`w-3 h-3 ${colors.icon}`} />
                <span className={`text-xs font-medium ${colors.text}`}>
                  {category.displayNameVi ||
                    category.displayName ||
                    "Unknown"}
                </span>
                <span className="text-sm">
                  {getUnicodeEmoji(category.unicodeCodepoint) || "🏷️"}
                </span>
              </button>
            );
          })}
        </div>
      ) : categoryTagIds.length > 0 ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
            <Hash className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Loading...
            </span>
          </div>
        </div>
      ) : null}

      {error && (
        <div className="text-red-500 text-xs sm:text-sm mt-2">{error}</div>
      )}

      {/* 🎃 Animation styles */}
      <style jsx>{`
        @keyframes flame {
          0%,
          100% {
            transform: scale(1) translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2) translateY(-4px);
            opacity: 1;
          }
        }
        .animate-flame {
          animation: flame 1.2s ease-in-out infinite;
        }
        .animate-flame-delay {
          animation: flame 1.2s ease-in-out 0.6s infinite;
        }

        @keyframes bat-fly {
          0% {
            transform: translateX(0) rotate(0deg) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateX(-20px) translateY(-10px) rotate(-10deg)
              scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateX(0) rotate(0deg) scale(1);
            opacity: 0.8;
          }
        }
        .animate-bat {
          animation: bat-fly 1.5s ease-in-out infinite;
        }
        .animate-bat-delay {
          animation: bat-fly 1.5s ease-in-out 0.75s infinite;
        }
      `}</style>
    </div>
  );
};

export default PostActions;
