import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Sun, Moon, Shield, ShieldOff } from "lucide-react";
import { toggleTheme, toggleSafeMode } from "../../store/themeSlice";
import { aliasPreferencesService } from "../../services/apiService";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";

const ThemeToggle = ({ showSafeToggle = true }) => {
  const dispatch = useDispatch();
  const { isDarkMode, isSafeMode } = useSelector((state) => state.theme);

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    try {
      const raw = localStorage.getItem('alias_preferences');
      const prefs = raw ? JSON.parse(raw) : {};
      const next = {
        theme: !isDarkMode ? 'Dark' : 'Light',
        language: prefs?.language || 'VI',
        notificationsEnabled: typeof prefs?.notificationsEnabled === 'boolean' ? prefs.notificationsEnabled : true,
      };
      await aliasPreferencesService.updatePreferences(next);
    } catch { }
  };

  const handleSafeModeToggle = () => {
    dispatch(toggleSafeMode());
  };

  return (
    <div className="flex items-center space-x-2">
      {showSafeToggle && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSafeModeToggle}
            className={`relative ${isSafeMode ? "text-green-600 dark:text-green-400" : "text-gray-500"
              }`}
            title={isSafeMode ? "Tắt chế độ an toàn" : "Bật chế độ an toàn"}>
            {isSafeMode ? (
              <Shield className="w-5 h-5" />
            ) : (
              <ShieldOff className="w-5 h-5" />
            )}
          </Button>

          {isSafeMode && (
            <Badge
              variant="success"
              size="xs"
              className="absolute -top-1 -right-1 animate-pulse">
              🛡️
            </Badge>
          )}
        </div>
      )}

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleThemeToggle}
        className="text-gray-500 dark:text-gray-400"
        title={
          isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
        }>
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;
