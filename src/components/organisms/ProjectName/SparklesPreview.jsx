"use client";
import React, { useEffect, useState } from "react";

export function SparklesPreview({
  logoSrc = "/image/home/projectName.webp",
  alt = "EmoEase logo",
}) {
  const [SparklesCoreComp, setSparklesCoreComp] = useState(null);

  useEffect(() => {
    // Defer loading heavy particle component until the browser is idle
    // Fallback to setTimeout if requestIdleCallback is not available
    let cancelled = false;
    const mount = async () => {
      try {
        const load = async () => {
          const mod = await import("@/components/molecules");
          if (!cancelled) setSparklesCoreComp(() => mod.SparklesCore);
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          // allow a short idle time so initial paint is not blocked
          window.requestIdleCallback(() => load(), { timeout: 1000 });
        } else {
          // safe fallback
          setTimeout(() => load(), 800);
        }
      } catch (e) {
        // ignore dynamic import failures gracefully
        // console.warn('SparklesCore failed to load', e);
      }
    };

    mount();
    return () => {
      cancelled = true;
    };
  }, []);

  // Choose a lower default density to reduce initial runtime cost; the
  // heavy particle renderer will be loaded lazily above.
  const defaultDensity = 80;

  return (
    <div className="h-[8rem] w-full bg-[#ffffff00] flex flex-col items-center justify-center overflow-hidden rounded-md">
      <img
        src={logoSrc}
        alt={alt}
        className="relative z-20 h-20 md:h-24 lg:h-20 w-auto select-none pointer-events-none"
        draggable={false}
        // Provide intrinsic size to avoid layout shift
        width="80"
        height="80"
        // let the browser decode asynchronously and avoid blocking paint
        decoding="async"
        // logo is important but we defer particle overlay — loading can be auto
        loading="auto"
      />
      <div className="w-[30rem] h-40 relative">
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[#4a4040] to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[#ebebeb] to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[#795ea2] to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[#5c4978] to-transparent h-px w-1/4" />

        {/* Core component - only render if dynamic import succeeded */}
        {SparklesCoreComp ? (
          <SparklesCoreComp
            background="transparent"
            minSize={0.2}
            maxSize={1}
            particleDensity={defaultDensity}
            className="w-full h-10"
            particleColor="#ffffff"
          />
        ) : (
          // lightweight placeholder to keep layout stable
          <div className="w-full h-10" aria-hidden />
        )}

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-[#ffffff00] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
export default SparklesPreview;
