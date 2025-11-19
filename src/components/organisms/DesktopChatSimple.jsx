import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Users,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";

const DesktopChatSimple = ({ selectedConversationId }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get conversations from Redux store (same as mobile)
  const storeConversations = useSelector(
    (state) => state.chat.conversations || []
  );

  // Mock conversations data (same as mobile)
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
  mockConversations.forEach((mockConv) => {
    if (!allConversations.find((conv) => conv.id === mockConv.id)) {
      allConversations.push(mockConv);
    }
  });

  const conversations = allConversations;

  // Auto-select conversation when selectedConversationId changes
  useEffect(() => {
    // ...existing code...
    if (selectedConversationId) {
      const conversation = conversations.find(
        (conv) => conv.id === selectedConversationId
      );
      // ...existing code...
      if (conversation) {
        setSelectedChat(conversation);
      }
    }
  }, [selectedConversationId, conversations]);

  const messages = selectedChat
    ? [
      {
        id: 1,
        content: "Hey! How's your day going?",
        isMine: false,
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        content: "It's been great! Working on some exciting projects.",
        isMine: true,
        timestamp: "10:32 AM",
      },
      {
        id: 3,
        content: "That sounds amazing! 🌟",
        isMine: false,
        timestamp: "10:35 AM",
      },
    ]
    : [];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle sending message
    setMessage("");
  };

  // Format timestamp helper (same as mobile)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  // Get display name helper (same as mobile)
  const getDisplayName = (conversation) => {
    if (conversation.type === "group") {
      return conversation.name;
    }
    return conversation.participant?.username || "Unknown";
  };

  // Get last message display (same as mobile)
  const getLastMessageDisplay = (conversation) => {
    if (!conversation.lastMessage) return "Chưa có tin nhắn";

    if (conversation.type === "group" && conversation.lastMessage.senderName) {
      return `${conversation.lastMessage.senderName}: ${conversation.lastMessage.content}`;
    }

    return conversation.lastMessage.content;
  };

  const filteredConversations = conversations.filter((conv) => {
    const displayName = getDisplayName(conv);
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Trò chuyện
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.05)" }}
                  onClick={() => setSelectedChat(conversation)}
                  className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors ${selectedChat?.id === conversation.id
                    ? "bg-purple-50 dark:bg-purple-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-[#1C1C1E]"
                    }`}>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {conversation.type === "group" ? (
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <Avatar
                          username={conversation.participant?.username || "Unknown"}
                          size="md"
                          className="w-12 h-12"
                          rounded={false}
                        />
                      )}
                      {conversation.type === "dm" &&
                        conversation.participant?.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {getDisplayName(conversation)}
                          </h3>
                          {conversation.type === "group" && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {conversation.members} thành viên
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(conversation.lastMessage?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                        {getLastMessageDisplay(conversation)}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "Không tìm thấy cuộc trò chuyện"
                      : "Chưa có cuộc trò chuyện nào"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedChat.type === "group" ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <Avatar
                          username={selectedChat.participant?.username || "Unknown"}
                          size="md"
                          className="w-10 h-10"
                          rounded={false}
                        />
                      )}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {getDisplayName(selectedChat)}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedChat.type === "group"
                            ? `${selectedChat.members} thành viên`
                            : selectedChat.participant?.isOnline
                              ? "Đang hoạt động"
                              : "Không trực tuyến"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.isMine ? "justify-end" : "justify-start"
                          }`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.isMine
                            ? "bg-purple-500 text-white"
                            : "bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                            }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${msg.isMine
                              ? "text-purple-100"
                              : "text-gray-500 dark:text-gray-400"
                              }`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E]">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Nhập tin nhắn..."
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="rounded-full w-10 h-10 p-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Chọn một cuộc trò chuyện
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Chọn một cuộc trò chuyện để bắt đầu nhắn tin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopChatSimple;
