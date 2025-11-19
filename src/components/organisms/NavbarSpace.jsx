import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Home, BookOpen, Target, BarChart3 } from "lucide-react";
import Avatar from "../atoms/Avatar";
import { useNavigate } from "react-router-dom";

const Navbar = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const { user, isFirstMount } = useSelector((state) => state.auth);
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) return null; // Hide Navbar on mobile, use MobileNavBar

    const navigationItems = [
        { key: "knowledge", label: t("nav.knowledge"), icon: BookOpen, gradient: "from-purple-500 to-pink-600", textColor: "text-purple-600 dark:text-pink-400", bgColor: "bg-purple-50 dark:bg-pink-900/20", hoverBg: "hover:bg-purple-100 dark:hover:bg-pink-800/30" },
        { key: "challenge", label: t("nav.challenge"), icon: Target, gradient: "from-red-500 to-orange-600", textColor: "text-red-600 dark:text-orange-400", bgColor: "bg-red-50 dark:bg-orange-900/20", hoverBg: "hover:bg-red-100 dark:hover:bg-orange-800/30" },
        { key: "statistics", label: t("nav.home"), icon: BarChart3, gradient: "from-blue-500 to-indigo-600", textColor: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20", hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-800/30" },
        // { key: "progress", label: t("nav.progress"), gradient: "from-green-500 to-teal-600", textColor: "text-green-600 dark:text-teal-400", bgColor: "bg-green-50 dark:bg-teal-900/20", hoverBg: "hover:bg-green-100 dark:hover:bg-teal-800/30" },
        // { key: "mood", label: t("nav.mood"), gradient: "from-cyan-500 to-blue-600", textColor: "text-cyan-600 dark:text-blue-400", bgColor: "bg-cyan-50 dark:bg-blue-900/20", hoverBg: "hover:bg-cyan-100 dark:hover:bg-blue-800/30" },
        // { key: "wellness-hub", label: t("nav.wellness-hub"), gradient: "from-lime-500 to-emerald-600", textColor: "text-lime-600 dark:text-lime-400", bgColor: "bg-lime-50 dark:bg-lime-900/20", hoverBg: "hover:bg-lime-100 dark:hover:bg-lime-800/30" },
        // { key: "wellbeingtools", label: t("nav.wellbeingtools"), gradient: "from-gray-500 to-slate-600", textColor: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-50 dark:bg-gray-900/20", hoverBg: "hover:bg-gray-100 dark:hover:bg-gray-800/30" },
    ];

    return (
        <motion.nav
            initial={isFirstMount ? { y: -100, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800/50 "
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center h-16">
                {/* Logo Section - Left column */}
                <motion.div
                    initial={isFirstMount ? { scale: 0.9, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center space-x-3 cursor-pointer justify-start"
                    onClick={() => navigate("/space")}
                >
                    <img
                        src="/knowledge/emo1.png"
                        alt="Emo QC"
                        className="w-16 h-16 rounded-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="hidden md:block">
                        <h1 className="text-xl font-semibold bg-pink-300 bg-clip-text text-transparent">
                            EmoSpace
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Không gian cảm xúc – nơi bạn học, chia sẻ và thử thách bản thân</p>
                    </div>
                </motion.div>

                {/* Navigation Items - Centered column */}
                <div className="flex items-center justify-center space-x-1">
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                        {navigationItems.map((item, index) => {
                            const isActive = activeTab === item.key;
                            return (
                                <motion.button
                                    key={item.key}
                                    initial={isFirstMount ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                                    onClick={() => onTabChange(item.key)}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? `${item.textColor} ${item.bgColor} scale-105` : `text-gray-600 dark:text-gray-300 ${item.hoverBg}`}`}
                                >
                                    {item.icon && (
                                        <item.icon className="w-4 h-4 mr-2" />
                                    )}
                                    <span className="whitespace-nowrap">{item.label}</span>
                                    {item.badge > 0 && (
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="ml-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                            {item.badge}
                                        </motion.span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* User Info & Settings - Right column */}
                <motion.div
                    initial={isFirstMount ? { opacity: 0, x: 20 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex items-center space-x-2 justify-end"
                >
                    {/* 
                    <div className="flex items-center space-x-1 flex-shrink-0">
                        <ThemeToggle />
                        <LanguageSwitcher variant="no-icon" />

                    </div> */}
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-shrink-0">
                            <Avatar username={user?.username || "Anonymous"} size="sm" />
                            <motion.div
                                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        {/* <div className="hidden md:block min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                                {user?.username || "Anonymous"}
                            </p>
                            <div className="flex items-center text-xs text-green-500 dark:text-green-400">
                                <motion.span
                                    className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 flex-shrink-0"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span className="truncate">Online</span>
                            </div>
                        </div> */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/AIChatBoxWithEmo", { replace: true })}
                            className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 flex-shrink-0"
                            title="Quay về home"
                        >
                            <Home className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.nav>
    );
};

export default Navbar;