import React, { useState } from "react";
import { Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../atoms/Badge";
import { isContentSensitive } from "../../utils/helpers";

const PostContent = ({ post, isSafeMode = false, className = "" }) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const isSensitive = isContentSensitive(post.content);
  const shouldBlur = isSafeMode && isSensitive && isBlurred;
  const images = post.mediaUrls || post.medias || [];
  const isEnhanced = post.isEnhanced ?? false;

  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handleRevealContent = () => {
    setIsBlurred(false);
  };

  const openImageModal = (idx) => {
    setModalIndex(idx);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const nextImg = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev + 1) % images.length);
  };
  const prevImg = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`${className}`}>
      {isSafeMode && isSensitive && isBlurred && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-medium text-yellow-800 dark:text-yellow-300">
              Nội dung nhạy cảm
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
            Bài viết này có thể chứa nội dung nhạy cảm. Bạn có muốn xem không?
          </p>
          <button
            onClick={handleRevealContent}
            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Hiển thị nội dung
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!shouldBlur && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed mb-2">
                {post.content}
              </p>
              {Array.isArray(images) && images.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 relative">
                  {images.slice(0, 3).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative cursor-pointer group flex-1 min-w-0"
                      onClick={() => openImageModal(idx)}
                    >
                      <img
                        src={img}
                        alt={`post-img-${idx}`}
                        className="w-full max-h-48 sm:max-h-60 rounded-lg border group-hover:opacity-80 transition object-cover"
                      />
                      {idx === 2 && images.length > 3 && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                          <span className="text-white text-lg sm:text-2xl font-bold">
                            +{images.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {showModal && Array.isArray(images) && images.length > 0 && (
                <div
                  className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-80"
                  onClick={closeModal}
                >
                  <button
                    className="absolute top-4 right-4 sm:top-6 sm:right-8 text-white text-2xl sm:text-3xl font-bold"
                    onClick={closeModal}
                    aria-label="Đóng"
                  >
                    &times;
                  </button>
                  <button
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white text-2xl sm:text-3xl font-bold px-1 sm:px-2 py-1 bg-black bg-opacity-40 rounded-full"
                    onClick={prevImg}
                    aria-label="Trước"
                  >
                    &#8592;
                  </button>
                  <img
                    src={images[modalIndex]}
                    alt={`modal-img-${modalIndex}`}
                    className="max-h-[70vh] sm:max-h-[80vh] max-w-[95vw] sm:max-w-[90vw] rounded-lg sm:rounded-xl shadow-2xl border-2 sm:border-4 border-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white text-2xl sm:text-3xl font-bold px-1 sm:px-2 py-1 bg-black bg-opacity-40 rounded-full"
                    onClick={nextImg}
                    aria-label="Sau"
                  >
                    &#8594;
                  </button>
                  <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-black bg-opacity-40 rounded-full px-3 sm:px-4 py-1">
                    {modalIndex + 1} / {images.length}
                  </div>
                </div>
              )}
              {isEnhanced && (
                <div className="flex items-center space-x-1 mt-3">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <Badge variant="purple" size="sm">
                    Đã tối ưu bởi AI
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {shouldBlur && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-4"
        >
          <div className="blur-sm select-none pointer-events-none">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
              {post.content.length > 100
                ? `${post.content.substring(0, 100)}...`
                : post.content}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900"></div>
        </motion.div>
      )}
    </div>
  );
};

export default PostContent;