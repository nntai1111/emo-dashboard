import React from "react";
import { motion } from "framer-motion";
import { Home, Shield, Settings, Bell, User, MessageCircle } from "lucide-react";
import Button from "../atoms/Button";

const MobileNavBar = ({
  activeTab = "home",
  onTabChange,
  unreadMessages = 0,
  unreadNotifications = 0,
}) => {
  const navItems = [
    { id: "home", icon: Home, label: "Trang chủ", enabled: true },
    // { id: "chat", icon: MessageCircle, label: "Chat", enabled: true, badge: unreadMessages },
    { id: "notifications", icon: Bell, label: "Thông báo", enabled: true, badge: unreadNotifications },
    // { id: "settings", icon: Settings, label: "Cài đặt", enabled: true },
    { id: "community-rules", icon: Shield, label: "Quy tắc", enabled: true },
    { id: "profile", icon: User, label: "Hồ sơ", enabled: true },
  ];


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1C1C1E] border-t border-gray-200 dark:border-gray-700 z-40 md:hidden pb-safe-area-inset-bottom">
      {/* Gạch ngang phân cách */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

      <div className="flex items-center justify-around px-2 sm:px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = !item.enabled;

          return (
            <motion.div
              key={item.id}
              whileTap={isDisabled ? {} : { scale: 0.9 }}
              className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={isDisabled ? undefined : () => onTabChange?.(item.id)}
                disabled={isDisabled}
                className={`flex flex-col items-center space-y-1.5 p-2 sm:p-3 min-w-[60px] sm:min-w-[70px] relative ${isDisabled
                  ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                  : isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                  }`}>
                <div className="relative">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  {item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-full w-3 h-3 flex items-center justify-center">
                    </motion.div>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:block">{item.label}</span>
              </Button>
              {isActive && item.enabled && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 mx-auto w-8 sm:w-10 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default MobileNavBar;
