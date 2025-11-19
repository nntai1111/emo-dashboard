"use client";
import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
// import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export default function CanvasRevealEffectDemo() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  const cards = [
    { title: "EmoChat", image: "/image/service/6.webp" },
    { title: "EmoCommunity", image: "/image/service/15.webp" },
    { title: "EmoTest", image: "/image/service/9.webp" },
    { title: "EmoSpace", image: "/image/service/12.webp" },
    { title: "EmoBalance", image: "/image/service/18.webp" },
  ];

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

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const cardWidth = screenSize === 'mobile' ? 280 : 320;
      const gap = 16;
      const scrollPosition = index * (cardWidth + gap);
      
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft >= maxScroll - 1);
      
      // Update current index based on scroll position
      const cardWidth = screenSize === 'mobile' ? 280 : 320;
      const gap = 16;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setCurrentIndex(Math.min(newIndex, cards.length - 1));
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  return (
    <>
      <div className="pb-20 w-full mx-auto px-4 sm:px-8">
        {/* Desktop Layout */}
        {screenSize === 'desktop' && (
          <div className="flex flex-row items-center justify-center w-full gap-4">
            {cards.map((card, index) => (
              <Card key={index} title={card.title}>
                <img
                  src={card.image}
                  className="absolute inset-0 object-cover h-full w-full"
                />
              </Card>
            ))}
          </div>
        )}

        {/* Mobile/Tablet Layout with Horizontal Scroll */}
        {(screenSize === 'mobile' || screenSize === 'tablet') && (
          <div className="relative">
            {/* Navigation Arrows */}
            <motion.button
              onClick={prevCard}
              disabled={isAtStart}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 transition-all duration-200 ${
                isAtStart ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:scale-110'
              }`}
              whileHover={{ scale: isAtStart ? 1 : 1.1 }}
              whileTap={{ scale: isAtStart ? 1 : 0.95 }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>

            <motion.button
              onClick={nextCard}
              disabled={isAtEnd}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 transition-all duration-200 ${
                isAtEnd ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:scale-110'
              }`}
              whileHover={{ scale: isAtEnd ? 1 : 1.1 }}
              whileTap={{ scale: isAtEnd ? 1 : 0.95 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </motion.button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide p-4"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth'
              }}
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{
                    scrollSnapAlign: 'start',
                    width: screenSize === 'mobile' ? '280px' : '320px'
                  }}
                >
                  <Card title={card.title} isMobile={true}>
                    <img
                      src={card.image}
                      className="absolute inset-0 object-cover h-full w-full"
                    />
                  </Card>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {cards.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-purple-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Swipe Hint */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center mt-4 text-sm text-gray-500"
            >
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                ← Swipe để xem thêm →
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

const Card = ({ title, children, isMobile = false }) => {
  const [hovered, setHovered] = React.useState(false);
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => {
        // Enable tap-to-toggle on touch/pen devices
        if (e.pointerType === "touch" || e.pointerType === "pen") {
          setHovered((v) => !v);
        }
      }}
      onKeyDown={(e) => {
        // Keyboard accessibility: Enter/Space toggles
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setHovered((v) => !v);
        }
      }}
      role="button"
      aria-pressed={hovered}
      tabIndex={0}
      className={`cursor-pointer select-none border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] mx-auto p-4 relative ${
        isMobile 
          ? 'w-full h-[20rem] sm:h-[24rem]' 
          : 'max-w-sm w-full h-[30rem]'
      }`}>
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-20 w-full flex flex-col items-center">
        <h3
          className={`text-center font-bold text-black dark:text-white transition duration-200 ${
            isMobile 
              ? 'text-xl sm:text-2xl' 
              : 'text-2xl md:text-3xl'
          } ${
            hovered ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
          } group-hover/canvas-card:opacity-0 group-hover/canvas-card:-translate-y-1`}>
          {title}
        </h3>
      </div>
    </div>
  );
};

// Removed decorative center icon in favor of prominent title

export const Icon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
