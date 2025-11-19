import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Search,
  X,
  ChevronLeft,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { useSelector } from "react-redux";

const DesktopChat = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const conversations = [
    {
      id: 1,
      user: {
        name: "Dream Chaser",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b829?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        isOnline: true,
        lastSeen: "Active now",
      },
      lastMessage: "That sounds amazing! 🌟",
      timestamp: "2m ago",
      unreadCount: 2,
      messages: [
        {
          id: 1,
          senderId: 1,
          content: "Hey! How's your day going?",
          timestamp: "10:30 AM",
          isMine: false,
        },
        {
          id: 2,
          senderId: "me",
          content: "It's been great! Working on some exciting projects.",
          timestamp: "10:32 AM",
          isMine: true,
        },
        {
          id: 3,
          senderId: 1,
          content: "That sounds amazing! 🌟",
          timestamp: "10:35 AM",
          isMine: false,
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Coding Ninja",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        isOnline: false,
        lastSeen: "2h ago",
      },
      lastMessage: "Sure, let's discuss tomorrow",
      timestamp: "1h ago",
      unreadCount: 0,
      messages: [
        {
          id: 4,
          senderId: 2,
          content: "Can we schedule a meeting?",
          timestamp: "Yesterday 8:30 PM",
          isMine: false,
        },
        {
          id: 5,
          senderId: "me",
          content: "Sure, let's discuss tomorrow",
          timestamp: "Yesterday 8:45 PM",
          isMine: true,
        },
      ],
    },
    {
      id: 3,
      user: {
        name: "Tech Explorer",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        isOnline: true,
        lastSeen: "Active now",
      },
      lastMessage: "Thanks for the help! 💪",
      timestamp: "5h ago",
      unreadCount: 1,
      messages: [
        {
          id: 6,
          senderId: 3,
          content: "I'm struggling with this bug",
          timestamp: "Today 2:00 PM",
          isMine: false,
        },
        {
          id: 7,
          senderId: "me",
          content: "Let me take a look at your code",
          timestamp: "Today 2:15 PM",
          isMine: true,
        },
        {
          id: 8,
          senderId: 3,
          content: "Thanks for the help! 💪",
          timestamp: "Today 3:30 PM",
          isMine: false,
        },
      ],
    },
  ];

  const [activeChat, setActiveChat] = useState(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      senderId: "me",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMine: true,
    };

    // This would normally update the conversation in your state/store
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[600px] bg-white dark:bg-[#1C1C1E] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Messages
              </h2>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                onClick={() => setSelectedChat(conversation)}
                className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${selectedChat?.id === conversation.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                  }`}>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar src={conversation.user.avatar} size="md" />
                    {conversation.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversation.user.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar src={selectedChat.user.avatar} size="sm" />
                      {selectedChat.user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {selectedChat.user.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedChat.user.isOnline
                          ? "Active now"
                          : selectedChat.user.lastSeen}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMine ? "justify-end" : "justify-start"
                      }`}>
                    <div
                      className={`max-w-xs lg:max-w-md ${msg.isMine ? "order-2" : "order-1"
                        }`}>
                      {!msg.isMine && (
                        <Avatar
                          src={selectedChat.user.avatar}
                          size="xs"
                          className="mb-1"
                        />
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${msg.isMine
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                          }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p
                        className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.isMine ? "text-right" : "text-left"
                          }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-end space-x-3">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-3 py-2 bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-600 rounded-lg resize-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      rows="1"
                      style={{ minHeight: "2.5rem", maxHeight: "6rem" }}
                    />
                  </div>

                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a conversation to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopChat;
