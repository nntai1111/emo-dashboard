import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Component xử lý redirect dựa trên trạng thái authentication
 * - Nếu đã authenticated: redirect đến /AIChatBoxWithEmo
 * - Nếu chưa authenticated: redirect đến /onboarding
 */
const AuthRedirect = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <Navigate to="/AIChatBoxWithEmo" replace />
  ) : (
    <Navigate to="/onboarding" replace />
  );
};

export default AuthRedirect;
