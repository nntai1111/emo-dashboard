import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Phone,
  Video,
  MoreVertical,
  Trash2,
  EyeOff,
} from "lucide-react";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import { deleteConversation, hideConversation } from "../store/chatSlice";

const MobileChatPage = ({ onBack, selectedConversationId }) => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [swipedConversationId, setSwipedConversationId] = useState(null);

  const dispatch = useDispatch();

  // Get conversations from Redux store
  const storeConversations = useSelector(
    (state) => state.chat.conversations || []
  );

  // Mock conversations data (fallback)
  const mockConversations = [
    {
      id: "dm_1",
      type: "dm",
      participant: {
        id: "user1",
        username: "MysteriousFox42",
        isOnline: true,
      },
      lastMessage: {
        content: "Cảm ơn bạn đã chia sẻ!",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        senderId: "user1",
      },
      unreadCount: 2,
    },
    {
      id: "dm_2",
      type: "dm",
      participant: {
        id: "user2",
        username: "GentleWolf89",
        isOnline: false,
      },
      lastMessage: {
        content: "Mình cũng vậy, cùng nhau vượt qua nhé! 💪",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        senderId: "user2",
      },
      unreadCount: 0,
    },
    {
      id: "group_1",
      type: "group",
      name: "Hỗ trợ tâm lý 💙",
      members: 156,
      lastMessage: {
        content: "Chúng ta cùng động viên nhau nhé!",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        senderId: "user3",
        senderName: "CalmButterfly12",
      },
      unreadCount: 5,
    },
  ];

  // Combine store conversations with mock data, avoiding duplicates
  const allConversations = [...storeConversations];

  // Add mock conversations only if they don't exist in store
  mockConversations.forEach((mockConv) => {
    if (!allConversations.find((conv) => conv.id === mockConv.id)) {
      allConversations.push(mockConv);
    }
  });

  const conversations = allConversations;

  // Auto-select conversation if selectedConversationId is provided
  useEffect(() => {
    if (selectedConversationId) {
      const foundConversation = conversations.find(
        (conv) => conv.id === selectedConversationId
      );
      if (foundConversation) {
        setActiveConversation(foundConversation);
      }
    }
  }, [selectedConversationId, conversations]);

  // Handle back button in chat detail view
  const handleBackFromChat = () => {
    if (selectedConversationId) {
      // If came from a post, go back to home directly
      onBack();
    } else {
      // If came from conversations list, go back to list
      setActiveConversation(null);
    }
  };

  // Handle delete conversation
  const handleDeleteConversation = (conversationId) => {
    dispatch(deleteConversation(conversationId));
    setSwipedConversationId(null);
  };

  // Handle hide conversation
  const handleHideConversation = (conversationId) => {
    dispatch(hideConversation(conversationId));
    setSwipedConversationId(null);
  };

  // Handle swipe gestures
  const handleSwipeStart = (conversationId) => {
    setSwipedConversationId(conversationId);
  };

  const handleSwipeEnd = () => {
    // Auto-hide swipe actions after a delay
    setTimeout(() => {
      setSwipedConversationId(null);
    }, 3000);
  };

  const filteredConversations = conversations.filter((conv) => {
    // Hide conversations that are marked as hidden
    if (conv.hidden) return false;

    // Filter by search query
    if (conv.type === "dm") {
      return conv.participant.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    } else {
      return conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = (now - time) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} phút`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ`;
    } else {
      return `${Math.floor(diffInHours / 24)} ngày`;
    }
  };

  // Chat Detail View
  if (activeConversation) {
    return (
      <div className="flex flex-col h-dvh bg-white dark:bg-gray-900">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E]">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackFromChat}
              className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar
              username={
                activeConversation.type === "dm"
                  ? activeConversation.participant.username
                  : activeConversation.name
              }
              size="sm"
              online={
                activeConversation.type === "dm"
                  ? activeConversation.participant.isOnline
                  : false
              }
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {activeConversation.type === "dm"
                  ? activeConversation.participant.username
                  : activeConversation.name}
              </h3>
              {activeConversation.type === "dm" && (
                <p className="text-base text-gray-500">
                  {activeConversation.participant.isOnline
                    ? "Đang online"
                    : "Offline"}
                </p>
              )}
              {activeConversation.type === "group" && (
                <p className="text-base text-gray-500">
                  {activeConversation.members} thành viên
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area - Takes remaining space above fixed input */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 pb-24">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>
              Cuộc trò chuyện với{" "}
              {activeConversation.type === "dm"
                ? activeConversation.participant.username
                : activeConversation.name}
            </p>
            <p className="text-base mt-1">Tin nhắn sẽ được hiển thị ở đây</p>
          </div>
        </div>

        {/* Message Input - Fixed at bottom like navigation bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E] z-50 safe-area-pb">
          <div className="flex items-center space-x-3 max-w-full">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button
              variant="primary"
              size="sm"
              className="px-6 py-3 rounded-full font-medium shrink-0">
              Gửi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations List View
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="flex flex-col h-dvh bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tin nhắn
          </h1>
          <div className="w-9"></div> {/* Spacer */}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div key={conversation.id} className="relative overflow-hidden">
            {/* Swipe Actions Background */}
            <div
              className={`absolute right-0 top-0 bottom-0 flex items-center transition-all duration-300 ${swipedConversationId === conversation.id
                ? "translate-x-0"
                : "translate-x-full"
                }`}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleHideConversation(conversation.id)}
                className="h-full px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-none border-none flex items-center space-x-2">
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">Ẩn</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDeleteConversation(conversation.id)}
                className="h-full px-6 bg-red-500 hover:bg-red-600 text-white rounded-none border-none flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa</span>
              </Button>
            </div>

            {/* Main Conversation Item */}
            <motion.div
              drag="x"
              dragConstraints={{ left: -120, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) {
                  handleSwipeStart(conversation.id);
                  handleSwipeEnd();
                } else {
                  setSwipedConversationId(null);
                }
              }}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (swipedConversationId === conversation.id) {
                  setSwipedConversationId(null);
                } else {
                  setActiveConversation(conversation);
                }
              }}
              className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1C1C1E]/50 bg-white dark:bg-gray-900 relative z-10">
              <div className="relative">
                <Avatar
                  username={
                    conversation.type === "dm"
                      ? conversation.participant.username
                      : conversation.name
                  }
                  size="md"
                  online={
                    conversation.type === "dm"
                      ? conversation.participant.isOnline
                      : false
                  }
                />
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-base rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount > 9
                      ? "9+"
                      : conversation.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 ml-3">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium truncate ${conversation.unreadCount > 0
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                      }`}>
                    {conversation.type === "dm"
                      ? conversation.participant.username
                      : conversation.name}
                  </p>
                  <span className="text-base text-gray-500 ml-2">
                    {conversation.lastMessage
                      ? formatTime(conversation.lastMessage.timestamp)
                      : "Vừa xong"}
                  </span>
                </div>
                <p
                  className={`text-base truncate ${conversation.unreadCount > 0
                    ? "text-gray-600 dark:text-gray-400 font-medium"
                    : "text-gray-500 dark:text-gray-500"
                    }`}>
                  {conversation.lastMessage ? (
                    <>
                      {conversation.type === "group" &&
                        conversation.lastMessage.senderName && (
                          <span className="text-purple-600 dark:text-purple-400">
                            {conversation.lastMessage.senderName}:
                          </span>
                        )}
                      {conversation.lastMessage.content}
                    </>
                  ) : (
                    <span className="italic">Bắt đầu cuộc trò chuyện...</span>
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileChatPage;
