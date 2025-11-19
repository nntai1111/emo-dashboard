import React, { useEffect, useState } from "react";
// Header omitted for brevity; FloatingParticles is large and animated so we
// defer loading it until the browser is idle to avoid blocking first paint.
import Header from "../Chat/Header";

const MainLayout = ({ children }) => {

  const [FloatingParticles, setFloatingParticles] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadParticles = async () => {
      try {
        const importer = async () => {
          const mod = await import("../Chat/FloatingParticles");
          if (!cancelled) setFloatingParticles(() => mod.default || mod);
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          // give the browser a moment to paint before loading heavy animations
          window.requestIdleCallback(() => importer(), { timeout: 1000 });
        } else {
          // fallback to a short timeout
          setTimeout(() => importer(), 700);
        }
      } catch (e) {
        // ignore import errors; particles are optional
        // console.warn('Failed to load FloatingParticles', e);
      }
    };

    loadParticles();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full min-h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Mount particles only after dynamic import completes (deferred) */}
      {FloatingParticles ? <FloatingParticles /> : null}
      {/* <Header /> */}
      <main className="flex-1 relative z-10 min-h-0">{children}</main>
    </div>
  );
};

export default MainLayout;
