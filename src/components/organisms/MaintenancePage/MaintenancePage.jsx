import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MaintenancePage = () => {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleReload = () => {
    try {
      window.location.reload();
    } catch (_) {}
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50">
      {/* Soft ambient glows for a premium feel */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 w-[60vw] max-w-[780px] aspect-square rounded-full"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(216,180,254,0.30) 0%, rgba(216,180,254,0) 65%)",
          filter: "blur(42px)",
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 w-[55vw] max-w-[700px] aspect-square rounded-full"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(147,197,253,0.30) 0%, rgba(147,197,253,0) 65%)",
          filter: "blur(42px)",
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      {/* Container */}
      <div className="relative z-10 w-full px-5 sm:px-6 py-14">
        <div className="mx-auto max-w-3xl">
          {/* Card */}
          <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_rgba(2,6,23,0.18)] p-6 sm:p-8 md:p-10">
            {/* Hero: Lottie as primary visual */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center justify-center">
              <div className="relative w-52 sm:w-64 md:w-72 aspect-square">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-200/30 via-white/10 to-transparent blur-2xl" aria-hidden />
                <div className="relative w-full h-full rounded-full border border-white/30 bg-white/10 p-3">
                  <div className="w-full h-full overflow-hidden rounded-full">
                    <DotLottieReact
                      src="https://lottie.host/170a585c-efd4-4687-a978-e954be35996e/K4VM1h6dE1.lottie"
                      loop
                      autoplay
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
              className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-300/60 bg-amber-50 text-amber-800 mb-4" role="status" aria-live="polite">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                Đang bảo trì định kỳ
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Chúng tôi sẽ sớm quay lại
              </h1>
              <p className="mt-3 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 font-semibold">
                để mang đến trải nghiệm tốt hơn
              </p>
              <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Hệ thống đang được nâng cấp để cải thiện hiệu năng, tăng độ ổn định và bổ sung một số tính năng mới. Cảm ơn bạn đã kiên nhẫn chờ đợi.
              </p>
            </motion.div>

      
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaintenancePage;
