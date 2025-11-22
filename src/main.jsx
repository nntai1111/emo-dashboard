// import { StrictMode, useEffect, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./store";
// import "./index.css";
// import App from "./App.jsx";
// import LoadingScreen from "@/components/atoms/Loading/LoadingScreen.jsx";
// import { LanguageProvider } from "./contexts/LanguageContext.jsx";
// import { initializeAuth } from "./services/authInit";
// import "./i18n";

// function Root() {
//   const [isReady, setIsReady] = useState(false);
//   const [authInitialized, setAuthInitialized] = useState(false);

//   useEffect(() => {
//     const onLoad = () => setIsReady(true);
//     if (document.readyState === "complete") setIsReady(true);
//     else window.addEventListener("load", onLoad);
//     const min = setTimeout(() => setIsReady((r) => r || false), 300);
//     return () => {
//       window.removeEventListener("load", onLoad);
//       clearTimeout(min);
//     };
//   }, []);

//   // Initialize authentication from localStorage
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         await initializeAuth();
//         setAuthInitialized(true);
//       } catch (error) {
//         console.error("Auth initialization failed:", error);
//         setAuthInitialized(true); // Continue even if auth init fails
//       }
//     };

//     initAuth();
//   }, []);

//   if (!isReady || !authInitialized) {
//     return <LoadingScreen />;
//   }

//   return <App />;
// }

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <LanguageProvider>
//           <Root />
//         </LanguageProvider>
//       </BrowserRouter>
//     </Provider>
//   </StrictMode>
// );
// main.jsx
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Thêm
import { store } from "./store";
import "./index.css";
import App from "./App.jsx";
import LoadingScreen from "@/components/atoms/Loading/LoadingScreen.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { initializeAuth } from "./services/authInit";
import "./i18n";

// Tạo instance QueryClient (chỉ tạo 1 lần)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 phút
      cacheTime: 1000 * 60 * 5, // 5 phút
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function Root() {
  const [isReady, setIsReady] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const onLoad = () => setIsReady(true);
    if (document.readyState === "complete") setIsReady(true);
    else window.addEventListener("load", onLoad);
    const min = setTimeout(() => setIsReady((r) => r || false), 300);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(min);
    };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuth();
        setAuthInitialized(true);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  if (!isReady || !authInitialized) {
    return <LoadingScreen />;
  }

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {" "}
        {/* Thêm ở đây */}
        <HashRouter>
          <LanguageProvider>
            <Root />
          </LanguageProvider>
        </HashRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
