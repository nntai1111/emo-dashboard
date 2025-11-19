import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../organisms/NavbarSpace"; // Thay Sidebar bằng Navbar
import MobileNavBar from "../organisms/MobileNavBarSpace";
import { setFirstMountFalse } from "../../store/authSlice";
import KnowledgeBreadcrumb from "../molecules/KnowledgeBreadcrumb";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";
import NotificationSystem from "../organisms/NotificationSystem";
import AuthRedirect from "@/services/AuthRedirect";

const Layout = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <AuthRedirect />;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFirstMount } = useSelector((state) => state.auth);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("knowledge");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation();

  // Mock data for unread counts
  const mockConversations = [
    { id: "dm_1", unreadCount: 2 },
    { id: "group_1", unreadCount: 5 },
  ];
  const totalUnreadMessages = mockConversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );
  const unreadNotificationsCount = 2;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isFirstMount) {
      dispatch(setFirstMountFalse());
    }
  }, [dispatch, isFirstMount]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "statistics":
        navigate("/space/statistics");
        break;
      case "knowledge":
        navigate("/space/knowledge");
        break;
      case "challenge":
        navigate("/space/challenge");
        break;
      default:
        navigate(`/space/${tab}`);
    }
  };

  const location = useLocation();

  // Xác định activeTab dựa trên route
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/space" || pathname === "/space/") {
      navigate("/space/knowledge", { replace: true });
    } else if (pathname.includes("statistics")) {
      setActiveTab("statistics");
    } else if (pathname.includes("challenge")) {
      setActiveTab("challenge");
    } else if (pathname.includes("knowledge")) {
      setActiveTab("knowledge");
    }
  }, [location.pathname, navigate]);

  // const { breadcrumb } = useBreadcrumb();
  const pathnames = location.pathname.split("/").filter((x) => x);
  // Ưu tiên breadcrumb từ context nếu có, nếu không thì lấy từ URL
  const category = pathnames[0] ? pathnames[0] : "Home";
  const topic = pathnames[1] ? pathnames[1] : null;
  const article = pathnames[2] ? pathnames[2] : null;
  // const category = breadcrumb.category || (pathnames[0] ? pathnames[0] : "Home");
  // const topic = breadcrumb.topic || (pathnames[1] ? pathnames[1] : null);
  // const article = breadcrumb.article || (pathnames[2] ? pathnames[2] : null);
  return (
    <div className="min-h-screen dark:bg-gray-900 pb-20 md:pb-0 relative overflow-hidden z-10">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-96 h-96 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 180, 90] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/2 w-96 h-96 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{ scale: [1, 1.3, 1], rotate: [180, 270, 180] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="flex flex-col relative z-20">
        {/* Thay Sidebar bằng Navbar */}
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
        {/* Mobile NavBar ở top */}
        {isMobile && (
          <MobileNavBar activeTab={activeTab} onTabChange={handleTabChange} />
        )}
        {/* Breadcrumb luôn ở đầu mỗi trang - chỉ hiển thị trên desktop */}
        {!isMobile && (
          <div className="w-full max-w-5xl mx-auto px-4 pt-4">
            <KnowledgeBreadcrumb
              category={category}
              topic={topic}
              article={article}
              onNavigate={() => {}}
            />
          </div>
        )}
        <div className={`flex-1 ${isMobile ? "pt-16 mt-0" : "mt-4 md:mt-8"}`}>
          {" "}
          {/* Padding-top cho mobile để tránh bị top navbar che */}
          <div className="mx-auto">
            <Outlet
              context={{
                handleNavigateToChat: (id) =>
                  navigate(`/chat${id ? `?id=${id}` : ""}`),
              }}
            />
          </div>
        </div>
      </div>
      <NotificationSystem />
    </div>
  );
};

export default Layout;