import React from "react";

// Lazy load the heavy chat page to avoid large initial bundle and reduce
// the risk of a white flash when navigating directly to the chat route.
const AIChatBoxWithEmo = React.lazy(() => import("@/pages/AIChatBoxWithEmo"));
const TestEmotion = React.lazy(() => import("@/pages/Test/TestEmotion"));
const MoodInsights = React.lazy(() => import("@/pages/MoodInsights"));
const PaymentCallback = React.lazy(() =>
  import("@/pages/Payment/PaymentCallback")
);
const PaymentSuccess = React.lazy(() =>
  import("@/pages/Payment/PaymentSuccess")
);
const PaymentFailure = React.lazy(() =>
  import("@/pages/Payment/PaymentFailure")
);
// Routes rendered inside PrivateLayout (web chính)
export const privateRoutes = [
  { path: "/AIChatBoxWithEmo", component: AIChatBoxWithEmo },
  { path: "/tests/dass-21", component: TestEmotion },
  { path: "/mood-insights", component: MoodInsights },
  { path: "/payments/callback", component: PaymentCallback },
  { path: "/payment-success", component: PaymentSuccess },
  { path: "/payment-failure", component: PaymentFailure },
];
