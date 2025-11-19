import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../organisms/Sidebar";
import MobileNavBar from "../molecules/MobileNavBar";
import ChatSidebar from "../organisms/ChatSidebar";
import NotificationSystem from "../organisms/NotificationSystem";
import GiftReceivedEffect from "../molecules/GiftReceivedEffect";
import { useGiftReceivedEffect } from "../../hooks/useGiftReceivedEffect";
import { setFirstMountFalse } from "../../store/authSlice";
import { NotificationService } from "../../services/notificationService";
import AuthRedirect from "../../services/AuthRedirect";

// Layout is used for community (authenticated) routes. It receives
// `isAuthenticated` from the router (App.jsx). If the user is not
// authenticated we should redirect to the onboarding flow.
const Layout = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <AuthRedirect />;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFirstMount } = useSelector((state) => state.auth);
  const authUser = useSelector((state) => state.auth.user);
  const aliasId = useMemo(() => authUser?.aliasId || authUser?.id, [authUser]);
  const [giftActorName, setGiftActorName] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { t } = useTranslation();

  // Badge counts
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const isPollingRef = useRef(false); // Ngăn +1 khi đang poll

  // Gift received effect
  const { showGiftEffect, giftData, hideGiftEffect } = useGiftReceivedEffect();

  // Mock unread messages
  const mockConversations = [
    { id: "dm_1", unreadCount: 2 },
    { id: "group_1", unreadCount: 5 },
  ];
  const totalUnreadMessages = mockConversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  // -----------------------------------------------------------------
  // 1. Resize + custom event listener (Nav lắng nghe)
  // -----------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    const handleUnread = (e) => {
      const { count } = e.detail || {};
      if (typeof count === "number") setUnreadNotificationsCount(count);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("app:noti:unread", handleUnread);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("app:noti:unread", handleUnread);
    };
  }, []);

  // -----------------------------------------------------------------
  // 2. NotificationService – realtime + REST (Giữ nguyên toast của bạn)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!aliasId) return;

    const service = new NotificationService(aliasId);
    let mounted = true;

    // Realtime callback – giữ nguyên toast gốc
    const realtimeCallback = (n) => {
      if (!mounted) return;

      setGiftActorName(n.actorDisplayName);

      // Check if it's a gift notification (type 8)
      if (n.type === 8) {
        try {
          window.dispatchEvent(new CustomEvent('app:gift:received', {
            detail: {
              type: 'gift',
              notificationType: 8,
              actorDisplayName: n.actorDisplayName,
              message: n.snippet || 'Bạn đã nhận được một món quà!',
              data: n
            }
          }));
        } catch (error) {
          console.error('❌ Error dispatching gift event:', error);
        }
      }

      // Giữ nguyên toast của bạn 100%
      try {
        window.dispatchEvent(new CustomEvent('app:toast', {
          detail: {
            type: 'info',
            title: n.actorDisplayName || 'Thông báo',
            message: n.snippet || '',
            duration: 2000,
            notificationType: n.type
          }
        }));
      } catch { }

      // Chỉ tăng badge nếu không đang poll
      if (!isPollingRef.current) {
        setUnreadNotificationsCount((c) => {
          const next = (c || 0) + 1;
          dispatchUnreadBadge(next);
          return next;
        });
      }
    };

    // Kết nối realtime + REST
    (async () => {
      try {
        await service.connect(realtimeCallback);
      } catch {
        // realtime fail → vẫn dùng REST
      }

      // Lấy số lượng chưa đọc ban đầu (REST)
      try {
        isPollingRef.current = true;
        const count = await service.getUnreadCount(); // ĐÃ SỬA LỖI: xóa `g.`
        if (mounted) {
          setUnreadNotificationsCount(count || 0);
          dispatchUnreadBadge(count || 0);
        }

      } catch {
        // ignore
      } finally {
        isPollingRef.current = false;
      }
    })();

    return () => {
      mounted = false;
      try {
        service.disconnect();
      } catch { }
    };
  }, [aliasId]);


  // -----------------------------------------------------------------
  // 3. Dispatch badge event
  // -----------------------------------------------------------------
  const dispatchUnreadBadge = (count) => {
    try {
      window.dispatchEvent(
        new CustomEvent("app:noti:unread", { detail: { count } })
      );
    } catch { }
  };

  // -----------------------------------------------------------------
  // 4. First mount
  // -----------------------------------------------------------------
  useEffect(() => {
    if (isFirstMount) dispatch(setFirstMountFalse());
  }, [dispatch, isFirstMount]);

  // -----------------------------------------------------------------
  // 5. Sync activeTab với URL
  // -----------------------------------------------------------------
  useEffect(() => {
    const path = location.pathname;
    if (path === "/home") setActiveTab("home");
    else if (path === "/notifications") setActiveTab("notifications");
    else if (path === "/profile") setActiveTab("profile");
    else if (path === "/community-rules") setActiveTab("community-rules");
  }, [location.pathname]);

  // -----------------------------------------------------------------
  // 6. Tab navigation
  // -----------------------------------------------------------------
  const handleTabChange = (tab) => {
    const map = {
      home: "/home",
      notifications: "/notifications",
      profile: "/profile",
      "community-rules": "/community-rules",
    };
    if (map[tab]) {
      setActiveTab(tab);
      navigate(map[tab]);
    }
  };

  const handleCollapseChange = (collapsed) => setIsSidebarCollapsed(collapsed);

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen dark:bg-black pb-16 md:pb-0 relative overflow-hidden z-10">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-64 h-64 sm:w-96 sm:h-96 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 180, 90] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/2 w-64 h-64 sm:w-96 sm:h-96 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{ scale: [1, 1.3, 1], rotate: [180, 270, 180] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex relative z-20">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadMessages={totalUnreadMessages}
          unreadNotifications={unreadNotificationsCount}
          onCollapseChange={handleCollapseChange}
        />

        <div
          className={`flex-1 ${!isMobile ? (isSidebarCollapsed ? "ml-20" : "ml-80") : ""
            } relative z-20 transition-all duration-300`}>
          <div className="w-full">
            <Outlet
              context={{
                handleNavigateToChat: (id) =>
                  navigate(`/chat${id ? `?id=${id}` : ""}`),
              }}
            />
          </div>
        </div>
      </div>

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {isMobile && (
        <MobileNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadMessages={totalUnreadMessages}
          unreadNotifications={unreadNotificationsCount}
        />
      )}

      <NotificationSystem />
      <GiftReceivedEffect
        isVisible={showGiftEffect}
        giftId={giftData?.giftId}
        giftName={giftData?.snippet ? giftData.snippet.split(': ')[1] : null}
        actorDisplayName={giftActorName}
        onComplete={hideGiftEffect}
      />
      {/* <NotificationTest /> */}
    </div>
  );
};

export default Layout;