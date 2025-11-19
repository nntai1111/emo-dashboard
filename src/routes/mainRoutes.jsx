import React from "react";
import Home from "@/pages/Home";
import About from "@/pages/About";

// Routes rendered inside MainLayout
export const mainRoutes = [
  { path: "/trang-chu", element: <Home /> },
  { path: "/about", element: <About /> },
  // Add more main routes here later (e.g., /dashboard, /profile)
];

// Prefixes for determining when to show main layout UI (e.g., StaggeredMenu)
export const MAIN_LAYOUT_PREFIXES = [
  "/trang-chu",
  "/about",
  "/terms",
  "/onboarding",
  "/AIChatBoxWithEmo",
  "/tests/dass-21",
]; // extend as needed
