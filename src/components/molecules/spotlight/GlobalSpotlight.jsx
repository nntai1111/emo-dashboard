"use client";
import { Spotlight } from "./spotlight-new";
import { useState, useEffect } from "react";

const GlobalSpotlight = () => {
  const [screenSize, setScreenSize] = useState('desktop');
  
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

  // Chỉ hiển thị spotlight trên desktop và tablet
  if (screenSize === 'mobile') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Spotlight chỉ hiển thị ở vùng giao nhau giữa GreetingsNoAnimationText và SpotlightNewDemo */}
      <div 
        className="absolute w-full"
        style={{
          top: '42%', // Bắt đầu từ giữa màn hình (cuối GreetingsNoAnimationText)
          height: '100vh', // Chiều cao bằng 50% viewport (vùng giao nhau)
          transform: 'translateY(-50%)'
        }}
      >
        <Spotlight />
      </div>
    </div>
  );
};

export default GlobalSpotlight;
