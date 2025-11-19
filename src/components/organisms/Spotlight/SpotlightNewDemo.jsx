"use client";
import { ColourfulText } from "@/components/molecules";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../../../styles/Font/Font.module.css";
import { motion, useReducedMotion, useInView} from "framer-motion";
import CanvasRevealEffectDemo from "../Service/CanvasRevealEffectDemo";
import { ArrowDown } from "lucide-react";
import { Start } from "@/components/atoms";
import GlobalSpotlight from "@/components/molecules/spotlight/GlobalSpotlight";
export default function SpotlightNewDemo() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const servicesRef = useRef(null);
  const [screenSize, setScreenSize] = useState('desktop');
  
  // Track scroll direction to control one-way reveal behavior
  const [scrollDir, setScrollDir] = useState("down");
  
  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY + 2) setScrollDir("down");
      else if (y < lastY - 2) setScrollDir("up");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Screen size detection
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

  // Only trigger when ~75% of the section is in view, with a slight bottom margin to avoid early fire
  const isInView = useInView(sectionRef, {
    amount: 0.75,
    margin: "0px 0px -20% 0px",
    once: false, // allow replay on subsequent entries
  });

  // Services section visibility
  const isServicesInView = useInView(servicesRef, {
    amount: 0.3,
    margin: "0px 0px -10% 0px",
    once: false,
  });

  // Display mode: hidden | anim (reveal with animation) | static (visible without animation)
  const [mode, setMode] = useState("hidden");
  useEffect(() => {
    if (isInView) {
      // Entering viewport
      if (scrollDir === "down") setMode("anim");
      else setMode("static"); // show without animation when scrolling up
    } else {
      // Leaving viewport
      if (scrollDir === "up") {
        // Scrolled above the section — reset to hidden so next downward entry can animate
        setMode("hidden");
      } else {
        // Scrolling further down — keep visible (no fade out)
        setMode((prev) => (prev === "hidden" ? "hidden" : "static"));
      }
    }
  }, [isInView, scrollDir]);
  const containerVariants = reduceMotion
    ? { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      };
  // Reveal animation (kept as-is for downward entry)
  const itemVariantsAnim = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.35 } },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 140,
            damping: 18,
            mass: 0.8,
          },
        },
      };
  // No-animation variant: show immediately without transitions
  const itemVariantsNoAnim = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0 } },
  };
  const containerVariantsNoAnim = {
    hidden: {},
    visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
  };
  return (
    <div className={`${styles.dancingScript} relative w-full overflow-visible`}>
      {/* Hero Section with Spotlight */}
      <div className="relative">
        {/* Spotlight đã được chuyển thành GlobalSpotlight trong Home.jsx */}
        <GlobalSpotlight />
        {/* Hero Content Container */}
        <div
          ref={sectionRef}
          className={`${
            screenSize === "mobile"
              ? "h-[25rem]"
              : screenSize === "tablet"
              ? "h-[30rem]"
              : "h-[35rem]"
          } mt-10 w-full rounded-2xl flex flex-col md:items-center md:justify-center subpixel-antialiased  relative overflow-hidden isolate `}>
          <motion.div
            initial="hidden"
            animate={mode === "hidden" ? "hidden" : "visible"}
            variants={
              mode === "static" ? containerVariantsNoAnim : containerVariants
            }
            className="max-w-7xl mx-auto relative z-20 w-full pt-16 md:pt-0 px-4 sm:px-6 lg:px-8">
            {/* Main Title (static - motion removed for performance) */}
            <h1
              className={`${
                screenSize === "mobile"
                  ? "text-4xl sm:text-5xl"
                  : screenSize === "tablet"
                  ? "text-5xl sm:text-6xl md:text-7xl"
                  : "text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
              } font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 via-white to-neutral-300 leading-tight`}>
              Hiểu được <br />
              những <ColourfulText text="vấn đề" /> của bạn
            </h1>

            {/* Subtitle (static) */}
            <p
              className={`${
                screenSize === "mobile"
                  ? "text-base md:text-lg"
                  : screenSize === "tablet"
                  ? "text-lg md:text-xl"
                  : "text-lg md:text-2xl"
              } my-6 font-normal text-neutral-300 max-w-2xl text-center mx-auto leading-relaxed`}>
              EmoEase sẽ là người bạn đồng hành thấu hiểu và chia sẻ cảm xúc của
              bạn, giúp bạn vượt qua những khó khăn trong cuộc sống.
            </p>
            {/* Decorative Elements - Strategic Positioning */}
            {screenSize !== "mobile" && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* 4 Elements around Main Title - 2 on each side */}

                {/* Left side of Main Title */}
                <motion.div
                  className={`absolute ${
                    screenSize === "mobile"
                      ? "top-[8%] left-[5%]"
                      : screenSize === "tablet"
                      ? "top-[10%] left-[8%]"
                      : "top-[12%] left-[10%]"
                  }`}
                  animate={{
                    y: [0, -8, 0],
                    x: [0, -5, 0],
                    rotate: [0, -20, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: screenSize === "mobile" ? 4 : 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                  }}>
                  <Start
                    icon="sparkles"
                    size={`${
                      screenSize === "mobile"
                        ? "w-4 h-4"
                        : screenSize === "tablet"
                        ? "w-5 h-5"
                        : "w-6 h-6 md:w-7 md:h-7"
                    }`}
                    color="text-purple-300"
                    animation="twinkle"
                    duration={screenSize === "mobile" ? 1.5 : 2}
                    delay={0.5}
                    tooltip="Tâm hồn trong sáng"
                    tooltipPosition={
                      screenSize === "mobile" ? "right" : "right"
                    }
                    showTooltipAlways={screenSize !== "mobile"}
                    onClick={() => {
                      const nextSection =
                        document.querySelector("#features-section") ||
                        document.querySelector("#service-section") ||
                        document.querySelector("main > section:nth-child(2)");
                      if (nextSection) {
                        nextSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={`${
                      screenSize === "mobile"
                        ? "active:scale-110"
                        : "hover:scale-125"
                    } transition-transform duration-300 drop-shadow-lg pointer-events-auto touch-manipulation`}
                    ariaLabel="Pure Soul"
                  />
                </motion.div>

                <motion.div
                  className={`absolute ${
                    screenSize === "mobile"
                      ? "top-[25%] left-[8%]"
                      : screenSize === "tablet"
                      ? "top-[28%] left-[12%]"
                      : "top-[30%] left-[15%]"
                  }`}
                  animate={{
                    y: [0, -10, 0],
                    x: [0, -6, 0],
                    rotate: [0, -15, 0],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: screenSize === "mobile" ? 5 : 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}>
                  <Start
                    icon="sparkles"
                    size={`${
                      screenSize === "mobile"
                        ? "w-3 h-3"
                        : screenSize === "tablet"
                        ? "w-4 h-4"
                        : "w-5 h-5 md:w-6 md:h-6"
                    }`}
                    color="text-blue-300"
                    animation="float"
                    duration={screenSize === "mobile" ? 2 : 2.5}
                    delay={0.8}
                    tooltip="Sự tin tưởng"
                    tooltipPosition={screenSize === "mobile" ? "right" : "left"}
                    showTooltipAlways={screenSize !== "mobile"}
                    onClick={() => {
                      const aboutSection =
                        document.querySelector("#about-section");
                      if (aboutSection) {
                        aboutSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={`${
                      screenSize === "mobile"
                        ? "active:scale-110"
                        : "hover:scale-120"
                    } transition-transform duration-300 drop-shadow-lg pointer-events-auto touch-manipulation`}
                    ariaLabel="Trust"
                  />
                </motion.div>

                {/* Right side of Main Title */}
                <motion.div
                  className={`absolute ${
                    screenSize === "mobile"
                      ? "top-[8%] right-[5%]"
                      : screenSize === "tablet"
                      ? "top-[10%] right-[8%]"
                      : "top-[12%] right-[10%]"
                  }`}
                  animate={{
                    y: [0, -12, 0],
                    x: [0, 8, 0],
                    rotate: [0, 25, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: screenSize === "mobile" ? 3.5 : 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}>
                  <Start
                    icon="sparkles"
                    size={`${
                      screenSize === "mobile"
                        ? "w-6 h-6"
                        : screenSize === "tablet"
                        ? "w-7 h-7"
                        : "w-8 h-8 md:w-9 md:h-9"
                    }`}
                    color="text-pink-300"
                    animation="float"
                    duration={screenSize === "mobile" ? 2.5 : 3}
                    delay={1.2}
                    tooltip="Trái tim ấm áp"
                    tooltipPosition={screenSize === "mobile" ? "left" : "left"}
                    showTooltipAlways={screenSize !== "mobile"}
                    onClick={() => {
                      const contactSection =
                        document.querySelector("#contact-section") ||
                        document.querySelector("#about-section");
                      if (contactSection) {
                        contactSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      } else {
                        alert("Contact us at: info@emoproject.com");
                      }
                    }}
                    className={`${
                      screenSize === "mobile"
                        ? "active:scale-105"
                        : "hover:scale-110"
                    } transition-transform duration-300 drop-shadow-lg pointer-events-auto touch-manipulation`}
                    ariaLabel="Warm Heart"
                  />
                </motion.div>

                <motion.div
                  className={`absolute ${
                    screenSize === "mobile"
                      ? "top-[25%] right-[8%]"
                      : screenSize === "tablet"
                      ? "top-[28%] right-[12%]"
                      : "top-[30%] right-[15%]"
                  }`}
                  animate={{
                    y: [0, -8, 0],
                    x: [0, 6, 0],
                    rotate: [0, 20, 0],
                    scale: [1, 1.12, 1],
                  }}
                  transition={{
                    duration: screenSize === "mobile" ? 4.5 : 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.2,
                  }}>
                  <Start
                    icon="sparkles"
                    size={`${
                      screenSize === "mobile"
                        ? "w-4 h-4"
                        : screenSize === "tablet"
                        ? "w-5 h-5"
                        : "w-6 h-6 md:w-7 md:h-7"
                    }`}
                    color="text-green-300"
                    animation="twinkle"
                    duration={screenSize === "mobile" ? 1.5 : 1.8}
                    delay={1.5}
                    tooltip="Sự bình yên"
                    tooltipPosition={screenSize === "mobile" ? "left" : "right"}
                    showTooltipAlways={screenSize !== "mobile"}
                    onClick={() => {
                      const meditationSection = document.querySelector(
                        "#meditation-section"
                      );
                      if (meditationSection) {
                        meditationSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={`${
                      screenSize === "mobile"
                        ? "active:scale-110"
                        : "hover:scale-125"
                    } transition-transform duration-300 drop-shadow-lg pointer-events-auto touch-manipulation`}
                    ariaLabel="Peace"
                  />
                </motion.div>

                {/* 2 Elements below Subtitle - 1 on each side */}

                <motion.div
                  className={`absolute ${
                    screenSize === "mobile"
                      ? "top-[65%] left-[12%]"
                      : screenSize === "tablet"
                      ? "top-[68%] left-[15%]"
                      : "top-[70%] left-[18%]"
                  }`}
                  animate={{
                    y: [0, 10, 0],
                    x: [0, -5, 0],
                    rotate: [0, -15, 0],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: screenSize === "mobile" ? 5 : 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}>
                  <Start
                    icon="sparkles"
                    size={`${
                      screenSize === "mobile"
                        ? "w-5 h-5"
                        : screenSize === "tablet"
                        ? "w-6 h-6"
                        : "w-7 h-7 md:w-8 md:h-8"
                    }`}
                    color="text-yellow-300"
                    animation="float"
                    duration={screenSize === "mobile" ? 2.2 : 2.8}
                    delay={0.3}
                    tooltip="Hy vọng tươi sáng"
                    tooltipPosition={screenSize === "mobile" ? "right" : "left"}
                    showTooltipAlways={screenSize !== "mobile"}
                    onClick={() => {
                      const serviceSection =
                        document.querySelector("#service-section");
                      if (serviceSection) {
                        serviceSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={`${
                      screenSize === "mobile"
                        ? "active:scale-105"
                        : "hover:scale-115"
                    } transition-transform duration-300 drop-shadow-lg pointer-events-auto touch-manipulation`}
                    ariaLabel="Bright Hope"
                  />
                </motion.div>

                <motion.div
                  className={`absolute ${
                    screenSize === "mobile"
                      ? "top-[65%] right-[12%]"
                      : screenSize === "tablet"
                      ? "top-[68%] right-[15%]"
                      : "top-[70%] right-[18%]"
                  }`}
                  animate={{
                    y: [0, 12, 0],
                    x: [0, 6, 0],
                    rotate: [0, 15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: screenSize === "mobile" ? 6 : 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                  }}>
                  <Start
                    icon="sparkles"
                    size={`${
                      screenSize === "mobile"
                        ? "w-4 h-4"
                        : screenSize === "tablet"
                        ? "w-5 h-5"
                        : "w-6 h-6 md:w-7 md:h-7"
                    }`}
                    color="text-indigo-300"
                    animation="twinkle"
                    duration={screenSize === "mobile" ? 2.5 : 3.2}
                    delay={0.2}
                    tooltip="Trí tuệ sâu sắc"
                    tooltipPosition={screenSize === "mobile" ? "left" : "right"}
                    showTooltipAlways={screenSize !== "mobile"}
                    onClick={() => {
                      const wisdomSection =
                        document.querySelector("#wisdom-section");
                      if (wisdomSection) {
                        wisdomSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={`${
                      screenSize === "mobile"
                        ? "active:scale-110"
                        : "hover:scale-120"
                    } transition-transform duration-300 drop-shadow-lg pointer-events-auto touch-manipulation`}
                    ariaLabel="Deep Wisdom"
                  />
                </motion.div>

                {/* Floating particles for extra magic */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex justify-center mt-8">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-neutral-400">
            <span className="text-[20px] font-medium">Khám phá dịch vụ</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Services Section */}
      <motion.div
        ref={servicesRef}
        initial={{ opacity: 0, y: 50 }}
        animate={
          isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`${
          screenSize === "mobile"
            ? "mt-16"
            : screenSize === "tablet"
            ? "mt-20"
            : "mt-24"
        } relative`}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12 px-4">
          <h2
            className={`${
              screenSize === "mobile"
                ? "text-3xl sm:text-4xl"
                : screenSize === "tablet"
                ? "text-4xl sm:text-5xl"
                : "text-5xl sm:text-6xl"
            } font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4`}>
            Chúng tớ mang đến
          </h2>
          <p
            className={`${
              screenSize === "mobile"
                ? "text-base"
                : screenSize === "tablet"
                ? "text-lg"
                : "text-xl"
            } text-neutral-400 max-w-2xl mx-auto`}>
            Các dịch vụ được thiết kế đặc biệt để hỗ trợ bạn trong hành trình
            cảm xúc
          </p>
        </motion.div>

        {/* Services Cards */}
        <div className="relative">
          <CanvasRevealEffectDemo />
        </div>
      </motion.div>

      {/* Bottom Spacing */}
      <div
        className={`${
          screenSize === "mobile"
            ? "h-16"
            : screenSize === "tablet"
            ? "h-20"
            : "h-24"
        }`}
      />
    </div>
  );
}
