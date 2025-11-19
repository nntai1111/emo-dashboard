import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

// Hook kiểm tra màn hình hẹp để rút gọn chữ
function useShortLabel() {
  const [short, setShort] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      // Ví dụ: nhỏ hơn 1100px thì rút gọn
      setShort(window.innerWidth < 1100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return short;
}

const StartButton = ({ onClick }) => {
  const shortLabel = useShortLabel();
  const label = shortLabel ? "Talk to Emo" : "Talk to Emo";

  return (
    <div className="relative w-full flex justify-center">
      {/* Moonlight halo glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "clamp(220px, 42vw, 460px)",
          height: "clamp(220px, 42vw, 460px)",
          borderRadius: "9999px",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(253,224,71,0.42) 0%, rgba(250,204,21,0.22) 38%, rgba(250,204,21,0.0) 70%)",
          filter: "blur(36px)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.button
        onClick={onClick}
        aria-label={label}
        className="relative hover:cursor-pointer overflow-hidden group rounded-full px-5 sm:px-6 py-3.5 flex items-center gap-3 transition-all duration-300 focus:outline-none 
        bg-white/15 border border-white/30 text-slate-800 
        shadow-[0_8px_24px_rgba(2,6,23,0.12)] hover:shadow-[0_16px_40px_rgba(2,6,23,0.16)]
        backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/10 
        focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        whileHover={{
          y: -1,
          boxShadow: "0 18px 40px rgba(2,6,23,0.20)",
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        {/* Frosted overlay + sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay 
          bg-gradient-to-br from-white/30 via-white/10 to-white/5"
          style={{ zIndex: 0 }}
        />
        {/* Top highlight */}
        <div
          aria-hidden
          className="absolute left-2 right-2 top-1 h-[2px] rounded-full bg-white/60 blur-[2px] opacity-70"
          style={{ zIndex: 0 }}
        />

        {/* Button content */}
        <div className="relative flex items-center gap-2 z-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <MessageCircle className="w-5 h-5 text-purple-500" />
          </motion.div>

          <span className="font-semibold text-[15px] sm:text-[16px] text-white drop-shadow-sm">
            {label}
          </span>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}>
            <Sparkles className="w-5 h-5 text-pink-500" />
          </motion.div>
        </div>

        {/* Sparkle effects */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
          style={{ zIndex: 1 }}>
          <div className="text-yellow-200/70 text-5xl">✨</div>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default StartButton;
