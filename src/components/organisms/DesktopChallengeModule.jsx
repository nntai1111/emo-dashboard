import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Lazy load để tối ưu hơn nữa (chỉ load khi cần)
const ChallengeHubPage = lazy(() => import("../../pages/ChallengeHubPage"));
const TaskTimeline = lazy(() => import("./TaskTimeline"));

const DesktopChallengeModule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get('view');
  const [activeView, setActiveView] = useState(viewParam === 'task' ? 'task' : 'challenge');
  const containerRef = useRef(null);

  // Update view when URL param changes
  useEffect(() => {
    if (viewParam === 'task') {
      setActiveView('task');
    } else {
      setActiveView('challenge');
    }
  }, [viewParam]);

  // Sync URL khi chuyển view
  useEffect(() => {
    setSearchParams({ view: activeView }, { replace: true });
  }, [activeView, setSearchParams]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timeout;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          container.classList.add("local-scrolling");
          clearTimeout(timeout);
          timeout = setTimeout(() => container.classList.remove("local-scrolling"), 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleView = () => {
    setActiveView((prev) => (prev === "challenge" ? "task" : "challenge"));
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden local-optimize bg-black text-white"
    >
      {/* SLIDING CONTAINER */}
      <motion.div
        className="flex h-full"
        animate={{
          x: activeView === "challenge" ? 0 : "calc(-100vw)",
        }}
        initial={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ width: "calc(200vw)" }}
      >
        {/* CHALLENGE PANEL - chỉ render khi active */}
        <div
          style={{ width: "100vw", minWidth: "100vw" }}
          className="h-full overflow-y-auto local-scrollbar bg-black"
        >
          {activeView === "challenge" ? (
            <Suspense fallback={<div className="flex h-full items-center justify-center">Đang tải thử thách...</div>}>
              <ChallengeHubPage />
            </Suspense>
          ) : (
            <div style={{ width: "100vw" }} />
          )}
        </div>

        {/* TASK PANEL - chỉ render khi active */}
        <div
          style={{ width: "100vw", minWidth: "100vw" }}
          className="h-full overflow-y-auto local-scrollbar bg-black"
        >
          {activeView === "task" ? (
            <Suspense fallback={<div className="flex h-full items-center justify-center">Đang tải nhiệm vụ...</div>}>
              <TaskTimeline />
            </Suspense>
          ) : (
            <div style={{ width: "100vw" }} />
          )}
        </div>
      </motion.div>

      {/* TOGGLE BUTTON */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 z-50"
        animate={{
          left: activeView === "task" ? 16 : "auto",
          right: activeView === "challenge" ? 16 : "auto",
          rotate: activeView === "challenge" ? 0 : 180,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <button
          onClick={toggleView}
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl shadow-xl border border-white/20 hover:border-sky-400 hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <ChevronRight className="h-6 w-6 text-sky-400 group-hover:text-sky-300" />
        </button>

        <span
          className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none backdrop-blur-md"
          style={{
            left: activeView === "task" ? "calc(100% + 12px)" : "auto",
            right: activeView === "challenge" ? "calc(100% + 12px)" : "auto",
          }}
        >
          {activeView === "challenge" ? "View Tasks" : "View Challenges"}
        </span>
      </motion.div>

      <style jsx>{`
        .local-optimize * {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .local-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .local-scrollbar::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        .local-scrollbar:hover::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .local-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(200, 162, 200, 0.7);
          border-radius: 2px;
        }
        .local-scrolling * {
          transition: none !important;
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
};

export default DesktopChallengeModule;