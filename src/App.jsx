import "./App.css";
// import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { StaggeredMenu, MoodTracking } from "@/components/molecules";
import { tokenManager } from "./services/tokenManager";
import { useSelector } from "react-redux";
import { publicRoutes } from "@/routes/publicRoutes";
import { mainRoutes, MAIN_LAYOUT_PREFIXES } from "@/routes/mainRoutes";
import { privateRoutes } from "@/routes/privateRoutes";
import { communityRoutes } from "./routes/communityRoutes";
import { spaceRoutes } from "./routes/spaceRoutes";
import AuthRedirect from "./services/AuthRedirect";
import { PublicLayout } from "./components/layouts";
import PrivateLayout from "./components/layouts/PrivateLayout";
import Layout from "./components/layouts/Layout";
import LayoutSpace from "./components/layouts/LayoutSpace";
import React, { Suspense } from "react";
import LoadingScreen from "./components/atoms/Loading/LoadingScreen";
import AliasGuard from "./components/AliasGuard";
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const showMainMenu = MAIN_LAYOUT_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

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

  // Nếu user đã authenticated nhưng đang ở các route signup
  // thì redirect đến AIChatBoxWithEmo (KHÔNG bao gồm /login và /onboarding để tránh xung đột)
  const shouldRedirectToChat =
    isAuthenticated && location.pathname === "/signup";

  const introductionLinks = [
    {
      id: "intro-home",
      label: "Trang chủ",
      ariaLabel: "Đến trang chủ",
      description: "Khởi đầu hành trình cùng EmoEase",
      link: "/trang-chu",
      actionOnly: true,
      onSelect: () => {
        if (location.pathname === "/trang-chu") {
          // Scroll directly with retry logic for same-route navigation
          const scrollToHero = (attempt = 0) => {
            const maxAttempts = 5;
            const delays = [400, 100, 150, 200, 250]; // Start with 400ms for menu close, then retry

            setTimeout(() => {
              const heroSection = document.querySelector("#hero-section");
              if (heroSection) {
                // Force scroll by using window.scrollTo for more reliable behavior
                const elementTop =
                  heroSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                  top: elementTop,
                  behavior: "smooth",
                });
              } else if (attempt < maxAttempts - 1) {
                scrollToHero(attempt + 1);
              }
            }, delays[attempt] || 100);
          };

          scrollToHero();
        } else {
          localStorage.setItem("scrollToSection", "hero-section");
          navigate("/trang-chu");
        }
      },
    },
    {
      id: "intro-about",
      label: "Giới thiệu",
      ariaLabel: "Tìm hiểu về chúng tôi",
      description: "Sứ mệnh và đội ngũ EmoEase",
      link: "/about",
    },
    {
      id: "intro-packages",
      label: "Gói dịch vụ",
      ariaLabel: "Xem các gói dịch vụ",
      description: "Tổng quan các gói phù hợp với bạn",
      link: "/trang-chu",
      actionOnly: true,
      onSelect: () => {
        if (location.pathname === "/trang-chu") {
          // Scroll directly with retry logic for same-route navigation
          const scrollToPackages = (attempt = 0) => {
            const maxAttempts = 5;
            const delays = [400, 100, 150, 200, 250]; // Start with 400ms for menu close, then retry

            setTimeout(() => {
              const packagesSection =
                document.querySelector("#packages-section");
              if (packagesSection) {
                // Force scroll by using window.scrollTo for more reliable behavior
                const elementTop =
                  packagesSection.getBoundingClientRect().top +
                  window.pageYOffset;
                window.scrollTo({
                  top: elementTop,
                  behavior: "smooth",
                });
              } else if (attempt < maxAttempts - 1) {
                scrollToPackages(attempt + 1);
              }
            }, delays[attempt] || 100);
          };

          scrollToPackages();
        } else {
          localStorage.setItem("scrollToSection", "packages-section");
          navigate("/trang-chu");
        }
      },
    },

    {
      id: "intro-terms",
      label: "Điều khoản",
      ariaLabel: "Xem điều khoản và quyền riêng tư",
      description: "Cam kết bảo mật và quyền lợi của bạn",
      link: "/terms",
    },
  ];

  const serviceLinks = [
    {
      id: "service-ai-chat",
      label: "Tâm sự cùng Emo",
      ariaLabel: "Tâm sự cùng Emo",
      description: "Tư vấn và hỗ trợ tâm lý thông qua AI",
      link: "/AIChatBoxWithEmo",
    },
    {
      id: "service-assessment",
      label: "Đánh giá tâm lý",
      ariaLabel: "Đánh giá tâm lý",
      description: "Bài test DASS-21 giúp hiểu trạng thái cảm xúc",
      link: "/tests/dass-21",
    },
    {
      id: "service-wellbeing",
      label: "Sức khỏe tinh thần",
      ariaLabel: "Sức khỏe tinh thần",
      description: "Không gian chăm sóc và xây dựng thói quen an yên",
      link: "/space/knowledge",
    },
    {
      id: "service-community",
      label: "Cộng đồng ẩn danh",
      ariaLabel: "Cộng đồng ẩn danh",
      description: "Chia sẻ và đồng hành cùng cộng đồng an toàn",
      link: "/home",
    },
  ];

  const communityLinks = [
    {
      id: "social-facebook",
      label: "Facebook",
      link: "https://www.facebook.com/EmoEase.SolTech",
      description: "Cập nhật sự kiện và hoạt động mới nhất",
      isExternal: true,
    },
    {
      id: "social-tiktok",
      label: "TikTok",
      link: "https://www.tiktok.com/@emoease.ne?lang=vi-VN",
      description: "Góc nhìn vui tươi về cảm xúc hằng ngày",
      isExternal: true,
    },
    {
      id: "social-instagram",
      label: "Instagram",
      link: "https://www.instagram.com/emoease.ne/",
      description: "Khoảnh khắc truyền cảm hứng và lời nhắn nhủ",
      isExternal: true,
    },
  ];

  const mainMenuSections = [
    {
      id: "section-intro",
      title: "Khám phá EmoEase",
      subtitle: "Thông tin giới thiệu và định hướng trải nghiệm",
      layout: "list",
      items: introductionLinks,
    },
    {
      id: "section-services",
      title: "Dịch vụ chăm sóc tinh thần",
      subtitle: "Các công cụ và chương trình cốt lõi",
      layout: "list",
      items: serviceLinks,
    },
    {
      id: "section-community",
      title: "Kết nối & Cộng đồng",
      subtitle: "Theo dõi EmoEase trên các nền tảng",
      layout: "grid",
      items: communityLinks,
    },
  ];

  // Nếu cần redirect thì hiển thị AuthRedirect
  if (shouldRedirectToChat) {
    return <AuthRedirect />;
  }

  return (
    <div className="relative">
      {/* Mount MoodTracking globally so CTA events can open it anywhere */}
      <MoodTracking />
      {/* {showMainMenu && ( */}
      <div
        className="fixed inset-0 z-60 pointer-events-none overscroll-none"
        style={{ background: "transparent" }}>
        <StaggeredMenu
          position="right"
          menuSections={mainMenuSections}
          displaySocials={false}
          displayItemNumbering={false}
          menuButtonColor="#fff"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={true}
          colors={["#B19EEF", "#5227FF"]}
          logoUrl="/path-to-your-logo.svg"
          accentColor="#4a2580"
          onMenuOpen={() => {}}
          onMenuClose={() => {}}
        />
      </div>
      {/* )} */}

      <Routes>
        {/* --- PUBLIC LAYOUT --- */}
        <Route element={<PublicLayout />}>
          {publicRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* --- MAIN LAYOUT --- */}
        {/* <Route element={<MainLayout />}>
          {mainRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route> */}

        {/* --- PRIVATE LAYOUT (Web chính) --- */}
        <Route element={<PrivateLayout isAuthenticated={isAuthenticated} />}>
          {privateRoutes.map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                <AliasGuard>
                  <Suspense fallback={<LoadingScreen />}>
                    <r.component />
                  </Suspense>
                </AliasGuard>
              }
            />
          ))}
        </Route>

        {/* --- COMMUNITY LAYOUT (Web phụ) --- */}
        <Route element={<Layout isAuthenticated={isAuthenticated} />}>
          {communityRoutes.map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                <AliasGuard>
                  <Suspense fallback={<LoadingScreen />}>
                    <r.component />
                  </Suspense>
                </AliasGuard>
              }
            />
          ))}
        </Route>
        {/* --- SPACE LAYOUT (Web phụ) --- */}
        <Route element={<LayoutSpace isAuthenticated={isAuthenticated} />}>
          {spaceRoutes.map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                <AliasGuard>
                  <Suspense fallback={<LoadingScreen />}>
                    <BreadcrumbProvider>
                      <r.component />
                    </BreadcrumbProvider>
                  </Suspense>
                </AliasGuard>
              }
            />
          ))}
        </Route>
        {/* --- 404 --- */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </div>
  );
}
