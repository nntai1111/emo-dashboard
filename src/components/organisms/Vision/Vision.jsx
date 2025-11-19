import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import styles from "../../../../styles/Font/Font.module.css";
import { Heart, Globe, Shield, Sparkles } from "lucide-react";

function Vision() {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Responsive globe animations
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, 
    [0, 0.5, 1], 
    screenSize === 'mobile' ? [0.7, 0.8, 0.75] : 
    screenSize === 'tablet' ? [0.8, 0.9, 0.85] : 
    [0.9, 1, 0.95]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Additional responsive transforms
  const translateX = useTransform(scrollYProgress, 
    [0, 0.5, 1], 
    screenSize === 'mobile' ? [50, 0, -30] : 
    screenSize === 'tablet' ? [30, 0, -20] : 
    [20, 0, -10]
  );
  const translateY = useTransform(scrollYProgress, 
    [0, 0.5, 1], 
    screenSize === 'mobile' ? [20, 0, -10] : 
    screenSize === 'tablet' ? [15, 0, -8] : 
    [10, 0, -5]
  );

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${
        screenSize === 'mobile' ? 'min-h-screen py-16' :
        screenSize === 'tablet' ? 'min-h-[90vh] py-20' :
        'min-h-screen py-24'
      } overflow-visible z-50`}>
      
      {/* Enhanced Background with Gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30" /> */}
      
      {/* Mobile Layout: Content First, Globe Below */}
      {screenSize === 'mobile' ? (
        <div className="flex flex-col h-full">
          {/* Content Section */}
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="max-w-4xl w-full">
              <motion.div
                className=" space-y-4 text-center relative z-30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}>
                
                {/* Enhanced Title */}
                <div className="relative w-full overflow-hidden z-40">
                  <h2 className="text-4xl sm:text-3xl  leading-tight relative z-50">
                    <div className="whitespace-nowrap">
                    <span
  className={` relative z-50 bg-gradient-to-b from-[#FFD6A5] to-[#FFF4C2] bg-clip-text text-transparent`}
>
  Không gian an toàn
</span>

                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 relative z-50 font-bold">
                        cho mọi cảm xúc
                      </span>
                    </div>
                  </h2>
                </div>

                {/* Enhanced Description */}
                <p className="text-base text-gray-600 leading-relaxed max-w-full mx-auto">
                  Chúng mình tin rằng mỗi cảm xúc đều xứng đáng được lắng nghe và
                  thấu hiểu. EmoEase mong muốn mang đến một không gian nơi bạn có
                  thể thoải mái sẻ chia, được kết nối và được đồng hành để vượt qua
                  những lúc khó khăn.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Globe Section */}
          <div className="flex-1 flex items-center justify-center relative">
            <motion.div
              ref={globeRef}
              className="w-full h-full flex items-center justify-center relative z-10">
              <motion.img
                src="/image/vision/globe-2_0.webp"
                alt="Global Vision"
                className="w-full h-auto object-contain max-w-md"
                style={{ 
                  rotateZ, 
                  scale, 
                  translateX, 
                  translateY,
                  willChange: "transform" 
                }}
                initial={{ opacity: 0, scale: 1.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </motion.div>
          </div>
        </div>
      ) : (
        /* Desktop/Tablet Layout: Side by Side */
        <>
          {/* Responsive Globe Container */}
          <motion.div
            ref={globeRef}
            className={`${
              screenSize === 'tablet' ? 'mx-[calc(50%-50vw)] h-full absolute inset-0 left-[38%]' :
              'mx-[calc(50%-50vw)] h-full absolute inset-0 left-[40%]'
            } flex items-center justify-center z-10`}>
            <motion.img
              src="/image/vision/globe-2_0.webp"
              alt="Global Vision"
              className={`${
                screenSize === 'tablet' ? 'w-full h-auto object-cover ml-[28%]' :
                'w-full h-auto object-cover ml-[30%]'
              } scale-100 absolute inset-0 z-10`}
              style={{ 
                rotateZ, 
                scale, 
                translateX, 
                translateY,
                willChange: "transform" 
              }}
              initial={{ opacity: 0, scale: 1.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* Main Content Container */}
          <div className={`container mx-auto ${
            screenSize === 'tablet' ? 'max-w-5xl px-6' :
            'max-w-7xl px-8'
          }`}>
            <div className={`grid ${
              screenSize === 'tablet' ? 'grid-cols-1 md:grid-cols-2' :
              'lg:grid-cols-2'
            } ${
              screenSize === 'tablet' ? 'gap-10 lg:gap-12' :
              'gap-12 lg:gap-16'
            } items-center`}>
              
              {/* Content */}
              <motion.div
                className={` ${
                  screenSize === 'tablet' ? 'space-y-5 lg:space-y-6' :
                  'space-y-6 lg:space-y-8'
                } ${
                  screenSize === 'tablet' ? 'text-center md:text-left' :
                  'text-left'
                } relative z-30`}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}>
                
                {/* Spacer for tablet/desktop */}
                <div className={`${
                  screenSize === 'tablet' ? 'h-12' : 'h-20'
                }`}></div>
                
                {/* Enhanced Title */}
                <div className="relative w-full overflow-hidden z-40">
                 
                  <h2 className={`${
                    screenSize === 'tablet' ? 'text-2xl md:text-3xl lg:text-4xl' :
                    'text-4xl md:text-6xl lg:text-6xl xl:text-7xl'
                  } font-bold leading-tight relative z-50`}>
                    <div className="whitespace-nowrap">
                      <span className={`${styles.fantasy} ${
                        screenSize === 'tablet' ? 'text-gray-800' : 'text-gray-900'
                      } relative z-50`}>
                        Không gian an toàn
                      </span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 relative z-50">
                        cho mọi cảm xúc
                      </span>
                    </div>
                  </h2>
                  
                </div>

                {/* Enhanced Description */}
                <p className={`${
                  screenSize === 'tablet' ? 'text-lg md:text-xl' : 'text-lg md:text-xl'
                } ${
                  screenSize === 'tablet' ? 'text-gray-700' : 'text-gray-700'
                } leading-relaxed ${
                  screenSize === 'tablet' ? 'max-w-xl md:max-w-2xl' : 'max-w-2xl'
                }`}>
                  Chúng mình tin rằng mỗi cảm xúc đều xứng đáng được lắng nghe và
                  thấu hiểu. EmoEase mong muốn mang đến một không gian nơi bạn có
                  thể thoải mái sẻ chia, được kết nối và được đồng hành để vượt qua
                  những lúc khó khăn.
                </p>

                {/* Additional paragraph for larger screens */}
                <p className={`${
                  screenSize === 'tablet' ? 'text-lg md:text-xl' : 'text-lg md:text-xl'
                } text-gray-700 leading-relaxed ${
                  screenSize === 'tablet' ? 'max-w-xl md:max-w-2xl' : 'max-w-2xl'
                }`}>
                  Kết hợp giữa công nghệ và sự đồng hành ấm áp,
                  chúng mình hy vọng có thể cùng thế hệ trẻ tìm lại sự cân bằng,
                  nuôi dưỡng lòng đồng cảm và xây dựng một tinh thần khỏe mạnh, bền
                  vững.
                </p>
              </motion.div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Decorative Elements */}
      <div className={`absolute ${
        screenSize === 'mobile' ? 'top-16 left-4' :
        screenSize === 'tablet' ? 'top-20 left-8' :
        'top-20 left-10'
      } ${
        screenSize === 'mobile' ? 'w-12 h-12' :
        screenSize === 'tablet' ? 'w-16 h-16' :
        'w-20 h-20'
      } bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-30 blur-xl`} />
      
      <div className={`absolute ${
        screenSize === 'mobile' ? 'bottom-16 right-4' :
        screenSize === 'tablet' ? 'bottom-20 right-8' :
        'bottom-20 right-10'
      } ${
        screenSize === 'mobile' ? 'w-20 h-20' :
        screenSize === 'tablet' ? 'w-24 h-24' :
        'w-32 h-32'
      } bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-30 blur-xl`} />

      {/* Floating elements for all screen sizes */}
      <motion.div
        className={`absolute ${
          screenSize === 'mobile' ? 'top-1/4 right-1/6' :
          screenSize === 'tablet' ? 'top-1/3 right-1/5' :
          'top-1/3 right-1/4'
        } ${
          screenSize === 'mobile' ? 'w-2 h-2' :
          screenSize === 'tablet' ? 'w-3 h-3' :
          'w-4 h-4'
        } bg-pink-300/40 rounded-full`}
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: screenSize === 'mobile' ? 2.5 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`absolute ${
          screenSize === 'mobile' ? 'bottom-1/4 left-1/6' :
          screenSize === 'tablet' ? 'bottom-1/3 left-1/5' :
          'bottom-1/3 left-1/4'
        } ${
          screenSize === 'mobile' ? 'w-2 h-2' :
          screenSize === 'tablet' ? 'w-2 h-2' :
          'w-3 h-3'
        } bg-purple-300/40 rounded-full`}
        animate={{
          y: [0, 8, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: screenSize === 'mobile' ? 3.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Additional floating elements for tablet and desktop */}
      {screenSize !== 'mobile' && (
        <>
          <motion.div
            className={`absolute ${
              screenSize === 'tablet' ? 'top-1/2 right-1/3' : 'top-1/2 right-1/3'
            } ${
              screenSize === 'tablet' ? 'w-2 h-2' : 'w-3 h-3'
            } bg-blue-300/30 rounded-full`}
            animate={{
              y: [0, -6, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: screenSize === 'tablet' ? 3 : 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className={`absolute ${
              screenSize === 'tablet' ? 'bottom-1/2 left-1/3' : 'bottom-1/2 left-1/3'
            } ${
              screenSize === 'tablet' ? 'w-2 h-2' : 'w-3 h-3'
            } bg-green-300/30 rounded-full`}
            animate={{
              y: [0, 6, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: screenSize === 'tablet' ? 4 : 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
        </>
      )}
      
      {/* Extra floating elements for desktop only */}
      {screenSize === 'desktop' && (
        <>
          <motion.div
            className="absolute top-1/6 left-1/3 w-2 h-2 bg-yellow-300/30 rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute bottom-1/6 right-1/3 w-2 h-2 bg-indigo-300/30 rounded-full"
            animate={{
              y: [0, 7, 0],
              opacity: [0.25, 0.55, 0.25],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5,
            }}
          />
        </>
      )}
    </section>
  );
}

export default Vision;
