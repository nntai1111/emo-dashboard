"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
  // Responsive props
  mobileWidth?: number;
  mobileHeight?: number;
  mobileSmallWidth?: number;
  mobileBlur?: number;
  tabletWidth?: number;
  tabletHeight?: number;
  tabletSmallWidth?: number;
  tabletBlur?: number;
};

export const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 70%, rgba(255,255,255,0.01) 90%, transparent 100%)",

  gradientSecond = "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%, transparent 100%)",

  gradientThird = "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.02) 85%, transparent 100%)",

  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
  // Responsive defaults
  mobileWidth = 200,
  mobileHeight = 500,
  mobileSmallWidth = 80,
  mobileBlur = 15,
  tabletWidth = 350,
  tabletHeight = 800,
  tabletSmallWidth = 150,
  tabletBlur = 20,
}: SpotlightProps = {}) => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Responsive values
  const getResponsiveValues = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          width: mobileWidth,
          height: mobileHeight,
          smallWidth: mobileSmallWidth,
          blur: mobileBlur,
          translateY: -150,
          xOffset: 30,
        };
      case 'tablet':
        return {
          width: tabletWidth,
          height: tabletHeight,
          smallWidth: tabletSmallWidth,
          blur: tabletBlur,
          translateY: -250,
          xOffset: 60,
        };
      default:
        return {
          width,
          height,
          smallWidth,
          blur: 30,
          translateY,
          xOffset,
        };
    }
  };

  const responsiveValues = getResponsiveValues();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full">
      {/* LEFT */}
      <motion.div
        animate={{ x: [0, responsiveValues.xOffset, 0] }}
        transition={{
          duration: screenSize === 'mobile' ? duration * 0.8 : duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none">
        <div
          style={{
            transform: `translateY(${responsiveValues.translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${responsiveValues.width}px`,
            height: `${responsiveValues.height}px`,
            filter: `blur(${responsiveValues.blur}px)`,
          }}
          className="absolute top-0 left-0"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${responsiveValues.smallWidth}px`,
            height: `${responsiveValues.height}px`,
            filter: `blur(${responsiveValues.blur - 5}px)`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${responsiveValues.smallWidth}px`,
            height: `${responsiveValues.height}px`,
            filter: `blur(${responsiveValues.blur - 10}px)`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      {/* RIGHT */}
      <motion.div
        animate={{ x: [0, -responsiveValues.xOffset, 0] }}
        transition={{
          duration: screenSize === 'mobile' ? duration * 0.8 : duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none">
        <div
          style={{
            transform: `translateY(${responsiveValues.translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${responsiveValues.width}px`,
            height: `${responsiveValues.height}px`,
            filter: `blur(${responsiveValues.blur}px)`,
          }}
          className="absolute top-0 right-0"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${responsiveValues.smallWidth}px`,
            height: `${responsiveValues.height}px`,
            filter: `blur(${responsiveValues.blur - 5}px)`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${responsiveValues.smallWidth}px`,
            height: `${responsiveValues.height}px`,
            filter: `blur(${responsiveValues.blur - 10}px)`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>

      {/* Mobile-specific center spotlight for better effect */}
      {screenSize === 'mobile' && (
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-30 pointer-events-none">
          <div
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              filter: "blur(20px)",
            }}
            className="w-full h-full rounded-full"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Spotlight;
