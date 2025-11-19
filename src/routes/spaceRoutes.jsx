import React from "react";

// Lazy load components to avoid large initial bundle
const WellnesssPage = React.lazy(() => import("@/pages/WellnesssPage"));
const KnowledgeModulePage = React.lazy(() => import("@/pages/KnowledgeModulePage"));
const ChallengeModulePage = React.lazy(() => import("@/pages/ChallengeModulePage"));
const ChallengeDetailPage = React.lazy(() => import("@/pages/ChallengeDetailPage"));
const ChallengeHubPage = React.lazy(() => import("@/pages/ChallengeHubPage"));
const DailyCheckInPage = React.lazy(() => import("@/pages/DailyCheckInPage"));
const CompletionPage = React.lazy(() => import("@/pages/CompletionPage"));
const CategoryPage = React.lazy(() => import("@/pages/CategoryPage"));

// Routes rendered inside community/layout. Use `component` (lazy) and
// render inside Suspense at the route mount time.
export const spaceRoutes = [
    { path: "/space/statistics", component: WellnesssPage },
    { path: "/space/knowledge", component: KnowledgeModulePage },
    { path: "/space/challenge", component: ChallengeModulePage },
    { path: "/space/challenges", component: ChallengeHubPage },
    { path: "/space/challenge/:id", component: ChallengeDetailPage },
    { path: "/space/check-in/:id", component: DailyCheckInPage },
    { path: "/space/completion/:id", component: CompletionPage },
    { path: "/space/articles/category", component: CategoryPage },
];
