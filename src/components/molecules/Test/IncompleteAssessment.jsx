import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const IncompleteAssessment = ({ onClose, currentIndex, totalQuestions }) => {
  const y = useMotionValue(0);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  // Drag to dismiss
  const scale = useTransform(y, [0, 300], [1, 0.95]);
  const opacity = useTransform(y, [0, 200], [1, 0.8]);
  const borderRadius = useTransform(y, [0, 300], [32, 40]);

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 180 || info.velocity.y > 800) {
      controls.start({ y: 1000, opacity: 0, transition: { duration: 0.3 } });
      setTimeout(onClose, 300);
    } else {
      controls.start({ y: 0, opacity: 1 });
    }
    setIsDragging(false);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Animate in to default position when mounted
  useEffect(() => {
    controls.start({ y: 0, opacity: 1, scale: 1 });
  }, [controls]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ WebkitBackdropFilter: "blur(12px)" }} // iOS-style blur
    >
      {/* Vibrant Background Blur */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5" />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{
          y,
          scale,
          opacity,
          borderRadius,
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.15)
          `,
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
        }}
        animate={controls}
        initial={{ y: 600, opacity: 0, scale: 0.9 }}
        exit={{ y: 600, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="relative w-full max-w-xl bg-white/8 backdrop-blur-3xl border border-white/25 rounded-3xl shadow-2xl overflow-hidden max-h-[86vh] flex flex-col cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}>
        {/* === ULTRA-GLASS HEADER === */}
        <div className="sticky top-0 z-10">
          <div className="relative px-6 pt-5 pb-4">
            <div className="relative flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white tracking-tight">
                Bắt đầu bài kiểm tra DASS-21
              </h3>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/25 transition-all">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* === SCROLLABLE CONTENT === */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-6 pt-2">
            {/* Progress Bar - iOS Style */}
            <div className="bg-white/10 backdrop-blur-xl rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${
                    Math.min(
                      ((currentIndex ?? 0) + 1) / (totalQuestions || 21),
                      1
                    ) * 100
                  }%`,
                  background: "linear-gradient(90deg, #00e5ff, #0077ff)",
                  boxShadow: "0 0 12px rgba(0, 119, 255, 0.6)",
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    Math.min(
                      ((currentIndex ?? 0) + 1) / (totalQuestions || 21),
                      1
                    ) * 100
                  }%`,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            <div className="flex items-center gap-2 text-white text-xs">
              <span className="font-medium">
                Câu {Math.min((currentIndex ?? 0) + 1, totalQuestions ?? 21)} /{" "}
                {totalQuestions ?? 21}
              </span>
              <span className="w-1 h-1 rounded-full bg-white" />
              <span>~3 phút</span>
            </div>

            {/* Intro Text */}
            <p className="text-white text-base leading-relaxed font-light">
              Trước khi bắt đầu, hãy dành vài phút để hiểu vì sao bài test này
              quan trọng với bạn.
              <span className="text-cyan-300 font-medium"> Emo</span> sẽ cá nhân
              hóa lộ trình hỗ trợ dựa trên kết quả của bạn.
            </p>

            {/* Glass Cards */}
            <div className="space-y-3">
              {[
                {
                  icon: "ℹ️",
                  title: "DASS-21 là gì?",
                  desc: "Bộ câu hỏi giúp đánh giá mức độ Trầm cảm, Lo âu và Căng thẳng — được kiểm chứng và sử dụng rộng rãi.",
                },
                {
                  icon: "🔒",
                  title: "Bảo mật tuyệt đối",
                  desc: "Câu trả lời được xử lý ẩn danh. Bạn có thể dừng bất kỳ lúc nào.",
                },
                {
                  icon: "🌱",
                  title: "Nhanh chóng",
                  desc: "Chỉ khoảng 3 phút. Kết quả giúp Emo đưa ra gợi ý phù hợp và cá nhân hóa.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/8 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 hover:bg-white/12 transition-all"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xl flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-base">
                        {item.title}
                      </p>
                      <p className="text-white/70 text-sm mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons - iOS Style */}
            <div className="flex gap-3 pt-4 pb-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="flex-1 h-12 rounded-2xl font-medium text-white tracking-tight
                  bg-linear-to-r from-cyan-500 to-blue-600
                  shadow-lg shadow-cyan-500/30
                  hover:shadow-cyan-500/50
                  transition-all"
                style={{
                  boxShadow: `
                    0 4px 12px rgba(0, 229, 255, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}>
                Bắt đầu ngay
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/AIChatBoxWithEmo")}
                className="px-6 h-12 rounded-2xl font-medium text-white/70 hover:text-white
                  border border-white/30 backdrop-blur-xl
                  hover:bg-white/10 transition-all">
                Để sau
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IncompleteAssessment;
