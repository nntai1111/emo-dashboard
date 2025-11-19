import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import TermLayout from "@/components/organisms/Terms/TermLayout";

// ⚙️ Nhẹ, load ngay lập tức — giữ nguyên
import {
  Privacy,
  TermsOfUse,
  LogIn,
  MaintenancePage,
  Error,
} from "@/components";
import AuthRedirect from "@/services/AuthRedirect";

// 🕊️ Lazy load các page nặng / ít dùng
const Home = React.lazy(() => import("@/pages/Home"));
const About = React.lazy(() => import("@/pages/About"));
const TermsPage = React.lazy(() => import("@/pages/TermsPage"));
const SignUp = React.lazy(() => import("@/components/molecules/logIn/SignUp"));

// Wrapper to read `ref` query param and pass it to SignUp as `referralCode` prop
const SignUpWithReferral = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref") || undefined;
  return (
    <React.Suspense fallback={<LoadingScreen />}>
      <SignUp referralCode={ref} />
    </React.Suspense>
  );
};

// 🧠 Gom nhóm Onboarding vào 1 chunk (giúp user đi qua flow nhanh, chỉ load 1 lần)
const OnboardingGroup = React.lazy(() =>
  import("@/pages/Onboarding/_OnboardingGroup")
);

// 🌀 Loading fallback (tránh màn trắng khi chờ tải)
import LoadingScreen from "@/components/atoms/Loading/LoadingScreen";

export const publicRoutes = [
  // ✅ Redirect mặc định
  { path: "/", element: <AuthRedirect /> },

  // 🏠 Trang chính
  {
    path: "/trang-chu",
    element: (
      <React.Suspense fallback={<LoadingScreen />}>
        <Home />
      </React.Suspense>
    ),
  },

  // ℹ️ Giới thiệu
  {
    path: "/about",
    element: (
      <React.Suspense fallback={<LoadingScreen />}>
        <About />
      </React.Suspense>
    ),
  },

  // 🧭 Onboarding flow (gom thành 1 dynamic import)
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingScreen />}>
          <OnboardingGroup page="main" />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboard-first",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingScreen />}>
          <OnboardingGroup page="first" />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboard-second",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingScreen />}>
          <OnboardingGroup page="second" />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboard-three",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingScreen />}>
          <OnboardingGroup page="three" />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },

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
  {
    path: "/signup",
    element: (
      <ProtectedRoute>
        <SignUpWithReferral />
      </ProtectedRoute>
    ),
  },

  // ⚙️ Hệ thống & Điều khoản
  { path: "/maintenance", element: <MaintenancePage /> },
  { path: "/error", element: <Error /> },

  // 📄 Terms page với tab switching
  {
    path: "/terms",
    element: (
      <React.Suspense fallback={<LoadingScreen />}>
        <TermsPage />
      </React.Suspense>
    ),
  },

  // 🔄 Backward compatibility - redirect old routes to new terms page
  {
    path: "/terms/privacy",
    element: <Navigate to="/terms?tab=privacy" replace />,
  },
  {
    path: "/terms/terms-of-use",
    element: <Navigate to="/terms?tab=terms" replace />,
  },
];
