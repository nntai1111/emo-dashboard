import React from "react";

// Lazy load components to avoid large initial bundle
const ChatPage = React.lazy(() => import("@/pages/ChatPage"));
const NotificationsPage = React.lazy(() => import("@/pages/NotificationsPage"));
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = React.lazy(() => import("@/pages/SettingsPage"));
const PostDetailPage = React.lazy(() => import("@/pages/PostDetailPage"));
const CommunityRulesPage = React.lazy(() => import("@/pages/CommunityRulesPage"));
const HomePage = React.lazy(() => import("@/pages/HomePage"));

// Routes rendered inside community/layout. Use `component` (lazy) and
// render inside Suspense at the route mount time.
export const communityRoutes = [
  { path: "/home", component: HomePage },
  { path: "/post/:id", component: PostDetailPage },
  { path: "/chat", component: ChatPage },
  { path: "/notifications", component: NotificationsPage },
  { path: "/profile", component: ProfilePage },
  { path: "/settings", component: SettingsPage },
  { path: "/community-rules", component: CommunityRulesPage },
];
