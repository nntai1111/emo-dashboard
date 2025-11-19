import { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const FancyHomeButton = () => {
  const location = useLocation();
  const isActive = location.pathname === "/";
  const shouldReduceMotion = useReducedMotion();

  const [emoji, setEmoji] = useState("🏡");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Emoji theo giờ
  useEffect(() => {
    const hour = new Date().getHours();
    setEmoji(hour >= 6 && hour < 18 ? "🏡" : "🌙");
  }, []);

  // Tạo bong bóng - ít hơn trên mobile
  const bubbles = useMemo(() => {
    const bubbleCount = isMobile ? 3 : 6;
    return Array.from({ length: bubbleCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: (isMobile ? 4 : 6) + Math.random() * (isMobile ? 6 : 10),
      duration: (isMobile ? 2 : 3) + Math.random() * (isMobile ? 2 : 4),
      delay: Math.random() * (isMobile ? 1 : 2),
    }));
  }, [isMobile]);

  // State để điều khiển hover cho glow aura
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-fit h-fit">
      {/* Bubble effect xung quanh - chỉ hiện trên desktop */}
      {!isMobile && bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-white/30 blur-sm pointer-events-none"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            bottom: "-15px",
          }}
          animate={{
            y: [0, -40],
            opacity: [0.2, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Nút chính */}
      <Link
        to="/"
        className="relative group block"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}>
        <motion.div
          initial={{ scale: 1 }}
          whileHover={!isMobile ? { scale: 1.05 } : {}}
          whileTap={{ scale: 0.95 }}
          animate={!shouldReduceMotion ? { scale: [1, 1.02, 1] } : {}}
          transition={{ 
            duration: shouldReduceMotion ? 0 : 1.6, 
            repeat: shouldReduceMotion ? 0 : Infinity, 
            ease: "easeInOut" 
          }}
          className={`relative z-10 flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-xl border backdrop-blur-md touch-manipulation
            ${
              isActive
                ? "bg-white/40 text-[#C8A2C8] border-white/50 shadow-2xl"
                : "bg-white/30 hover:bg-white/40 text-[#C8A2C8]/90 border-white/30 hover:shadow-2xl"
            }`}>
          {/* Emoji */}
          <motion.span
            className="text-base sm:text-lg"
            animate={!shouldReduceMotion ? { y: [0, -2, 0] } : {}}
            transition={{ 
              duration: shouldReduceMotion ? 0 : 2, 
              repeat: shouldReduceMotion ? 0 : Infinity 
            }}>
            {emoji}
          </motion.span>
          <span className="hidden xs:inline tracking-wide font-medium text-xs sm:text-sm">
            Về chốn dịu dàng
          </span>
        </motion.div>

        {/* Glow aura - chỉ hiện trên desktop */}
        {!isMobile && (
          <motion.span
            className="absolute -inset-1.5 bg-gradient-to-r from-[#C8A2C8]/20 to-[#6B728E]/20 rounded-full blur-xl pointer-events-none"
            animate={{ opacity: isHovered ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </div>
  );
};

export default FancyHomeButton;
