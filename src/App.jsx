import "./App.css";
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { tokenManager } from "./services/tokenManager";
import { useSelector } from "react-redux";
import { publicRoutes } from "@/routes/publicRoutes";
import { privateRoutes } from "@/routes/privateRoutes";
import AuthRedirect from "./services/AuthRedirect";
import { PublicLayout, PrivateLayout } from "./components/layouts";
import LoadingScreen from "./components/atoms/Loading/LoadingScreen";

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Khởi tạo token refresh timer khi user đã đăng nhập
  React.useEffect(() => {
    if (isAuthenticated) {
      tokenManager.startTokenRefreshTimer();
    } else {
      tokenManager.stopTokenRefreshTimer();
    }

    // Cleanup khi component unmount
    return () => {
      tokenManager.stopTokenRefreshTimer();
    };
  }, [isAuthenticated]);

  return (
    <div className="relative">
      <Routes>
        {/* --- PUBLIC LAYOUT --- */}
        <Route element={<PublicLayout />}>
          {publicRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* --- PRIVATE LAYOUT --- */}
        <Route element={<PrivateLayout isAuthenticated={isAuthenticated} />}>
          {privateRoutes.map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <r.component />
                </Suspense>
              }
            />
          ))}
        </Route>

        {/* --- Default redirect --- */}
        <Route path="/" element={<AuthRedirect />} />

        {/* --- 404 --- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
