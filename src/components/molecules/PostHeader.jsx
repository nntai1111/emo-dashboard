import React, { useState, useEffect } from "react";
import { Clock, MoreHorizontal, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../atoms/Avatar";
import IconButton from "../atoms/IconButton";
import Badge from "../atoms/Badge";
import { formatTimeAgo } from "../../utils/helpers";
import { getEmotionTagsByIds, getUnicodeEmoji } from "../../utils/tagHelpers";

const PostHeader = ({
  post,
  showJoinedBadge = false,
  onMoreClick,
  className = "",
  onBack,
}) => {
  const currentAliasId = (() => {
    try {
      const u = localStorage.getItem('auth_user');
      return u ? JSON.parse(u)?.aliasId : null;
    } catch {
      return null;
    }
  })();

  const isMine = currentAliasId && post.author?.id === currentAliasId;

  const author = {
    username: (post.author?.displayName || post.author?.username || "Anonymous") + (isMine ? " (tôi)" : ""),
    isOnline: post.author?.isOnline ?? false,
  };

  // Lấy emotion tags từ post (xử lý cả emotionTagIds và emotionId)
  const emotionTagIds = post.emotionTagIds || post.emotionId || [];
  const [emotionTags, setEmotionTags] = useState([]);


  // Load emotion tags
  useEffect(() => {
    const loadEmotionTags = async () => {
      const tags = await getEmotionTagsByIds(emotionTagIds);
      setEmotionTags(tags);
    };
    loadEmotionTags();
  }, [emotionTagIds]);

  const [showDelete, setShowDelete] = useState(false);

  const canDeletePost = isMine;

  const handleDeletePost = async () => {
    try {
      const { postService } = await import("../../services/postService");
      await postService.deletePost(post.id);
      try {
        window.dispatchEvent(new CustomEvent("app:toast", { detail: { type: "success", message: "Đã xóa bài viết" } }));
      } catch { }
      try {
        if (window.location.pathname.startsWith('/post/')) window.history.back(); else window.location.reload();
      } catch { }
    } catch { }
  };

  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        {onBack && (
          <button
            className="mr-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none flex-shrink-0"
            onClick={onBack}
            title="Quay lại"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" />
          </button>
        )}
        <Avatar
          username={author.username}
          size="md"
          online={author.isOnline}
          rounded={false}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
              {author.username}
            </h4>
            {emotionTags.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-400">
                  đang cảm thấy
                </span>
                {emotionTags.map((emotion, index) => (
                  <div key={emotion.id} className="flex items-center space-x-1">
                    {emotion.mediaUrl ? (
                      <div className=" overflow-hidden">
                        <img
                          src={emotion.mediaUrl}
                          alt={emotion.displayName}
                          className="ml-2 w-5 h-5  md:w-7 md:h-7 mt-1 object-cover object-center scale-375"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'inline';
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-[16px] mt-1 ml-2">{getUnicodeEmoji(emotion.unicodeCodepoint)}</span>
                    )}

                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium capitalize">
                      {emotion.displayNameVi || emotion.displayName}
                    </span>

                    {index < emotionTags.length - 1 && (
                      <span className="text-xs text-gray-400">,</span>
                    )}
                  </div>

                ))}
              </div>
            )}
            {showJoinedBadge && (
              <Badge variant="success" size="sm">
                ✓ Đã tham gia
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>
      {(onMoreClick || canDeletePost) && (
        <div className="relative flex-shrink-0">
          <span
            onClick={(e) => {
              e.stopPropagation();
              (onMoreClick ? onMoreClick() : setShowDelete(true));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                (onMoreClick ? onMoreClick() : setShowDelete(true));
              }
            }}
            role="button"
            tabIndex={0}
            className="inline-flex"
          >
            <IconButton
              icon={MoreHorizontal}
              variant="ghost"
              size="sm"
              title="Tùy chọn khác"
            />
          </span>
          {canDeletePost && showDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDelete(false)}>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-xl w-80 p-5" onClick={(e) => e.stopPropagation()}>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Xác nhận xóa bài viết</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Bạn có chắc muốn xóa bài viết này?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => setShowDelete(false)}>Hủy</button>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700" onClick={handleDeletePost}>Xóa</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostHeader;