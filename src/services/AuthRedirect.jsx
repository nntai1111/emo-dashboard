import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Component xử lý redirect dựa trên trạng thái authentication
 * - Nếu đã authenticated: redirect đến /dashboard
 * - Nếu chưa authenticated: redirect đến /login
 */
const AuthRedirect = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AuthRedirect;
