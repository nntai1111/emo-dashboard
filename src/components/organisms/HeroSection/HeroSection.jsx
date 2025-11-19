import React, {
  useEffect,
  useState,
  useMemo,
  lazy,
  Suspense,
  useRef,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import CurvedLoop from "@/components/atoms/Animation/CurvedLoop";
import DownloadSection from "../Title/DownloadSection";
import Navbar from "../Navbar/Navbar";
import { StartButton, Start } from "@/components/atoms";

const MOBILE_MAX_WIDTH = 768;

const HeroSection = () => {
  // Respect reduced motion before deriving transforms
  const reduceMotion = useReducedMotion();
  // Sticky scene-based parallax tied to this section only
  const sceneRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const yUnder = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -150]
  );
  const yLayout = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -80]
  );
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_MAX_WIDTH : false
  );

  // State để lazy load InfiniteMenu
  const [shouldLoadInfiniteMenu, setShouldLoadInfiniteMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_MAX_WIDTH);
    };

    // Intersection Observer để tối ưu loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadInfiniteMenu) {
            setShouldLoadInfiniteMenu(true);
          }
        });
      },
      {
        rootMargin: "100px", // Load trước 100px
      }
    );

    // Target element để observe
    const infiniteMenuSection = document.querySelector(
      "#infinite-menu-section"
    );
    if (infiniteMenuSection) {
      observer.observe(infiniteMenuSection);
    }
    window.addEventListener("resize", handleResize);

    // Khởi tạo giá trị ban đầu
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [shouldLoadInfiniteMenu]);

  return (
    <>
      {/* Full-bleed HERO wrapper. Tăng chiều cao để chứa toàn bộ các lớp parallax thay vì phụ thuộc section video phía sau. */}
      <div className="relative z-[20] min-h-[100vh] overflow-x-clip overflow-y-visible mx-[calc(50%-50vw)] will-change-transform transform-gpu">
        {/* NOTE: Nếu Navbar đã render ở layout cha, có thể xoá dòng sau để tránh trùng lặp. */}
        <div className="pt-4">
          <Navbar />
        </div>
        {/* Nền tĩnh phủ toàn bộ hero */}
        <div
          className="absolute h-[100vh] 2xl:h-[120vh] inset-0 -z-30"
          style={{
            backgroundImage: "url('/image/home/bg_HomeCenter.webp')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* DownloadSection nằm chính giữa nền tĩnh */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full">
          <DownloadSection />
        </div>
        {/* Interactive Stars positioned 100px from center */}
        <div className="absolute inset-0 z-10">
          {/* First star - positioned 100px to the right of center and 100px up */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       ml-[100px] md:ml-[100px] sm:ml-[60px] ml-[40px]
                       -mt-[150px] md:-mt-[100px] sm:-mt-[60px] -mt-[40px]"
            animate={{
              y: [0, -15, 0],
              x: [0, 8, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}>
            <Start
              icon="sparkles"
              size="w-8 h-8 md:w-8 md:h-8 sm:w-6 sm:h-6"
              color="text-white"
              animation="twinkle"
              duration={1.5}
              delay={1}
              tooltip="Trò chuyện với Emo!"
              tooltipPosition="top"
              showTooltipAlways={true}
              tooltipTo="/AIChatBoxWithEmo"
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
              className="hover:scale-125 transition-transform duration-300 drop-shadow-lg"
              ariaLabel="Talk to Emo"
            />
          </motion.div>

          {/* Second star - positioned 100px to the left of center and 100px up */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       -ml-[100px] md:-ml-[100px] sm:-ml-[60px] 
                       -mt-[150px] md:-mt-[150px] sm:-mt-[60px] "
            animate={{
              y: [0, -20, 0],
              x: [0, -10, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}>
            <Start
              icon="sparkles"
              size="w-6 h-6 md:w-6 md:h-6 sm:w-5 sm:h-5"
              color="text-white"
              animation="float"
              duration={3}
              delay={1}
              tooltip="Cộng đồng"
              tooltipPosition="top"
              showTooltipAlways={true}
              tooltipTo="/home"
              tooltipTarget="_blank"
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
              className="hover:scale-110 transition-transform duration-300 drop-shadow-lg"
              ariaLabel="EmoCommunity"
            />
          </motion.div>
        </div>

        {/* Đệm 1 viewport để parallax bắt đầu ngay sau nền tĩnh, tránh khoảng trắng */}
        <div
          aria-hidden
          className="h-[50vh] sm:h-[50vh] md:h-[50vh] lg:h-[68vh] xl:h-[50vh] 2xl:h-[60vh]"
        />

        {/* PARALLAX LAYERS (Sticky scene, không chồng lấn section bên dưới) */}
        <div ref={sceneRef} className="relative">
          <div className="sticky top-0 h-screen pointer-events-none overflow-visible z-0">
            <motion.img
              src="/image/home/bg_HomeUnder.webp"
              alt=""
              style={{
                y: yUnder,
                willChange: "transform",
                pointerEvents: "none",
              }}
              className="absolute inset-x-0 -top-[10vh] w-full h-[120vh] object-cover object-top select-none transform-gpu z-[1]"
              draggable={false}
            />
            <motion.img
              src="/image/home/bg_Layout3.webp"
              alt=""
              style={{
                y: yLayout,
                opacity: 1,
                willChange: "transform",
                pointerEvents: "none",
              }}
              className="absolute inset-x-0 -top-[10vh] w-full h-[120vh] object-cover object-top select-none transform-gpu z-[2]"
              draggable={false}
            />
          </div>
        </div>
      </div>
      {/* Video showcase with ambient effects */}
      {/* <div className="relative w-full pt-[20%] px-2 flex justify-center items-center">
        <CurvedLoop />
        <video
          className="relative rounded-2xl shadow-lg shadow-violet-500/30 ring-1 ring-white/10 w-full max-w-2xl origin-center group-hover:scale-[1.01] transition-transform duration-700"
          src="/video/emo_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/emo.webp"
          loading="lazy"
          onError={(e) => console.error("Video loading error:", e)}
        />
      </div> */}
    </>
  );
};

export default HeroSection;
