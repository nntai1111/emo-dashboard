import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle, Plus, Trash2 } from "lucide-react";
import ChatbotAvatar from "./ChatbotAvatar";
import Community from "@/components/atoms/Button/Community";

const avatarImages = [
  "/Emo/EMO_1.webp",
  "/Emo/EMO_2.webp",
  "/Emo/EMO_3.webp",
  "/Emo/EMO_4.webp",
  "/Emo/EMO_5.webp",
  "/Emo/EMO_6.webp",
  "/Emo/EMO_7.webp",
  "/Emo/EMO_8.webp",
  "/Emo/EMO_9.webp",
  "/Emo/EMO_10.webp",
];

const getAvatarForSession = (sessionId) => {
  if (!sessionId) return avatarImages[0];
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = sessionId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarImages.length;
  return avatarImages[index];
};

const ConversationSidebar = ({
  sessions,
  onConversationSelect,
  onNewChat,
  activeConversation,
  onDeleteConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const filteredConversations = sessions.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SidebarContent = (
    <motion.div
      className="w-full h-full flex flex-col relative overflow-hidden"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}>
      {/* Compact Header Section */}
      <div className="p-4 relative border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate("/trang-chu")}
            className="shrink-0 h-11 w-11 rounded-xl border border-white/20 bg-white text-gray-800 flex items-center justify-center shadow-md hover:bg-white/90 transition-colors"
            title="Về trang chủ"
            aria-label="Về trang chủ">
            <span className="text-base">🏠</span>
          </button>
          <motion.button
            onClick={onNewChat}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-300 text-gray-800 rounded-xl font-semibold shadow-md transition-all duration-300 group relative overflow-hidden hover:shadow-lg border border-white/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-semibold tracking-wide">
                Cuộc trò chuyện mới
              </span>
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MessageCircle className="w-3 h-3 text-[#C084FC]" />
              </motion.div>
            </div>
          </motion.button>
          {/* Home square button */}
        </div>

        <div className="relative">
          <motion.div
            className="bg-white/90 backdrop-blur-sm shadow-md flex items-center gap-2 rounded-lg px-3 py-2 border border-white/20"
            whileFocus={{ scale: 1.02 }}>
            <Search className="w-3 h-3 text-gray-400/70" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-base placeholder-gray-500/70 font-medium"
            />
          </motion.div>
        </div>
      </div>

      {/* Compact Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
          {filteredConversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className={`relative group rounded-lg shadow-md hover:shadow-lg border border-white/20 bg-white/80 hover:bg-gradient-to-r hover:from-pink-50/60 hover:to-purple-50/60 transition-all cursor-pointer ${
                activeConversation === conversation.id
                  ? "ring-1 ring-pink-400/50 scale-[1.01] border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50"
                  : ""
              }`}
              onClick={() => {
                setIsOpen(false);
                onConversationSelect(conversation.id);
              }}>
              <div className="flex items-center gap-3 p-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-white/40 ring-1 ring-pink-200/20">
                    <img
                      src={getAvatarForSession(conversation.id)}
                      alt="Avatar"
                      className="rounded-full w-7 h-7 object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <motion.span
                      className="text-sm"
                      animate={{
                        scale:
                          activeConversation === conversation.id
                            ? [1, 1.1, 1]
                            : 1,
                      }}
                      transition={{ duration: 0.4 }}>
                      💬
                    </motion.span>
                    <h3 className="font-semibold text-[#6B728E] text-xs truncate flex-1">
                      {conversation.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500/80">
                      {conversation.createdDate ? (
                        <span className="bg-gradient-to-r from-[#F3E8FF] to-[#E0E7FF] text-[#8B5CF6] px-2 py-0.5 rounded-full shadow-sm font-mono text-xs">
                          {new Date(conversation.createdDate).toLocaleString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      ) : (
                        <span className="text-white bg-gradient-to-r from-[#C8A2C8] to-[#a78bfa] px-2 py-0.5 rounded-full shadow-sm text-xs font-medium">
                          Mới
                        </span>
                      )}
                    </span>
                    <motion.button
                      className="opacity-100 transition-opacity rounded-full p-1 hover:bg-pink-200/40"
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(conversation.id);
                      }}>
                      <Trash2 className="w-3 h-3 text-pink-500" />
                    </motion.button>
                  </div>
                </div>
              </div>
              {activeConversation === conversation.id && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#C8A2C8] to-[#6B728E] rounded-r-full shadow-md"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredConversations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="relative">
              <ChatbotAvatar />
              <span className="absolute -top-2 -right-2 text-lg animate-bounce select-none">
                {searchQuery ? "🤔" : "💬"}
              </span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-[#6B728E] drop-shadow">
                {searchQuery ? "Không tìm thấy" : "Chưa có cuộc trò chuyện"}
              </h3>
              <p className="text-[#C8A2C8]/80 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? "Thử từ khóa khác nhé!"
                  : "Bắt đầu cuộc trò chuyện mới 🫂"}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Community CTA - Fixed at bottom */}
      <div className="p-4 border-t flex justify-center border-white/10">
        <Community
          onClick={() => {
            // Trigger MoodTracking modal logic without removing existing CTA behavior
            try {
              // Ensure modal opens even if MoodTracking mounts after navigation
              localStorage.setItem("openMoodAfterLogin", "1");
            } catch {}
            try {
              // If MoodTracking is already mounted, open immediately
              window.dispatchEvent(new CustomEvent("app:openMoodModal"));
            } catch {}
            navigate("/home");
          }}
        />
      </div>
    </motion.div>
  );

  // Popup xác nhận xóa - render ngoài vòng lặp, luôn ở giữa màn hình
  const deletePopup = (
    <AnimatePresence>
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center gap-4 border border-[#C8A2C8]/30">
            <div className="text-4xl mb-2 animate-bounce">🗑️</div>
            <h3 className="text-lg font-bold text-[#C8A2C8] text-center">
              Xóa cuộc trò chuyện?
            </h3>
            <p className="text-gray-500 text-center text-sm">
              Bạn chắc chắn muốn xoá cuộc trò chuyện này? Hành động này không
              thể hoàn tác!
            </p>
            <div className="flex gap-2 mt-2 w-full">
              <button
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#c8a2c8] to-[#6b728e] text-white font-semibold shadow hover:scale-105 transition-all"
                onClick={() => {
                  onDeleteConversation(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}>
                Xóa
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 transition-all"
                onClick={() => setDeleteConfirmId(null)}>
                Hủy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative z-50 h-full">
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block h-full">{SidebarContent}</div>

      {/* Mobile Sidebar - Only when used in mobile overlay */}
      <div className="lg:hidden h-full">{SidebarContent}</div>

      {/* Popup xác nhận xóa luôn ở giữa màn hình */}
      {deletePopup}
    </div>
  );
};

export default ConversationSidebar;
