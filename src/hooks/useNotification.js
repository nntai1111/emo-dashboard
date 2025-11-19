import { useState } from "react";

/**
 * Custom hook để quản lý notification state và logic
 * @returns {Object} Object chứa notification state và các function để show/hide notification
 */
export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  /**
   * Hiển thị notification
   * @param {string} type - Loại notification: 'success', 'error', 'warning'
   * @param {string} message - Nội dung notification
   * @param {number} duration - Thời gian tự động đóng (ms), mặc định 5000
   */
  const showNotification = (type, message, duration = 5000) => {
    setNotification({ type, message });
    if (duration > 0) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };

  /**
   * Ẩn notification ngay lập tức
   */
  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
