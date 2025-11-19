import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentFailure = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Small animation trigger
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Optional message passed from previous route
  const message =
    state?.message ||
    "Thanh toán không thành công. Vui lòng kiểm tra thông tin thẻ hoặc thử lại sau ít phút.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
        {/* Icon */}
        <motion.div
          className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-50 flex items-center justify-center mb-4"
          initial={{ scale: 0.85 }}
          animate={{ scale: isLoaded ? 1 : 0.85 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M6 18L18 6M6 6l12 12"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />
          </svg>
        </motion.div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-red-700 mb-2">
          Thanh toán thất bại
        </h1>

        {/* Short explanation */}
        <p className="text-sm text-gray-600 mb-6 px-2 sm:px-6">{message}</p>

        {/* Primary action */}
        <button
          onClick={() => navigate("/trang-chu")}
          className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200">
          Quay về trang chủ
        </button>

        {/* Helpful small hint */}
        <p className="mt-4 text-xs text-gray-400">
          Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ: hotro@emoease.com
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
