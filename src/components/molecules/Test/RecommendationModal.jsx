import React from "react";
import { motion } from "framer-motion";
// === THÊM VÀO FILE: RecommendationModal.jsx (hoặc tạo file CSS riêng) ===
const mobileStyles = `
  @media (max-width: 768px) {
    .mobile-modal {
      margin: 1rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      max-height: 92vh;
    }
    .mobile-title {
      font-size: 1.5rem;
      line-height: 1.3;
    }
    .mobile-score-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .mobile-section {
      padding: 1.25rem;
      border-radius: 1rem;
      margin-bottom: 1rem;
    }
    .mobile-text {
      font-size: 0.9375rem; /* 15px */
      line-height: 1.6;
    }
    .mobile-close-btn {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
    }
    .mobile-suggestion-card {
      padding: 1rem;
      border-radius: 1rem;
    }
    .mobile-icon {
      font-size: 1.5rem;
      min-width: 2rem;
    }
  }
`;
export const getScoreLevel = (type, score) => {
  const typeKey =
    type === "trầm cảm"
      ? "depression"
      : type === "lo âu"
      ? "anxiety"
      : type === "căng thẳng"
      ? "stress"
      : type;

  const severityLabels = {
    depression: [
      { max: 9, label: "Bình thường" },
      { max: 13, label: "Nhẹ" },
      { max: 20, label: "Trung bình" },
      { max: 27, label: "Nặng" },
      { max: 42, label: "Rất nặng" },
    ],
    anxiety: [
      { max: 7, label: "Bình thường" },
      { max: 9, label: "Nhẹ" },
      { max: 14, label: "Trung bình" },
      { max: 19, label: "Nặng" },
      { max: 42, label: "Rất nặng" },
    ],
    stress: [
      { max: 14, label: "Bình thường" },
      { max: 18, label: "Nhẹ" },
      { max: 25, label: "Trung bình" },
      { max: 33, label: "Nặng" },
      { max: 42, label: "Rất nặng" },
    ],
  };

  return (
    severityLabels[typeKey]?.find((level) => score <= level.max)?.label ||
    "Rất nặng"
  );
};

export const ScoreChart = ({
  scoresDepression = 0,
  scoresAnxiety = 0,
  scoresStress = 0,
}) => {
  const data = [
    {
      type: "Trầm cảm",
      english: "Depression",
      score: scoresDepression,
      color: "from-blue-500 to-blue-400",
    },
    {
      type: "Lo âu",
      english: "Anxiety",
      score: scoresAnxiety,
      color: "from-orange-500 to-orange-400",
    },
    {
      type: "Căng thẳng",
      english: "Stress",
      score: scoresStress,
      color: "from-rose-500 to-rose-400",
    },
  ];

  const maxScore = 21; // DASS-21 mỗi domain tối đa 21
  const ticks = [0, 7, 14, 21];

  const ProgressWithTicks = ({ value, color }) => {
    const percent = Math.max(0, Math.min(100, (value / maxScore) * 100));
    return (
      <div className="relative w-full h-3 rounded-full bg-white/10 border border-white/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-linear-to-r ${color}`}
        />
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute top-0 bottom-0 w-px bg-white/25"
            style={{ left: `${(t / maxScore) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => {
          const level = getScoreLevel(item.type, item.score);
          return (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-white font-semibold text-base md:text-lg">
                    {item.type}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-2">
                <div className="text-3xl font-extrabold text-white drop-shadow">
                  {item.score}
                </div>
                <div className="text-[11px] text-white/70">0 • 7 • 14 • 21</div>
              </div>

              <ProgressWithTicks value={item.score} color={item.color} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export const RecommendationSection = ({ recommendation }) => {
  if (!recommendation || typeof recommendation === "string") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/10 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 border-white/30">
        <div className="flex items-center mb-3">
          <p className="text-lg font-semibold text-white ml-3">Lời khuyên</p>
        </div>
        <p className="text-sm text-white/90">
          {typeof recommendation === "string"
            ? recommendation
            : "Đang phân tích kết quả, vui lòng đợi..."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {recommendation.overview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl ">
          <p className="text-base text-white/90 leading-relaxed text-justify">
            {recommendation.overview}
          </p>
        </motion.div>
      )}
      {recommendation.emotionAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" rounded-2xl">
          <h3 className="flex items-center text-lg font-semibold text-white mb-3 underline">
            <span className="mr-2">🧠</span>Phân tích cảm xúc
          </h3>
          <p className="text-base text-white/90 leading-relaxed whitespace-pre-line text-justify">
            {recommendation.emotionAnalysis}
          </p>
        </motion.div>
      )}
      {Array.isArray(recommendation.personalizedSuggestions) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-section">
          <h3 className="flex items-center text-lg font-semibold text-white mb-4 underline">
            <span className="mobile-icon">🎯</span>
            Gợi ý dành riêng cho bạn
          </h3>
          <div className="space-y-3">
            {recommendation.personalizedSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mobile-suggestion-card">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold p-2 text-white text-base md:text-base text-center rounded-2xl border border-white/20">
                      {suggestion.icon || "✨"} {suggestion.title}
                    </h4>
                    <p className="mobile-text text-white/85 mt-2 text-justify">
                      {suggestion.description}
                    </p>
                    {suggestion.tips && (
                      <ul className="mt-2 text-base text-[#f8f53b] space-y-1">
                        {suggestion.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-xs">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mobile-text text-white/85 mt-2 text-justify italic">
                      {suggestion.reference}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {recommendation.closing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-t-4 border-white/30">
          <p className="text-sm text-white/90 leading-relaxed text-justify">
            💌 {recommendation.closing}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// const RecommendationModal = ({
//   open,
//   onClose,
//   recommendation,
//   scores,
//   testInfo,
//   loading,
// }) => {
//   if (!open) return null;

//   return (
//     <>
//       <style jsx>{mobileStyles}</style>
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
//         <motion.div
//           initial={{ scale: 0.92, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.92, opacity: 0 }}
//           className="mobile-modal backdrop-blur-2xl bg-white/12 border border-white/25 text-white w-full rounded-2xl shadow-2xl overflow-y-auto">
//           {/* Nút đóng lớn hơn, dễ nhấn */}
//           <button
//             onClick={onClose}
//             className="mobile-close-btn absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 transition-all"
//             aria-label="Đóng">
//             ×
//           </button>

//           {/* Tiêu đề */}
//           <h2 className="mobile-title font-bold text-center mb-5 drop-shadow-sm">
//             Báo cáo tâm lý của bạn
//           </h2>

//           {/* Điểm số - dạng dọc trên mobile */}
//           <div className="mb-5">
//             {loading ? (
//               <div className="flex items-center justify-center py-6">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3" />
//                 <span className="mobile-text text-white/90">
//                   Đang phân tích...
//                 </span>
//               </div>
//             ) : (
//               <div className="mobile-score-grid grid">
//                 <ScoreCard
//                   type="trầm cảm"
//                   score={scores?.depression ?? 0}
//                   compact
//                 />
//                 <ScoreCard type="lo âu" score={scores?.anxiety ?? 0} compact />
//                 <ScoreCard
//                   type="căng thẳng"
//                   score={scores?.stress ?? 0}
//                   compact
//                 />
//               </div>
//             )}
//           </div>

//           {/* Thông tin bài test */}
//           <div className="mobile-text text-white/80 text-xs space-y-1 mb-5 bg-white/5 px-4 py-3 rounded-xl">
//             <div className="flex justify-between">
//               <span className="font-medium">Thời gian:</span>
//               <span>
//                 {testInfo?.takenAt
//                   ? new Date(testInfo.takenAt).toLocaleString("vi-VN")
//                   : "—"}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-medium">Mức độ:</span>
//               <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
//                 {testInfo?.severityLevel ?? "—"}
//               </span>
//             </div>
//           </div>

//           {/* Nội dung gợi ý */}
//           <div className="space-y-4">
//             <RecommendationSection recommendation={recommendation} />
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default RecommendationModal;
