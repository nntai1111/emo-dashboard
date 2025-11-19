import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Error } from "@/components";

const PaymentSuccess = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 350);
    return () => clearTimeout(t);
  }, []);

  if (!state) return <Error />;

  const message =
    state?.message || "Thanh toán thành công. Cảm ơn bạn đã sử dụng dịch vụ.";
  const amount = state?.amount
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(state.amount)
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
        <motion.div
          className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-50 flex items-center justify-center mb-4"
          initial={{ scale: 0.85 }}
          animate={{ scale: isLoaded ? 1 : 0.85 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M5 13l4 4L19 7"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />
          </svg>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-2">
          Thanh toán thành công
        </h1>
        <p className="text-sm text-gray-600 mb-3 px-2 sm:px-6">{message}</p>

        {amount && (
          <p className="text-sm text-gray-700 font-medium mb-4">
            Số tiền: {amount}
          </p>
        )}

        <div className="mt-4">
          <button
            onClick={() => navigate("/trang-chu")}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200">
            Quay về trang chủ
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Bạn sẽ nhận được email xác nhận nếu có lịch hẹn. Liên hệ:
          hotro@emoease.com
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
