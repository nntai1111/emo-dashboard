import React, { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Responsive particle configuration
const getParticleConfig = (isMobile) => ({
  PARTICLE_COUNT: isMobile ? 6 : 12,
  CLOUD_COUNT: isMobile ? 2 : 5,
  PARTICLE_SIZE_MULTIPLIER: isMobile ? 0.7 : 1,
  ANIMATION_DURATION_MULTIPLIER: isMobile ? 0.8 : 1,
});

const particleColors = [
  "bg-[#C8A2C8]/20",
  "bg-[#6B728E]/20", 
  "bg-[#F06292]/15",
  "bg-pink-200/25",
  "bg-purple-300/20",
  "bg-indigo-200/20",
];

const particleSizes = ["w-1 h-1", "w-2 h-2", "w-3 h-3", "w-4 h-4"];

const cloudIcons = ["☁️", "🌥️", "🌤️", "⛅", "🌦️"];

export default function FloatingParticles() {
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const config = useMemo(() => getParticleConfig(isMobile), [isMobile]);

  // Tạo particles một lần với responsive config
  const particles = useMemo(
    () =>
      Array.from({ length: config.PARTICLE_COUNT }).map(() => ({
        size: particleSizes[Math.floor(Math.random() * particleSizes.length)],
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        delay: Math.random() * 3,
        left: `${15 + Math.random() * 70}%`,
        top: `${15 + Math.random() * 70}%`,
        duration: (8 + Math.random() * 6) * config.ANIMATION_DURATION_MULTIPLIER,
        scale: 0.8 + Math.random() * 0.4,
      })),
    [config]
  );

  // Tạo clouds một lần với responsive config
  const clouds = useMemo(
    () =>
      Array.from({ length: config.CLOUD_COUNT }).map((_, i) => ({
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 70}%`,
        fontSize: `${2 + Math.random() * 2}rem`,
        icon: cloudIcons[i % cloudIcons.length],
        delay: i * 0.8,
        duration: (15 + Math.random() * 8) * config.ANIMATION_DURATION_MULTIPLIER,
      })),
    [config]
  );

  // Disable animations if user prefers reduced motion
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          className={`absolute rounded-full ${particle.size} ${particle.color}`}
          style={{
            left: particle.left,
            top: particle.top,
            filter: "blur(0.5px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 15, -8, 0],
            y: [0, -8, 6, 0],
            opacity: [0.2, 0.4, 0.3, 0.2],
            scale: [particle.scale, particle.scale * 1.1, particle.scale],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Clouds - only on larger screens */}
      {!isMobile && clouds.map((cloud, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute text-gray-400/30 select-none"
          style={{
            left: cloud.left,
            top: cloud.top,
            fontSize: cloud.fontSize,
            filter: "blur(1px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -15, 8, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "easeInOut",
          }}>
          {cloud.icon}
        </motion.div>
      ))}
    </div>
  );
}


