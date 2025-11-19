import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Menu, X, Home, BookOpen, Target, BarChart3 } from "lucide-react";
import Avatar from "../atoms/Avatar";
import { useNavigate } from "react-router-dom";

const MobileNavBar = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const { user, isFirstMount } = useSelector((state) => state.auth);
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationItems = [
        { key: "knowledge", label: t("nav.knowledge"), icon: BookOpen, gradient: "from-purple-500 to-pink-600", textColor: "text-purple-600 dark:text-pink-400", bgColor: "bg-purple-50 dark:bg-pink-900/20", hoverBg: "hover:bg-purple-100 dark:hover:bg-pink-800/30" },
        { key: "challenge", label: t("nav.challenge"), icon: Target, gradient: "from-red-500 to-orange-600", textColor: "text-red-600 dark:text-orange-400", bgColor: "bg-red-50 dark:bg-orange-900/20", hoverBg: "hover:bg-red-100 dark:hover:bg-orange-800/30" },
        { key: "statistics", label: t("nav.home"), icon: BarChart3, gradient: "from-blue-500 to-indigo-600", textColor: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20", hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-800/30" },
        // { key: "progress", label: t("nav.progress"), icon: TrendingUp, gradient: "from-green-500 to-teal-600", textColor: "text-green-600 dark:text-teal-400", bgColor: "bg-green-50 dark:bg-teal-900/20", hoverBg: "hover:bg-green-100 dark:hover:bg-teal-800/30" },
        // { key: "mood", label: t("nav.mood"), icon: Heart, gradient: "from-cyan-500 to-blue-600", textColor: "text-cyan-600 dark:text-blue-400", bgColor: "bg-cyan-50 dark:bg-blue-900/20", hoverBg: "hover:bg-cyan-100 dark:hover:bg-blue-800/30" },
        // { key: "wellbeingtools", label: t("nav.wellbeingtools"), icon: Sparkles, gradient: "from-gray-500 to-slate-600", textColor: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-50 dark:bg-gray-900/20", hoverBg: "hover:bg-gray-100 dark:hover:bg-gray-800/30" },
    ];

    const handleTabClick = (key) => {
        onTabChange(key);
        setIsMenuOpen(false);
    };

    // Show only top 5 items in bottom nav (scrollable horizontally)
    const bottomNavItems = navigationItems.slice(0, 5);

    return (
        <>
            {/* Top NavBar - Header */}
            <motion.nav
                initial={isFirstMount ? { y: -100, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800/50 md:hidden"
            >
                <div className="px-4 flex items-center justify-between h-14">
                    {/* Logo Section */}
                    <motion.div
                        initial={isFirstMount ? { scale: 0.9, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
                        onClick={() => navigate("/space")}
                    >
                        <img
                            src="/knowledge/emo1.png"
                            alt="Emo QC"
                            className="w-12 h-12 rounded-full object-cover transition-transform duration-300 active:scale-95"
                        />
                        <div>
                            <h1 className="text-xl font-semibold bg-pink-300 bg-clip-text text-transparent">
                                EmoSpace
                            </h1>
                        </div>
                    </motion.div>

                    {/* Menu Button & User Actions */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        {/* <div className="flex items-center space-x-1">
                            <ThemeToggle />
                            <LanguageSwitcher variant="no-icon" />
                        </div> */}
                        <div className="relative flex-shrink-0">
                            <Avatar username={user?.username || "Anonymous"} size="sm" />
                            <motion.div
                                className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed top-14 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg md:hidden"
                >
                    <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {navigationItems.map((item) => {
                            const isActive = activeTab === item.key;
                            return (
                                <motion.button
                                    key={item.key}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTabClick(item.key)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] ${isActive ? `${item.textColor} ${item.bgColor}` : `text-gray-600 dark:text-gray-300 ${item.hoverBg}`}`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobileActiveIndicator"
                                            className="w-2 h-2 rounded-full bg-current"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    navigate("/AIChatBoxWithEmo", { replace: true });
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all min-h-[44px]"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Quay về home
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Bottom NavBar - Navigation */}
            <motion.nav
                initial={isFirstMount ? { y: 100, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800/50 md:hidden pb-safe-area-inset-bottom"
            >
                <div className="flex items-center justify-around px-2 py-2">
                    {bottomNavItems.map((item) => {
                        const isActive = activeTab === item.key;
                        const IconComponent = item.icon;
                        return (
                            <motion.button
                                key={item.key}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onTabChange(item.key)}
                                className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all duration-300 min-h-[44px] ${isActive
                                    ? `${item.textColor}`
                                    : "text-gray-600 dark:text-gray-400"
                                    }`}
                                title={item.label}
                            >
                                <IconComponent
                                    className={`w-6 h-6 ${isActive ? "scale-110" : ""}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomActiveIndicator"
                                        className={`w-1.5 h-1.5 rounded-full mt-1 ${item.key === "statistics" ? "bg-blue-600 dark:bg-blue-400" :
                                            item.key === "knowledge" ? "bg-purple-600 dark:bg-pink-400" :
                                                item.key === "challenge" ? "bg-red-600 dark:bg-orange-400" :
                                                    item.key === "progress" ? "bg-green-600 dark:bg-teal-400" :
                                                        item.key === "mood" ? "bg-cyan-600 dark:bg-blue-400" :
                                                            "bg-gray-600 dark:bg-gray-400"
                                            }`}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                    {/* More button for remaining items */}
                    {navigationItems.length > 5 && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all duration-300 min-h-[44px] ${isMenuOpen
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-600 dark:text-gray-400"
                                }`}
                            title="More"
                        >
                            <Menu className={`w-6 h-6 ${isMenuOpen ? "scale-110" : ""}`} strokeWidth={isMenuOpen ? 2.5 : 2} />
                            {isMenuOpen && (
                                <motion.div
                                    layoutId="bottomMoreIndicator"
                                    className="w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400 mt-1"
                                />
                            )}
                        </motion.button>
                    )}
                </div>
            </motion.nav>
        </>
    );
};

export default MobileNavBar;
