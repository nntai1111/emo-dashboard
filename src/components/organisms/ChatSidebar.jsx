import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Users, Search, Plus, X } from "lucide-react";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import {
  setActiveConversation,
  setConversations,
  setGroups,
} from "../../store/chatSlice";
import { formatTimeAgo } from "../../utils/helpers";

// Mock data for demo
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
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "dm_2",
    type: "dm",
    participant: {
      id: "user2",
      username: "PeacefulMoon16",
      isOnline: false,
    },
    lastMessage: {
      content: "Chúc bạn một ngày tốt lành!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      senderId: "current_user",
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

const mockGroups = [
  {
    id: "group_1",
    type: "group",
    name: "Nhóm Sách Tâm Lý 📚",
    participants: ["user3", "user4", "user5"],
    status: "joined",
    lastMessage: {
      content: 'Mình vừa đọc xong cuốn "Tâm lý học tích cực"',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      senderId: "user3",
      senderName: "WiseOwl23",
    },
    unreadCount: 5,
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "group_2",
    type: "group",
    name: "Hỗ trợ & Chia sẻ 🤗",
    participants: ["user6", "user7"],
    status: "pending",
    lastMessage: null,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

const ChatSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { conversations, groups, activeConversation, onlineUsers } =
    useSelector((state) => state.chat);
  const [activeTab, setActiveTab] = useState("dms"); // 'dms' or 'groups'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Initialize with mock data
    if (conversations.length === 0) {
      dispatch(setConversations(mockConversations));
    }
    if (groups.length === 0) {
      dispatch(setGroups(mockGroups));
    }
  }, [dispatch, conversations.length, groups.length]);

  const handleConversationClick = (conversation) => {
    dispatch(setActiveConversation(conversation));
    // On mobile, close sidebar after selecting
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ConversationItem = ({ conversation }) => {
    const isActive = activeConversation?.id === conversation.id;
    const isOnline = onlineUsers.includes(conversation.participant.id);

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleConversationClick(conversation)}
        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
          ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar
              username={conversation.participant.username}
              size="md"
              online={isOnline}
              rounded={false}
            />
            {conversation.unreadCount > 0 && (
              <Badge
                variant="danger"
                size="xs"
                className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center">
                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p
                className={`font-medium truncate ${isActive
                  ? "text-purple-900 dark:text-purple-100"
                  : "text-gray-900 dark:text-white"
                  }`}>
                {conversation.participant.username}
              </p>
              {conversation.lastMessage && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(conversation.lastMessage.timestamp)}
                </span>
              )}
            </div>

            {conversation.lastMessage && (
              <p
                className={`text-sm truncate mt-1 ${conversation.unreadCount > 0
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-500 dark:text-gray-400"
                  }`}>
                {conversation.lastMessage.senderId === "current_user"
                  ? "Bạn: "
                  : ""}
                {conversation.lastMessage.content}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const GroupItem = ({ group }) => {
    const isActive = activeConversation?.id === group.id;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleConversationClick(group)}
        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
          ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>

            {group.unreadCount > 0 && (
              <Badge
                variant="danger"
                size="xs"
                className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center">
                {group.unreadCount > 9 ? "9+" : group.unreadCount}
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p
                  className={`font-medium truncate ${isActive
                    ? "text-purple-900 dark:text-purple-100"
                    : "text-gray-900 dark:text-white"
                    }`}>
                  {group.name}
                </p>
                <Badge
                  variant={group.status === "joined" ? "success" : "warning"}
                  size="xs">
                  {group.status === "joined" ? "Đã tham gia" : "Chờ duyệt"}
                </Badge>
              </div>

              {group.lastMessage && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(group.lastMessage.timestamp)}
                </span>
              )}
            </div>

            {group.lastMessage ? (
              <p
                className={`text-sm truncate mt-1 ${group.unreadCount > 0
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-500 dark:text-gray-400"
                  }`}>
                {group.lastMessage.senderName}: {group.lastMessage.content}
              </p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Nhóm mới tạo
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 sm:w-96 bg-white dark:bg-[#1C1C1E] border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tin nhắn
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("dms")}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "dms"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}>
                <div className="flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Tin nhắn</span>
                  {filteredConversations.length > 0 && (
                    <Badge variant="secondary" size="xs">
                      {filteredConversations.length}
                    </Badge>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("groups")}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "groups"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Nhóm</span>
                  {filteredGroups.length > 0 && (
                    <Badge variant="secondary" size="xs">
                      {filteredGroups.length}
                    </Badge>
                  )}
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "dms" ? (
                <>
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {searchQuery
                          ? "Không tìm thấy cuộc trò chuyện"
                          : "Chưa có tin nhắn nào"}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <GroupItem key={group.id} group={group} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {searchQuery
                          ? "Không tìm thấy nhóm"
                          : "Chưa tham gia nhóm nào"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
