import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MessageCircle, Users, Bell, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import { NotificationService } from "../services/notificationService";

const MobileNotificationsPage = ({ onBack }) => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const aliasId = useMemo(() => authUser?.aliasId || authUser?.id, [authUser]);
  const [filter, setFilter] = useState("all");
  const [realtimeService, setRealtimeService] = useState(null);
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!aliasId) return;
    const service = new NotificationService(aliasId);
    setRealtimeService(service);

    let mounted = true;
    (async () => {
      try {
        await service.connect((n) => {
          if (!mounted) return;
          setRealtimeNotifications((prev) => [n, ...prev]);
          setUnreadCount((c) => {
            const next = (c || 0) + 1;
            try {
              window.dispatchEvent(new CustomEvent('app:noti:unread', { detail: { count: next } }));
              window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'info', title: n.actorDisplayName || 'Thông báo', message: n.snippet || '', duration: 2000, notificationType: n.type } }));
            } catch { }
            return next;
          });
        });
      } catch { }

      // Always load REST data regardless of realtime success
      try {
        const list = await service.getNotifications(20);
        if (mounted) {
          setRealtimeNotifications(list.items || []);

        }
        const count = await service.getUnreadCount();
        if (mounted) {
          setUnreadCount(count || 0);
          try { window.dispatchEvent(new CustomEvent('app:noti:unread', { detail: { count: count || 0 } })); } catch { }
        }
      } catch { }
    })();

    return () => {
      mounted = false;
      service.disconnect();
    };
  }, [aliasId]);

  // Get notification type info based on numeric type
  const getNotificationTypeInfo = (type) => {
    switch (type) {
      case 1: // Reaction
        return {
          icon: <Heart className="w-4 h-4 text-red-500" />,
          message: "đã thích bài viết của bạn",
          filterKey: "1"
        };
      case 2: // Comment
        return {
          icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
          message: "đã bình luận về bài viết của bạn",
          filterKey: "2"
        };
      case 3: // Mention
        return {
          icon: <MessageCircle className="w-4 h-4 text-purple-500" />,
          message: "đã nhắc đến bạn trong một bình luận",
          filterKey: "3"
        };
      case 4: // Follow
        return {
          icon: <Users className="w-4 h-4 text-green-500" />,
          message: "đã theo dõi bạn",
          filterKey: "4"
        };
      case 5: // Moderation
        return {
          icon: <Bell className="w-4 h-4 text-orange-500" />,
          message: "thông báo kiểm duyệt",
          filterKey: "all"
        };
      case 6: // BotReply
        return {
          icon: <MessageCircle className="w-4 h-4 text-cyan-500" />,
          message: "đã trả lời tự động",
          filterKey: "all"
        };
      case 7: // System
        return {
          icon: <Bell className="w-4 h-4 text-gray-500" />,
          message: "thông báo hệ thống",
          filterKey: "all"
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-gray-500" />,
          message: "thông báo mới",
          filterKey: "all"
        };
    }
  };

  const filters = [
    { id: "all", label: "Tất cả", icon: Bell },
    { id: "1", label: "Lượt thích", icon: Heart },
    { id: "2", label: "Bình luận", icon: MessageCircle },
  ];

  const getFilteredNotifications = () => {
    // Use real notifications from API
    const notificationsToFilter = realtimeNotifications.length > 0
      ? realtimeNotifications
      : [];

    if (filter === "all") {
      return notificationsToFilter;
    }

    return notificationsToFilter.filter((n) => {
      const typeInfo = getNotificationTypeInfo(n.type);
      return typeInfo.filterKey === filter;
    });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = (now - time) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} phút trước`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / (24 * 60))} ngày trước`;
    }
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="flex flex-col h-dvh bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Thông báo
          </h1>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-base text-purple-600"
              onClick={async () => {
                try {
                  if (realtimeService) {
                    await realtimeService.markAllAsRead();
                    setUnreadCount(0);
                    setRealtimeNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
                    window.dispatchEvent(new CustomEvent('app:noti:unread', { detail: { count: 0 } }));
                  }
                } catch { }
              }}
            >
              <Check className="w-4 h-4 mr-1" />
              Đánh dấu đã đọc
            </Button>
          )}
        </div>

        {/* Filters - Show only 3 main filters */}
        <div className="flex space-x-2 pb-2">
          {filters.slice(0, 3).map((filterItem) => {
            const Icon = filterItem.icon;
            return (
              <Button
                key={filterItem.id}
                variant={filter === filterItem.id ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFilter(filterItem.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 min-w-0">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs truncate">{filterItem.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {getFilteredNotifications().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có thông báo
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Khi có thông báo mới, chúng sẽ xuất hiện ở đây
            </p>
          </div>
        ) : (
          getFilteredNotifications().map((notification) => {
            const displayName = notification.actorDisplayName || notification.user?.username || "Người dùng";
            const isRead = typeof notification.isRead === 'boolean' ? notification.isRead : !!notification.read;
            const createdAt = notification.createdAt || notification.timestamp;
            const snippet = notification.snippet || notification.content || "";
            const typeInfo = getNotificationTypeInfo(notification.type);

            // Tách snippet thành 2 phần: trước dấu : và sau dấu :
            const splitSnippet = (snippet) => {
              if (!snippet) return { beforeColon: '', afterColon: '' };

              const colonIndex = snippet.indexOf(':');
              if (colonIndex !== -1) {
                return {
                  beforeColon: snippet.substring(0, colonIndex).trim(),
                  afterColon: snippet.substring(colonIndex + 1).trim()
                };
              }
              return {
                beforeColon: '',
                afterColon: snippet
              };
            };

            const snippetParts = splitSnippet(snippet);

            const handleNotificationClick = async () => {
              // Mark as read if not already read
              if (!isRead && realtimeService) {
                try {
                  await realtimeService.markSingleAsRead(notification.id);
                  setRealtimeNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                  );
                  setUnreadCount(prev => Math.max(0, prev - 1));
                  // Update global unread count
                  window.dispatchEvent(new CustomEvent('app:noti:unread', {
                    detail: { count: Math.max(0, unreadCount - 1) }
                  }));
                } catch (error) {
                  console.error('Failed to mark notification as read:', error);
                }
              }

              // Navigate to post if available
              if (notification.postId) {
                navigate(`/post/${notification.postId}`);
              }
            };

            return (
              <motion.div
                key={notification.id}
                whileTap={{ scale: 0.98 }}
                className={`flex items-start p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1C1C1E]/50 ${!isRead ? "bg-purple-50 dark:bg-purple-900/10" : ""
                  }`}
                onClick={handleNotificationClick}>
                <div className="relative mr-3">
                  <Avatar
                    username={displayName}
                    size="md"
                    online={notification.user?.isOnline || false}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1C1C1E] rounded-full p-1">
                    {typeInfo.icon}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base text-gray-900 dark:text-white">
                        <span className="font-semibold">{displayName}</span>
                        {/* <span className="ml-1">{typeInfo.message}</span> */}
                        {snippetParts.beforeColon && (
                          <span className="ml-1">: {snippetParts.beforeColon}</span>
                        )}
                      </p>

                      {/* Show snippet below the main message */}
                      {snippetParts.afterColon && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <p className="text-base text-gray-600 dark:text-gray-300">
                            {snippetParts.afterColon}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end ml-2">
                      <span className="text-base text-gray-500">
                        {formatTime(createdAt)}
                      </span>
                      {!isRead && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </motion.div>
  );
};

export default MobileNotificationsPage;
