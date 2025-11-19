import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute - Component bảo vệ route khỏi user đã authenticated
 * Nếu user đã đăng nhập, sẽ redirect về /dashboard
 * Chỉ dành cho các route public như login
 */
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Nếu đã authenticated, không render children (sẽ redirect)
  if (isAuthenticated) {
    return null;
  }

  // Nếu chưa authenticated, render children
  return children;
};

export default ProtectedRoute;
