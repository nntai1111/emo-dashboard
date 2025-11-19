import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { subHours, format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import tokenManager from "@/services/tokenManager";
import { IncompleteAssessment } from "@/components/molecules";
import {
  ScoreChart,
  RecommendationSection,
} from "@/components/molecules/Test/RecommendationModal";
import { Navbar } from "@/components";
import { useNavigate } from "react-router-dom";
const TestEmotion = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [scores, setScores] = useState({
    depression: 0,
    anxiety: 0,
    stress: 0,
  });
  const [testInfo, setTestInfo] = useState({
    testId: "",
    patientId: "",
    takenAt: "",
    severityLevel: "",
    patientName: "",
  });
  const [showIntro, setShowIntro] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("DASS21_Report.pdf");
  const [resultLoading, setResultLoading] = useState(false);
  const [resultFetched, setResultFetched] = useState(false);
  const [quotaError, setQuotaError] = useState(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [canDownloadPdf, setCanDownloadPdf] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const testId = "8fc88dbb-daee-4b17-9eca-de6cfe886097";
  const API_TEST = import.meta.env.VITE_API_TEST_URL;

  // Helper function to decode token and get subscription plan
  const checkSubscriptionPlan = useCallback(async () => {
    try {
      const token = await tokenManager.ensureValidToken();
      if (!token) {
        setCanDownloadPdf(false);
        return;
      }

      const decoded = jwtDecode(token);
      const planName = decoded?.SubscriptionPlanName || null;
      setSubscriptionPlan(planName);

      // Disable download if plan is "Free Plan"
      const isFreePlan = planName === "Free Plan";
      setCanDownloadPdf(!isFreePlan);
    } catch (error) {
      console.error("Error checking subscription plan:", error);
      // On error, allow download (fail open)
      setCanDownloadPdf(true);
    }
  }, []);

  // Quota exceeded modal (glass blur style)
  const QuotaModal = ({ open, onClose, error }) => {
    if (!open) return null;
    const title = error?.title || "Thông báo";
    const detail = error?.detail || "Bạn đã vượt quá hạn mức hành động.";
    const code = error?.errorCode || error?.status || "";

    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
        <div className="backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-3xl">🚫</div>
              <h3 className="text-lg font-bold text-white">
                Emo xin lỗi bạn nha
              </h3>
            </div>
            <p className="mt-2 text-sm text-white/90 leading-relaxed">
              {detail}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                navigate("/AIChatBoxWithEmo");
              }}
              className="px-4 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20">
              Tạm biệt
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Subscription plan modal (glass blur style)
  const SubscriptionModal = ({ open, onClose }) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
        <div className="backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-3xl">💎</div>
              <h3 className="text-lg font-bold text-white">
                Nâng cấp gói để sử dụng tính năng này
              </h3>
            </div>
            <p className="mt-2 text-sm text-white/90 leading-relaxed">
              Bạn cần mua gói để sử dụng tính năng này.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20">
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    );
  };

  // generatePDF now returns a structured result: { ok: boolean, error?: object }
  const generatePDF = async () => {
    setLoading(true);
    try {
      const token = await tokenManager.ensureValidToken();
      const response = await fetch(`${API_TEST}/v2/me/test/result/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testId,
          selectedOptionIds: Object.entries(answers)
            .map(([index, selectedOption]) => {
              const question = questions[parseInt(index)];
              const found = question?.options?.find(
                (opt) => opt.content === selectedOption
              );
              return found ? found.id : null;
            })
            .filter(Boolean),
          takenAt: testInfo.takenAt || new Date().toISOString(),
          completedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        setPdfBlob(blob);
        try {
          const url = window.URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (err) {
          console.warn("Could not create object URL for PDF", err);
        }
        const name = `DASS21_Report_${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.pdf`;
        setPdfFileName(name);
        return { ok: true };
      }

      // Non-OK response: try to parse JSON body for structured error info
      let json = null;
      try {
        json = await response.json();
      } catch (e) {
        // no JSON body
      }

      // If server explicitly says quota exceeded, surface that to UI
      if (
        response.status === 418 ||
        json?.errorCode === "TEST_QUOTA_EXCEEDED"
      ) {
        return {
          ok: false,
          error: json || {
            status: response.status,
            detail: "Bạn đã vượt quá giới hạn",
          },
        };
      }

      // default non-ok
      return { ok: false, error: json };
    } catch (error) {
      console.error("Error exporting PDF:", error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Check subscription plan on mount
  useEffect(() => {
    checkSubscriptionPlan();
  }, [checkSubscriptionPlan]);

  // Re-check subscription plan when test is submitted (to ensure accuracy)
  useEffect(() => {
    if (submitted) {
      checkSubscriptionPlan();
    }
  }, [submitted, checkSubscriptionPlan]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const token = await tokenManager.ensureValidToken();
        const response = await fetch(
          `${API_TEST}/v2/test/questions/${testId}?pageSize=21`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        const sortedQuestions = data.testQuestions.data.sort(
          (a, b) => a.order - b.order
        );
        setQuestions(sortedQuestions);
        setTotalQuestions(sortedQuestions.length);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        // Fetch the latest test result (most recent by TakenAt desc)
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [API_TEST, testId]);

  // Handle option selection
  const handleOptionChange = useCallback(
    (optionContent) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: optionContent,
      }));
      if (currentQuestionIndex + 1 < totalQuestions) {
        setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 400);
      }
    },
    [currentQuestionIndex, totalQuestions]
  );

  // Fetch the latest test result (most recent by TakenAt desc)
  const fetchLatestResult = useCallback(async () => {
    setResultLoading(true);
    try {
      const token = await tokenManager.ensureValidToken();
      const url = `${API_TEST}/v2/me/test/results?PageIndex=1&PageSize=1&SortBy=TakenAt&SortOrder=des`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch latest result");
      const data = await res.json();
      const item = data?.testResults?.data?.[0];
      if (!item) {
        setRecommendation("Không tìm thấy kết quả bài kiểm tra mới nhất.");
        return;
      }
      setScores({
        depression: item.depressionScore?.value ?? 0,
        anxiety: item.anxietyScore?.value ?? 0,
        stress: item.stressScore?.value ?? 0,
      });
      setTestInfo({
        testId: item.testId,
        patientId: item.patientId,
        takenAt: item.takenAt,
        severityLevel: item.severityLevel,
        patientName: item.patientName || testInfo.patientName || "",
      });
      setRecommendation(
        item.recommendation || "Không có khuyến nghị cho kết quả này."
      );
      setResultFetched(true);
    } catch (err) {
      console.error("fetchLatestResult error:", err);
      setRecommendation(
        "Không thể tải kết quả chi tiết. Vui lòng thử lại sau."
      );
    } finally {
      setResultLoading(false);
    }
  }, [API_TEST, testInfo.patientName]);

  // Handle test submission
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await generatePDF();
      if (res && res.ok) {
        setSubmitted(true);
        // Tự động fetch kết quả để hiển thị sau khi PDF được tạo thành công
        // Thêm delay nhỏ để đảm bảo server đã xử lý xong kết quả
        await new Promise((resolve) => setTimeout(resolve, 500));
        await fetchLatestResult();
      } else {
        // If server indicated quota exceeded, show dedicated modal with server message
        if (
          res?.error &&
          (res.error.errorCode === "TEST_QUOTA_EXCEEDED" ||
            res.error.status === 418)
        ) {
          setQuotaError(res.error);
          setShowQuotaModal(true);
        } else {
          setRecommendation(
            "Đã xảy ra lỗi khi tạo file PDF. Vui lòng thử lại."
          );
          setSubmitted(true);
        }
      }
    } catch (err) {
      console.error("Error during submit/generatePDF:", err);
      setRecommendation("Đã xảy ra lỗi khi tạo file PDF. Vui lòng thử lại.");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [generatePDF, fetchLatestResult]);

  const downloadPdf = useCallback(async () => {
    // Check subscription plan before downloading
    if (!canDownloadPdf) {
      setShowSubscriptionModal(true);
      return;
    }

    if (!pdfUrl) return;
    try {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = pdfFileName || "DASS21_Report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download PDF failed:", err);
    }
  }, [pdfUrl, pdfFileName, canDownloadPdf]);

  // revoke object URL when pdfUrl changes/unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        try {
          window.URL.revokeObjectURL(pdfUrl);
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, [pdfUrl]);

  // Reset test
  const handleTestAgain = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setScores({ depression: 0, anxiety: 0, stress: 0 });
    setTestInfo({
      testId: "",
      patientId: "",
      takenAt: "",
      severityLevel: "",
      patientName: "",
    });
    setRecommendation(null);
    setPdfBlob(null);
    setPdfUrl(null);
    setResultFetched(false);
  };

  const loadingMessages = [
    "🧠 Đang suy nghĩ kỹ càng...",
    "Emo đang chạy hết tốc lực để xử lý kết quả...",
    "📊 Đang phân tích dữ liệu cảm xúc của bạn...",
    "💫 Chúng tôi đang gọi các neuron hội họp gấp...",
    "🧬 Kết quả đang được tinh chỉnh bởi AI cảm xúc...",
    "🔮 Tính toán tương lai cảm xúc...",
    "📦 Gói kết quả đang được đóng hộp đẹp đẽ...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (submitting) {
    return (
      <LoadingOverlay
        fullScreen
        message={loadingMessages[messageIndex]}
        subMessage="Emo đang tổng hợp kết quả và tạo báo cáo cho bạn"
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="relative min-h-dvh flex flex-col justify-start md:justify-center p-4 md:p-8 overflow-hidden">
      {/* Background layer: image + gradient overlay + animated blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Nền ảnh */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/image/home/bg_EmoTest.webp')",
          }}
        />

        {/* Sao băng container */}
        <div className="absolute inset-0">
          <div className="mx-auto shooting-star shooting-star-1"></div>
          <div className="mx-auto shooting-star shooting-star-2"></div>
          <div className="mx-auto shooting-star shooting-star-3"></div>
          <div className="mx-auto shooting-star shooting-star-4"></div>
        </div>

        {/* CSS Animation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes shooting-star {
            0% {
              transform: translateX(0) translateY(0) rotate(45deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateX(500vw) translateY(500vh) rotate(45deg);
              opacity: 0;
            }
          }
          @keyframes tail-fade {
            0%,
            100% {
              opacity: 0;
            }
            30%,
            70% {
              opacity: 0.8;
            }
          }
          .shooting-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #fff, transparent);
            border-radius: 50%;
            box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.8);
          }
          .shooting-star::before {
            content: "";
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 1px;
            background: linear-gradient(90deg, #fff, transparent);
            right: 0;
            border-radius: 50%;
            animation: tail-fade 1.5s linear infinite;
          }
          .shooting-star-1 {
            top: 10%;
            left: -10%;
            animation: shooting-star 4s linear infinite;
            animation-delay: 0s;
          }
          .shooting-star-2 {
            top: 30%;
            left: -15%;
            animation: shooting-star 5s linear infinite;
            animation-delay: 1.5s;
          }
          .shooting-star-3 {
            top: 50%;
            left: -5%;
            animation: shooting-star 3.5s linear infinite;
            animation-delay: 3s;
          }
          .shooting-star-4 {
            top: 70%;
            left: -20%;
            animation: shooting-star 6s linear infinite;
            animation-delay: 2s;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
       `,
          }}
        />
      </div>
      <Navbar />
      <AnimatePresence>
        {showIntro && (
          <IncompleteAssessment
            currentIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onClose={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {!showIntro && (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-2xl mx-auto">
            {/* CÂU HỎI */}
            {!submitted && currentQuestion && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full max-w-2xl mx-auto">
                  <motion.div
                    className="backdrop-blur-xl bg-white/8 border border-white/10 p-5 md:p-8 rounded-3xl 
                          shadow-[0_8px_32px_rgba(0,0,0,0.08)] min-h-[380px] flex flex-col justify-between"
                    initial={{ y: 16, scale: 0.98 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)`,
                    }}>
                    {/* Câu hỏi */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="text-center">
                      <p className="text-lg md:text-xl font-medium text-white/80 mb-3 md:mb-5">
                        Câu{" "}
                        <span className="text-cyan-300 font-semibold">
                          {currentQuestionIndex + 1}
                        </span>{" "}
                        / {totalQuestions}
                      </p>
                      <p className="text-base md:text-lg text-white/95 font-medium leading-snug px-4">
                        {currentQuestion.content}
                      </p>
                    </motion.div>

                    {/* Đáp án: HIỆN CÙNG LÚC NHƯ CÂU HỎI */}
                    <motion.div
                      className="flex flex-col w-full space-y-3 md:space-y-4 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.2, // Chờ câu hỏi hiện xong
                        duration: 0.4, // Mượt như câu hỏi
                        ease: "easeOut",
                      }}>
                      {currentQuestion.options.map((option, idx) => {
                        const isSelected =
                          answers[currentQuestionIndex] === option.content;

                        return (
                          <motion.button
                            key={option.id}
                            // Không dùng variants, không stagger → tất cả cùng animate từ parent
                            whileHover={{
                              scale: 1.015,
                              transition: { duration: 0.3 },
                            }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleOptionChange(option.content)}
                            className={`
                         relative overflow-hidden p-4 md:p-5 rounded-2xl text-left transition-all duration-500
                         text-sm md:text-base font-medium focus:outline-none focus-visible:ring-2 
                         focus-visible:ring-cyan-300/40 focus-visible:ring-offset-2
                         backdrop-blur-md border
                         ${
                           isSelected
                             ? `bg-linear-to-r from-cyan-500/20 to-transparent border-cyan-300/40 text-white shadow-lg ring-1 ring-cyan-300/30`
                             : `bg-white/5 hover:bg-white/10 border-white/10 text-white/85 hover:border-white/20 hover:shadow-md`
                         }
                       `}
                            style={{
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                            }}>
                            {/* Ripple khi chọn */}
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  layoutId={`ripple-${currentQuestionIndex}`}
                                  className="absolute inset-0 bg-linear-to-r from-cyan-400/10 to-transparent rounded-2xl"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 1.1 }}
                                  transition={{
                                    duration: 0.6,
                                    ease: "easeOut",
                                  }}
                                />
                              )}
                            </AnimatePresence>

                            <span className="relative z-10 flex items-center gap-3">
                              <motion.span
                                layout
                                className={`
                             inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold
                             transition-all duration-300
                             ${
                               isSelected
                                 ? "bg-cyan-400 text-white shadow-md"
                                 : "bg-white/15 text-white/70"
                             }
                           `}>
                                {String.fromCharCode(65 + idx)}
                              </motion.span>
                              <span className="transition-colors duration-300">
                                {option.content}
                              </span>
                            </span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}
            {/* NỘP BÀI */}
            {!submitted && (
              <div className="mt-6 md:mt-8 flex justify-center">
                {isLastQuestion && (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!answers[currentQuestionIndex]}
                    whileHover={{
                      scale: answers[currentQuestionIndex] ? 1.05 : 1,
                    }}
                    whileTap={{
                      scale: answers[currentQuestionIndex] ? 0.95 : 1,
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-xl border
                    ${
                      answers[currentQuestionIndex]
                        ? "bg-white/15 border-white/30 text-white shadow-xl hover:bg-white/25 hover:shadow-2xl"
                        : "bg-white/10 border-white/10 text-white/50 cursor-not-allowed"
                    }`}>
                    <span>Nộp bài</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}
            {/* KẾT QUẢ */}
            {submitted && (
              <div className="mt-10 max-w-4xl mx-auto w-full">
                {loading && (
                  <LoadingOverlay
                    fullScreen
                    message="Đang tạo PDF..."
                    subMessage="Emo đang tạo file báo cáo của bạn"
                  />
                )}
                <div className=" rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4  ">
                  {/* <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-6 drop-shadow">
                    
                    🧠 Kết quả đánh giá DASS-21 của bạn
                  </h2> */}

                  {/* Hộp thoại scrollable chứa kết quả */}
                  <div className="mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Loading state khi đang fetch kết quả */}
                    {resultLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3" />
                        <span className="text-sm text-white/90">
                          Đang tải kết quả...
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Test info */}
                        {/* {resultFetched && testInfo?.takenAt && (
                          <div className="mb-6 text-sm text-white/90 p-4 rounded-2xl border border-white/20">
                            <div className="mb-2">
                              <strong>Thời gian thực hiện:</strong>{" "}
                              {(() => {
                                try {
                                  return new Date(
                                    testInfo.takenAt
                                  ).toLocaleString("vi-VN");
                                } catch (e) {
                                  return testInfo.takenAt;
                                }
                              })()}
                            </div>
                            <div>
                              <strong>Mức độ:</strong>{" "}
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold backdrop-blur bg-white/20 text-white border border-white/30">
                                {testInfo?.severityLevel ?? "—"}
                              </span>
                            </div>
                          </div>
                        )} */}
                        {/* Scores */}
                        {resultFetched && (
                          <div className="mb-6">
                            <ScoreChart
                              scoresDepression={scores?.depression ?? 0}
                              scoresAnxiety={scores?.anxiety ?? 0}
                              scoresStress={scores?.stress ?? 0}
                            />
                          </div>
                        )}

                        {/* Recommendation Section */}
                        {recommendation && (
                          <RecommendationSection
                            recommendation={recommendation}
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* 2 CTA buttons */}
                  <div className="flex flex-col items-center w-full">
                    {/* Container bo tròn lớn, nền mờ, 2 button nằm ngang */}
                    <div className="flex items-center w-full max-w-xs p-2 rounded-full gap-2 backdrop-blur-xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] border border-white/20">
                      {/* CTA 1: Tải báo cáo PDF – gradient xanh, chiếm phần lớn */}
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          downloadPdf();
                        }}
                        className={`
        flex-1 min-w-0
        ${
          canDownloadPdf
            ? "bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 cursor-pointer hover:scale-105"
            : "bg-white/10 hover:bg-white/15 cursor-not-allowed opacity-60"
        }
        text-white font-semibold text-center
        px-5 py-2.5 rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
        select-none
        flex items-center justify-center gap-2
        relative
      `}
                        title={
                          !canDownloadPdf
                            ? "Bạn cần mua gói để sử dụng tính năng này"
                            : ""
                        }>
                        Tải báo cáo PDF
                        {!canDownloadPdf && (
                          <span className="ml-1 text-xs">🔒</span>
                        )}
                      </a>

                      {/* CTA 2: Thử lại – nhỏ hơn, nền mờ, chữ nhạt */}
                      <a
                        onClick={handleTestAgain}
                        className={`
        shrink-0
        backdrop-blur-xl bg-white/15 hover:bg-white/25
        border border-white/30 text-white/80
        px-4 py-2.5 rounded-full
        text-sm font-medium
        shadow-md hover:shadow-lg
        transition-all duration-300 hover:scale-105
        cursor-pointer select-none
        flex items-center gap-1.5
      `}>
                        Thử lại
                        <svg
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          fill="none"
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5">
                          <path
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quota-exceeded popup */}
      <QuotaModal
        open={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        error={quotaError}
      />

      {/* Subscription plan modal */}
      <SubscriptionModal
        open={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

// Reusable glass-blur loading overlay
const LoadingOverlay = ({
  fullScreen = false,
  message = "Đang tải...",
  subMessage = "Vui lòng đợi",
}) => {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 flex items-center justify-center z-50 bg-black/40"
          : "relative"
      }>
      <div className="backdrop-blur-lg bg-white/6 border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 animate-spin-slow" viewBox="0 0 50 50">
              <defs>
                <linearGradient id="g" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="url(#g)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="31.4 31.4"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/Emo/EmoChat.webp"
                alt="Emo"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{message}</div>
            {subMessage && (
              <div className="text-sm text-white/80 mt-1">{subMessage}</div>
            )}
            <div className="mt-3">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-linear-to-r from-cyan-400 to-purple-600 animate-loading-bar"
                  style={{ width: "40%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* local animations */}
      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-loading-bar { animation: loading 2.6s ease-in-out infinite; }
        @keyframes loading {
          0% { transform: translateX(-10%); width: 20%; }
          50% { transform: translateX(10%); width: 60%; }
          100% { transform: translateX(-10%); width: 20%; }
        }
      `}</style>
    </div>
  );
};

export default TestEmotion;
