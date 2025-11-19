import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Shield, Lightbulb, Target, Sparkles, ArrowRight, Star } from 'lucide-react';

const About = () => {
  const [screenSize, setScreenSize] = useState('desktop');
  const navigate = useNavigate();

  // Handle navigation to AIChatBoxWithEmo
  const handleExploreClick = () => {
    navigate('/AIChatBoxWithEmo');
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Section - Compact & Elegant */}
      <div className="relative">
        <div className="h-[45vh] sm:h-[50vh] lg:h-[55vh] bg-gradient-to-br from-[#C8A2C8] via-[#6B728E] to-[#8B5CF6] relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-8 right-8 w-24 h-24 bg-white/8 rounded-full blur-2xl animate-pulse" />
            <div className="absolute top-16 right-20 w-12 h-12 bg-purple-300/15 rounded-full blur-xl animate-bounce" />
            <div className="absolute bottom-16 left-8 w-16 h-16 bg-pink-300/15 rounded-full blur-xl animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-5xl mx-auto">
              <div className="mb-8">
                <img
                  src="/image/aboutUs/About.webp"
                  alt="EmoEase"
                  className="w-full scale-120"
                />
              </div>
            </motion.div>
          </div>

          {/* Elegant Curved Bottom */}
          <div
            className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"
            style={{
              clipPath:
                "polygon(0% 100%, 0% 0%, 30% 0%, 50% 25%, 70% 5%, 100% 0%, 100% 100%)",
            }}
          />
        </div>
      </div>

      {/* Main Content - Compact & Elegant */}
      <div className="relative -mt-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
          {/* Mission Statement - Refined */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 sm:mb-16">
            <div className="max-w-4xl mx-auto">
              <h2
                className={`${
                  screenSize === "mobile"
                    ? "text-2xl sm:text-3xl"
                    : screenSize === "tablet"
                    ? "text-3xl sm:text-4xl"
                    : "text-4xl sm:text-5xl"
                } font-serif font-bold text-gray-900 mb-4 leading-tight tracking-tight`}>
                Sứ mệnh của chúng tôi
              </h2>

              <p
                className={`${
                  screenSize === "mobile"
                    ? "text-base sm:text-lg"
                    : screenSize === "tablet"
                    ? "text-lg sm:text-xl"
                    : "text-xl sm:text-2xl"
                } text-gray-600 max-w-3xl mx-auto leading-relaxed font-light`}>
                Tạo nên một không gian an toàn – nơi mọi cảm xúc đều được lắng
                nghe, thấu hiểu và chăm sóc. Chúng mình mong muốn được đồng hành
                cùng bạn trên hành trình tìm lại sự cân bằng và nuôi dưỡng lòng
                thấu cảm mỗi ngày.
              </p>
            </div>
          </motion.div>

          {/* Three Column Layout - Compact Cards */}
          <div
            className={`${
              screenSize === "mobile"
                ? "space-y-6"
                : "grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            }`}>
            {/* Column 1: Chúng mình là ai */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#C8A2C8]/20"
              whileHover={{ y: -4, scale: 1.01 }}>
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto bg-gradient-to-br from-[#C8A2C8] to-[#6B728E] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Users className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                </motion.div>

                <h3
                  className={`${
                    screenSize === "mobile"
                      ? "text-lg sm:text-xl"
                      : screenSize === "tablet"
                      ? "text-xl sm:text-2xl"
                      : "text-2xl sm:text-3xl"
                  } font-bold text-gray-900 mb-4 group-hover:text-[#C8A2C8] transition-colors duration-300`}>
                  Chúng mình là ai
                </h3>

                <p
                  className={`${
                    screenSize === "mobile"
                      ? "text-sm sm:text-base"
                      : screenSize === "tablet"
                      ? "text-base sm:text-lg"
                      : "text-lg sm:text-xl"
                  } text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300`}>
                  EmoEase là người bạn đồng hành tinh thần đáng tin cậy đồng
                  thời là góc nhỏ dịu dàng để bạn có thể chia sẻ cảm xúc, kết
                  nối ẩn danh và tìm lại sự bình yên.
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#C8A2C8] to-[#6B728E] rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Column 2: Chúng mình làm gì */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#6B728E]/20"
              whileHover={{ y: -4, scale: 1.01 }}>
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto bg-gradient-to-br from-[#6B728E] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Heart className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                </motion.div>

                <h3
                  className={`${
                    screenSize === "mobile"
                      ? "text-lg sm:text-xl"
                      : screenSize === "tablet"
                      ? "text-xl sm:text-2xl"
                      : "text-2xl sm:text-3xl"
                  } font-bold text-gray-900 mb-4 group-hover:text-[#6B728E] transition-colors duration-300`}>
                  Chúng mình làm gì
                </h3>

                <p
                  className={`${
                    screenSize === "mobile"
                      ? "text-sm sm:text-base"
                      : screenSize === "tablet"
                      ? "text-base sm:text-lg"
                      : "text-lg sm:text-xl"
                  } text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300`}>
                  Với người bạn ảo luôn lắng nghe và cộng đồng ẩn danh đầy thấu
                  cảm, EmoEase mang đến một chốn an yên, nơi bạn có thể gửi gắm
                  cảm xúc mà không lo bị phán xét.
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#6B728E] to-[#8B5CF6] rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Column 3: Chúng mình làm như thế nào */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#8B5CF6]/20"
              whileHover={{ y: -4, scale: 1.01 }}>
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto bg-gradient-to-br from-[#8B5CF6] to-[#C8A2C8] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Lightbulb className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                </motion.div>

                <h3
                  className={`${
                    screenSize === "mobile"
                      ? "text-lg sm:text-xl"
                      : screenSize === "tablet"
                      ? "text-xl sm:text-2xl"
                      : "text-2xl sm:text-3xl"
                  } font-bold text-gray-900 mb-4 group-hover:text-[#8B5CF6] transition-colors duration-300`}>
                  Chúng mình làm như thế nào
                </h3>

                <p
                  className={`${
                    screenSize === "mobile"
                      ? "text-sm sm:text-base"
                      : screenSize === "tablet"
                      ? "text-base sm:text-lg"
                      : "text-lg sm:text-xl"
                  } text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300`}>
                  Dựa trên 5 giá trị cốt lõi – Đồng cảm, An toàn, Chân thực, Kết
                  nối và Phát triển, EmoEase kết hợp công nghệ và sự thấu hiểu
                  để việc chăm sóc cảm xúc trở nên gần gũi và dễ dàng hơn.
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#C8A2C8] rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values Section - Compact */}
          <motion.div
            variants={itemVariants}
            className="mt-16 sm:mt-20 lg:mt-24">
            <div className="text-center mb-10 sm:mb-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C8A2C8] to-[#6B728E] rounded-xl shadow-md">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
              </motion.div>

              <h2
                className={`${
                  screenSize === "mobile"
                    ? "text-2xl sm:text-3xl"
                    : screenSize === "tablet"
                    ? "text-3xl sm:text-4xl"
                    : "text-4xl sm:text-5xl"
                } font-bold text-gray-900 mb-4 leading-tight tracking-tight`}>
                5 Giá trị cốt lõi
              </h2>

              <p
                className={`${
                  screenSize === "mobile"
                    ? "text-base sm:text-lg"
                    : screenSize === "tablet"
                    ? "text-lg sm:text-xl"
                    : "text-xl sm:text-2xl"
                } text-gray-600 max-w-2xl mx-auto leading-relaxed font-light`}>
                Những nguyên tắc định hướng mọi hoạt động của chúng tôi
              </p>
            </div>

            {/* Values Grid - Desktop/Tablet */}
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                { name: "Đồng cảm", icon: Heart },
                { name: "An toàn", icon: Shield },
                { name: "Chân thực", icon: Star },
                { name: "Kết nối", icon: Users },
                { name: "Phát triển", icon: Lightbulb },
              ].map((value, index) => (
                <motion.div
                  key={value.name}
                  variants={itemVariants}
                  className="group text-center"
                  whileHover={{ scale: 1.05 }}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-[#C8A2C8] to-[#6B728E] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3
                    className={`${
                      screenSize === "tablet"
                        ? "text-base"
                        : "text-base sm:text-lg"
                    } font-semibold text-gray-900 group-hover:text-[#C8A2C8] transition-colors duration-300`}>
                    {value.name}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* Mobile Marquee - Values */}
            <div className="sm:hidden overflow-hidden relative">
              {/* Gradient overlays for smooth fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <motion.div
                className="flex gap-4"
                animate={{
                  x: [0, -480], // 5 items * (80px + 16px gap) = 480px
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}>
                {/* First set */}
                {[
                  { name: "Đồng cảm", icon: Heart },
                  { name: "An toàn", icon: Shield },
                  { name: "Chân thực", icon: Star },
                  { name: "Kết nối", icon: Users },
                  { name: "Phát triển", icon: Lightbulb },
                ].map((value, index) => (
                  <div
                    key={`first-${value.name}`}
                    className="flex-shrink-0 w-20 text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-[#C8A2C8] to-[#6B728E] rounded-lg flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}>
                      <value.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">
                      {value.name}
                    </h3>
                  </div>
                ))}

                {/* Duplicate set for seamless loop */}
                {[
                  { name: "Đồng cảm", icon: Heart },
                  { name: "An toàn", icon: Shield },
                  { name: "Chân thực", icon: Star },
                  { name: "Kết nối", icon: Users },
                  { name: "Phát triển", icon: Lightbulb },
                ].map((value, index) => (
                  <div
                    key={`second-${value.name}`}
                    className="flex-shrink-0 w-20 text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-[#C8A2C8] to-[#6B728E] rounded-lg flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}>
                      <value.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">
                      {value.name}
                    </h3>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action - Compact */}
          <motion.div
            variants={itemVariants}
            className="mt-16 sm:mt-20 lg:mt-24 text-center">
            <div className="bg-gradient-to-br from-[#C8A2C8]/8 to-[#6B728E]/8 rounded-2xl p-8 sm:p-10 lg:p-12 border border-[#C8A2C8]/15">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-[#C8A2C8] to-[#6B728E] rounded-xl shadow-md">
                  <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                </div>
              </motion.div>

              <h2
                className={`${
                  screenSize === "mobile"
                    ? "text-2xl sm:text-3xl"
                    : screenSize === "tablet"
                    ? "text-3xl sm:text-4xl"
                    : "text-4xl sm:text-5xl"
                } font-bold text-gray-900 mb-4 leading-tight tracking-tight`}>
                Hãy cùng chúng tôi
              </h2>

              <p
                className={`${
                  screenSize === "mobile"
                    ? "text-base sm:text-lg"
                    : screenSize === "tablet"
                    ? "text-lg sm:text-xl"
                    : "text-xl sm:text-2xl"
                } text-gray-600 max-w-2xl mx-auto leading-relaxed font-light mb-6`}>
                Tạo nên một cộng đồng nơi mọi cảm xúc đều được trân trọng và
                chăm sóc
              </p>

              <motion.button
                onClick={handleExploreClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C8A2C8] to-[#6B728E] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;