import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Sun,
  Shield,
  Bell,
  Lock,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Eye,
  Smartphone,
  Play,
  Languages,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useIntroStatus } from "../hooks/useIntroStatus";
import Button from "../components/atoms/Button";
import { toggleTheme, toggleSafeMode } from "../store/themeSlice";
import { logout } from "../store/authSlice";
import LanguageSwitcher from "../components/molecules/LanguageSwitcher";

const MobileSettingsPage = ({ onBack }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isDarkMode, isSafeMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const { resetIntroStatus } = useIntroStatus();

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    messages: true,
    groups: false,
  });

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      dispatch(logout());
    }
  };

  const handleViewIntro = () => {
    resetIntroStatus();
    // Optionally trigger a page reload to show intro
    window.location.reload();
  };

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    action,
    actionType = "navigate",
    value,
  }) => {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="flex items-center p-4 bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={action}>
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center">
          {actionType === "toggle" && (
            <div
              className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                }`}>
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${value ? "translate-x-6" : "translate-x-0"
                  }`}></div>
            </div>
          )}
          {actionType === "navigate" && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
          {actionType === "info" && value && (
            <span className="text-base text-gray-500 dark:text-gray-400">
              {value}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  const SettingSection = ({ title, children }) => (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
        {title}
      </h2>
      <div className="bg-white dark:bg-[#1C1C1E] rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="flex flex-col h-dvh bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-[#1C1C1E] border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("settings.title")}
          </h1>
          <div className="w-9"></div> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Account Section */}
        <SettingSection title={t("settings.account")}>
          <SettingItem
            icon={User}
            title={t("settings.accountProfile")}
            description={t("settings.accountProfileDesc")}
            actionType="navigate"
            action={() => { }}
          />
          <SettingItem
            icon={Lock}
            title={t("settings.accountSecurity")}
            description={t("settings.accountSecurityDesc")}
            actionType="navigate"
            action={() => { }}
          />
        </SettingSection>
        {/* Appearance Section */}
        <SettingSection title={t("settings.appearance")}>
          <SettingItem
            icon={isDarkMode ? Sun : Moon}
            title={t("settings.appearanceTheme")}
            description={t("settings.appearanceThemeDesc")}
            actionType="toggle"
            value={isDarkMode}
            action={() => dispatch(toggleTheme())}
          />
          <SettingItem
            icon={Shield}
            title={t("settings.privacySafeMode")}
            description={t("settings.privacySafeModeDesc")}
            actionType="toggle"
            value={isSafeMode}
            action={() => dispatch(toggleSafeMode())}
          />
          <div className="flex items-center p-4 bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
              <Languages className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t("settings.appearanceLanguage")}
              </h3>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                {t("settings.appearanceLanguageDesc")}
              </p>
            </div>
            <div className="flex items-center">
              <LanguageSwitcher variant="compact" className="mr-2" />
            </div>
          </div>
          <SettingItem
            icon={Eye}
            title={t("settings.display")}
            description={t("settings.displayDesc")}
            actionType="navigate"
            action={() => { }}
          />
        </SettingSection>
        {/* Privacy Section */}
        <SettingSection title={t("settings.privacy")}>
          <SettingItem
            icon={Globe}
            title={t("settings.privacy")}
            description={t("settings.privacyDesc")}
            actionType="navigate"
            action={() => { }}
          />
          <SettingItem
            icon={Bell}
            title={t("settings.notifications")}
            description={t("settings.notificationsDesc")}
            actionType="navigate"
            action={() => { }}
          />
        </SettingSection>
        {/* App Section */}
        <SettingSection title={t("settings.application")}>
          <SettingItem
            icon={Play}
            title={t("settings.viewIntro")}
            description={t("settings.viewIntroDesc")}
            actionType="navigate"
            action={handleViewIntro}
          />
          <SettingItem
            icon={Smartphone}
            title={t("settings.applicationVersion")}
            description={t("settings.applicationVersionDesc")}
            actionType="info"
            value="v1.0.0"
            action={() => { }}
          />
          <SettingItem
            icon={HelpCircle}
            title={t("settings.applicationSupport")}
            description={t("settings.applicationSupportDesc")}
            actionType="navigate"
            action={() => { }}
          />
        </SettingSection>
        {/* Account Actions */}
        <SettingSection title={t("settings.actions")}>
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer"
            onClick={handleLogout}>
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full mr-3">
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-red-600 dark:text-red-400">
                {t("settings.actionsLogout")}
              </h3>
              <p className="text-base text-red-500 dark:text-red-400 mt-1">
                {t("settings.actionsLogoutDesc")}
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-red-400" />
          </motion.div>
        </SettingSection>
        <div className="h-16"></div> {/* Bottom spacing */}
      </div>
    </motion.div>
  );
};

export default MobileSettingsPage;
