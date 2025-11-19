import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogIn from "@/components/molecules/logIn/LogIn";
import LoadingScreen from "@/components/atoms/Loading/LoadingScreen";

export const publicRoutes = [
  // 🔐 Auth routes
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingScreen />}>
          <LogIn />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
];
